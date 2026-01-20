import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/lib/mail"
import { encrypt } from "@/lib/crypto"

export async function POST(req: Request) {
  try {
    const { email, username, password, name } = await req.json()

    if (!email || !username || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email or username" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()

    // Encrypt registration data
    const registrationData = encrypt(JSON.stringify({
      email,
      username,
      password: hashedPassword,
      name,
      otpCode,
      expires: Date.now() + 10 * 60 * 1000 // 10 minutes
    }))

    console.log(`[AUTH] Stateless Signup OTP for ${email}: ${otpCode}`)
    const emailResult = await sendVerificationEmail(email, otpCode)

    if (!emailResult.success) {
      return NextResponse.json({
        error: "Failed to send verification email. Please check your email or contact admin."
      }, { status: 500 })
    }

    const response = NextResponse.json({
      message: "Verification code sent. Please check your email.",
      email: email
    }, { status: 201 })

    // Set secure cookie with registration data
    response.cookies.set("pending_registration", registrationData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600 // 10 minutes
    })

    return response
  } catch (error: any) {
    console.error("Signup error details:", error)
    return NextResponse.json({
      error: "Internal server error",
      message: error.message || "Unknown error"
    }, { status: 500 })
  }
}
