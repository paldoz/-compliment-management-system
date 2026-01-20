import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)

    // Ensure Super Admin only
    if (session?.user?.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { searchParams } = new URL(req.url)
        const organizationId = searchParams.get("organizationId")
        const departmentId = searchParams.get("departmentId")
        const adminId = searchParams.get("adminId")
        const status = searchParams.get("status")
        const startDate = searchParams.get("startDate")
        const endDate = searchParams.get("endDate")
        const search = searchParams.get("search")

        // Build filter conditions
        const whereClause: any = {}

        if (organizationId) whereClause.organizationId = organizationId
        if (departmentId) whereClause.departmentId = departmentId
        if (adminId) whereClause.resolvedByUserId = adminId
        if (status) whereClause.status = status

        if (startDate || endDate) {
            whereClause.createdAt = {}
            if (startDate) whereClause.createdAt.gte = new Date(startDate)
            if (endDate) whereClause.createdAt.lte = new Date(endDate)
        }

        if (search) {
            whereClause.OR = [
                { id: { contains: search, mode: "insensitive" } },
                { title: { contains: search, mode: "insensitive" } }
            ]
        }

        // Log report view for audit
        await prisma.auditLog.create({
            data: {
                action: "REPORT_VIEW",
                entity: "Report",
                entityId: "reports-dashboard",
                userId: session.user.id,
                details: `Viewed reports dashboard with filters: ${JSON.stringify({
                    organizationId, departmentId, adminId, status, startDate, endDate, search
                })}`
            }
        })

        // Fetch all complaints with filters
        const complaints = await prisma.complaint.findMany({
            where: whereClause,
            include: {
                organization: { select: { id: true, name: true } },
                department: { select: { id: true, name: true } },
                resolvedBy: { select: { id: true, name: true } }
            },
            orderBy: { createdAt: "desc" }
        })

        // Fetch all organizations
        const organizations = await prisma.organization.findMany({
            select: {
                id: true,
                name: true,
                _count: { select: { complaints: true } }
            }
        })

        // Fetch all departments
        const departments = await prisma.department.findMany({
            include: {
                organization: { select: { name: true } },
                complaints: {
                    select: {
                        id: true,
                        status: true,
                        createdAt: true,
                        updatedAt: true
                    }
                }
            }
        })

        // Fetch all admins
        const admins = await prisma.user.findMany({
            where: { role: "ORG_ADMIN" },
            select: {
                id: true,
                name: true,
                organizationId: true,
                organization: { select: { name: true } }
            }
        })

        // === ALL STATS DERIVED FROM FILTERED COMPLAINTS ===
        // This ensures charts, summaries, and lists all respect the user's filters
        const totalComplaints = complaints.length

        // Status Distribution (Filtered)
        const statusCounts = {
            PENDING: complaints.filter(c => c.status === "PENDING").length,
            APPROVED: complaints.filter(c => c.status === "APPROVED" || c.status === "IN_PROGRESS").length,
            RESOLVED: complaints.filter(c => c.status === "RESOLVED" || c.status === "CLOSED").length,
            REJECTED: complaints.filter(c => c.status === "REJECTED").length
        }

        // Complaints per organization (Filtered)
        const complaintsCountPerOrgMap = new Map<string, number>()
        complaints.forEach(c => {
            if (!c.organizationId) return
            complaintsCountPerOrgMap.set(c.organizationId, (complaintsCountPerOrgMap.get(c.organizationId) || 0) + 1)
        })

        const complaintsPerOrg = organizations.map(org => ({
            id: org.id,
            name: org.name,
            count: complaintsCountPerOrgMap.get(org.id) || 0
        })).sort((a, b) => b.count - a.count)

        // Department Stats (Filtered)
        const departmentStatsMap = new Map<string, { total: number, unresolved: number, resolved: number, totalResTime: number }>()

        complaints.forEach(c => {
            if (!c.departmentId) return
            const stats = departmentStatsMap.get(c.departmentId) || { total: 0, unresolved: 0, resolved: 0, totalResTime: 0 }

            stats.total++
            if (c.status === "PENDING" || c.status === "IN_PROGRESS" || c.status === "APPROVED") {
                stats.unresolved++
            } else if (c.status === "RESOLVED" || c.status === "CLOSED") {
                stats.resolved++
                const start = new Date(c.createdAt).getTime()
                const end = new Date(c.updatedAt).getTime()
                stats.totalResTime += (end - start)
            }
            departmentStatsMap.set(c.departmentId, stats)
        })

        const departmentStats = departments.map(dept => {
            const stats = departmentStatsMap.get(dept.id) || { total: 0, unresolved: 0, resolved: 0, totalResTime: 0 }
            const avgResTime = stats.resolved > 0
                ? stats.totalResTime / (stats.resolved * 1000 * 60 * 60)
                : 0

            return {
                id: dept.id,
                name: dept.name,
                organization: dept.organization.name,
                totalComplaints: stats.total,
                unresolvedCount: stats.unresolved,
                resolvedCount: stats.resolved,
                avgResolutionTime: parseFloat(avgResTime.toFixed(1))
            }
        }).filter(d => d.totalComplaints > 0 || !organizationId) // Keep all if no org filter, otherwise only relevant ones
            .sort((a, b) => b.unresolvedCount - a.unresolvedCount)

        const repeatedComplaintsDepts = departmentStats.filter(d => d.totalComplaints >= 5)

        // Organization Insights (Filtered)
        const orgInsights = organizations.map(org => {
            const orgComplaintsCount = complaintsCountPerOrgMap.get(org.id) || 0
            const resolvedCount = complaints.filter(c => c.organizationId === org.id && (c.status === "RESOLVED" || c.status === "CLOSED")).length
            const resolutionRate = orgComplaintsCount > 0
                ? ((resolvedCount / orgComplaintsCount) * 100).toFixed(1)
                : "0"

            return {
                id: org.id,
                name: org.name,
                totalComplaints: orgComplaintsCount,
                resolvedCount: resolvedCount,
                resolutionRate: parseFloat(resolutionRate)
            }
        }).sort((a, b) => b.resolutionRate - a.resolutionRate)

        // === TREND DATA ===
        // Daily trends (last 30 days)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const dailyTrends: { date: string; count: number }[] = []
        for (let i = 29; i >= 0; i--) {
            const date = new Date()
            date.setDate(date.getDate() - i)
            const dateStr = date.toISOString().split('T')[0]
            const count = complaints.filter(c => {
                const cDate = new Date(c.createdAt).toISOString().split('T')[0]
                return cDate === dateStr
            }).length
            dailyTrends.push({ date: dateStr, count })
        }

        // Monthly trends (last 12 months)
        const monthlyTrends: { month: string; count: number }[] = []
        for (let i = 11; i >= 0; i--) {
            const date = new Date()
            date.setMonth(date.getMonth() - i)
            const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
            const count = complaints.filter(c => {
                const cDate = new Date(c.createdAt)
                const cMonthStr = `${cDate.getFullYear()}-${String(cDate.getMonth() + 1).padStart(2, '0')}`
                return cMonthStr === monthStr
            }).length
            monthlyTrends.push({ month: monthStr, count })
        }

        return NextResponse.json({
            // Filter options
            filterOptions: {
                organizations: organizations.map(o => ({ id: o.id, name: o.name })),
                departments: departments.map(d => ({
                    id: d.id,
                    name: d.name,
                    organization: d.organization.name,
                    organizationId: d.organizationId // Added for dependent filtering
                })),
                admins: admins.map(a => ({
                    id: a.id,
                    name: a.name,
                    organization: a.organization?.name,
                    organizationId: a.organizationId // Added for dependent filtering
                }))
            },
            // Summary
            summary: {
                totalComplaints,
                statusCounts,
                complaintsPerOrg
            },
            // Department reports
            departmentStats,
            repeatedComplaintsDepts,
            // Repeated Issues logic
            repeatedIssues: (() => {
                const issueMap = new Map<string, { title: string, count: number, deptId: string, deptName: string, orgId: string, orgName: string }>()

                complaints.forEach(c => {
                    if (!c.departmentId || !c.title) return
                    const key = `${c.departmentId}-${c.title.toLowerCase().trim()}`
                    const existing = issueMap.get(key)
                    if (existing) {
                        existing.count++
                    } else {
                        issueMap.set(key, {
                            title: c.title,
                            count: 1,
                            deptId: c.departmentId,
                            deptName: c.department?.name || "Unknown",
                            orgId: c.organizationId || "",
                            orgName: c.organization?.name || "Unknown"
                        })
                    }
                })

                return Array.from(issueMap.values())
                    .filter(issue => issue.count > 1)
                    .sort((a, b) => b.count - a.count)
            })(),
            // Organization insights
            orgInsights,
            // Trends
            dailyTrends,
            monthlyTrends,
            // Raw complaints for export
            complaints: complaints.map(c => ({
                id: c.id,
                title: c.title,
                status: c.status,
                organization: c.organization?.name || "N/A",
                department: c.department?.name || "N/A",
                resolvedBy: c.resolvedBy?.name || "N/A",
                createdAt: c.createdAt,
                updatedAt: c.updatedAt
            }))
        })
    } catch (error) {
        console.error("Reports API error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

// POST for logging exports
export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (session?.user?.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { exportType } = await req.json()

        // Log export action
        await prisma.auditLog.create({
            data: {
                action: "REPORT_EXPORT",
                entity: "Report",
                entityId: "reports-export",
                userId: session.user.id,
                details: `Exported reports as ${exportType}`
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Export log error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
