import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

// POST: Create the main PlanAction container
export async function POST(request) {
  try {
    const { workflowId, description, dateDebut } = await request.json();

    const plan = await prisma.planAction.create({
      data: {
        workflowId: parseInt(workflowId),
        description: description || "Plan d'amélioration",
        statut: "EN_COURS",
        dateDebut: dateDebut ? new Date(dateDebut) : new Date(),
      }
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("[PLAN_POST_ERROR]:", error);
    return NextResponse.json({ error: "Impossible de créer le plan" }, { status: 500 });
  }
}

// GET: Fetch plans to list them in the UI if needed
export async function GET() {
  try {
    const plans = await prisma.planAction.findMany({
      include: { _count: { select: { actions: true } } },
      orderBy: { dateDebut: 'desc' }
    });
    return NextResponse.json(plans);
  } catch (error) {
    return NextResponse.json({ error: "Erreur de récupération" }, { status: 500 });
  }
}