import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)

    // Ensure Super Admin
    if (session?.user?.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        // 1. Fetch all Org Admins
        const admins = await prisma.user.findMany({
            where: { role: "ORG_ADMIN" },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                username: true,
                gender: true,
                organizationId: true,
                organization: {
                    select: {
                        id: true,
                        name: true,
                        complaints: {
                            select: { status: true, createdAt: true }
                        }
                    }
                },
                resolvedComplaints: {
                    select: {
                        id: true,
                        createdAt: true,
                        updatedAt: true,
                        rating: true,
                        status: true
                    },
                    where: {
                        status: { in: ["RESOLVED", "CLOSED", "APPROVED"] }
                    }
                }
            }
        })

        // 2. Calculate Metrics
        const adminMetrics = await Promise.all(admins.map(async (admin) => {
            // Performance stats (from what they resolved personally)
            const resolvedCount = admin.resolvedComplaints.length

            // Ratings
            const ratedComplaints = admin.resolvedComplaints.filter(c => c.rating && c.rating > 0)
            const totalRatingObj = ratedComplaints.reduce((acc, curr) => acc + (curr.rating || 0), 0)
            const averageRating = ratedComplaints.length > 0 ? (totalRatingObj / ratedComplaints.length).toFixed(1) : "N/A"

            // Resolution Time
            const totalTimeMs = admin.resolvedComplaints.reduce((acc, curr) => {
                const start = new Date(curr.createdAt).getTime()
                const end = new Date(curr.updatedAt).getTime()
                return acc + (end - start)
            }, 0)
            const averageResolutionTimeHours = resolvedCount > 0
                ? (totalTimeMs / (resolvedCount * 1000 * 60 * 60)).toFixed(1)
                : "N/A"

            // Organization Stats (Alert triggers)
            // If the admin belongs to an org, we check that org's backlog
            let unresolvedCount = 0
            let ignoredCount = 0

            if (admin.organization?.complaints) {
                const orgComplaints = admin.organization.complaints

                // Unresolved: Pending or In Progress
                unresolvedCount = orgComplaints.filter(c =>
                    c.status === "PENDING" || c.status === "IN_PROGRESS"
                ).length

                // Ignored: Pending for > 7 days
                const sevenDaysAgo = new Date()
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

                ignoredCount = orgComplaints.filter(c =>
                    c.status === "PENDING" && new Date(c.createdAt) < sevenDaysAgo
                ).length
            }

            return {
                id: admin.id,
                name: admin.name,
                image: admin.image || "",
                username: admin.username,
                gender: admin.gender,
                organization: admin.organization?.name || "Unknown",
                resolved: resolvedCount,
                ratedCount: ratedComplaints.length,
                averageRating: averageRating === "N/A" ? 0 : parseFloat(averageRating),
                averageResolutionTime: averageResolutionTimeHours === "N/A" ? 0 : parseFloat(averageResolutionTimeHours),
                unresolvedCount,
                ignoredCount
            }
        }))

        // 3. Ranking Logic
        // Score = (Rating * 10) + Resolved - (Time * 0.1) ? 
        // Simple ranking: Sort by Rating (desc), then Resolved (desc), then Time (asc)
        const rankedAdmins = adminMetrics.sort((a, b) => {
            if (b.averageRating !== a.averageRating) return b.averageRating - a.averageRating
            if (b.resolved !== a.resolved) return b.resolved - a.resolved
            return a.averageResolutionTime - b.averageResolutionTime
        })

        return NextResponse.json(rankedAdmins)
    } catch (error) {
        console.error("Metrics error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
