import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const organizations = await prisma.organization.findMany({
            include: {
                departments: {
                    include: {
                        _count: {
                            select: { complaints: true }
                        }
                    }
                },
                _count: {
                    select: {
                        departments: true,
                        users: true,
                        complaints: true
                    }
                }
            },
            orderBy: { name: "asc" }
        })
        return NextResponse.json(organizations)
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { name, slug, description, isActive, isVerified, departments } = await req.json()

        // Use a transaction to create organization and its departments
        const organization = await prisma.$transaction(async (tx) => {
            const org = await tx.organization.create({
                data: {
                    name,
                    slug,
                    description,
                    isActive: isActive !== undefined ? isActive : true,
                    isVerified: isVerified !== undefined ? isVerified : false,
                }
            })

            let departmentsToCreate;

            if (departments && Array.isArray(departments) && departments.length > 0) {
                departmentsToCreate = departments.map((dept: any) => ({
                    name: dept.name,
                    slug: dept.slug || dept.name.toLowerCase().replace(/\s+/g, '-')
                }));
            } else {
                departmentsToCreate = [
                    { name: "Finance", slug: "finance" },
                    { name: "Water", slug: "water" },
                    { name: "Electricity", slug: "electricity" },
                    { name: "Maintenance", slug: "maintenance" }
                ]
            }

            await tx.department.createMany({
                data: departmentsToCreate.map(dept => ({
                    ...dept,
                    organizationId: org.id
                }))
            })

            return org
        })

        // Log action
        await prisma.auditLog.create({
            data: {
                action: "Organization Created",
                entity: "Organization",
                entityId: organization.id,
                userId: session.user.id,
                details: `Created organization: ${name} with ${departments && departments.length > 0 ? departments.length + ' custom' : '4 default'} departments`
            }
        })

        return NextResponse.json(organization)
    } catch (error: any) {
        console.error("Error creating organization:", error)
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Organization name or slug already exists" }, { status: 400 })
        }
        return NextResponse.json({ error: "Error creating organization" }, { status: 400 })
    }
}

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { id, name, slug, description, isActive, isVerified } = await req.json()
        const organization = await prisma.organization.update({
            where: { id },
            data: {
                name,
                slug,
                description,
                isActive: isActive !== undefined ? isActive : undefined,
                isVerified: isVerified !== undefined ? isVerified : undefined
            }
        })

        // Log action
        await prisma.auditLog.create({
            data: {
                action: "Organization Updated",
                entity: "Organization",
                entityId: id,
                userId: session.user.id,
                details: `Updated organization: ${name}`
            }
        })

        return NextResponse.json(organization)
    } catch (error) {
        return NextResponse.json({ error: "Error updating organization" }, { status: 400 })
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

        // Use a transaction to safely delete all associated data
        await prisma.$transaction(async (tx) => {
            // 1. Reset organizationId on Users (set to null)
            await tx.user.updateMany({
                where: { organizationId: id },
                data: { organizationId: null, departmentId: null }
            })

            // 2. Delete all Departments (and their complaints if we want, or just reset them)
            // For now, let's reset complaints and delete departments
            await tx.complaint.updateMany({
                where: { organizationId: id },
                data: { organizationId: null, departmentId: null }
            })

            await tx.department.deleteMany({
                where: { organizationId: id }
            })

            // 3. Delete the Organization itself
            await tx.organization.delete({
                where: { id }
            })

            // 4. Log action
            await tx.auditLog.create({
                data: {
                    action: "Organization Deleted",
                    entity: "Organization",
                    entityId: id,
                    userId: session.user.id,
                    details: `Deleted organization ID: ${id} and all sub-entities`
                }
            })
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Delete organization error:", error)
        return NextResponse.json({ error: "Error deleting organization" }, { status: 400 })
    }
}
