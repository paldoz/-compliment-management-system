import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "USER") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                organizationId: true,
                organization: {
                    select: {
                        name: true,
                        description: true,
                        users: {
                            where: { role: "ORG_ADMIN" },
                            select: {
                                name: true,
                                email: true,
                                image: true,
                                gender: true,
                                username: true
                            }
                        }
                    }
                }
            }
        })

        const [total, pending, inProgress, resolved, recent] = await Promise.all([
            prisma.complaint.count({ where: { userId: session.user.id } }),
            prisma.complaint.count({ where: { userId: session.user.id, status: "PENDING" } }),
            prisma.complaint.count({ where: { userId: session.user.id, status: "IN_PROGRESS" } }),
            prisma.complaint.count({ where: { userId: session.user.id, status: "RESOLVED" } }),
            prisma.complaint.findMany({
                where: { userId: session.user.id },
                orderBy: { createdAt: "desc" },
                take: 5,
                include: {
                    department: { select: { name: true } }
                }
            })
        ])

        return NextResponse.json({
            total,
            pending,
            inProgress,
            resolved,
            recent,
            organization: user?.organization ? {
                name: user.organization.name,
                description: user.organization.description,
                admins: user.organization.users
            } : null
        })
    } catch (error) {
        console.error("User stats error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
