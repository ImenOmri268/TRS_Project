import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

// 1. GET: Fetch workflows and their saved analysis steps
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const ressourceId = searchParams.get("ressourceId");
    const workflowId = searchParams.get("workflowId");

    // If fetching details for a specific active workflow
    if (workflowId) {
      const analyses = await prisma.analyse.findMany({
        where: { workflowId: parseInt(workflowId) }
      });
      return NextResponse.json(analyses);
    }

    if (!ressourceId) {
      return NextResponse.json(
        { error: "Le paramètre ressourceId est requis." }, 
        { status: 400 }
      );
    }

    const workflows = await prisma.workflow.findMany({
      where: { ressourceId: parseInt(ressourceId) },
      orderBy: { id: 'desc' },
      select: {
        id: true,
        nom: true,
        dateDebut: true,
        pdfUrl: true,
      }
    });

    return NextResponse.json(workflows);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

// 2. POST / PUT: Save or Create step results safely without overwriting other phases
export async function POST(req) {
  try {
    const body = await req.json();
    const { nom, ressourceId, workflowId, type, contenu } = body;
    
    // CASE A: It's a save request for an existing workflow's step data
    if (workflowId && type) {
      let parsedContenu = typeof contenu === "string" ? JSON.parse(contenu) : contenu;

      // FIXED: If saving a Pareto step, automatically run your custom math calculation formula
      if (type === "PARETO" && Array.isArray(parsedContenu)) {
        const totalProblems = parsedContenu.reduce((sum, item) => sum + (item.problems?.length || 0), 0);
        
        parsedContenu = parsedContenu.map(item => {
          const problemCount = item.problems?.length || 0;
          const percentage = totalProblems > 0 ? (problemCount / totalProblems) * 100 : 0;
          return {
            ...item,
            count: problemCount,
            percentage: parseFloat(percentage.toFixed(2)) // Formatted nicely to 2 decimal points
          };
        });
      }

      // Check if a row for this specific tool step already exists in this workflow
      const existingAnalysis = await prisma.analyse.findFirst({
        where: {
          workflowId: parseInt(workflowId),
          type: type
        }
      });

      let stepResult;
      if (existingAnalysis) {
        stepResult = await prisma.analyse.update({
          where: { id: existingAnalysis.id },
          data: { contenu: JSON.stringify(parsedContenu) }
        });
      } else {
        stepResult = await prisma.analyse.create({
          data: {
            workflowId: parseInt(workflowId),
            type: type,
            contenu: JSON.stringify(parsedContenu)
          }
        });
      }
      return NextResponse.json({ success: true, data: stepResult });
    }

    // CASE B: Creating an completely new workflow session loop
    if (!nom || !ressourceId) {
      return NextResponse.json({ error: "Données manquantes (nom, ressourceId)" }, { status: 400 });
    }

    const workflow = await prisma.workflow.create({
      data: {
        nom: nom,
        ressourceId: parseInt(ressourceId),
        analyse: {
          create: {
            type: "BRAINSTORMING",
            contenu: JSON.stringify([{ id: 1, name: "Initial", problems: [] }])
          }
        }
      }
    });

    return NextResponse.json(workflow);
  } catch (error) {
    console.error("Workflow Processing Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const idString = searchParams.get("workflowId");

    if (!idString) {
      return NextResponse.json(
        { error: "L'identifiant du workflow (workflowId) est requis." },
        { status: 400 }
      );
    }

    const workflowId = parseInt(idString, 10);

    // 1. Verify existence
    const existingWorkflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
      include: { planAction: true } // Include the plan to find its ID
    });

    if (!existingWorkflow) {
      return NextResponse.json(
        { error: "Session de workflow introuvable." },
        { status: 404 }
      );
    }

    // 2. MULTI-LEVEL CASCADE PURGE
    // Step A: Delete IA Prompts linked to the Action Plan of this workflow
    if (existingWorkflow.planAction) {
      await prisma.promptIA.deleteMany({
        where: { planId: existingWorkflow.planAction.id },
      });

      // Step B: Delete the Action Plan itself
      await prisma.planAction.delete({
        where: { id: existingWorkflow.planAction.id },
      });
    }

    // Step C: Delete all analysis steps (Pareto, Ishikawa, etc.)
    await prisma.analyse.deleteMany({
      where: { workflowId: workflowId },
    });

    // 3. Finally, remove the core workflow session entry
    await prisma.workflow.delete({
      where: { id: workflowId },
    });

    return NextResponse.json(
      { message: "Workflow, plans d'actions et analyses supprimés avec succès." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur lors de la suppression du workflow (API):", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue lors de la suppression." },
      { status: 500 }
    );
  }
}