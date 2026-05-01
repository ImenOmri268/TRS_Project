const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {

  // Users
  const hashAdmin = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      name: 'Marie Curie',
      email: 'marie@test.com',
      password: hashAdmin,
      status: true,
      type: 'ADMIN',
      mustChangePassword: false
    }
  })

  const hashUser = await bcrypt.hash('user123', 10)
  const technicien = await prisma.user.create({
    data: {
      name: 'Paul Martin',
      email: 'paul@test.com',
      password: hashUser,
      status: true,
      type: 'USER',
      mustChangePassword: false
    }
  })

  // Permissions = accès aux pages
  const permDashboard    = await prisma.permission.create({ data: { name: 'voir_dashboard' } })
  const permObjectifs    = await prisma.permission.create({ data: { name: 'voir_objectifs' } })
  const permUtilisateurs = await prisma.permission.create({ data: { name: 'voir_utilisateurs' } })
  const permRessources   = await prisma.permission.create({ data: { name: 'voir_ressources' } })
  const permSuiviTRS     = await prisma.permission.create({ data: { name: 'voir_suivi_trs' } })
  const permTraitements  = await prisma.permission.create({ data: { name: 'voir_traitements' } })
  const permPlanAction   = await prisma.permission.create({ data: { name: 'voir_plan_action' } })
  const permControle     = await prisma.permission.create({ data: { name: 'voir_controle' } })

  // Rôle Technicien — accès limité
  const roleTechnicien = await prisma.role.create({ data: { name: 'Technicien' } })
  await prisma.rolePermission.createMany({
    data: [
      { roleId: roleTechnicien.id, permissionId: permDashboard.id },
      { roleId: roleTechnicien.id, permissionId: permSuiviTRS.id },
      { roleId: roleTechnicien.id, permissionId: permObjectifs.id },
    ]
  })

  // Rôle Opérateur — accès très limité
  const roleOperateur = await prisma.role.create({ data: { name: 'Opérateur' } })
  await prisma.rolePermission.createMany({
    data: [
      { roleId: roleOperateur.id, permissionId: permDashboard.id },
      { roleId: roleOperateur.id, permissionId: permSuiviTRS.id },
    ]
  })

  // Assigner rôle Technicien à Paul
  await prisma.userRole.create({
    data: { userId: technicien.id, roleId: roleTechnicien.id }
  })

  // Ressources
  const machine1 = await prisma.ressource.create({
    data: {
      nom: 'Machine A1',
      type: 'Presse hydraulique',
      description: 'Presse hydraulique 500T',
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

  // TRS
  const trs1 = await prisma.tRS.create({
    data: { type: 'INITIAL', valeur: 68.5, ressourceId: machine1.id }
  })
  const trs2 = await prisma.tRS.create({
    data: { type: 'INITIAL', valeur: 72.3, ressourceId: machine2.id }
  })

  await prisma.disponibilite.create({ data: { valeur: 75.0, trsId: trs1.id } })
  await prisma.performance.create({   data: { valeur: 80.5, trsId: trs1.id } })
  await prisma.qualite.create({       data: { valeur: 92.0, trsId: trs1.id } })

  await prisma.disponibilite.create({ data: { valeur: 78.0, trsId: trs2.id } })
  await prisma.performance.create({   data: { valeur: 85.0, trsId: trs2.id } })
  await prisma.qualite.create({       data: { valeur: 90.0, trsId: trs2.id } })

  // Objectifs
  await prisma.objectif.create({
    data: { valeurCible: 85.0, ressourceId: machine1.id }
  })
  await prisma.objectif.create({
    data: { valeurCible: 90.0, ressourceId: machine2.id }
  })

  console.log('✅ Seed terminé !')
  console.log('ADMIN      → marie@test.com / admin123')
  console.log('TECHNICIEN → paul@test.com  / user123')
}

main()
  .catch(e => { console.error('❌', e); process.exit(1) })
  .finally(async () => await prisma.$disconnect())