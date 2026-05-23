const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. CLEANUP (Order respects foreign key constraints)
  // We delete "children" before "parents"
  await prisma.userPermission.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.action.deleteMany();
  await prisma.tracking.deleteMany();
  await prisma.promptIA.deleteMany();
  await prisma.planAction.deleteMany();
  await prisma.analyse.deleteMany();
  await prisma.workflow.deleteMany();
  await prisma.objectif.deleteMany();
  await prisma.qualite.deleteMany();
  await prisma.performance.deleteMany();
  await prisma.disponibilite.deleteMany();
  await prisma.tRS.deleteMany();
  await prisma.dailyValue.deleteMany();
  await prisma.resourceParameter.deleteMany();
  await prisma.ressource.deleteMany();
  await prisma.email.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.demande.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.permission.deleteMany();

  console.log('🧹 Database cleaned.');

  // 2. CREATE PERMISSIONS
const permissionNames = [
  'voir_dashboard',
  'voir_utilisateurs', 'ajouter_utilisateur', 'modifier_utilisateur', 'supprimer_utilisateur',
  'voir_ressources', 'ajouter_ressource', 'modifier_ressource', 'supprimer_ressource',
  'voir_objectifs', 'ajouter_objectif', 'modifier_objectif', 'supprimer_objectif',
  'faire_collecte', 'calculer_trs',
  'lancer_amelioration', 'ajouter_categorie', 'ajouter_probleme', 'modifier_probleme', 'supprimer_probleme',
  'voir_pareto', 'cinq_pourquoi', 'ishikawa',
  'voir_rapport', 'exporter_pdf',
  'voir_plan_action', 'ajouter_action', 'modifier_action', 'supprimer_action',
  'accomplir_action', 'suivre_plan_action'
];

  const permissions = [];
  for (const name of permissionNames) {
    const perm = await prisma.permission.create({ data: { name } });
    permissions.push(perm);
  }

  // 3. CREATE ROLES
  const adminRole = await prisma.role.create({ data: { name: 'Administrateur' } });
  const techRole = await prisma.role.create({ data: { name: 'Technicien' } });

  // 4. ASSIGN ALL PERMISSIONS TO ADMIN ROLE
  for (const perm of permissions) {
    await prisma.rolePermission.create({
      data: { roleId: adminRole.id, permissionId: perm.id },
    });
  }
  console.log('✅ Roles and Permissions configured.');

  // 5. CREATE THE SINGLE ADMIN USER
  const passwordHash = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.create({
    data: {
      name: 'Main Administrator',
      email: 'admin@trs.com',
      password: passwordHash,
      status: true,
      type: 'ADMIN', // Matches UserType Enum
      mustChangePassword: false,
    },
  });

  // Link User to Admin Role
  await prisma.userRole.create({
    data: { userId: adminUser.id, roleId: adminRole.id },
  });

  console.log(`✅ Admin user created: ${adminUser.email}`);

  // 6. CREATE SAMPLE DATA (Ressource & TRS)
  const ressource = await prisma.ressource.create({
    data: {
      nom: 'Ligne d\'Assemblage A1',
      type: 'Automatisée',
      description: 'Ligne principale pour le calcul du TRS initial',
      adminId: adminUser.id,
      statut: true,
    },
  });

  const trs = await prisma.tRS.create({
    data: {
      type: 'INITIAL',
      valeur: 78.4,
      ressourceId: ressource.id,
    },
  });

  // Initialize components of TRS
  await prisma.disponibilite.create({ data: { valeur: 85.0, trsId: trs.id } });
  await prisma.performance.create({ data: { valeur: 92.0, trsId: trs.id } });
  await prisma.qualite.create({ data: { valeur: 99.0, trsId: trs.id } });

  console.log('✅ Sample ressource and TRS metrics generated.');
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch(e => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });