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

    if (session.user.role !== "DEPT_ADMIN" || !session.user.departmentId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const deptId = session.user.departmentId

    try {
        const logs = await prisma.auditLog.findMany({
            where: {
                complaint: {
                    departmentId: deptId
                }
            },
            include: {
                user: { select: { name: true, role: true } },
                complaint: { select: { title: true } }
            },
            orderBy: { createdAt: "desc" }
        })

        return NextResponse.json(logs)
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
