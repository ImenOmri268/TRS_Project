import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'
import { verifyToken } from '../../../lib/jwt'

// --- GET: Fetch all goals for the logged-in admin's resources ---
export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const adminId = decoded.id;

    // Fetch objectives linked to resources belonging to this admin
    const objectifs = await prisma.objectif.findMany({
      where: {
        ressource: {
          adminId: adminId,
        },
      },
      include: {
        ressource: {
          select: { nom: true },
        },
      },
      orderBy: {
        dateDebut: 'desc',
      },
    });

    return NextResponse.json(objectifs);
  } catch (error) {
    console.error('[OBJECTIFS_GET_ERROR]', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

// --- POST: Create a new goal ---
export async function POST(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });

    const body = await request.json();
    const {title, description, valeurCible, dateFin, ressourceId } = body;

    const newObjectif = await prisma.objectif.create({
      data: {
        title,
        description,
        valeurCible: parseFloat(valeurCible),
        dateFin: dateFin ? new Date(dateFin) : null,
        ressourceId: parseInt(ressourceId),
      },
    });

    return NextResponse.json(newObjectif, { status: 201 });
  } catch (error) {
    console.error('[OBJECTIFS_POST_ERROR]', error);
    return NextResponse.json({ message: 'Erreur lors de la création' }, { status: 500 });
  }
}

// --- PUT: Update an existing goal ---
export async function PUT(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });

    const { id, title, description, valeurCible, dateFin } = await request.json();
    

    const updatedObjectif = await prisma.objectif.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        valeurCible: parseFloat(valeurCible),
        dateFin: dateFin ? new Date(dateFin) : null,
      },
    });

    return NextResponse.json(updatedObjectif);
  } catch (error) {
    console.error('[OBJECTIFS_PUT_ERROR]', error);
    return NextResponse.json({ message: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

// --- DELETE: Remove a goal ---
export async function DELETE(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'ID manquant' }, { status: 400 });
    }

    await prisma.objectif.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Objectif supprimé avec succès' });
  } catch (error) {
    console.error('[OBJECTIFS_DELETE_ERROR]', error);
    return NextResponse.json({ message: 'Erreur lors de la suppression' }, { status: 500 });
  }
}