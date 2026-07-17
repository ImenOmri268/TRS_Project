import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { verifyToken } from '../../../lib/jwt';
import bcrypt from 'bcryptjs';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });

    const decoded = verifyToken(token);

    let adminId;
    if (decoded.type === 'ADMIN') {
      adminId = decoded.id;
    } else {
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { adminId: true }
      });
      adminId = user?.adminId;
    }

    if (!adminId) return NextResponse.json({ message: 'Admin introuvable' }, { status: 404 });

    const users = await prisma.user.findMany({
      where: { adminId },
      orderBy: { name: 'asc' },
      include: {
        userPermissions: {
          include: { permission: true }
        }
      }
    });

    const formatted = users.map(({ password, ...user }) => ({
      ...user,
      displayStatus: user.status ? 'Actif' : 'Inactif',
      permissionNames: user.userPermissions.map(up => up.permission.name),
      permissionIds: user.userPermissions.map(up => up.permission.id),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('[USER_UTILISATEURS_GET_ERROR]', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });

    const decoded = verifyToken(token);

    // Fetch the acting user to get both their name and adminId
    const actor = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { name: true, adminId: true }
    });
    const adminId = actor?.adminId;

    if (!adminId) return NextResponse.json({ message: 'Admin introuvable' }, { status: 404 });

    const { name, email, userRole, permissionIds } = await request.json();

    if (!name || !email || !userRole || !permissionIds || permissionIds.length === 0) {
      return NextResponse.json({ message: 'Données manquantes' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return NextResponse.json({ message: 'Email déjà utilisé' }, { status: 400 });

    const tempPassword = name + '123';
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const newUser = await prisma.$transaction(async (tx) => {
      const u = await tx.user.create({
        data: {
          name, email, userRole,
          password: hashedPassword,
          type: 'USER',
          status: true,
          adminId,
        }
      });
      await tx.userPermission.createMany({
        data: permissionIds.map(pId => ({
          userId: u.id,
          permissionId: parseInt(pId)
        }))
      });
      return u;
    });

    // --- NOTIFICATION CODE ---
    try {
      if (actor?.adminId) {
        await prisma.notification.create({
          data: {
            message: `L'utilisateur ${actor.name} a créé un nouveau compte collaborateur : ${name} (${userRole}).`,
            userId: actor.adminId,
            createdBy: actor.name,
          },
        });
      }
    } catch (notifError) {
      console.error('[POST_USER_NOTIF_ERROR]', notifError);
    }
    // -------------------------

    const { password, ...safeUser } = newUser;
    return NextResponse.json(safeUser, { status: 201 });
  } catch (error) {
    console.error('[USER_UTILISATEURS_POST_ERROR]', error);
    return NextResponse.json({ message: 'Erreur de création' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });

    const decoded = verifyToken(token);

    const body = await request.json();
    const { id, name, email, userRole, status, permissionIds } = body;

    await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, email, userRole, status }
    });

    await prisma.$transaction([
      prisma.userPermission.deleteMany({ where: { userId: parseInt(id) } }),
      prisma.userPermission.createMany({
        data: permissionIds.map(pId => ({
          userId: parseInt(id),
          permissionId: parseInt(pId)
        }))
      })
    ]);

    // --- NOTIFICATION CODE ---
    try {
      const actor = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { name: true, adminId: true }
      });

      if (actor?.adminId) {
        await prisma.notification.create({
          data: {
            message: `L'utilisateur ${actor.name} a mis à jour les informations du compte de ${name}.`,
            userId: actor.adminId,
            createdBy: actor.name,
          },
        });
      }
    } catch (notifError) {
      console.error('[PUT_USER_NOTIF_ERROR]', notifError);
    }
    // -------------------------

    return NextResponse.json({ message: 'Utilisateur mis à jour' });
  } catch (error) {
    console.error('[USER_UTILISATEURS_PUT_ERROR]', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });

    const decoded = verifyToken(token);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Vérifier que ce user appartient bien à l'admin du user connecté
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { name: true, adminId: true }
    });

    const targetUser = await prisma.user.findFirst({
      where: { 
        id: parseInt(id),
        adminId: currentUser?.adminId
      }
    });

    if (!targetUser) return NextResponse.json({ message: 'Introuvable' }, { status: 404 });

    await prisma.user.delete({ where: { id: parseInt(id) } });

    // --- NOTIFICATION CODE ---
    try {
      if (currentUser?.adminId && targetUser) {
        await prisma.notification.create({
          data: {
            message: `L'utilisateur ${currentUser.name} a supprimé le compte collaborateur de ${targetUser.name}.`,
            userId: currentUser.adminId,
            createdBy: currentUser.name,
          },
        });
      }
    } catch (notifError) {
      console.error('[DELETE_USER_NOTIF_ERROR]', notifError);
    }
    // -------------------------

    return NextResponse.json({ message: 'Supprimé' });
  } catch (error) {
    console.error('[USER_UTILISATEURS_DELETE_ERROR]', error);
    return NextResponse.json({ message: 'Erreur suppression' }, { status: 500 });
  }
}