import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'
import { verifyToken } from '../../../lib/jwt'

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });

    const decoded = verifyToken(token);

    // Récupère l'adminId du user
    let adminId;
    if (decoded.type === 'ADMIN') {
      adminId = decoded.id;
    } else {
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { adminId: true }
      });
      adminId = user?.adminId;
    }

    if (!adminId) return NextResponse.json({ message: 'Admin introuvable' }, { status: 404 });

    const objectifs = await prisma.objectif.findMany({
      where: {
        ressource: { adminId }
      },
      include: {
        ressource: { select: { nom: true } }
      },
      orderBy: { dateDebut: 'desc' }
    });

    return NextResponse.json(objectifs);
  } catch (error) {
    console.error('[USER_OBJECTIFS_GET_ERROR]', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}