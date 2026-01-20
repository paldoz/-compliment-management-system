import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { sendAdminAssignmentEmail, sendAuditLogNotification } from "@/lib/mail"


export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { organizationId, userIds } = await req.json()

        if (!organizationId || !userIds || !Array.isArray(userIds)) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 })
        }

        // Fetch users before update to get their emails and names
        const usersToAssign = await prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, email: true, name: true }
        })

        // Update users to have the organizationId and set role to ORG_ADMIN
        const updatedUsers = await prisma.user.updateMany({
            where: {
                id: { in: userIds }
            },
            data: {
                organizationId,
                role: "ORG_ADMIN"
            }
        })

        // Get organization name for notifications
        const organization = await prisma.organization.findUnique({
            where: { id: organizationId },
            select: { name: true }
        })

        // Create notifications and send emails for each assigned user
        const assignmentDate = new Date().toLocaleString()
        for (const user of usersToAssign) {
            // Internal Notification
            await prisma.notification.create({
                data: {
                    userId: user.id,
                    title: "Organization Assignment",
                    message: `You have been assigned as an admin to ${organization?.name || 'an organization'}. You can now manage complaints and view the organization dashboard.`,
                    isRead: false
                }
            })

            // Email Notification
            await sendAdminAssignmentEmail({
                adminName: user.name || user.email.split('@')[0],
                adminEmail: user.email,
                orgName: organization?.name || "Organization",
                superAdminName: session.user.name || "Super Admin",
                date: assignmentDate
            })
        }

        // Log action to DB
        await prisma.auditLog.create({
            data: {
                action: "Admins Assigned",
                entity: "Organization",
                entityId: organizationId,
                userId: session.user.id,
                details: `Assigned ${userIds.length} admins to organization ID: ${organizationId}`
            }
        })

        // Notify Super Admins via Audit Log Email for transparency
        const superAdmins = await prisma.user.findMany({
            where: { role: "SUPER_ADMIN" }
        })
        for (const sa of superAdmins) {
            await sendAuditLogNotification({
                superAdminEmail: sa.email,
                action: "Admin Assigned",
                performedBy: session.user.name || "Super Admin",
                target: usersToAssign.map(u => u.name || u.email).join(", "),
                targetType: "Admin Personnel",
                organization: organization?.name || "Global",
                date: assignmentDate,
                details: `Assigned ${userIds.length} personnel to ${organization?.name || 'organization'}`
            })
        }

        return NextResponse.json({ success: true, updatedCount: updatedUsers.count })
    } catch (error) {
        console.error("Error assigning admins:", error)
        return NextResponse.json({ error: "Error assigning admins" }, { status: 400 })
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { searchParams } = new URL(req.url)
        const userId = searchParams.get("userId")

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 })
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                organizationId: null,
                role: "USER" // Reset to regular user or keep as is? User usually becomes a regular user if unassigned.
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Error removing admin" }, { status: 400 })
    }
}
