import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export const dynamic = "force-dynamic"

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || session.user.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const users = await prisma.user.findMany({
            include: {
                department: { select: { name: true } },
                organization: { select: { id: true, name: true } }
            },
            orderBy: { createdAt: "desc" }
        })
        return NextResponse.json(users)
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { id, role, departmentId, organizationId, username, email, password } = await req.json()

        const updateData: any = {}
        if (role) updateData.role = role

        // Handle assignments
        if (departmentId !== undefined) {
            updateData.departmentId = departmentId === "NONE" || departmentId === null ? null : departmentId
        }
        if (organizationId !== undefined) {
            updateData.organizationId = organizationId === "NONE" || organizationId === null ? null : organizationId
        }

        // Handle profile updates
        if (username) updateData.username = username
        if (email) updateData.email = email
        if (password && password.trim() !== "") {
            updateData.password = await bcrypt.hash(password, 12)
        }

        const user = await prisma.user.update({
            where: { id },
            data: updateData
        })

        // Log action
        await prisma.auditLog.create({
            data: {
                action: "User Updated",
                entity: "User",
                entityId: id,
                userId: session.user.id,
                details: `Updated user ${user.email}. Role: ${role || 'unchanged'}. Org: ${organizationId || 'unchanged'}`
            }
        })

        return NextResponse.json(user)
    } catch (error) {
        console.error("Error updating user:", error)
        return NextResponse.json({ error: "Error updating user" }, { status: 400 })
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

        if (!id) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 })
        }

        if (id === session.user.id) {
            return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 })
        }

        const user = await prisma.user.delete({
            where: { id }
        })

        // Log action
        await prisma.auditLog.create({
            data: {
                action: "User Deleted",
                entity: "User",
                entityId: id,
                userId: session.user.id,
                details: `Deleted user ${user.email} (${user.name})`
            }
        })

        return NextResponse.json({ message: "User deleted successfully" })
    } catch (error) {
        console.error("Error deleting user:", error)
        return NextResponse.json({ error: "Error deleting user" }, { status: 500 })
    }
}
