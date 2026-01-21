import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export const dynamic = "force-dynamic"

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { name, image, password, email, username, gender } = await req.json()

        const updateData: any = {}
        if (name) updateData.name = name
        if (image) updateData.image = image
        if (gender) updateData.gender = gender
        if (password) {
            updateData.password = await bcrypt.hash(password, 10)
        }

        // Check uniqueness if email or username is changing
        if (email && email !== session.user.email) {
            const existingEmail = await prisma.user.findUnique({ where: { email } })
            if (existingEmail) return NextResponse.json({ error: "Email already in use" }, { status: 400 })
            updateData.email = email
        }

        if (username && username !== (session.user as any).username) {
            const existingUsername = await prisma.user.findUnique({ where: { username } })
            if (existingUsername) return NextResponse.json({ error: "Username already in use" }, { status: 400 })
            updateData.username = username
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                username: true,
                image: true,
                gender: true
            }
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error("Profile update error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
