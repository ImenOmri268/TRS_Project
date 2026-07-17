import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request, { params }) {
  try {
    // 1. Extraction sécurisée des paramètres
    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: 'ID du traitement manquant' }, { status: 400 });
    }

    const workflowId = parseInt(id, 10);
    if (isNaN(workflowId)) {
      return NextResponse.json({ message: 'ID du traitement invalide' }, { status: 400 });
    }

    // 2. Récupération du workflow avec inclusion explicite de la table 'analyse'
    const workflowDetails = await prisma.workflow.findUnique({
      where: {
        id: workflowId
      },
      include: {
        ressource: true,
        planAction: {
          include: {
            actions: true
          }
        },
        // Correspond exactement au modèle de votre table d'analyses (Image 3)
        analyse: true 
      }
    });

    if (!workflowDetails) {
      return NextResponse.json({ message: 'Traitement introuvable' }, { status: 404 });
    }

    // Renvoi propre des données
    return NextResponse.json({ workflow: workflowDetails }, { status: 200 });

  } catch (error) {
    console.error('[USER_WORKFLOW_SINGLE_GET_ERROR]', error);
    return NextResponse.json({ message: 'Erreur interne lors du chargement des détails' }, { status: 500 });
  }
}