
import { prisma } from '../src/lib/db';

async function main() {
    console.log('Scanning for users with large profile images...');

    const users = await prisma.user.findMany({
        select: { id: true, username: true, image: true }
    });

    let count = 0;
    for (const user of users) {
        if (user.image && user.image.length > 2048) {
            console.log(`Fixing user: ${user.username} (Image size: ${user.image.length} chars)`);

            await prisma.user.update({
                where: { id: user.id },
                data: { image: null }
            });

            count++;
        }
    }

    console.log(`\nDone! Removed large images from ${count} users.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
