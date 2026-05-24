import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const ressourceId = searchParams.get("ressourceId");
    const workflowId = searchParams.get("workflowId");

    // CAS 1 : Détails d'un workflow spécifique
    if (workflowId) {
      const workflowDetails = await prisma.workflow.findUnique({
        where: { id: parseInt(workflowId) },
        include: { analyse: true }
      });
      
      if (!workflowDetails) {
        return NextResponse.json({ error: "Introuvable" }, { status: 404 });
      }

      // Sécurité : Dupliquer sous forme de tableau pluriel si nécessaire
      const formattedDetails = {
        ...workflowDetails,
        analyses: workflowDetails.analyse || []
      };

      return NextResponse.json(formattedDetails);
    }

    // CAS 2 : Historique Global ou Filtré
    const whereClause = ressourceId && ressourceId !== "undefined"
      ? { ressourceId: parseInt(ressourceId) }
      : {};

    const workflowsHistory = await prisma.workflow.findMany({
      where: whereClause,
      orderBy: { id: 'desc' },
      include: {
        analyse: true, // Récupère les étapes (Brainstorming, Pareto...)
        ressource: {
          select: { nom: true }
        }
      }
    });

    // CORRECTION LOGIQUE : On adapte le format pour le composant TableTraitements
    const formattedWorkflows = workflowsHistory.map(w => ({
      ...w,
      // On fournit la clé "analyses" au pluriel attendue par le badge du tableau
      analyses: w.analyse || [], 
      ressourceImpliquee: w.ressource?.nom || "Non spécifiée"
    }));

    return NextResponse.json({ workflows: formattedWorkflows });

  } catch (error) {
    console.error("Erreur de consultation (voir_traitements):", error);
    return NextResponse.json({ workflows: [], error: "Impossible de charger les données." }, { status: 500 });
  }
}