import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'
import { verifyToken } from '../../../lib/jwt'

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });

    const decoded = verifyToken(token);

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

    const ressources = await prisma.ressource.findMany({
      where: { adminId },
      orderBy: { nom: 'asc' },
      include: {
        parameters: true,
        trs: {
          include: {
            disponibilite: true,
            performance: true,
            qualite: true,
          }
        },
      }
    });

    return NextResponse.json(ressources);
  } catch (error) {
    console.error('[USER_RESSOURCES_GET_ERROR]', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = request.cookies.get('token')?.value;
    const decoded = verifyToken(token);

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

    const { nom, type, description, parameters, initialTRS, initialDisp, initialPerf, initialQual } = await request.json();

    const newResource = await prisma.ressource.create({
      data: {
        nom, type, description,
        statut: true,
        adminId,
        parameters: {
          create: parameters.map(p => ({ label: p.label, category: p.category }))
        },
        trs: (initialTRS || initialDisp || initialPerf || initialQual) ? {
          create: [{
            type: 'INITIAL',
            valeur: parseFloat(initialTRS) || 0,
            disponibilite: { create: { valeur: parseFloat(initialDisp) || 0 } },
            performance: { create: { valeur: parseFloat(initialPerf) || 0 } },
            qualite: { create: { valeur: parseFloat(initialQual) || 0 } },
          }]
        } : undefined
      },
      include: {
        parameters: true,
        trs: { include: { disponibilite: true, performance: true, qualite: true } }
      }
    });

    return NextResponse.json(newResource, { status: 201 });
  } catch (error) {
    console.error('[USER_RESSOURCES_POST_ERROR]', error);
    return NextResponse.json({ message: 'Erreur de création' }, { status: 500 });
  }
}