import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { verifyToken } from '../../../lib/jwt';

// === GET: Fetch all resources ===
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
        metrics: {
          orderBy: { date: 'desc' },
        }
      }
    });

    return NextResponse.json(ressources);
  } catch (error) {
    console.error('[USER_RESSOURCES_GET_ERROR]', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

// === POST: Create a new resource ===
export async function POST(request) {
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

    try {
      const actor = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { name: true, adminId: true }
      });

      if (actor?.adminId) {
        await prisma.notification.create({
          data: {
            message: `L'utilisateur ${actor.name} a créé une nouvelle ressource : ${nom} (${type}).`,
            userId: actor.adminId,
            createdBy: actor.name
          }
        });
      }
    } catch (notifError) {
      console.error('[POST_RESSOURCE_NOTIF_ERROR]', notifError);
    }

    return NextResponse.json(newResource, { status: 201 });
  } catch (error) {
    console.error('[USER_RESSOURCES_POST_ERROR]', error);
    return NextResponse.json({ message: 'Erreur de création' }, { status: 500 });
  }
}

// === PUT: Update an existing resource ===
export async function PUT(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
    
    const decoded = verifyToken(token);

    const body = await request.json();
    const { id, dailyEntries, nom, type, description, statut, parameters } = body;
    const resourceId = parseInt(id);

    let notificationMessage = "";

    if (dailyEntries && dailyEntries.length > 0) {
      await prisma.dailyValue.createMany({
        data: dailyEntries.map(entry => ({
          parameterId: parseInt(entry.parameterId),
          value: parseFloat(entry.value),
          date: new Date()
        }))
      });

      const resourceParams = await prisma.resourceParameter.findMany({
        where: { ressourceId: resourceId }
      });

      const categories = ['DISPONIBILITE', 'PERFORMANCE', 'QUALITE'];
      
      for (const cat of categories) {
        const catParamIds = resourceParams
          .filter(p => p.category === cat)
          .map(p => p.id);

        const relevantEntries = dailyEntries.filter(e => 
          catParamIds.includes(parseInt(e.parameterId))
        );
        
        if (relevantEntries.length >= 2) {
          const v1 = parseFloat(relevantEntries[0].value);
          const v2 = parseFloat(relevantEntries[1].value);

          if (v1 !== 0) {
            const resultPourcentage = ((v1 - v2) / v1) * 100;

            await prisma.calculatedMetric.create({
              data: {
                ressourceId: resourceId,
                category: cat,
                valeur: parseFloat(resultPourcentage.toFixed(2)),
                date: new Date()
              }
            });
          }
        }
      }
      notificationMessage = "collecté de nouvelles données et mis à jour les indicateurs de";
    } else {
      notificationMessage = "mis à jour les informations de";
    }

    if (parameters && Array.isArray(parameters)) {
      for (const param of parameters) {
        if (param.id) {
          await prisma.resourceParameter.update({
            where: { id: parseInt(param.id) },
            data: { label: param.label }
          });
        }
      }
    }
    
    const updateData = {};
    if (nom) updateData.nom = nom;
    if (type) updateData.type = type;
    if (description !== undefined) updateData.description = description;
    if (statut !== undefined) updateData.statut = statut;

    const updated = await prisma.ressource.update({
      where: { id: resourceId },
      data: updateData
    });

    // 🛠️ FIX: Fetch actor details down here safely
    try {
      const actor = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { name: true, adminId: true }
      });

      if (actor?.adminId) {
        await prisma.notification.create({
          data: {
            message: `L'utilisateur ${actor.name} a ${notificationMessage} la ressource : ${updated.nom}.`,
            userId: actor.adminId,
            createdBy: actor.name
          }
        });
      }
    } catch (notifError) {
      console.error('[PUT_RESSOURCE_NOTIF_ERROR]', notifError);
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[USER_RESSOURCES_PUT_ERROR]', error);
    return NextResponse.json({ message: 'Erreur de mise à jour' }, { status: 500 });
  }
}

// === DELETE: Remove a resource completely ===
export async function DELETE(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });

    const decoded = verifyToken(token);
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));

    if (!id || isNaN(id)) {
      return NextResponse.json({ message: 'ID ressource invalide' }, { status: 400 });
    }

    // 1. Get resource name and verification info BEFORE executing deletion cascade
    const targetResource = await prisma.ressource.findUnique({
      where: { id },
      select: { nom: true }
    });

    if (!targetResource) {
      return NextResponse.json({ message: 'Ressource introuvable' }, { status: 404 });
    }

    // 2. Fetch actor profile tracking parameters
    const actor = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { name: true, adminId: true }
    });

    // 3. Delete from Database
    await prisma.ressource.delete({
      where: { id }
    });

    // 4. Record Notification row using local execution strings
    if (actor?.adminId) {
      try {
        await prisma.notification.create({
          data: {
            message: `L'utilisateur ${actor.name} a supprimé la ressource : ${targetResource.nom}.`,
            userId: actor.adminId,
            createdBy: actor.name
          }
        });
      } catch (notifError) {
        console.error('[DELETE_RESSOURCE_NOTIF_ERROR]', notifError);
      }
    }

    return NextResponse.json({ message: 'Ressource supprimée avec succès' });
  } catch (error) {
    console.error('[USER_RESSOURCES_DELETE_ERROR]', error);
    return NextResponse.json({ message: 'Erreur lors de la suppression' }, { status: 500 });
  }
}