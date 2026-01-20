import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { logger } from "@/lib/logger"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                logger.log("Authorize called", { email: credentials?.email });
                if (!credentials?.email || !credentials?.password) {
                    logger.log("Missing credentials");
                    return null
                }

                try {
                    const identifier = credentials.email.toLowerCase().trim()

                    // Add a timeout to the database operation
                    const start = Date.now()
                    logger.log(`Starting user lookup for ${identifier}`)

                    const user = await Promise.race([
                        (async () => {
                            try {
                                const foundUser = await prisma.user.findFirst({
                                    where: {
                                        OR: [
                                            { email: identifier },
                                            { username: identifier }
                                        ]
                                    }
                                })

                                const duration = Date.now() - start
                                logger.log(`User lookup took ${duration}ms`, { found: !!foundUser })

                                if (!foundUser) {
                                    logger.log("User not found");
                                    return null
                                }
                                if (!foundUser.password) {
                                    logger.log("User has no password set");
                                    return null
                                }

                                // Verify password
                                const isValid = await bcrypt.compare(credentials.password, foundUser.password)
                                if (!isValid) {
                                    logger.log("Invalid password");
                                    return null
                                }

                                logger.log("Login successful");
                                return foundUser
                            } catch (error) {
                                logger.error("Database Query FAILED", error);
                                throw error
                            }
                        })(),
                        new Promise<null>((_, reject) =>
                            setTimeout(() => {
                                logger.error("Database query TIMED OUT after 45s");
                                reject(new Error("Database query timed out"))
                            }, 45000)
                        )
                    ])

                    if (!user) {
                        return null
                    }

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        username: user.username,
                        gender: user.gender,
                        image: user.image,
                        role: user.role,
                        departmentId: user.departmentId,
                        organizationId: user.organizationId
                    }
                } catch (error) {
                    logger.error("Login critical error", error);
                    return null
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            logger.log("JWT Callback started", { trigger, hasUser: !!user });
            try {
                if (user) {
                    token.id = user.id
                    token.role = user.role
                    token.username = (user as any).username
                    token.departmentId = user.departmentId
                    token.organizationId = user.organizationId
                    token.gender = (user as any).gender
                    // We knowingly ignore user.image from DB to keep cookies small
                    token.image = null
                }
                if (trigger === "update" && session?.user) {
                    logger.log("JWT Update Triggered", { gender: session.user.gender });
                    if (session.user.name) token.name = session.user.name
                    if (session.user.email) token.email = session.user.email
                    if (session.user.gender) token.gender = session.user.gender
                    // Ignore image updates

                    if (session.user.username) token.username = session.user.username
                }
                logger.log("JWT Callback finished");
                return token
            } catch (error) {
                logger.error("JWT Callback Error", error);
                throw error;
            }
        },
        async session({ session, token }) {
            logger.log("Session Callback started")
            try {
                if (token && session.user) {
                    session.user.id = token.id as string
                    session.user.role = token.role as string;
                    (session.user as any).username = token.username;
                    session.user.departmentId = token.departmentId as string | undefined;
                    session.user.organizationId = token.organizationId as string | undefined;
                    (session.user as any).gender = token.gender
                }
                logger.log("Session Callback finished");
                return session;
            } catch (error) {
                logger.error("Session Callback Error", error);
                throw error;
            }
        }
    },
    pages: {
        signIn: "/login",
    },
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET,
}
