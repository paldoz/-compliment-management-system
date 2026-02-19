import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { unstable_noStore as noStore } from "next/cache"
import { sendPasswordResetEmail } from "@/lib/mail"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
    noStore()
    try {
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return NextResponse.json({ error: "No account found with this email" }, { status: 404 })
        }

        const resetCode = Math.floor(100000 + Math.random() * 900000).toString()

        await prisma.user.update({
            where: { email },
            data: { resetCode }
        })

        // Send actual email thru the service
        await sendPasswordResetEmail(email, resetCode)

        return NextResponse.json({ message: "Reset code transmitted to your identity node." })
    } catch (error) {
        console.error("Forgot password error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
