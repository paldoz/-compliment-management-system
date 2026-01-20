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
        const logs = await prisma.auditLog.findMany({
            include: {
                user: { select: { name: true, role: true } },
                complaint: { select: { title: true } }
            },
            orderBy: { createdAt: "desc" },
            take: 100
        })
        return NextResponse.json(logs)
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
