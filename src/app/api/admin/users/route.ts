import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Allow SUPER_ADMIN to see all users, DEPT_ADMIN to see department users
    const isSuperAdmin = session.user.role === "SUPER_ADMIN"
    const isDeptAdmin = session.user.role === "DEPT_ADMIN"

    if (!isSuperAdmin && (!isDeptAdmin || !session.user.departmentId)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    try {
        let users;
        if (isSuperAdmin) {
            users = await prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
        } else {
            const deptId = session.user.departmentId
            users = await prisma.user.findMany({
                where: {
                    complaints: {
                        some: {
                            departmentId: deptId
                        }
                    }
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true
                }
            })
        }

        return NextResponse.json(users)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized: Super Admin access required" }, { status: 403 })
    }

    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 })
        }

        // Prevent deleting yourself
        if (id === session.user.id) {
            return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 })
        }

        await prisma.user.delete({
            where: { id }
        })

        return NextResponse.json({ message: "User deleted successfully" })
    } catch (error) {
        console.error("Delete user error:", error)
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
    }
}
