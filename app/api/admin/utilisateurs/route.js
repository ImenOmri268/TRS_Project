import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import {  verifyToken } from '../../../lib/jwt';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

// ─── Helper: send welcome email ──────────────────────────────────────────────
async function sendWelcomeEmail({ to, name,userRole, adminName, tempPassword  }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Vos identifiants de connexion - Application TRS',
    html: `
      <div style="font-family: sans-serif; color: #334155; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px;">
        <h2 style="color: #1e293b;">Bienvenue sur l'application TRS !</h2>
        <h2 style="color: #1e293b;">Bienvenue sur l'application TRS !</h2>
        <p>Bonjour <strong>${name}</strong>,</p>
        <p>Votre compte a été créé et ton role sera <strong>${userRole}</strong>.</p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px dashed #cbd5e1;">
          <p style="margin: 0; color: #475569;"><strong>Email :</strong> ${to}</p>
          <p style="margin: 0; color: #475569;"><strong>Mot de passe temporaire :</strong> ${tempPassword}</p>
        </div>
        <p style="margin-top: 20px;">Par sécurité, veuillez modifier votre mot de passe lors de votre première connexion.</p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.APP_URL}/EmailSend" 
             style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Accéder à l'application
          </a>
        </div>
      </div>
    `,
  });
}

// ─── GET: List users with Full Permission Data ──────────────────────────────
export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });

    const decoded = verifyToken(token);
    if (decoded.type !== 'ADMIN') return NextResponse.json({ message: 'Accès refusé' }, { status: 403 });

    const adminId = decoded.id;

    const users = await prisma.user.findMany({
      where: { adminId },
      orderBy: { name: 'asc' },
      include: {
        userPermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    // Formatting for frontend: including both permission names (for display) and IDs (for editing)
    const formatted = users.map(({ password, ...user }) => ({
      ...user,
      permissionNames: user.userPermissions.map((up) => up.permission.name),
      permissionIds: user.userPermissions.map((up) => up.permission.id),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('[USERS_GET_ERROR]', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

// ─── POST: Create User & Assign Permissions ─────────────────────────────────
export async function POST(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });

    const decoded = verifyToken(token);
    if (decoded.type !== 'ADMIN') return NextResponse.json({ message: 'Accès refusé' }, { status: 403 });

    const adminId = decoded.id;
    const { name, email, userRole, permissionIds } = await request.json();

    // Checked validation (allowing permissionIds to be modified safely)
    if (!name || !email || !userRole || !permissionIds) {
      return NextResponse.json({ message: 'Données manquantes' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return NextResponse.json({ message: 'Email déjà utilisé' }, { status: 400 });

    const tempPassword = name + '123';
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // 1. Fetch the hidden dashboard permission ID
    const dashboardPermission = await prisma.permission.findFirst({
      where: { name: 'voir_dashboard' }
    });

    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          userRole,
          password: hashedPassword,
          type: 'USER',
          status: true,
          adminId,
        },
      });

      // 2. Build explicit list containing the submitted array + the auto-assigned id
      const finalPermissionIds = new Set(permissionIds.map(pId => parseInt(pId)));
      if (dashboardPermission) {
        finalPermissionIds.add(dashboardPermission.id);
      }

      await tx.userPermission.createMany({
        data: Array.from(finalPermissionIds).map((pId) => ({
          userId: user.id,
          permissionId: pId,
        })),
      });

      return user;
    });

    try {
      const currentAdmin = await prisma.user.findUnique({ where: { id: adminId }, select: { name: true } });
      await sendWelcomeEmail({ to: email, name, userRole, adminName: currentAdmin?.name, tempPassword });
    } catch (e) { console.error("Email fail", e); }

    const { password, ...safeUser } = newUser;
    return NextResponse.json(safeUser, { status: 201 });
  } catch (error) {
    console.error("[USER_POST_ERROR]", error);
    return NextResponse.json({ message: 'Erreur de création' }, { status: 500 });
  }
}

// ─── PUT: Sync Info & Permissions ───────────────────────────────────────────
export async function PUT(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });

    const decoded = verifyToken(token);
    if (decoded.type !== 'ADMIN') return NextResponse.json({ message: 'Accès refusé' }, { status: 403 });

    const { id, name, email, userRole, permissionIds, status } = await request.json();

    if (!id || !name || !email || !userRole || !permissionIds) {
      return NextResponse.json({ message: 'Données manquantes' }, { status: 400 });
    }

    // 1. Fetch the dashboard permission record
    const dashboardPermission = await prisma.permission.findFirst({
      where: { name: 'voir_dashboard' }
    });

    const updatedUser = await prisma.$transaction(async (tx) => {
      // Update basic fields
      const user = await tx.user.update({
        where: { id: parseInt(id) },
        data: { name, email, userRole, status },
      });

      // Delete old user permissions links
      await tx.userPermission.deleteMany({
        where: { userId: user.id }
      });

      // 2. Build the new collection ensuring dashboard permission is re-attached
      const finalPermissionIds = new Set(permissionIds.map(pId => parseInt(pId)));
      if (dashboardPermission) {
        finalPermissionIds.add(dashboardPermission.id);
      }

      // Re-create relations safely
      await tx.userPermission.createMany({
        data: Array.from(finalPermissionIds).map((pId) => ({
          userId: user.id,
          permissionId: pId,
        })),
      });

      return user;
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("[USER_PUT_ERROR]", error);
    return NextResponse.json({ message: 'Erreur lors de la modification' }, { status: 500 });
  }
}

// ─── DELETE: Standard Delete ────────────────────────────────────────────────
export async function DELETE(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });

    const decoded = verifyToken(token);
    if (decoded.type !== 'ADMIN') return NextResponse.json({ message: 'Accès refusé' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'ID requis' }, { status: 400 });
    }

    const userIdToDelete = parseInt(id, 10);

    // 1. Verify that this user belongs to the logged-in Admin
    const targetUser = await prisma.user.findFirst({
      where: { id: userIdToDelete, adminId: decoded.id },
    });

    if (!targetUser) {
      return NextResponse.json({ message: 'Utilisateur introuvable' }, { status: 404 });
    }


    await prisma.$transaction(async (tx) => {

      await tx.userPermission.deleteMany({ where: { userId: userIdToDelete } });
      await tx.userRole.deleteMany({ where: { userId: userIdToDelete } });

      // Step B: Remove personal system logs
      await tx.notification.deleteMany({ where: { userId: userIdToDelete } });
      await tx.email.deleteMany({ where: { userId: userIdToDelete } });


      await tx.action.deleteMany({ where: { userId: userIdToDelete } });

      await tx.user.delete({ where: { id: userIdToDelete } });
    });

    return NextResponse.json({ message: 'Utilisateur supprimé avec succès' }, { status: 200 });
  } catch (error) {
    console.error("[USER_DELETE_ERROR]", error);
    return NextResponse.json({ message: 'Erreur lors de la suppression de l\'utilisateur' }, { status: 500 });
  }
}