import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import {  verifyToken } from '../../../lib/jwt';

// ─── GET: List Resources with Parameters and Daily Values ──────────────────
// ─── GET: Fetch resources with the LATEST performance metrics ──────────────
export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    const decoded = verifyToken(token);

    const resources = await prisma.ressource.findMany({
      where: { adminId: decoded.id },
      orderBy: { nom: 'asc' },
      include: {
        parameters: { include: { dailyValues: { orderBy: { date: 'desc' }, take: 5 } } },
        trs: { include: { disponibilite: true, performance: true, qualite: true } },
        metrics: {
          orderBy: { date: 'desc' },
          // Removed 'take: 3' to get the full history for the table
        }
      }
    });

    return NextResponse.json(resources);
  } catch (error) {
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

// ─── POST: Create Resource and Initialize Parameters ────────────────────────
export async function POST(request) {
  try {
    const token = request.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    
    // 1. Destructure the initial values from the JSON body
    const body = await request.json();
    const { 
      nom, 
      type, 
      description, 
      parameters, 
      initialTRS, 
      initialDisp, 
      initialPerf, 
      initialQual 
    } = body;

    // 2. Now these variables are defined and can be used in the logic
    const newResource = await prisma.ressource.create({
      data: {
        nom,
        type,
        description,
        statut: true,
        adminId: decoded.id,
        parameters: {
          create: parameters.map(p => ({
            label: p.label,
            category: p.category
          }))
        },
        // This line will now work because the variables are defined above
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
        trs: {
          include: {
            disponibilite: true,
            performance: true,
            qualite: true
          }
        }
      }
    });

    return NextResponse.json(newResource, { status: 201 });
  } catch (error) {
    console.error('[RESOURCES_POST_ERROR]', error);
    return NextResponse.json({ message: 'Erreur de création' }, { status: 500 });
  }
}


export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, dailyEntries, nom, type, description, statut, parameters } = body;
    const resourceId = parseInt(id);

    // ─── CRITICAL FIX: SHARED TIMESTAMP ─────────────────────────────────────
    // This variable ensures all metrics from this "Collecte" are linked together.
    const calculationDate = new Date(); 

    if (dailyEntries && dailyEntries.length > 0) {
      // 1. Log the raw Daily Values using the shared timestamp
      await prisma.dailyValue.createMany({
        data: dailyEntries.map(entry => ({
          parameterId: parseInt(entry.parameterId),
          value: parseFloat(entry.value),
          date: calculationDate
        }))
      });

      // 2. Dynamic Calculation
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
        
        // Ensure we have both values (e.g., Total and Stopped) to calculate the %
        if (relevantEntries.length >= 2) {
          const v1 = parseFloat(relevantEntries[0].value);
          const v2 = parseFloat(relevantEntries[1].value);

          if (v1 !== 0) {
            const resultPourcentage = ((v1 - v2) / v1) * 100;

            // 3. Create CalculatedMetric with the shared calculationDate
            await prisma.calculatedMetric.create({
              data: {
                ressourceId: resourceId,
                category: cat,
                valeur: parseFloat(resultPourcentage.toFixed(2)),
                date: calculationDate // Linked to the same session
              }
            });
          }
        }
      }
    }

    // 4. Update the field names (labels) if modified in the interface
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

    // 5. Update basic resource information
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
    console.error('[RESOURCES_PUT_ERROR]', error);
    return NextResponse.json({ message: 'Erreur de mise à jour' }, { status: 500 });
  }
}

// ─── DELETE: Remove Resource and Cascade Data ───────────────────────────────
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ message: 'ID manquant' }, { status: 400 });

    // onDelete: Cascade in the schema will handle cleaning up Parameters, DailyValues, and TRS
    await prisma.ressource.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Ressource supprimée' });
  } catch (error) {
    console.error('[RESOURCES_DELETE_ERROR]', error);
    return NextResponse.json({ message: 'Erreur de suppression' }, { status: 500 });
  }
}