import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const admins = await prisma.user.findMany({
            where: {
                role: {
                    in: ["ORG_ADMIN", "DEPT_ADMIN"]
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                username: true,
                role: true,
                organizationId: true,
                departmentId: true,
                organization: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                department: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                createdAt: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return NextResponse.json(admins)
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
        const { id, username, email, password, organizationId } = await req.json()

        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 })
        }

        const updateData: any = {}
        if (username) updateData.username = username
        if (email) updateData.email = email

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 12)
            updateData.password = hashedPassword
        }

        if (organizationId !== undefined) {
            updateData.organizationId = organizationId
            // If reassigned to an org, ensure they are ORG_ADMIN if they were not or if logic dictates
            // For flexibility, we just update the ID. If they move orgs, we should probably clear departmentId to avoid inconsistency
            if (organizationId) {
                updateData.departmentId = null
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                organization: { select: { name: true } }
            }
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error("Update admin error:", error)
        return NextResponse.json({ error: "Failed to update admin" }, { status: 500 })
    }
}
