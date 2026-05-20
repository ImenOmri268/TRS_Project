import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const ressourceId = searchParams.get("ressourceId");
    const type = searchParams.get("type");

    if (!ressourceId) {
      return NextResponse.json({ error: "ressourceId est requis" }, { status: 400 });
    }

    const analyses = await prisma.analyse.findMany({
      where: {
        type: type, // e.g., "IDENTIFICATION"
        workflow: {
          ressourceId: parseInt(ressourceId) // Traverses back up to match the resource ID
        }
      }
    });

    return NextResponse.json(analyses);
  } catch (error) {
    console.error("GET Analyse Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { ressourceId, type, contenu } = body;

    if (!ressourceId || !type || !contenu) {
      return NextResponse.json(
        { error: "Données manquantes (ressourceId, type, contenu)" }, 
        { status: 400 }
      );
    }

    const parsedRessourceId = parseInt(ressourceId);

    // 1. Fetch the active or most recent workflow associated with this resource
    const activeWorkflow = await prisma.workflow.findFirst({
      where: { ressourceId: parsedRessourceId },
      orderBy: { id: "desc" } // Targets the latest created workflow cycle context
    });

    if (!activeWorkflow) {
      return NextResponse.json(
        { error: "Aucun workflow actif trouvé pour cette ressource." }, 
        { status: 404 }
      );
    }

    // 2. Check if an analysis already exists for this unique workflow session
    const existingAnalyse = await prisma.analyse.findUnique({
      where: {
        workflowId: activeWorkflow.id
      }
    });

    let analysis;
    if (existingAnalyse) {
      // Overwrite step contents and advance phase type status flags
      analysis = await prisma.analyse.update({
        where: { id: existingAnalyse.id },
        data: { 
          type: type, // e.g., updates to "IDENTIFICATION", "PARETO", "CINQ_POURQUOI", etc.
          contenu: contenu 
        }
      });
    } else {
      // Create the single analysis tracking instance for this workflow path cycle
      analysis = await prisma.analyse.create({
        data: {
          workflowId: activeWorkflow.id,
          type: type,
          contenu: contenu,
        },
      });
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("POST Analyse Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}