import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { verifyToken } from '../../../../lib/jwt';

export async function PUT(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
    }

    const body = await request.json();
    const { id, statut } = body;

    if (!id || !statut) {
      return NextResponse.json({ message: 'Paramètres manquants' }, { status: 400 });
    }

    // Vérification que le statut envoyé fait bien partie de l'Enum de votre schema.prisma
    const statutsValides = ['A_FAIRE', 'EN_COURS', 'TERMINE', 'EN_RETARD'];
    if (!statutsValides.includes(statut)) {
      return NextResponse.json({ message: 'Statut invalide' }, { status: 400 });
    }

    // Mise à jour de l'action
    const actionMiseAJour = await prisma.action.update({
      where: { id: parseInt(id) },
      data: { statut }
    });

    await prisma.notification.create({
      data: {
        message: `A créé une nouvelle ressource: ${nomRessource}`,
        type: "SYSTEM_AUDIT",
        userId: user.adminId, // L'ID de l'admin rattaché à cet utilisateur
        createdBy: user.name, // Le nom de l'utilisateur courant
      }
    });

    return NextResponse.json({ 
      message: 'Statut mis à jour avec succès', 
      action: actionMiseAJour 
    }, { status: 200 });

  } catch (error) {
    console.error('[USER_ACTION_STATUS_UPDATE_ERROR]', error);
    return NextResponse.json({ message: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}