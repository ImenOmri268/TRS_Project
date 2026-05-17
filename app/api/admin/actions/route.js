import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// 1. GET: Fetch actions (can filter by planId or userId)
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const planId = searchParams.get("planId");
  const userId = searchParams.get("userId");

  try {
    const actions = await prisma.action.findMany({
      where: {
        ...(planId && { planId: parseInt(planId) }),
        ...(userId && { userId: parseInt(userId) }),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        plan: { select: { description: true } }
      },
      orderBy: { id: "desc" },
    });
    return NextResponse.json(actions);
  } catch (err) {
    return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 500 });
  }
}

// 2. POST: Create a new action manually
export async function POST(req) {
  try {
    const body = await req.json();
    const { description, planId, userId, statut } = body;

    const newAction = await prisma.action.create({
      data: {
        description,
        statut: statut || "EN_COURS",
        planId: parseInt(planId),
        userId: parseInt(userId),
      },
    });

    return NextResponse.json(newAction);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
  }
}

// 3. PUT: Full update of an action (Description, User, or Status)
export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, description, userId, statut } = body;

    const updatedAction = await prisma.action.update({
      where: { id: parseInt(id) },
      data: {
        ...(description && { description }),
        ...(userId && { userId: parseInt(userId) }),
        ...(statut && { statut }),
      },
    });

    return NextResponse.json(updatedAction);
  } catch (err) {
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}

// 4. DELETE: Remove an action
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    await prisma.action.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Action supprimée avec succès" });
  } catch (err) {
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}