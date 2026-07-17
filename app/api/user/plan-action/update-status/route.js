import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import jwt from 'jsonwebtoken'; 

export async function PUT(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
    }

    // 1. Décodage du token pour récupérer l'utilisateur courant
    let currentUser;
    try {
      currentUser = jwt.verify(token, process.env.JWT_SECRET); 
    } catch (err) {
      return NextResponse.json({ message: 'Session invalide ou expirée' }, { status: 401 });
    }

    const body = await request.json();
    const { id, statut } = body;

    if (!id || !statut) {
      return NextResponse.json({ message: 'Paramètres manquants' }, { status: 400 });
    }

    // Vérification du statut
    const statutsValides = ['A_FAIRE', 'EN_COURS', 'TERMINE', 'EN_RETARD'];
    if (!statutsValides.includes(statut)) {
      return NextResponse.json({ message: 'Statut invalide' }, { status: 400 });
    }

    // 2. Mise à jour de l'action en incluant la relation "plan" (corrigée)
    const actionMiseAJour = await prisma.action.update({
      where: { id: parseInt(id) },
      data: { statut },
      include: {
        plan: true // Relation corrigée ici (au lieu de planAction)
      }
    });

    if (!actionMiseAJour) {
      return NextResponse.json({ message: 'Action introuvable' }, { status: 404 });
    }

    // 3. Récupération des informations de l'utilisateur en base de données
    const dbUser = await prisma.user.findUnique({
      where: { id: currentUser.id }
    });

    // 4. Déterminer l'ID de l'admin destinataire
    // On cherche d'abord l'adminId de l'utilisateur, sinon on prend le userId lié au plan parent
    const targetAdminId = dbUser?.adminId || actionMiseAJour.plan?.userId; 

    // 5. Création de la notification pour l'admin
    if (targetAdminId) {
      await prisma.notification.create({
        data: {
          message: `${dbUser?.name || 'Un utilisateur'} a changé le statut de l'action "${actionMiseAJour.description || 'Sans description'}" en [${statut}]`,
          userId: targetAdminId,          
          createdBy: dbUser?.name || "Système", 
        }
      });
    }

    return NextResponse.json({ 
      message: 'Statut mis à jour et notification envoyée avec succès', 
      action: actionMiseAJour 
    }, { status: 200 });

  } catch (error) {
    console.error('[USER_ACTION_STATUS_UPDATE_ERROR]', error);
    return NextResponse.json({ message: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}