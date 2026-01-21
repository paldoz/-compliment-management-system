import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { sendComplaintStatusUpdateEmail, sendSuperAdminUpdateEmail, sendAuditLogNotification } from "@/lib/mail"

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")

    // Verify Role from DB (Fresh Data)
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true, organizationId: true }
    })

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.role !== "ORG_ADMIN" && user.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orgId = user.organizationId
    if (!orgId && user.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Organization not assigned" }, { status: 400 })
    }

    const id = searchParams.get("id")

    try {
        if (id) {
            const complaint = await prisma.complaint.findUnique({
                where: {
                    id,
                    ...(orgId ? { organizationId: orgId } : {})
                },
                include: {
                    user: { select: { name: true, email: true, id: true } },
                    department: { select: { name: true } },
                    attachments: true,
                    comments: {
                        include: { user: { select: { name: true, role: true } } },
                        orderBy: { createdAt: "asc" }
                    },
                    auditLogs: {
                        include: { user: { select: { name: true, role: true } } },
                        orderBy: { createdAt: "desc" }
                    }
                }
            })
            return NextResponse.json(complaint)
        }

        const complaints = await prisma.complaint.findMany({
            where: {
                ...(orgId ? { organizationId: orgId } : {}),
                ...(status ? { status } : {})
            },
            include: {
                user: { select: { name: true, email: true, id: true } },
                department: { select: { name: true } },
                attachments: true,
                comments: {
                    include: { user: { select: { name: true, role: true } } },
                    orderBy: { createdAt: "asc" }
                }
            },
            orderBy: { createdAt: "desc" }
        })

        return NextResponse.json(complaints)
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify Role from DB
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true, organizationId: true, name: true }
    })

    if (!user || (user.role !== "ORG_ADMIN" && user.role !== "SUPER_ADMIN")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { id, status, resolutionNote } = await req.json()

        // Ensure complaint belongs to admin's organization (if not super admin)
        const complaint = await prisma.complaint.findUnique({
            where: { id },
            include: {
                user: { select: { name: true, email: true } },
                organization: { select: { name: true } }
            }
        })

        if (!complaint) {
            return NextResponse.json({ error: "Not found" }, { status: 404 })
        }

        if (user.role !== "SUPER_ADMIN" && complaint.organizationId !== user.organizationId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const updated = await prisma.complaint.update({
            where: { id },
            data: {
                status,
                ...((["RESOLVED", "CLOSED", "APPROVED"].includes(status)) ? { resolvedByUserId: session.user.id } : {})
            }
        })

        const updateDate = new Date().toLocaleString()

        // Create Audit Log
        await prisma.auditLog.create({
            data: {
                action: `Status changed to ${status}`,
                entity: "Complaint",
                entityId: id,
                userId: session.user.id,
                details: resolutionNote || "Status update",
                complaintId: id
            }
        })

        if (resolutionNote) {
            await prisma.comment.create({
                data: {
                    content: `[RESOLUTION NOTE]: ${resolutionNote}`,
                    userId: session.user.id,
                    complaintId: id
                }
            })
        }

        // 1. Notify User (Trigger 3)
        if (["APPROVED", "RESOLVED", "REJECTED"].includes(status.toUpperCase())) {
            await sendComplaintStatusUpdateEmail({
                userEmail: complaint.user.email,
                userName: complaint.user.name || "User",
                complaintId: complaint.id,
                title: complaint.title,
                newStatus: status,
                adminMessage: resolutionNote,
                date: updateDate
            })
        }

        // 2. Notify Super Admins if RESOLVED (Trigger 4)
        if (status.toUpperCase() === "RESOLVED") {
            const superAdmins = await prisma.user.findMany({
                where: { role: "SUPER_ADMIN" }
            })

            for (const sa of superAdmins) {
                await sendSuperAdminUpdateEmail({
                    superAdminEmail: sa.email,
                    complaintId: complaint.id,
                    title: complaint.title,
                    adminName: user.name || "Admin",
                    orgName: complaint.organization?.name || "Global",
                    status: status,
                    date: updateDate,
                    summary: resolutionNote
                })
            }
        }

        // 3. Notify Super Admins via Audit Log Email for transparency
        const allSuperAdmins = await prisma.user.findMany({
            where: { role: "SUPER_ADMIN" }
        })
        for (const sa of allSuperAdmins) {
            await sendAuditLogNotification({
                superAdminEmail: sa.email,
                action: `Status changed to ${status}`,
                performedBy: user.name || "Admin",
                target: complaint.title,
                targetType: "Complaint",
                organization: complaint.organization?.name || "Global",
                date: updateDate,
                details: resolutionNote || `Status updated to ${status}`
            })
        }

        // Internal Notification for the complaint owner
        await prisma.notification.create({
            data: {
                title: "Complaint Status Updated",
                message: `Your complaint "${complaint.title}" status is now ${status}.`,
                type: "STATUS_UPDATE",
                userId: complaint.userId,
                link: `/dashboard/complaints?id=${id}`
            }
        })


        return NextResponse.json(updated)
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
