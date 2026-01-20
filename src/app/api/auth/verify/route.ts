import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { decrypt } from "@/lib/crypto"
import { sendAccountCreatedEmail } from "@/lib/mail"

export async function POST(req: Request) {
    try {
        const { email, otpCode } = await req.json()

        if (!email || !otpCode) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }

        // Read registration data from cookie
        const pendingCookie = req.cookies?.get("pending_registration")?.value

        if (!pendingCookie) {
            // Check if already verified (fail-safe)
            const alreadyUser = await prisma.user.findUnique({ where: { email } })
            if (alreadyUser) return NextResponse.json({ message: "Already verified" })
            return NextResponse.json({ error: "Registration session expired. Please sign up again." }, { status: 400 })
        }

        let regData
        try {
            regData = JSON.parse(decrypt(pendingCookie))
        } catch (e) {
            return NextResponse.json({ error: "Invalid registration session" }, { status: 400 })
        }

        if (regData.email !== email) {
            return NextResponse.json({ error: "Email mismatch" }, { status: 400 })
        }

        if (regData.otpCode?.trim() !== otpCode?.trim()) {
            return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
        }

        if (regData.expires < Date.now()) {
            return NextResponse.json({ error: "Code expired" }, { status: 400 })
        }

        // Create official user
        await prisma.user.create({
            data: {
                email: regData.email,
                username: regData.username,
                password: regData.password,
                name: regData.name,
                role: "USER",
                isVerified: true
            }
        })

        // Send welcome email
        await sendAccountCreatedEmail({
            email: regData.email,
            name: regData.name,
            username: regData.username
        })

        const response = NextResponse.json({ message: "Verified and registered successfully" })
        response.cookies.delete("pending_registration")
        return response
    } catch (error) {
        console.error("Verification error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
