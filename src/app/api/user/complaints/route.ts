import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { sendNewComplaintAdminEmail, sendAuditLogNotification } from "@/lib/mail"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "USER") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const id = searchParams.get("id")

    try {
        if (id) {
            const complaint = await prisma.complaint.findUnique({
                where: { id, userId: session.user.id },
                include: {
                    department: { select: { name: true } },
                    organization: { select: { name: true, isVerified: true } },
                    attachments: true,
                    comments: {
                        include: { user: { select: { name: true, role: true } } },
                        orderBy: { createdAt: "asc" }
                    },
                    auditLogs: {
                        include: { user: { select: { name: true } } },
                        orderBy: { createdAt: "desc" }
                    }
                }
            })
            return NextResponse.json(complaint)
        }

        const complaints = await prisma.complaint.findMany({
            where: {
                userId: session.user.id,
                ...(status ? { status } : {})
            },
            include: {
                department: { select: { name: true } },
                organization: { select: { name: true, isVerified: true } }
            },
            orderBy: { createdAt: "desc" }
        })

        return NextResponse.json(complaints)
    } catch (error) {
        console.error("Fetch user complaints error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "USER") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { title, description, organizationId, departmentId, attachments } = await req.json()

        // Create the complaint
        const complaint = await prisma.complaint.create({
            data: {
                title,
                description,
                userId: session.user.id,
                organizationId: organizationId || null,
                departmentId: departmentId || null,
                status: "PENDING",
                attachments: {
                    create: attachments?.map((a: any) => ({
                        url: a.url,
                        name: a.name,
                        type: a.type
                    })) || []
                }
            },
            include: {
                organization: true,
                department: true,
                user: { select: { name: true, email: true } }
            }
        })

        // Create initial Audit Log
        await prisma.auditLog.create({
            data: {
                action: "Complaint Submitted",
                entity: "Complaint",
                entityId: complaint.id,
                userId: session.user.id,
                details: `Complaint filed and assigned to ${complaint.organization?.name || "Global"} - ${complaint.department?.name || "Registry"}`,
                complaintId: complaint.id
            }
        })

        // Create initial Notification for the user
        await prisma.notification.create({
            data: {
                title: "Complaint Received",
                message: `Your complaint "${title}" has been successfully logged.`,
                type: "SUBMISSION",
                userId: session.user.id,
                link: `/dashboard/complaints?id=${complaint.id}`
            }
        })

        // Notify Organization Admins (ORG_ADMIN)
        if (organizationId) {
            const orgAdmins = await prisma.user.findMany({
                where: { organizationId, role: "ORG_ADMIN" }
            })

            const submissionDate = new Date().toLocaleString()
            for (const admin of orgAdmins) {
                // Internal Notification
                await prisma.notification.create({
                    data: {
                        title: "New Organization Complaint",
                        message: `New complaint received for your organization: "${title}"`,
                        type: "NEW_COMPLAINT",
                        userId: admin.id,
                        link: `/dashboard/admin/complaints`
                    }
                })

                // Email Notification
                await sendNewComplaintAdminEmail({
                    adminEmail: admin.email,
                    complaintId: complaint.id,
                    title: complaint.title,
                    userName: complaint.user.name || "Anonymous",
                    userEmail: complaint.user.email,
                    orgName: complaint.organization?.name || "Global",
                    date: submissionDate
                })
            }
        }

        // Notify Department Admins if assigned (legacy support or if we still use DEPT_ADMIN)
        if (departmentId) {
            const admins = await prisma.user.findMany({
                where: { departmentId, role: "DEPT_ADMIN" }
            })

            for (const admin of admins) {
                await prisma.notification.create({
                    data: {
                        title: "New Inbound Complaint",
                        message: `New complaint received: "${title}"`,
                        type: "NEW_COMPLAINT",
                        userId: admin.id,
                        link: `/dashboard/admin/complaints`
                    }
                })
            }
        }

        // Notify Super Admins via Audit Log Email
        const superAdmins = await prisma.user.findMany({
            where: { role: "SUPER_ADMIN" }
        })
        const submissionTime = new Date().toLocaleString()
        for (const sa of superAdmins) {
            await sendAuditLogNotification({
                superAdminEmail: sa.email,
                action: "Complaint Submitted",
                performedBy: session.user.name || "User",
                target: complaint.title,
                targetType: "Complaint",
                organization: complaint.organization?.name || "Global",
                date: submissionTime,
                details: `New complaint filed in ${complaint.department?.name || "General"} department`
            })
        }

        return NextResponse.json(complaint)
    } catch (error) {
        console.error("Create complaint error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
