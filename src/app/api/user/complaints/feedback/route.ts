import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { complaintId, rating, feedback } = await req.json()

        if (!complaintId || !rating) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const complaint = await prisma.complaint.findUnique({
            where: { id: complaintId }
        })

        if (!complaint) {
            return NextResponse.json({ error: "Complaint not found" }, { status: 404 })
        }

        if (complaint.userId !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        // Allow feedback if resolved or closed (adjust status check as needed based on your flow)
        if (complaint.status !== "RESOLVED" && complaint.status !== "CLOSED") {
            // Optional: allow feedback only when resolved
            // return NextResponse.json({ error: "Complaint is not resolved yet" }, { status: 400 })
        }

        // ONE-TIME RATING POLICY
        if (complaint.rating) {
            return NextResponse.json({ error: "Resolution has already been rated" }, { status: 400 })
        }

        const updated = await prisma.complaint.update({
            where: { id: complaintId },
            data: {
                rating: parseInt(rating),
                feedback: feedback || null
            }
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("Feedback error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
