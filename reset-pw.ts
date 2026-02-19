import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    const password = await bcrypt.hash("123", 10)

    const user = await prisma.user.update({
        where: { username: "kr" },
        data: { password }
    })

    console.log(`Password reset for user: ${user.username}`)
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())
