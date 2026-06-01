import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// 1. GET: Fetch actions with real-time automatic past-due check overrides
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const planId = searchParams.get("planId");
  const userId = searchParams.get("userId");

  try {
    const now = new Date();

    // Dynamically patch incomplete actions that have passed their deadline before returning them
    await prisma.action.updateMany({
      where: {
        statut: { in: ["A_FAIRE", "EN_COURS"] },
        dateLimite: { lt: now },
      },
      data: {
        statut: "EN_RETARD",
      },
    });

    const actions = await prisma.action.findMany({
      where: {
        ...(planId && { planId: parseInt(planId, 10) }),
        ...(userId && { userId: parseInt(userId, 10) }),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        plan: { select: { id: true, description: true } } 
      },
      orderBy: { id: "desc" },
    });

    return NextResponse.json(actions);
  } catch (err) {
    console.error("Error during GET actions:", err);
    return NextResponse.json({ error: "Erreur lors de la récupération des données." }, { status: 500 });
  }
}

// 2. POST: Create a new action & Notify the assigned User
export async function POST(req) {
  try {
    // Récupération de l'identité de l'admin via le token
    const token = req.cookies.get('token')?.value;
    let adminName = "L'administrateur";
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const dbAdmin = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (dbAdmin) adminName = dbAdmin.name;
      } catch (tokenErr) {
        console.warn("Token invalide ou inexistant lors de l'envoi de la notif admin.");
      }
    }

    const body = await req.json();
    const { title, description, planId, userId, priorite, dateLimite } = body;

    if (!title || !planId || !userId || !dateLimite) {
      return NextResponse.json({ error: "Les champs obligatoires (Titre, Plan, Responsable, Date limite) sont requis." }, { status: 400 });
    }

    const targetUserId = parseInt(userId, 10);

    // Création de l'action
    const newAction = await prisma.action.create({
      data: {
        title,
        description,
        priorite: priorite || "MOYEN",
        statut: "A_FAIRE", 
        dateLimite: new Date(dateLimite),
        planId: parseInt(planId, 10),
        userId: targetUserId,
      },
    });

    // NOTIFICATION : L'admin crée et affecte directement une nouvelle action à un utilisateur
    await prisma.notification.create({
      data: {
        message: `${adminName} vous a assigné une nouvelle action : "${title}"`,
        userId: targetUserId, // Destinataire : L'utilisateur assigné
        createdBy: adminName, // Expéditeur : L'admin courant
      }
    });

    return NextResponse.json(newAction);
  } catch (err) {
    console.error("Error creating new action:", err);
    return NextResponse.json({ error: "Erreur lors de la création de l'action." }, { status: 500 });
  }
}

// 3. PUT: Full updates & Notify user if responsibility changes
export async function PUT(req) {
  try {
    // Récupération de l'identité de l'admin via le token
    const token = req.cookies.get('token')?.value;
    let adminName = "L'administrateur";
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const dbAdmin = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (dbAdmin) adminName = dbAdmin.name;
      } catch (tokenErr) {
        console.warn("Token invalide lors de l'envoi de la notif admin.");
      }
    }

    const body = await req.json();
    const { id, title, description, priorite, statut, userId,  dateLimite } = body;

    if (!id) {
      return NextResponse.json({ error: "L'identifiant 'id' est requis pour la modification." }, { status: 400 });
    }

    const actionId = parseInt(id, 10);

    // Récupérer l'état actuel de l'action en base avant modification pour comparer le userId
    const currentAction = await prisma.action.findUnique({
      where: { id: actionId },
      select: { userId: true, title: true }
    });

    if (!currentAction) {
      return NextResponse.json({ error: "Action introuvable." }, { status: 404 });
    }

    const updateData = {};
    
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (priorite !== undefined) updateData.priorite = priorite;
    if (statut !== undefined) updateData.statut = statut;
    if (dateLimite !== undefined) updateData.dateLimite = new Date(dateLimite); 
    if (userId !== undefined) {
      updateData.userId = userId === null ? null : parseInt(userId, 10);
    }

    // Safety guard pour les dates limites dépassées
    if (updateData.statut && ["A_FAIRE", "EN_COURS"].includes(updateData.statut)) {
      const deadline = updateData.dateLimite ? updateData.dateLimite : currentAction?.dateLimite;
      if (deadline && new Date(deadline) < new Date()) {
        updateData.statut = "EN_RETARD";
      }
    }

    // Mise à jour de l'action
    const updatedAction = await prisma.action.update({
      where: { id: actionId },
      data: updateData,
    });

    // NOTIFICATION : Si le userId a changé ou vient d'être défini
    if (updateData.userId !== undefined && updateData.userId !== null && updateData.userId !== currentAction.userId) {
      await prisma.notification.create({
        data: {
          message: `${adminName} vous a désigné comme nouveau responsable de l'action : "${updatedAction.title}"`,
          userId: updateData.userId, // Destinataire : Le nouveau responsable
          createdBy: adminName,      // Expéditeur : L'admin
        }
      });
    }

    return NextResponse.json(updatedAction);
  } catch (err) {
    console.error("Error executing action PUT adjustments layout:", err);
    return NextResponse.json({ error: "Erreur serveur lors de la mise à jour." }, { status: 500 });
  }
}

// 4. DELETE: Remove an action node reference
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID de l'action manquant." }, { status: 400 });

    await prisma.action.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({ message: "Action supprimée avec succès." });
  } catch (err) {
    console.error("Error executing action deletion node workflow:", err);
    return NextResponse.json({ error: "Erreur lors de la suppression." }, { status: 500 });
  }
}