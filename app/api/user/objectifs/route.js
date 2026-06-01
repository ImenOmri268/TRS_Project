import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { verifyToken } from '../../../lib/jwt';

export const dynamic = 'force-dynamic';

// --- GET: Fetch goals belonging to supervisor's resources ---
export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const loggedInUserId = parseInt(decoded.id);

    const currentUser = await prisma.user.findUnique({
      where: { id: loggedInUserId },
      select: { adminId: true },
    });

    if (!currentUser || !currentUser.adminId) {
      return NextResponse.json([]);
    }

    const objectifs = await prisma.objectif.findMany({
      where: {
        ressource: {
          adminId: currentUser.adminId,
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
    console.error('[USER_OBJECTIFS_GET_ERROR]', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

// --- POST: Create a new goal (WITHOUT SCHEMA ALTERATIONS) ---
export async function POST(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });

    const decoded = verifyToken(token);
    const loggedInUserId = parseInt(decoded.id);
    
    if (isNaN(loggedInUserId)) {
      return NextResponse.json({ message: 'ID utilisateur invalide' }, { status: 400 });
    }

    // 1. PRE-FETCH ACTOR: Get the user name and adminId right away
    const actor = await prisma.user.findUnique({
      where: { id: loggedInUserId },
      select: { name: true, adminId: true },
    });

    if (!actor || !actor.adminId) {
      return NextResponse.json({ message: 'Admin associé introuvable' }, { status: 404 });
    }

    const body = await request.json();
    const { title, description, valeurCible, dateFin, ressourceId } = body;

    const parsedResourceId = parseInt(ressourceId);
    if (!ressourceId || isNaN(parsedResourceId)) {
      return NextResponse.json({ message: 'ID de ressource invalide' }, { status: 400 });
    }

    // Check duplicate constraints
    const existing = await prisma.objectif.findFirst({
      where: { ressourceId: parsedResourceId },
    });

    if (existing) {
      return NextResponse.json(
        { message: 'Cette ressource a déjà un objectif défini.' },
        { status: 400 }
      );
    }

    // 2. PRE-FETCH RESOURCE NAME: Get the name directly from the Resource table first
    const targetResource = await prisma.ressource.findUnique({
      where: { id: parsedResourceId },
      select: { nom: true },
    });

    // 3. CREATE THE OBJECTIVE: Keep this query simple and fast
    const newObjectif = await prisma.objectif.create({
      data: {
        title: title || null,
        description: description || null,
        valeurCible: parseFloat(valeurCible) || 0,
        dateFin: dateFin ? new Date(dateFin) : null,
        ressourceId: parsedResourceId,
      },
    });

    // 4. TRIGGER NOTIFICATION: Runs perfectly because it relies entirely on local memory constants
    try {
      await prisma.notification.create({
        data: {
          // We use 'actor.name', request body 'title', and 'targetResource.nom' directly!
          message: `L'utilisateur ${actor.name} a créé un nouvel objectif (${title || 'Sans titre'}) pour la ressource ${targetResource?.nom || 'Indéfinie'}.`,
          userId: actor.adminId, 
          createdBy: actor.name,
          date: new Date(),
        },
      });
      console.log("✅ Success: Notification written to DB using pre-cached variables.");
    } catch (notifError) {
      console.error('[POST_OBJECTIF_NOTIF_ERROR]', notifError.message);
    }

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

    const decoded = verifyToken(token);
    const loggedInUserId = parseInt(decoded.id);

    const { id, title, description, valeurCible, dateFin } = await request.json();

    const updatedObjectif = await prisma.objectif.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        valeurCible: parseFloat(valeurCible),
        dateFin: dateFin ? new Date(dateFin) : null,
      },
      include: {
        ressource: {
          select: { nom: true },
        },
      },
    });

    try {
      const actor = await prisma.user.findUnique({
        where: { id: loggedInUserId },
        select: { name: true, adminId: true },
      });

      if (actor?.adminId) {
        await prisma.notification.create({
          data: {
            message: `L'utilisateur ${actor.name} a modifié l'objectif de la ressource ${updatedObjectif.ressource?.nom || 'Indéfinie'}.`,
            userId: actor.adminId,
            createdBy: actor.name,
            date: new Date()
          },
        });
      }
    } catch (notifError) {
      console.error('[PUT_OBJECTIF_NOTIF_ERROR]', notifError);
    }

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

    const decoded = verifyToken(token);
    const loggedInUserId = parseInt(decoded.id);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'ID manquant' }, { status: 400 });
    }

    const targetGoal = await prisma.objectif.findUnique({
      where: { id: parseInt(id) },
      include: {
        ressource: {
          select: { nom: true },
        },
      },
    });

    await prisma.objectif.delete({
      where: { id: parseInt(id) },
    });

    try {
      const actor = await prisma.user.findUnique({
        where: { id: loggedInUserId },
        select: { name: true, adminId: true },
      });

      if (actor?.adminId && targetGoal) {
        await prisma.notification.create({
          data: {
            message: `L'utilisateur ${actor.name} a supprimé l'objectif (${targetGoal.title || 'Sans titre'}) associé à la ressource ${targetGoal.ressource?.nom || 'Indéfinie'}.`,
            userId: actor.adminId,
            createdBy: actor.name,
            date: new Date()
          },
        });
      }
    } catch (notifError) {
      console.error('[DELETE_OBJECTIF_NOTIF_ERROR]', notifError);
    }

    return NextResponse.json({ message: 'Objectif supprimé avec succès' });
  } catch (error) {
    console.error('[OBJECTIFS_DELETE_ERROR]', error);
    return NextResponse.json({ message: 'Erreur lors de la suppression' }, { status: 500 });
  }
}