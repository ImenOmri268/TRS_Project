const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const nouvelles_permissions = [
  
  'voir_dashboard',


  'voir_objectifs',
  'ajouter_objectif',
  'modifier_objectif',
  'supprimer_objectif',
  
  'voir_utilisateurs',
  'ajouter_utilisateur',
  'modifier_utilisateur',
  'supprimer_utilisateur',
  
  'voir_ressources',
  'ajouter_ressource',
  'modifier_ressource',
  'supprimer_ressource',
  
  
  'suivre_trs', 
  

  'faire_collecte',

  
  'consulter_traitement',
  'generer_traitements',
  

  'voir_plan_action',

]

async function main() {
  console.log('Suppression des anciennes permissions...')
  await prisma.userPermission.deleteMany()
  await prisma.rolePermission.deleteMany()
  await prisma.permission.deleteMany()

  console.log('Création des nouvelles permissions...')
  for (const name of nouvelles_permissions) {
    await prisma.permission.create({ data: { name } })
  }

  console.log(`${nouvelles_permissions.length} permissions créées !`)
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })