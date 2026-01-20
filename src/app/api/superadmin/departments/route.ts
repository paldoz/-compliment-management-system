import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const departments = await prisma.department.findMany({
            include: {
                users: {
                    where: { role: "DEPT_ADMIN" },
                    select: { id: true, name: true, email: true }
                },
                _count: {
                    select: { complaints: true }
                }
            },
            orderBy: { name: "asc" }
        })
        return NextResponse.json(departments)
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
        const { name, slug, description, isActive, organizationId } = await req.json()
        if (!organizationId) {
            return NextResponse.json({ error: "Organization ID is required" }, { status: 400 })
        }
        const department = await prisma.department.create({
            data: {
                name,
                slug,
                description,
                isActive: isActive !== undefined ? isActive : true,
                organizationId
            }
        })

        // Log action
        await prisma.auditLog.create({
            data: {
                action: "Department Created",
                entity: "Department",
                entityId: department.id,
                userId: session.user.id,
                details: `Created department: ${name}`
            }
        })

        return NextResponse.json(department)
    } catch (error) {
        return NextResponse.json({ error: "Error creating department" }, { status: 400 })
    }
}

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { id, name, slug, description, isActive } = await req.json()
        const department = await prisma.department.update({
            where: { id },
            data: {
                name,
                slug,
                description,
                isActive: isActive !== undefined ? isActive : undefined
            }
        })

        // Log action
        await prisma.auditLog.create({
            data: {
                action: "Department Updated",
                entity: "Department",
                entityId: id,
                userId: session.user.id,
                details: `Updated department: ${name}`
            }
        })

        return NextResponse.json(department)
    } catch (error) {
        return NextResponse.json({ error: "Error updating department" }, { status: 400 })
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

        await prisma.department.delete({ where: { id } })

        // Log action
        await prisma.auditLog.create({
            data: {
                action: "Department Deleted",
                entity: "Department",
                entityId: id,
                userId: session.user.id,
                details: `Deleted department ID: ${id}`
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Error deleting department" }, { status: 400 })
    }
}
