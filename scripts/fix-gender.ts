
import { prisma } from '../src/lib/db';

async function main() {
    console.log('Backfilling gender field...');

    const result = await prisma.user.updateMany({
        where: { gender: null },
        data: { gender: 'MALE' }
    });

    console.log(`Updated ${result.count} users with default gender 'MALE'.`);

    const users = await prisma.user.findMany({
        select: { username: true, gender: true }
    });
    console.log('Current users and genders:', users);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
