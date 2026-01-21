import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

console.log("NextAuth route module loaded")

export const dynamic = "force-dynamic"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
