import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Define auth pages (public)
    const isAuthPage =
        pathname.startsWith("/login") ||
        pathname.startsWith("/signup") ||
        pathname.startsWith("/forgot-password") ||
        pathname.startsWith("/reset-password") ||
        pathname.startsWith("/verify-email")

    // Define protected routes
    const isProtectedRoute = pathname.startsWith("/dashboard")

    // Define API routes that need protection
    const isProtectedAPI =
        pathname.startsWith("/api/super-admin") ||
        pathname.startsWith("/api/superadmin") ||
        pathname.startsWith("/api/admin") ||
        pathname.startsWith("/api/user")

    // Get the token with proper secret
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
    })

    // If trying to access protected route without being logged in
    if (isProtectedRoute && !token) {
        const loginUrl = new URL("/login", request.url)
        loginUrl.searchParams.set("callbackUrl", pathname)
        return NextResponse.redirect(loginUrl)
    }

    // If trying to access protected API without being logged in
    if (isProtectedAPI && !token) {
        return NextResponse.json(
            { error: "Unauthorized - Please login first" },
            { status: 401 }
        )
    }

    // Role-based access control for Super Admin routes
    if (token) {
        const userRole = token.role as string

        // Super Admin only routes
        if (pathname.startsWith("/dashboard/super") && userRole !== "SUPER_ADMIN") {
            return NextResponse.redirect(new URL("/dashboard", request.url))
        }

        if (pathname.startsWith("/dashboard/admin-performance") && userRole !== "SUPER_ADMIN") {
            return NextResponse.redirect(new URL("/dashboard", request.url))
        }

        if (pathname.startsWith("/dashboard/audit-logs") && userRole !== "SUPER_ADMIN") {
            return NextResponse.redirect(new URL("/dashboard", request.url))
        }

        if (pathname.startsWith("/dashboard/users") && userRole !== "SUPER_ADMIN") {
            return NextResponse.redirect(new URL("/dashboard", request.url))
        }

        // Org Admin only routes
        if (pathname.startsWith("/dashboard/admin") && !pathname.startsWith("/dashboard/admin-performance")) {
            if (userRole !== "ORG_ADMIN" && userRole !== "SUPER_ADMIN") {
                return NextResponse.redirect(new URL("/dashboard", request.url))
            }
        }
    }

    // If logged in user tries to access auth pages, redirect to dashboard
    if (isAuthPage && token) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/login",
        "/signup",
        "/forgot-password",
        "/reset-password",
        "/verify-email",
        "/api/super-admin/:path*",
        "/api/superadmin/:path*",
        "/api/admin/:path*",
        "/api/user/:path*"
    ]
}
