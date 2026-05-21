import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { verifyToken } from '../../../lib/jwt';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const adminId = decoded.id;

    // 1. Fetch resources matching the exact inclusion structure from resource management
    const ressources = await prisma.ressource.findMany({
      where: { adminId },
      include: {
        metrics: {
          orderBy: { date: 'desc' }
        },
        trs: { 
          include: { 
            disponibilite: true, 
            performance: true, 
            qualite: true 
          } 
        },
        objectifs: true,
      }
    });

    const nbUsers = await prisma.user.count({ where: { type: 'USER' } });
    const actionsEnRetard = await prisma.action.count({ where: { statut: 'EN_RETARD' } });

    // 2. Process circular logic with structural fallbacks
    const machinesData = ressources.map(ressource => {
      const sortedMetrics = ressource.metrics || [];
      
      // Dynamic baseline extraction from your nested 'trs' array structure
      const initialTrsRecord = ressource.trs?.find(t => t.type === 'INITIAL');
      
      const fallbackTRS = initialTrsRecord?.valeur ?? 0;
      const fallbackDisp = initialTrsRecord?.disponibilite?.valeur ?? 0;
      const fallbackPerf = initialTrsRecord?.performance?.valeur ?? 0;
      const fallbackQual = initialTrsRecord?.qualite?.valeur ?? 0;

      // Group by timestamp to identify unique calculation events
      const uniqueTimestamps = [...new Set(sortedMetrics.map(m => new Date(m.date).getTime()))];

      const getSetAtOffset = (index) => {
        const timestamp = uniqueTimestamps[index];
        if (!timestamp) return null;

        const dayMetrics = sortedMetrics.filter(m => new Date(m.date).getTime() === timestamp);
        let d = 0, p = 0, q = 0, count = 0;

        dayMetrics.forEach(m => {
          if (m.category === 'DISPONIBILITE') d = m.valeur;
          if (m.category === 'PERFORMANCE') p = m.valeur;
          if (m.category === 'QUALITE') q = m.valeur;
          count++;
        });

        const trs = count > 0 ? (d / 100 * p / 100 * q / 100) * 100 : 0;
        return { trs, d, p, q };
      };

      const finalSet = getSetAtOffset(0);   // Most recent calculation
      const previousSet = getSetAtOffset(1); // Second most recent calculation

      // Assign values based on calculation history presence
      const trsFinal = finalSet ? finalSet.trs : fallbackTRS;
      
      let trsInitial = 0;
      if (finalSet && previousSet) {
        trsInitial = previousSet.trs;
      } else {
        trsInitial = fallbackTRS;
      }

      return {
        id: ressource.id,
        nom: ressource.nom,
        type: ressource.type,
        statut: ressource.statut,
        trsInitial: parseFloat(trsInitial.toFixed(1)),
        trsFinal: parseFloat(trsFinal.toFixed(1)),
        // Map current metrics falling back to extracted setup values if history is empty
        disponibilite: finalSet?.d ?? fallbackDisp,
        performance: finalSet?.p ?? fallbackPerf,
        qualite: finalSet?.q ?? fallbackQual,
        objectif: ressource.objectifs[0]?.valeurCible ?? null,
      };
    });

    // 3. Global Stats using current visible metrics
    const trsValeurs = machinesData.map(m => m.trsFinal);
    const trsMoyen = trsValeurs.length > 0
      ? (trsValeurs.reduce((a, b) => a + b, 0) / trsValeurs.length).toFixed(1)
      : 0;

    const nbActiveMachines = ressources.filter(r => r.statut === true).length;

    return NextResponse.json({
      stats: {
        trsMoyen,
        nbMachines: ressources.length,
        nbActiveMachines,
        nbUsers,
        actionsEnRetard,
      },
      machines: machinesData,
    });

  } catch (error) {
    console.error('[DASHBOARD_ERROR]', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}