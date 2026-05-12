import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { verifyToken } from '../../../lib/jwt';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

// ─── Helper: send welcome email ──────────────────────────────────────────────
async function sendWelcomeEmail({ to, name,userRole, adminName, tempPassword }) {
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
    subject: 'Vos identifiants de connexion - Plateforme TRS',
    html: `
      <div style="font-family: sans-serif; color: #334155; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px;">
        <h2 style="color: #1e293b;">Bienvenue sur la plateforme TRS !</h2>
        <p>Bonjour <strong>${name}</strong>,</p>
        <p>Votre compte a été créé par l'administrateur : <strong>${adminName}</strong>  et ton role sera <strong>${userRole}</strong>.</p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px dashed #cbd5e1;">
          <p style="margin: 0; color: #475569;"><strong>Email :</strong> ${to}</p>
          <p style="margin: 0; color: #475569;"><strong>Mot de passe temporaire :</strong> ${tempPassword}</p>
        </div>
        <p style="margin-top: 20px;">Par sécurité, veuillez modifier votre mot de passe lors de votre première connexion.</p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.APP_URL}" 
             style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Accéder à la plateforme
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
    const { name, email ,userRole, permissionIds } = await request.json();

    if (!name || !email || !userRole || !permissionIds || permissionIds.length === 0) {
      return NextResponse.json({ message: 'Données manquantes' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return NextResponse.json({ message: 'Email déjà utilisé' }, { status: 400 });

    const tempPassword = name +'123';
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const newUser = await prisma.$transaction(async (tx) => {
      // 1. Create new User
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

      // 2. Link Permissions
      await tx.userPermission.createMany({
        data: permissionIds.map((pId) => ({
          userId: user.id,
          permissionId: parseInt(pId),
        })),
      });

      return user;
    });

    // Welcome Email
    try {
      const currentAdmin = await prisma.user.findUnique({ where: { id: adminId }, select: { name: true } });
      await sendWelcomeEmail({ to: email, name, userRole, adminName: currentAdmin?.name, tempPassword });
    } catch (e) { console.error("Email fail", e); }

    const { password, ...safeUser } = newUser;
    return NextResponse.json(safeUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Erreur de création' }, { status: 500 });
  }
}

// ─── PUT: Sync Info & Permissions ───────────────────────────────────────────
export async function PUT(request) {
  try {
    const token = request.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (decoded.type !== 'ADMIN') return NextResponse.json({ message: 'Accès refusé' }, { status: 403 });

    const body = await request.json();
    const { id, name, email,userRole,  status, permissionIds } = body;
    
    

    // 1. Update the user basic info
    await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name: name,
        email: email,
        userRole :userRole,
        status: status, // This is the boolean from your toggle
      },
    });

    // 2. Sync Permissions (Wipe and Re-create)
    await prisma.$transaction([
      prisma.userPermission.deleteMany({
        where: { userId: parseInt(id) },
      }),
      prisma.userPermission.createMany({
        data: permissionIds.map((pId) => ({
          userId: parseInt(id),
          permissionId: parseInt(pId),
        })),
      }),
    ]);
    

    return NextResponse.json({ message: "Utilisateur mis à jour avec succès" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}

// ─── DELETE: Standard Delete ────────────────────────────────────────────────
export async function DELETE(request) {
  try {
    const token = request.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const targetUser = await prisma.user.findFirst({
      where: { id: parseInt(id), adminId: decoded.id },
    });

    if (!targetUser) return NextResponse.json({ message: 'Introuvable' }, { status: 404 });

    await prisma.user.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ message: 'Supprimé' });
  } catch (error) {
    return NextResponse.json({ message: 'Erreur suppression' }, { status: 500 });
  }
}