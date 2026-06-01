const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ====================================================================
  // 1. CLEANUP (Strict order to avoid Foreign Key violations)
  // ====================================================================
  await prisma.userPermission.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.action.deleteMany();
  await prisma.promptIA.deleteMany();
  await prisma.planAction.deleteMany();
  await prisma.analyse.deleteMany();
  await prisma.workflow.deleteMany();
  await prisma.objectif.deleteMany();
  
  // Clean up legacy sub-component tables
  await prisma.disponibilite.deleteMany();
  await prisma.performance.deleteMany();
  await prisma.qualite.deleteMany();
  await prisma.tRS.deleteMany();
  
  // Clean up new metrics and daily entry tracker systems
  await prisma.calculatedMetric.deleteMany();
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

  // ====================================================================
  // 2. CREATE PERMISSIONS
  // ====================================================================
  const permissionNames = [
    'voir_dashboard',
    'voir_objectifs', 'ajouter_objectif', 'modifier_objectif', 'supprimer_objectif',
    'voir_utilisateurs', 'ajouter_utilisateur', 'modifier_utilisateur', 'supprimer_utilisateur',
    'voir_ressources', 'ajouter_ressource', 'modifier_ressource', 'supprimer_ressource',
    'faire_collecte',
    'consulter_traitements', 'generer_traitements',
    'voir_plan_action',
    'suivre_trs'
  ];

  const permissions = [];
  for (const name of permissionNames) {
    const perm = await prisma.permission.create({ data: { name } });
    permissions.push(perm);
  }

  // ====================================================================
  // 3. CREATE ROLES
  // ====================================================================
  const adminRole = await prisma.role.create({ data: { name: 'Administrateur' } });
  const techRole = await prisma.role.create({ data: { name: 'Technicien' } });

  // ====================================================================
  // 4. ASSIGN PERMISSIONS TO ADMIN ROLE
  // ====================================================================
  for (const perm of permissions) {
    await prisma.rolePermission.create({
      data: { roleId: adminRole.id, permissionId: perm.id },
    });
  }
  console.log('✅ Roles and Permissions configured.');

  // ====================================================================
  // 5. CREATE SYSTEM ADMIN USER
  // ====================================================================
  const passwordHash = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.create({
    data: {
      name: 'Main Administrator',
      email: 'admin@trs.com',
      password: passwordHash,
      status: true,
      type: 'ADMIN', // Exactly matches UserType ENUM values
      mustChangePassword: false,
    },
  });

  // Link User to Admin Role via Joins
  await prisma.userRole.create({
    data: { userId: adminUser.id, roleId: adminRole.id },
  });

  console.log(`✅ Admin user created: ${adminUser.email}`);

  // ====================================================================
  // 6. CREATE SAMPLE DATA (Ressource, Legacy metrics, and Calculated Metric entries)
  // ====================================================================
  const ressource = await prisma.ressource.create({
    data: {
      nom: 'Ligne d\'Assemblage A1',
      type: 'Automatisée',
      description: 'Ligne principale pour le calcul du TRS initial',
      adminId: adminUser.id,
      statut: true,
      initialDisponibilite: 85.0,
      initialPerformance: 92.0,
      initialQualite: 99.0,
      initialTRS: 77.41,
    },
  });

  // Create legacy core TRS node
  const trs = await prisma.tRS.create({
    data: {
      type: 'INITIAL', // Matches your TRSType Enum values
      valeur: 77.41,
      ressourceId: ressource.id,
    },
  });

  // Initialize sub components of legacy TRS structure
  await prisma.disponibilite.create({ data: { valeur: 85.0, trsId: trs.id } });
  await prisma.performance.create({ data: { valeur: 92.0, trsId: trs.id } });
  await prisma.qualite.create({ data: { valeur: 99.0, trsId: trs.id } });

  // FIXED: Seed historical points using uppercase ParameterCategory Enum values
  await prisma.calculatedMetric.createMany({
    data: [
      {
        category: 'DISPONIBILITE',
        valeur: 85.0,
        ressourceId: ressource.id,
        date: new Date(),
      },
      {
        category: 'PERFORMANCE',
        valeur: 92.0,
        ressourceId: ressource.id,
        date: new Date(),
      },
      {
        category: 'QUALITE',
        valeur: 99.0,
        ressourceId: ressource.id,
        date: new Date(),
      }
    ],
  });

  console.log('✅ Sample metrics tracking & data points seeded successfully.');
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