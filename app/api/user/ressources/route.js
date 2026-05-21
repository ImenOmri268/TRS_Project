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

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, dailyEntries, nom, type, description, statut, parameters } = body;
    const resourceId = parseInt(id);

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

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[USER_RESSOURCES_PUT_ERROR]', error);
    return NextResponse.json({ message: 'Erreur de mise à jour' }, { status: 500 });
  }
}