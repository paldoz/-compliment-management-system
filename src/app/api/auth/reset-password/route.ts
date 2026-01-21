import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { unstable_noStore as noStore } from "next/cache"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
    noStore()
    try {
        const { email, resetCode, newPassword } = await req.json()

        if (!email || !resetCode || !newPassword) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user || user.resetCode !== resetCode) {
            return NextResponse.json({ error: "Invalid reset code" }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                resetCode: null
            }
        })

        return NextResponse.json({ message: "Password updated successfully" })
    } catch (error) {
        console.error("Reset password error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
