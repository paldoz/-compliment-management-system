import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"
import { unstable_noStore as noStore } from "next/cache"

console.log("NextAuth route module loaded")

export const dynamic = "force-dynamic"

const handler = NextAuth(authOptions)

async function GET(req: any, res: any) {
    noStore()
    return await handler(req, res)
}

async function POST(req: any, res: any) {
    noStore()
    return await handler(req, res)
}

export { GET, POST }
