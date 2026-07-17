const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.user.findUnique({ where: { email: 'marie@test.com' } })
  
  await prisma.user.updateMany({
    where: { type: 'USER' },
    data: { adminId: admin.id }
  })
  
  console.log('✅ Tous les users liés à Marie id:', admin.id)
  await prisma.$disconnect()
}

main().catch(console.error)