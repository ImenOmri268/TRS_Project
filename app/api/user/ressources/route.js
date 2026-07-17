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
    const calculationDate = new Date();

    let notificationMessage = "";

    if (dailyEntries && dailyEntries.length > 0) {
      const startOfDay = new Date(calculationDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(calculationDate);
      endOfDay.setHours(23, 59, 59, 999);

      // Delete existing calculations and values for the current day to avoid duplicates
      await prisma.calculatedMetric.deleteMany({
        where: { ressourceId: resourceId, date: { gte: startOfDay, lte: endOfDay } }
      });

      const paramIds = dailyEntries.map(e => parseInt(e.parameterId));
      await prisma.dailyValue.deleteMany({
        where: { parameterId: { in: paramIds }, date: { gte: startOfDay, lte: endOfDay } }
      });

      await prisma.dailyValue.createMany({
        data: dailyEntries.map(entry => ({
          parameterId: parseInt(entry.parameterId),
          value: parseFloat(entry.value),
          date: calculationDate
        }))
      });

      const resourceParams = await prisma.resourceParameter.findMany({
        where: { ressourceId: resourceId }
      });

      const getValsByCat = (cat) => {
        const catParamIds = resourceParams.filter(p => p.category === cat).map(p => p.id);
        return dailyEntries
          .filter(e => catParamIds.includes(parseInt(e.parameterId)))
          .map(e => parseFloat(e.value));
      };

      const dispVals = getValsByCat('DISPONIBILITE');
      const perfVals = getValsByCat('PERFORMANCE');
      const qualVals = getValsByCat('QUALITE');

      let dispPct = null, perfPct = null, qualPct = null, trsPct = null;
      let tempsFonct = null;

      // 1. Availability calculation formula matching admin route logic
      if (dispVals.length >= 2 && dispVals[0] !== 0) {
        tempsFonct = dispVals[0] - dispVals[1];
        dispPct = (tempsFonct / dispVals[0]) * 100;
      }

      // 2. Performance calculation formula matching admin route logic
      if (tempsFonct !== null && perfVals.length >= 2 && perfVals[1] !== 0) {
        const qteProduite   = perfVals[0];
        const tempsUnitTheo = perfVals[1];
        const prodTheorique = tempsFonct / tempsUnitTheo;
        perfPct = prodTheorique !== 0 ? (qteProduite / prodTheorique) * 100 : 0;
      }

      // 3. Quality calculation formula matching admin route logic
      if (qualVals.length >= 2 && qualVals[0] !== 0) {
        const qteBonnes = qualVals[0] - qualVals[1];
        qualPct = (qteBonnes / qualVals[0]) * 100;
      }

      // 4. Global OEE / TRS product formula multiplication matching admin route logic
      if (dispPct !== null && perfPct !== null && qualPct !== null) {
        trsPct = (dispPct / 100) * (perfPct / 100) * (qualPct / 100) * 100;
      }

      // Save DISPONIBILITE, PERFORMANCE, QUALITE metrics tracking values inside historical tables
      const metricsToSave = [
        { category: 'DISPONIBILITE', valeur: dispPct },
        { category: 'PERFORMANCE',   valeur: perfPct },
        { category: 'QUALITE',       valeur: qualPct },
      ].filter(m => m.valeur !== null);

      for (const metric of metricsToSave) {
        await prisma.calculatedMetric.create({
          data: {
            ressourceId: resourceId,
            category: metric.category,
            valeur: parseFloat(metric.valeur.toFixed(2)),
            date: calculationDate
          }
        });
      }

      // Sync and apply calculation updates over persistent structural TRS rows
      if (trsPct !== null) {
        const existingTRS = await prisma.tRS.findFirst({
          where: { ressourceId: resourceId, type: 'INITIAL' }
        });
        
        if (existingTRS) {
          await prisma.tRS.update({
            where: { id: existingTRS.id },
            data: { valeur: parseFloat(trsPct.toFixed(2)) }
          });
          if (existingTRS.disponibilite) {
            await prisma.disponibilite.update({
              where: { trsId: existingTRS.id },
              data: { valeur: parseFloat(dispPct.toFixed(2)) }
            });
          }
          if (existingTRS.performance) {
            await prisma.performance.update({
              where: { trsId: existingTRS.id },
              data: { valeur: parseFloat(perfPct.toFixed(2)) }
            });
          }
          if (existingTRS.qualite) {
            await prisma.qualite.update({
              where: { trsId: existingTRS.id },
              data: { valeur: parseFloat(qualPct.toFixed(2)) }
            });
          }
        } else {
          await prisma.tRS.create({
            data: {
              type: 'INITIAL',
              valeur: parseFloat(trsPct.toFixed(2)),
              ressourceId: resourceId,
              disponibilite: { create: { valeur: parseFloat(dispPct.toFixed(2)) } },
              performance:   { create: { valeur: parseFloat(perfPct.toFixed(2)) } },
              qualite:       { create: { valeur: parseFloat(qualPct.toFixed(2)) } },
            }
          });
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

    const targetResource = await prisma.ressource.findUnique({
      where: { id },
      select: { nom: true }
    });

    if (!targetResource) {
      return NextResponse.json({ message: 'Ressource introuvable' }, { status: 404 });
    }

    const actor = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { name: true, adminId: true }
    });

    await prisma.ressource.delete({
      where: { id }
    });

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