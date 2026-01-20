import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    // 1. Create Default Organization
    const organization = await prisma.organization.upsert({
        where: { slug: 'default-org' },
        update: {},
        create: {
            name: 'Default Organization',
            slug: 'default-org',
            description: 'Main system organization'
        }
    })

    // 2. Create Departments
    const departments = [
        { name: 'Water', slug: 'water', description: 'Water supply and quality issues', organizationId: organization.id },
        { name: 'Electricity', slug: 'electricity', description: 'Power outages and electrical issues', organizationId: organization.id },
        { name: 'Salary', slug: 'salary', description: 'Payroll and salary discrepancies', organizationId: organization.id },
        { name: 'Maintenance', slug: 'maintenance', description: 'General facility maintenance', organizationId: organization.id },
        { name: 'Miscellaneous', slug: 'miscellaneous', description: 'Other issues and feedback', organizationId: organization.id },
    ]

    const createdDepts = []
    for (const dept of departments) {
        const d = await prisma.department.upsert({
            where: {
                organizationId_slug: {
                    organizationId: organization.id,
                    slug: dept.slug
                }
            },
            update: {},
            create: dept,
        })
        createdDepts.push(d)
    }

    const password = await bcrypt.hash('admin123', 10)

    // 3. Create Super Admin
    await prisma.user.upsert({
        where: { email: 'admin@cms.com' },
        update: { organizationId: organization.id },
        create: {
            email: 'admin@cms.com',
            username: 'superadmin',
            name: 'Super Admin',
            password: password,
            role: 'SUPER_ADMIN',
            organizationId: organization.id
        },
    })

    // 4. Create Org Admins (previously Dept Admins)
    for (const dept of createdDepts) {
        const email = `${dept.slug}@cms.com`
        await prisma.user.upsert({
            where: { email },
            update: {
                departmentId: dept.id,
                organizationId: organization.id,
                role: 'ORG_ADMIN'
            },
            create: {
                email,
                username: `${dept.slug}admin`,
                name: `${dept.name} Admin`,
                password: password,
                role: 'ORG_ADMIN',
                departmentId: dept.id,
                organizationId: organization.id
            },
        })
    }

    console.log('Database seeded successfully with Organization and Org Admins')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
