import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"
import { unstable_noStore as noStore } from "next/cache"

console.log("NextAuth route module loaded")

export const dynamic = "force-dynamic"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
