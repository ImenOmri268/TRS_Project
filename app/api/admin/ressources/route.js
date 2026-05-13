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
    const { nom, type, description, parameters } = await request.json();

    // parameters should be an array like: 
    // [{ label: "Temps prévu", category: "DISPONIBILITE" }, ...]

   const newResource = await prisma.ressource.create({
  data: {
    nom: nom,
    type: type,
    description: description,
    adminId: decoded.id, // Use the ID from your decoded token
    // REMOVED 'status' because it doesn't exist in your schema
    parameters: {
      create: parameters.map(p => ({
        label: p.label,
        category: p.category
      }))
    }
  },
  include: {
    parameters: true
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
    
    const { id, nom, type, description, status, dailyEntries } = body;

    // If dailyEntries is provided, it's a "Daily Logging" action
    // dailyEntries: [{ parameterId: 10, value: 480 }, { parameterId: 11, value: 20 }]
    if (dailyEntries && dailyEntries.length > 0) {
      await prisma.dailyValue.createMany({
        data: dailyEntries.map(entry => ({
          parameterId: entry.parameterId,
          value: parseFloat(entry.value),
          date: new Date() // Automatically logs for today
        }))
      });
    }

    // Standard info update
    const updated = await prisma.ressource.update({
      where: { id: parseInt(id) },
      data: {
        nom,
        type,
        description,
        status
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