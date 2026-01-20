import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

console.log("NextAuth route module loaded")

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
