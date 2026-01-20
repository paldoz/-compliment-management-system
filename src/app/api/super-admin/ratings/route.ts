import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)

    if (session?.user?.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const adminId = searchParams.get("adminId")

    if (!adminId) {
        return NextResponse.json({ error: "Admin ID required" }, { status: 400 })
    }

    try {
        // Fetch complaints resolved by this admin that have ratings
        const ratedComplaints = await prisma.complaint.findMany({
            where: {
                resolvedByUserId: adminId,
                rating: { not: null },
                status: { in: ["RESOLVED", "CLOSED", "APPROVED"] }
            },
            select: {
                id: true,
                title: true,
                rating: true,
                feedback: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        username: true,
                        gender: true
                    }
                }
            },
            orderBy: { updatedAt: "desc" }
        })

        // Get admin details
        const admin = await prisma.user.findUnique({
            where: { id: adminId },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                username: true,
                gender: true,
                organization: {
                    select: { name: true }
                }
            }
        })

        // Calculate average
        const ratings = ratedComplaints.map(c => c.rating).filter(r => r !== null) as number[]
        const averageRating = ratings.length > 0
            ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
            : "0"

        return NextResponse.json({
            admin,
            ratings: ratedComplaints.map(c => ({
                id: c.id,
                complaintTitle: c.title,
                rating: c.rating,
                feedback: c.feedback,
                ratedAt: c.updatedAt,
                user: c.user
            })),
            summary: {
                totalRatings: ratings.length,
                averageRating: parseFloat(averageRating),
                distribution: {
                    5: ratings.filter(r => r === 5).length,
                    4: ratings.filter(r => r === 4).length,
                    3: ratings.filter(r => r === 3).length,
                    2: ratings.filter(r => r === 2).length,
                    1: ratings.filter(r => r === 1).length
                }
            }
        })
    } catch (error) {
        console.error("Rating details error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
