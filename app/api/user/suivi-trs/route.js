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
    const userId = decoded.id;

    // 1. Trouver le profil de l'utilisateur pour identifier son Admin parent (adminId)
    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
      select: { adminId: true } // Assurez-vous que ce champ existe pour lier l'user à son admin
    });

    if (!userProfile || !userProfile.adminId) {
      return NextResponse.json({ message: 'Structure parente introuvable' }, { status: 403 });
    }

    const parentAdminId = userProfile.adminId;

    // 2. Charger les ressources rattachées à cet Admin parent
    const ressources = await prisma.ressource.findMany({
      where: { adminId: parentAdminId },
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

    const actionsEnRetard = await prisma.action.count({ 
      where: { 
        statut: 'EN_RETARD',
        // Optionnel : filtrer les actions assignées à cet admin ou cet utilisateur
      } 
    });

    // 3. Traitement identique à l'algorithme d'administration
    const machinesData = ressources.map(ressource => {
      const sortedMetrics = ressource.metrics || [];
      const initialTrsRecord = ressource.trs?.find(t => t.type === 'INITIAL');
      
      const fallbackTRS = initialTrsRecord?.valeur ?? 0;
      const fallbackDisp = initialTrsRecord?.disponibilite?.valeur ?? 0;
      const fallbackPerf = initialTrsRecord?.performance?.valeur ?? 0;
      const fallbackQual = initialTrsRecord?.qualite?.valeur ?? 0;

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

      const finalSet = getSetAtOffset(0);
      const previousSet = getSetAtOffset(1);

      const trsFinal = finalSet ? finalSet.trs : fallbackTRS;
      let trsInitial = finalSet && previousSet ? previousSet.trs : fallbackTRS;

      return {
        id: ressource.id,
        nom: ressource.nom,
        type: ressource.type,
        statut: ressource.statut,
        trsInitial: parseFloat(trsInitial.toFixed(1)),
        trsFinal: parseFloat(trsFinal.toFixed(1)),
        disponibilite: finalSet?.d ?? fallbackDisp,
        performance: finalSet?.p ?? fallbackPerf,
        qualite: finalSet?.q ?? fallbackQual,
        objectif: ressource.objectifs[0]?.valeurCible ?? null,
      };
    });

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
        actionsEnRetard,
      },
      machines: machinesData,
    });

  } catch (error) {
    console.error('[USER_DASHBOARD_ERROR]', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}