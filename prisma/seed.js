const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('123456', 10);

    const user = await prisma.user.create({
        data: {
            name: 'Jean Dupont',
            email: 'jean.dupont@entreprise.com',
            password: hashedPassword,
            status: true,
            type: 'ADMIN',
            mustChangePassword: false
        }
    });

    console.log('Utilisateur créé avec succès:', user.email);
}


main()
    .catch((e) => {
        console.error('Erreur seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });