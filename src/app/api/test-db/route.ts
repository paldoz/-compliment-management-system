import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
    console.log("API: Starting DB Connection Test...")
    try {
        const start = Date.now()
        // Simple query
        const count = await prisma.user.count()
        const duration = Date.now() - start

        console.log(`API: DB Test Success. Count: ${count}. Time: ${duration}ms`)
        return NextResponse.json({
            status: "success",
            count,
            duration,
            env: process.env.DATABASE_URL ? "Defined" : "Missing"
        })
    } catch (error: any) {
        console.error("API: DB Test Failed:", error)
        return NextResponse.json({
            status: "error",
            message: error.message,
            stack: error.stack
        }, { status: 500 })
    }
}
