import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { verifyToken } from '../../../lib/jwt';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const userId = decoded.id;

    // 1. Récupérer uniquement les actions affectées à CET utilisateur
    // On inclut toute la chaîne ascendante pour avoir les détails du plan et de la machine
    const actionsUtilisateur = await prisma.action.findMany({
      where: {
        userId: userId
      },
      include: {
        plan: {
          include: {
            workflow: {
              include: {
                ressource: {
                  select: { nom: true, type: true }
                }
              }
            }
          }
        }
      },
      orderBy: {
        dateLimite: 'asc'
      }
    });

    // 2. Structurer les données côté serveur pour faciliter le rendu Master-Detail
    // On va créer un dictionnaire/objet groupé par PlanAction
    const plansMap = {};

    actionsUtilisateur.forEach(action => {
      const plan = action.plan;
      if (!plan) return;

      if (!plansMap[plan.id]) {
        plansMap[plan.id] = {
          id: plan.id,
          title: plan.title,
          description: plan.description,
          statut: plan.statut,
          dateDebut: plan.dateDebut,
          dateFin: plan.dateFin,
          ressourceNom: plan.workflow?.ressource?.nom || "Général",
          ressourceType: plan.workflow?.ressource?.type || "N/A",
          actions: []
        };
      }

      // On pousse l'action nettoyée dans son plan respectif
      plansMap[plan.id].actions.push({
        id: action.id,
        title: action.title,
        description: action.description,
        priorite: action.priorite,
        statut: action.statut,
        dateLimite: action.dateLimite,
      });
    });

    // Convertir l'objet en tableau pour le Front-end
    const plansDactionsAffectes = Object.values(plansMap);

    return NextResponse.json({ plans: plansDactionsAffectes });

  } catch (error) {
    console.error('[USER_MY_PLAN_ACTION_GET_ERROR]', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}