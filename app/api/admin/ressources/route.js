import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import {  verifyToken } from '../../../lib/jwt';

// ─── GET: List Resources with Parameters and Daily Values ──────────────────
export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });

    const decoded = verifyToken(token);
    if (decoded.type !== 'ADMIN') return NextResponse.json({ message: 'Accès refusé' }, { status: 403 });

    const resources = await prisma.ressource.findMany({
      where: { adminId: decoded.id },
      orderBy: { nom: 'asc' },
      include: {
        parameters: {
          include: {
            dailyValues: {
              orderBy: { date: 'desc' },
              // We take a list of recent values to show the "history"
              take: 30 
            }
          }
        },
        trs: {
          include: {
            disponibilite: true,
            performance: true,
            qualite: true,
          }
        },
      }
    });

    return NextResponse.json(resources);
  } catch (error) {
    console.error('[RESOURCES_GET_ERROR]', error);
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

// ─── PUT: Update Details or Log Daily Values ────────────────────────────────
export async function PUT(request) {
  try {
    const token = request.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    const body = await request.json();
    
    // Destructure everything we need
    const { id, nom, type, description, statut, dailyEntries, parameters } = body;

    // 1. Update Daily Logging if provided
    if (dailyEntries && dailyEntries.length > 0) {
      await prisma.dailyValue.createMany({
        data: dailyEntries.map(entry => ({
          parameterId: entry.parameterId,
          value: parseFloat(entry.value),
          date: new Date()
        }))
      });
    }

    // 2. Handle Parameter Label Updates (Dynamic Schema)
    // We use 'resourceParameter' because your model is 'ResourceParameter'
    if (parameters && parameters.length > 0) {
      for (const param of parameters) {
        await prisma.resourceParameter.update({
          where: { id: parseInt(param.id) },
          data: { label: param.label }
        });
      }
    }

    // 3. Update main Resource Info
    const updated = await prisma.ressource.update({
      where: { id: parseInt(id) },
      data: {
        nom,
        type,
        description,
        statut: Boolean(statut) // Ensure it treats it as a true/false boolean
      }
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