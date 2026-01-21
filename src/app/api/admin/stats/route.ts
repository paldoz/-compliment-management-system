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

    // Headers to prevent caching
    const headers = {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
    }

    // Verify Role from DB (Fresh Data)
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true, organizationId: true, departmentId: true }
    })

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Support both ORG_ADMIN and DEPT_ADMIN
    const isOrgAdmin = user.role === "ORG_ADMIN"
    const isDeptAdmin = user.role === "DEPT_ADMIN"

    if (!isOrgAdmin && !isDeptAdmin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        // Get organization info if user is assigned to one
        let organization = null
        if (user.organizationId) {
            organization = await prisma.organization.findUnique({
                where: { id: user.organizationId },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    _count: { select: { departments: true, complaints: true, users: true } }
                }
            })
        }

        // Build filter based on role
        const whereFilter: any = {}
        if (isDeptAdmin && user.departmentId) {
            whereFilter.departmentId = user.departmentId
        } else if (isOrgAdmin && user.organizationId) {
            whereFilter.organizationId = user.organizationId
        }

        const [total, pending, inProgress, resolved, recent] = await Promise.all([
            prisma.complaint.count({ where: whereFilter }),
            prisma.complaint.count({ where: { ...whereFilter, status: "PENDING" } }),
            prisma.complaint.count({ where: { ...whereFilter, status: "IN_PROGRESS" } }),
            prisma.complaint.count({ where: { ...whereFilter, status: "RESOLVED" } }),
            prisma.complaint.findMany({
                where: whereFilter,
                take: 5,
                orderBy: { createdAt: "desc" },
                include: {
                    user: { select: { name: true, email: true } },
                    department: { select: { name: true } }
                }
            })
        ])

        const responseData = {
            total,
            pending,
            inProgress,
            resolved,
            recent,
            organization
        }

        console.log("API DEBUG: Returning Stats:", JSON.stringify({ ...responseData, recent: responseData.recent.length + " items" }))

        return NextResponse.json(responseData, { headers })
    } catch (error) {
        console.error("Stats fetch error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
