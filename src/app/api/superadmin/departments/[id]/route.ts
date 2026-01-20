import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { id } = await params

        const department = await prisma.department.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        complaints: true,
                        users: true
                    }
                },
                complaints: {
                    orderBy: { createdAt: 'desc' },
                    take: 50, // Limit to last 50 for performance
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true,
                                username: true,
                                gender: true
                            }
                        },
                        resolvedBy: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true,
                                username: true,
                                gender: true
                            }
                        }
                    }
                }
            }
        })

        if (!department) {
            return NextResponse.json({ error: "Department not found" }, { status: 404 })
        }

        return NextResponse.json(department)
    } catch (error) {
        console.error("Error fetching department details:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
