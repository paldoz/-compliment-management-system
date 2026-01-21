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
        const [
            totalUsers,
            totalOrganizations,
            totalComplaints,
            totalDepartments,
            pendingComplaints,
            inProgressComplaints,
            resolvedComplaints,
            miscComplaints,
            totalAdmins,
            recentComplaints,
            recentOrganizations,
            departmentVolume,
            auditLogs,
            resolvedComplaintsList
        ] = await Promise.all([
            prisma.user.count({ where: { role: "USER" } }),
            prisma.organization.count(),
            prisma.complaint.count(),
            prisma.department.count(),
            prisma.complaint.count({ where: { status: "PENDING" } }),
            prisma.complaint.count({ where: { status: "IN_PROGRESS" } }),
            prisma.complaint.count({ where: { status: "RESOLVED" } }),
            prisma.complaint.count({ where: { departmentId: null } }),
            prisma.user.count({ where: { role: "ORG_ADMIN" } }),
            prisma.complaint.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
                include: {
                    user: { select: { name: true } },
                    department: { select: { name: true } },
                    organization: { select: { name: true } }
                }
            }),
            prisma.organization.findMany({
                take: 10,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    createdAt: true,
                    _count: {
                        select: {
                            departments: true,
                            complaints: true
                        }
                    },
                    complaints: {
                        select: {
                            status: true
                        }
                    }
                }
            }),
            prisma.complaint.groupBy({
                by: ['departmentId'],
                _count: {
                    _all: true
                },
                orderBy: {
                    _count: {
                        departmentId: 'desc'
                    }
                },
                take: 10
            }),
            prisma.auditLog.findMany({
                take: 10,
                orderBy: { createdAt: "desc" },
                include: {
                    user: { select: { name: true, role: true, username: true, gender: true } }
                }
            }),
            prisma.complaint.findMany({
                where: { status: "RESOLVED" },
                take: 5,
                orderBy: { updatedAt: "desc" },
                include: {
                    user: { select: { name: true } },
                    organization: { select: { name: true } },
                    auditLogs: {
                        where: { action: { startsWith: "Status changed to RESOLVED" } },
                        take: 1,
                        orderBy: { createdAt: "desc" },
                        include: { user: { select: { name: true, username: true, gender: true } } }
                    }
                }
            })
        ])

        // Fetch department names for the grouped complaint counts
        const deptIds = departmentVolume.map(d => d.departmentId).filter((id): id is string => id !== null);
        const deptsWithNames = await prisma.department.findMany({
            where: { id: { in: deptIds } },
            select: { id: true, name: true }
        });

        const deptMap = new Map(deptsWithNames.map(d => [d.id, d.name]));

        // Aggregate by name to handle duplicate names across orgs
        const aggregatedDeptVolume: Record<string, number> = {};
        departmentVolume.forEach(d => {
            if (d.departmentId) {
                const name = deptMap.get(d.departmentId) || "Unknown";
                aggregatedDeptVolume[name] = (aggregatedDeptVolume[name] || 0) + d._count._all;
            }
        });

        const finalDeptVolume = Object.entries(aggregatedDeptVolume)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        const processedOrgs = recentOrganizations.map(org => {
            const pending = org.complaints.filter(c => c.status === "PENDING").length;
            const solved = org.complaints.filter(c => c.status === "RESOLVED").length;
            const inProgress = org.complaints.filter(c => c.status === "IN_PROGRESS").length;
            return {
                id: org.id,
                name: org.name,
                description: org.description,
                createdAt: org.createdAt,
                departmentCount: org._count.departments,
                totalComplaints: org._count.complaints,
                pendingCount: pending,
                solvedCount: solved,
                inProgressCount: inProgress,
                status: org._count.complaints > 0 ? (pending > 0 || inProgress > 0 ? "ACTIVE_PROCESSING" : "STABLE") : "INACTIVE"
            };
        });

        return NextResponse.json({
            totalUsers,
            totalOrganizations,
            totalComplaints,
            totalDepartments,
            pendingComplaints,
            inProgressComplaints,
            resolvedComplaints,
            miscComplaints,
            totalAdmins,
            recentComplaints,
            recentOrganizations: processedOrgs,
            departmentVolume: finalDeptVolume,
            auditLogs,
            resolvedComplaintsList: resolvedComplaintsList
        })
    } catch (error) {
        console.error("Global stats error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
