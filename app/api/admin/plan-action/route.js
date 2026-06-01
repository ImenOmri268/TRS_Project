import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const plans = await prisma.planAction.findMany({
      include: {
        workflow: { select: { nom: true } },
        _count: { select: { actions: true } }
      },
      orderBy: { dateDebut: 'desc' }
    });
    return NextResponse.json(plans);
  } catch (err) {
    return NextResponse.json({ error: "Fetch error" }, { status: 500 });
  }
}



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

export async function DELETE(request) {
  try {
    // 1. Extract the 'id' parameter from the request URL string
    const { searchParams } = new URL(request.url);
    const idString = searchParams.get("id");

    if (!idString) {
      return NextResponse.json(
        { error: "L'identifiant du plan d'action (id) est requis." },
        { status: 400 }
      );
    }

    const planId = parseInt(idString, 10);
    if (isNaN(planId)) {
      return NextResponse.json(
        { error: "L'identifiant fourni n'est pas un nombre valide." },
        { status: 400 }
      );
    }

    // 2. Optional safety check: Verify if the plan actually exists before trying to delete it
    const existingPlan = await prisma.planAction.findUnique({
      where: { id: planId },
    });

    if (!existingPlan) {
      return NextResponse.json(
        { error: "Plan d'action introuvable." },
        { status: 404 }
      );
    }

    // 3. DATABASE CASCADE HANDLING:
    await prisma.action.deleteMany({
      where: { planId: planId },
    });

    await prisma.promptIA.deleteMany({
      where: { planId: planId },
    });

    // 4. Delete the main plan action folder item
    await prisma.planAction.delete({
      where: { id: planId },
    });

    // 5. Return success response status configuration
    return NextResponse.json(
      { message: "Plan d'action et ses actions associés supprimés avec succès." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur lors de la suppression de l'élément (API):", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue lors de la suppression." },
      { status: 500 }
    );
  }
}
