import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const workflowId = searchParams.get("workflowId");
    const ressourceId = searchParams.get("ressourceId");

    // Fonction interne pour extraire les actions réelles depuis la base de données
    const formatWorkflowWithActions = (w) => {
      if (!w) return null;
      
      const analyses = w.analyse || [];
      let totalActionsCount = 0;

      // 1. Extraction Prioritaire : Depuis la relation Prisma directe (planAction)
      if (w.planAction) {
        if (w.planAction._count?.actions !== undefined) {
          totalActionsCount = w.planAction._count.actions;
        } else if (Array.isArray(w.planAction.actions)) {
          totalActionsCount = w.planAction.actions.length;
        }
      } 
      // 2. Extraction Alternative : Si la relation s'appelle directement 'actions' ou 'planActions' sur le workflow
      else if (Array.isArray(w.actions)) {
        totalActionsCount = w.actions.length;
      } else if (Array.isArray(w.planActions)) {
        totalActionsCount = w.planActions.length;
      }

      // 3. Extraction Fallback : Si les compteurs SQL sont vides, on inspecte le JSON de l'étape ISHIKAWA
      if (totalActionsCount === 0) {
        const ishikawaStep = analyses.find(a => a.type === "ISHIKAWA");
        if (ishikawaStep && ishikawaStep.contenu) {
          try {
            const parsedContenu = typeof ishikawaStep.contenu === 'string' 
              ? JSON.parse(ishikawaStep.contenu) 
              : ishikawaStep.contenu;

            if (parsedContenu && typeof parsedContenu === 'object') {
              if (Array.isArray(parsedContenu.actions)) {
                totalActionsCount = parsedContenu.actions.length;
              } else if (Array.isArray(parsedContenu.planActions)) {
                totalActionsCount = parsedContenu.planActions.length;
              } else {
                let count = 0;
                Object.values(parsedContenu).forEach(val => {
                  if (Array.isArray(val)) count += val.length;
                  else if (val && typeof val === 'object' && Array.isArray(val.actions)) count += val.actions.length;
                });
                if (count > 0) totalActionsCount = count;
              }
            }
          } catch (e) {
            console.error(`Erreur calcul fallback des actions pour workflow #${w.id}:`, e);
          }
        }
      }

      // Formatage de l'objet planAction attendu par <TableTraitements />
      const planActionData = totalActionsCount > 0 ? {
        _count: { actions: totalActionsCount },
        actions: new Array(totalActionsCount).fill({}) // Fallback sécurisé pour la propriété .length
      } : null;

      return {
        ...w,
        analyse: analyses,
        analyses: analyses, 
        ressource: w.ressource, 
        ressourceImpliquee: w.ressource?.nom || "Non spécifiée",
        planAction: planActionData 
      };
    };

    // Définition des inclusions Prisma pour charger les relations d'actions réelles depuis la BDD
    const genericInclude = {
      analyse: true, 
      ressource: { select: { nom: true, type: true } },
      // Charge la table liée planAction ainsi que le count de ses actions associées
      planAction: {
        include: {
          _count: {
            select: { actions: true }
          }
        }
      }
    };

    // ========================================================
    // CAS 1 : Recherche d'un Workflow UNIQUE
    // ========================================================
    if (workflowId && workflowId !== "undefined" && workflowId !== "null") {
      const parsedWorkflowId = parseInt(workflowId, 10);
      
      if (!isNaN(parsedWorkflowId)) {
        const singleWorkflow = await prisma.workflow.findUnique({
          where: { id: parsedWorkflowId },
          include: genericInclude
        });

        if (!singleWorkflow) {
          return NextResponse.json({ error: "Workflow introuvable." }, { status: 404 });
        }

        return NextResponse.json(formatWorkflowWithActions(singleWorkflow));
      }
    }

    // ========================================================
    // CAS 2 : Récupération de l'HISTORIQUE COMPLET
    // ========================================================
    let whereClause = {};
    if (ressourceId && ressourceId !== "undefined" && ressourceId !== "null") {
      const parsedId = parseInt(ressourceId, 10);
      if (!isNaN(parsedId)) {
        whereClause.ressourceId = parsedId;
      }
    }

    const workflowsHistory = await prisma.workflow.findMany({
      where: whereClause,
      orderBy: { id: 'desc' },
      include: genericInclude
    });

    const formattedWorkflows = workflowsHistory.map(w => formatWorkflowWithActions(w));

    return NextResponse.json({ workflows: formattedWorkflows });

  } catch (error) {
    console.error("Erreur API [workflow/list]:", error);
    return NextResponse.json({ workflows: [], error: "Impossible de charger l'historique." }, { status: 500 });
  }
}