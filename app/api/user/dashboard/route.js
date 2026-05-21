import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { verifyToken } from '../../../lib/jwt'

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json(
        { message: 'Non authentifié' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    
    //si admin on prend son id si un user on prend id de son admin
    let adminId
    if (decoded.type === 'ADMIN') {
      adminId = decoded.id
    } else {
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { adminId: true }
      })
      adminId = user?.adminId
    }
    if (!adminId) {
      return NextResponse.json(
        { message: 'Admin introuvable' },
        { status: 404 }
      )
    }

    const ressources = await prisma.ressource.findMany({
      where: { adminId },
      include: {
        trs: {
          include: {
            disponibilite: true,
            performance: true,
            qualite: true,
          }
        },
        objectifs: true,
      }
    })

    // calc nb user
    const nbUsers = await prisma.user.count({
      where: { type: 'USER' }
    })

    const actionsEnRetard = await prisma.action.count({
      where: { statut: 'EN_RETARD' }
    })

    const machinesData = ressources.map(ressource => {
      const trsInitial = ressource.trs.find(t => t.type === 'INITIAL')
      const trsFinal   = ressource.trs.find(t => t.type === 'FINAL')
      return {
        id: ressource.id,
        nom: ressource.nom,
        type: ressource.type,
        stat: ressource.stat,
        trsInitial: trsInitial?.valeur ?? null,
        trsFinal: trsFinal?.valeur ?? null,
        disponibilite: trsInitial?.disponibilite?.valeur ?? null,
        performance: trsInitial?.performance?.valeur ?? null,
        qualite: trsInitial?.qualite?.valeur ?? null,
        objectif: ressource.objectifs[0]?.valeurCible ?? null,
      }
    })

    //TRS moyen
    const trsValeurs = machinesData
    .map(m => m.trsInitial)
    .filter(v => v !== null)

    const trsMoyen = trsValeurs.length > 0
      ? (trsValeurs.reduce((a, b) => a + b, 0) / trsValeurs.length).toFixed(1)
      : 0

    const nbActiveMachines = ressources.filter(r => r.statut === true).length

    return NextResponse.json({
      stats: {
        trsMoyen,
        nbMachines: ressources.length,
        nbActiveMachines,
        nbUsers,
        actionsEnRetard,
      },
      machines: machinesData,
    })

  } catch (error) {
    console.error('[USER DASHBOARD ERROR]', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 })
  }
}