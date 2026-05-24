import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(request, { params }) {
  try {
    // 1. Récupération robuste de l'identifiant (gère [id] ou [workflowId])
    const idParam = params?.id || params?.workflowId;
    
    if (!idParam) {
      return NextResponse.json({ message: 'ID du traitement manquant' }, { status: 400 });
    }

    const workflowId = parseInt(idParam, 10);
    if (isNaN(workflowId)) {
      return NextResponse.json({ message: 'ID du traitement invalide' }, { status: 400 });
    }

    // 2. Extraction complète de toutes les données liées pour bâtir le document d'archive
    const workflowData = await prisma.workflow.findUnique({
      where: { id: workflowId },
      include: {
        ressource: true,
        planAction: {
          include: {
            actions: true
          }
        },
        analyse: true
      }
    });

    if (!workflowData) {
      return NextResponse.json({ message: 'Rapport introuvable pour ce traitement' }, { status: 404 });
    }

    // 3. Structuration du contenu du fichier d'export technique
    const reportPayload = {
      titre: `RAPPORT TECHNIQUE OFFICIEL - LEAN MANUFACTURING`,
      workflowId: workflowData.id,
      nomWorkflow: workflowData.nom,
      statutActuel: workflowData.statut,
      dateGeneration: new Date().toISOString(),
      equipement: {
        nom: workflowData.ressource?.nom || 'Non spécifié',
        type: workflowData.ressource?.type || 'Non spécifié'
      },
      livrablesMethodologiques: workflowData.analyse.map(a => ({
        typeAnalyse: a.type,
        creeLe: a.createdAt || a.created_at || 'Date inconnue',
        donneesBrutes: a.contenu ? JSON.parse(JSON.stringify(a.contenu)) : null
      })),
      maintenanceCorrective: {
        totalActions: workflowData.planAction?.actions?.length || 0,
        actions: workflowData.planAction?.actions?.map(act => ({
          description: act.description || act.nom || 'Sans description',
          statutAction: act.statut || 'En attente'
        })) || []
      },
      metadonnees: "Document d'archive infalsifiable - Lecture seule"
    };

    // 4. Conversion en chaîne JSON bien formatée (indentation de 2 espaces pour lisibilité)
    const jsonString = JSON.stringify(reportPayload, null, 2);

    // 5. Normalisation du nom de fichier (ex: rapport_15_nom-du-workflow.json)
    const sanitizedTitle = workflowData.nom
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_');
    const fileName = `rapport_${workflowId}_${sanitizedTitle}.json`;

    // 6. Envoi de la réponse avec en-têtes de téléchargement forcé
    return new NextResponse(jsonString, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Force le téléchargement immédiat par le navigateur avec le nom personnalisé
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-store, max-age=0'
      }
    });

  } catch (error) {
    console.error('[API_WORKFLOW_REPORT_EXPORT_ERROR]', error);
    return NextResponse.json({ message: 'Erreur lors de la génération du fichier de rapport' }, { status: 500 });
  }
}