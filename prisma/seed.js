const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {

  // Utiliser l'admin existant (Marie Curie id=9)
  const admin = await prisma.user.findUnique({
    where: { email: 'marie@test.com' }
  })

  if (!admin) {
    console.log('❌ Admin marie@test.com non trouvé ! Lance le serveur et crée un compte admin d\'abord.')
    return
  }

  console.log('✅ Admin trouvé:', admin.email, 'id:', admin.id)

  // ===== RESSOURCES =====
  const machine1 = await prisma.ressource.create({
    data: {
      nom: 'Machine A1',
      type: 'Presse hydraulique',
      description: 'Presse hydraulique 500T ligne 1',
      adminId: admin.id
    }
  })

  const machine2 = await prisma.ressource.create({
    data: {
      nom: 'Ligne B2',
      type: 'Ligne assemblage',
      description: 'Assemblage final des composants',
      adminId: admin.id
    }
  })

  const machine3 = await prisma.ressource.create({
    data: {
      nom: 'Poste C3',
      type: 'Poste de contrôle',
      description: 'Inspection visuelle et dimensionnelle',
      adminId: admin.id
    }
  })

  // ===== TRS INITIAL =====
  const trs1 = await prisma.tRS.create({
    data: { type: 'INITIAL', valeur: 68.5, ressourceId: machine1.id }
  })
  const trs2 = await prisma.tRS.create({
    data: { type: 'INITIAL', valeur: 72.3, ressourceId: machine2.id }
  })
  const trs3 = await prisma.tRS.create({
    data: { type: 'INITIAL', valeur: 58.0, ressourceId: machine3.id }
  })

  // ===== DISPONIBILITE PERFORMANCE QUALITE =====
  await prisma.disponibilite.create({ data: { valeur: 75.0, trsId: trs1.id } })
  await prisma.performance.create({   data: { valeur: 80.5, trsId: trs1.id } })
  await prisma.qualite.create({       data: { valeur: 92.0, trsId: trs1.id } })

  await prisma.disponibilite.create({ data: { valeur: 78.0, trsId: trs2.id } })
  await prisma.performance.create({   data: { valeur: 85.0, trsId: trs2.id } })
  await prisma.qualite.create({       data: { valeur: 90.0, trsId: trs2.id } })

  await prisma.disponibilite.create({ data: { valeur: 65.0, trsId: trs3.id } })
  await prisma.performance.create({   data: { valeur: 70.0, trsId: trs3.id } })
  await prisma.qualite.create({       data: { valeur: 88.0, trsId: trs3.id } })

  // ===== TRS FINAL =====
  await prisma.tRS.create({
    data: { type: 'FINAL', valeur: 82.0, ressourceId: machine1.id }
  })
  await prisma.tRS.create({
    data: { type: 'FINAL', valeur: 88.5, ressourceId: machine2.id }
  })

  // ===== OBJECTIFS =====
  await prisma.objectif.create({ data: { valeurCible: 85.0, ressourceId: machine1.id } })
  await prisma.objectif.create({ data: { valeurCible: 90.0, ressourceId: machine2.id } })
  await prisma.objectif.create({ data: { valeurCible: 80.0, ressourceId: machine3.id } })

  // ===== WORKFLOWS =====
  const workflow1 = await prisma.workflow.create({
    data: {
      dateDebut: new Date('2025-01-10'),
      dateFin: new Date('2025-03-15'),
      statut: 'TERMINE',
      ressourceId: machine1.id
    }
  })
  const workflow2 = await prisma.workflow.create({
    data: {
      dateDebut: new Date('2025-02-01'),
      dateFin: new Date('2025-04-20'),
      statut: 'TERMINE',
      ressourceId: machine2.id
    }
  })
  const workflow3 = await prisma.workflow.create({
    data: {
      dateDebut: new Date('2025-04-01'),
      statut: 'EN_COURS',
      ressourceId: machine3.id
    }
  })

  // ===== PLAN ACTIONS =====
  const plan1 = await prisma.planAction.create({
    data: {
      description: 'Réduire les temps d\'arrêt machine A1',
      statut: 'TERMINE',
      dateDebut: new Date('2025-01-15'),
      dateFin: new Date('2025-03-15'),
      workflowId: workflow1.id
    }
  })
  const plan2 = await prisma.planAction.create({
    data: {
      description: 'Améliorer la qualité ligne B2',
      statut: 'TERMINE',
      dateDebut: new Date('2025-02-10'),
      dateFin: new Date('2025-04-20'),
      workflowId: workflow2.id
    }
  })
  const plan3 = await prisma.planAction.create({
    data: {
      description: 'Optimiser le poste de contrôle C3',
      statut: 'EN_COURS',
      dateDebut: new Date('2025-04-05'),
      workflowId: workflow3.id
    }
  })

  // ===== ACTIONS =====
  const user = await prisma.user.findUnique({ where: { email: 'paul@test.com' } })

  if (user) {
    await prisma.action.create({
      data: {
        description: 'Remplacer les joints toutes les 200h',
        statut: 'TERMINE',
        planId: plan1.id,
        userId: user.id
      }
    })
    await prisma.action.create({
      data: {
        description: 'Former les opérateurs au nouveau process',
        statut: 'TERMINE',
        planId: plan2.id,
        userId: user.id
      }
    })
    await prisma.action.create({
      data: {
        description: 'Mettre en place les fiches de contrôle',
        statut: 'EN_COURS',
        planId: plan3.id,
        userId: user.id
      }
    })
    await prisma.action.create({
      data: {
        description: 'Audit interne du poste C3',
        statut: 'EN_RETARD',
        planId: plan3.id,
        userId: user.id
      }
    })
  }

  // ===== NOTIFICATIONS =====
  await prisma.notification.create({
    data: {
      message: 'Action "Audit interne" est en retard !',
      type: 'RETARD',
      lu: false,
      userId: admin.id
    }
  })

  console.log('✅ Seed terminé avec succès !')
  console.log('Connecte-toi avec : marie@test.com / admin123')
}

main()
  .catch(e => { console.error('❌ Erreur:', e); process.exit(1) })
  .finally(async () => await prisma.$disconnect())