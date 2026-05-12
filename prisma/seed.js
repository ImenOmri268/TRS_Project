const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean up (same as before, optional)
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
  await prisma.ressource.deleteMany();
  await prisma.email.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.demande.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.permission.deleteMany();

  // 2. Create Permissions
  const permissionNames = [
    'Dashboard',
    'les objectifs',
    'gestion des utilisateurs',
    'gestion des ressources',
    'suivi de trs',
    'traitements',
    'Plan d actions',
    'Controle',
  ];
  const permissions = [];
  for (const name of permissionNames) {
    let perm = await prisma.permission.findFirst({ where: { name } });
    if (!perm) {
      perm = await prisma.permission.create({ data: { name } });
    }
    permissions.push(perm);
  }
  console.log(`✅ Created/Found ${permissions.length} permissions`);

  // 3. Create Roles
  const rolesData = [
    { name: 'Administrateur' },
    { name: 'Technicien' },
    { name: 'Observateur' },
  ];
  const roles = [];
  for (const roleData of rolesData) {
    let role = await prisma.role.findFirst({ where: { name: roleData.name } });
    if (!role) {
      role = await prisma.role.create({ data: { name: roleData.name } });
    }
    roles.push(role);
  }
  console.log(`✅ Created/Found ${roles.length} roles`);

  // 4. Assign Role → Permissions (RolePermission)
  const adminRole = roles.find(r => r.name === 'Administrateur');
  const technicianRole = roles.find(r => r.name === 'Technicien');
  const observerRole = roles.find(r => r.name === 'Observateur');

  // Admin: all permissions
  for (const perm of permissions) {
    const existing = await prisma.rolePermission.findUnique({
      where: { roleId_permissionId: { roleId: adminRole.id, permissionId: perm.id } },
    });
    if (!existing) {
      await prisma.rolePermission.create({
        data: { roleId: adminRole.id, permissionId: perm.id },
      });
    }
  }

  // Technician: only some permissions
  const techPerms = permissions.filter(p =>
    ['Dashboard', 'suivi de trs', 'traitements'].includes(p.name)
  );
  for (const perm of techPerms) {
    const existing = await prisma.rolePermission.findUnique({
      where: { roleId_permissionId: { roleId: technicianRole.id, permissionId: perm.id } },
    });
    if (!existing) {
      await prisma.rolePermission.create({
        data: { roleId: technicianRole.id, permissionId: perm.id },
      });
    }
  }

  // Observer: only Dashboard
  const observerPerm = permissions.find(p => p.name === 'Dashboard');
  const existingObs = await prisma.rolePermission.findUnique({
    where: { roleId_permissionId: { roleId: observerRole.id, permissionId: observerPerm.id } },
  });
  if (!existingObs) {
    await prisma.rolePermission.create({
      data: { roleId: observerRole.id, permissionId: observerPerm.id },
    });
  }
  console.log('✅ Assigned role permissions');

  // 5. Create Users
  const passwordHash = await bcrypt.hash('password123', 10);

  const superAdmin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'super@admin.com',
      password: passwordHash,
      status: true,
      type: 'SUPER_ADMIN',
      mustChangePassword: false,
      adminId: null,
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: passwordHash,
      status: true,
      type: 'ADMIN',
      mustChangePassword: true,
      adminId: superAdmin.id,
    },
  });

  const techUser = await prisma.user.create({
    data: {
      name: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      password: passwordHash,
      status: true,
      type: 'USER',
      mustChangePassword: true,
      adminId: admin.id,
    },
  });

  const observerUser = await prisma.user.create({
    data: {
      name: 'Marie Curie',
      email: 'marie.curie@example.com',
      password: passwordHash,
      status: true,
      type: 'USER',
      mustChangePassword: true,
      adminId: admin.id,
    },
  });
  console.log(`✅ Created ${await prisma.user.count()} users`);

  // 6. Assign Roles to Users (UserRole)
  await prisma.userRole.create({
    data: { userId: admin.id, roleId: adminRole.id },
  });
  await prisma.userRole.create({
    data: { userId: techUser.id, roleId: technicianRole.id },
  });
  await prisma.userRole.create({
    data: { userId: observerUser.id, roleId: observerRole.id },
  });
  console.log('✅ Assigned user roles');

  // 7. Direct User Permissions (extra for technician)
  const gestionRessourcePerm = permissions.find(p => p.name === 'gestion des ressources');
  const existingUserPerm = await prisma.userPermission.findUnique({
    where: { userId_permissionId: { userId: techUser.id, permissionId: gestionRessourcePerm.id } },
  });
  if (!existingUserPerm) {
    await prisma.userPermission.create({
      data: { userId: techUser.id, permissionId: gestionRessourcePerm.id },
    });
  }
  console.log('✅ Assigned direct user permissions');

  // 8. Create a sample Ressource
  const ressource = await prisma.ressource.create({
    data: {
      nom: 'Machine Principale',
      type: 'Production',
      description: 'Machine de production principale',
      adminId: admin.id,
    },
  });
  console.log(`✅ Created ressource: ${ressource.nom}`);

  // 9. Create a TRS object for that ressource
  const trs = await prisma.tRS.create({
    data: {
      type: 'INITIAL',
      valeur: 85.5,
      ressourceId: ressource.id,
    },
  });
  await prisma.disponibilite.create({ data: { valeur: 90.0, trsId: trs.id } });
  await prisma.performance.create({ data: { valeur: 95.0, trsId: trs.id } });
  await prisma.qualite.create({ data: { valeur: 99.0, trsId: trs.id } });

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