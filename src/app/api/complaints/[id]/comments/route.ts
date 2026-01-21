import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { content } = await req.json()
        const { id: complaintId } = await params

        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 })
        }

        // Check if complaint exists and user has access
        const complaint = await prisma.complaint.findUnique({
            where: { id: complaintId },
            include: { organization: true, department: true }
        })

        if (!complaint) {
            return NextResponse.json({ error: "Complaint not found" }, { status: 404 })
        }

        // Access Control
        // 1. User is the owner
        // 2. User is SUPER_ADMIN
        // 3. User is ORG_ADMIN of the organization
        // 4. User is DEPT_ADMIN of the department
        const isOwner = complaint.userId === session.user.id
        const isSuperAdmin = session.user.role === "SUPER_ADMIN"
        const isOrgAdmin = session.user.role === "ORG_ADMIN" && complaint.organizationId === session.user.organizationId
        const isDeptAdmin = session.user.role === "DEPT_ADMIN" && complaint.departmentId === session.user.departmentId

        if (!isOwner && !isSuperAdmin && !isOrgAdmin && !isDeptAdmin) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 })
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                userId: session.user.id,
                complaintId: complaintId
            },
            include: {
                user: {
                    select: { name: true, role: true }
                }
            }
        })

        // Create notification for the other party
        // If user posted, notify admins
        // If admin posted, notify user
        if (session.user.role === "USER") {
            // Notify Org Admins
            if (complaint.organizationId) {
                const admins = await prisma.user.findMany({
                    where: { organizationId: complaint.organizationId, role: "ORG_ADMIN" }
                })
                for (const admin of admins) {
                    await prisma.notification.create({
                        data: {
                            title: "New Comment on Complaint",
                            message: `${session.user.name} added a comment to "${complaint.title}"`,
                            type: "NEW_COMMENT",
                            userId: admin.id,
                            link: `/dashboard/admin/complaints`
                        }
                    })
                }
            }
        } else {
            // Admin posted, notify user
            await prisma.notification.create({
                data: {
                    title: "Admin Response Received",
                    message: `A new response has been posted for your complaint "${complaint.title}"`,
                    type: "NEW_COMMENT",
                    userId: complaint.userId,
                    link: `/dashboard/complaints?id=${complaintId}`
                }
            })
        }

        return NextResponse.json(comment)
    } catch (error) {
        console.error("Post comment error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
