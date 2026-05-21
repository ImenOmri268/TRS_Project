import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

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
        plan: { select: { id: true, description: true } } // Select ID as well for form reference down the road
      },
      orderBy: { id: "desc" },
    });

    return NextResponse.json(actions);
  } catch (err) {
    console.error("Error during GET actions:", err);
    return NextResponse.json({ error: "Erreur lors de la récupération des données." }, { status: 500 });
  }
}

// 2. POST: Create a new action (Defaults automatically to 'A_FAIRE')
export async function POST(req) {
  try {
    const body = await req.json();
    const { title, description, planId, userId, priorite, impactTrs, dateLimite } = body;

    if (!title || !planId || !userId || !dateLimite) {
      return NextResponse.json({ error: "Les champs obligatoires (Titre, Plan, Responsable, Date limite) sont requis." }, { status: 400 });
    }

    const newAction = await prisma.action.create({
      data: {
        title,
        description,
        priorite: priorite || "MOYEN",
        impactTrs: impactTrs ? parseFloat(impactTrs) : null,
        statut: "A_FAIRE", // Guaranteed initialization state override
        dateLimite: new Date(dateLimite),
        planId: parseInt(planId, 10),
        userId: parseInt(userId, 10),
      },
    });

    return NextResponse.json(newAction);
  } catch (err) {
    console.error("Error creating new action:", err);
    return NextResponse.json({ error: "Erreur lors de la création de l'action." }, { status: 500 });
  }
}

// 3. PUT: Full updates manageable by Admin Panel UI Form inputs
export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, title, description, priorite, statut, userId, impactTrs, dateLimite } = body;

    if (!id) {
      return NextResponse.json({ error: "L'identifiant 'id' est requis pour la modification." }, { status: 400 });
    }

    const updateData = {};
    
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (priorite !== undefined) updateData.priorite = priorite;
    if (statut !== undefined) updateData.statut = statut;
    if (impactTrs !== undefined) updateData.impactTrs = impactTrs ? parseFloat(impactTrs) : null;
    if (dateLimite !== undefined) updateData.dateLimite = new Date(dateLimite);
    
    if (userId !== undefined) {
      updateData.userId = userId === null ? null : parseInt(userId, 10);
    }

    // Safety guard: If status is updated manually away from complete while deadline is past, auto-verify enum string
    if (updateData.statut && ["A_FAIRE", "EN_COURS"].includes(updateData.statut)) {
      const targetAction = await prisma.action.findUnique({ where: { id: parseInt(id, 10) } });
      const deadline = updateData.dateLimite ? updateData.dateLimite : targetAction?.dateLimite;
      if (deadline && new Date(deadline) < new Date()) {
        updateData.statut = "EN_RETARD";
      }
    }

    const updatedAction = await prisma.action.update({
      where: { id: parseInt(id, 10) },
      data: updateData,
    });

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