"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import {
    LayoutDashboard,
    FileText,
    PlusCircle,
    Settings,
    ShieldAlert,
    TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNav() {
    const pathname = usePathname()
    const { data: session } = useSession()
    const role = session?.user?.role

    const overviewHref = role === "SUPER_ADMIN" ? "/dashboard/super" : role === "ORG_ADMIN" ? "/dashboard/admin" : "/dashboard"

    const navItems = [
        {
            label: "Home",
            icon: LayoutDashboard,
            href: overviewHref,
            active: pathname === "/dashboard" || pathname === "/dashboard/super" || pathname === "/dashboard/admin"
        },
        {
            label: "Reports",
            icon: FileText,
            href: role === "ORG_ADMIN" ? "/dashboard/admin/complaints" : "/dashboard/complaints",
            active: pathname.includes("/complaints") && !pathname.includes("/new")
        },
        {
            label: "Post",
            icon: PlusCircle,
            href: "/dashboard/complaints/new",
            active: pathname === "/dashboard/complaints/new",
            primary: true
        },
        {
            label: role === "SUPER_ADMIN" ? "Stats" : "Feed",
            icon: role === "SUPER_ADMIN" ? TrendingUp : FileText,
            href: role === "SUPER_ADMIN" ? "/dashboard/admin-performance" : "/dashboard/complaints",
            active: role === "SUPER_ADMIN" ? pathname === "/dashboard/admin-performance" : false
        },
        {
            label: "Settings",
            icon: Settings,
            href: "/dashboard/settings",
            active: pathname === "/dashboard/settings"
        }
    ]

    return (
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-50">
            <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] px-3 py-3 flex items-center justify-between">
                {navItems.map((item) => {
                    const Icon = item.icon
                    if (item.primary) {
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="relative -top-1"
                            >
                                <div className={cn(
                                    "h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg shadow-blue-600/20 active:scale-95",
                                    item.active
                                        ? "bg-blue-600 text-white"
                                        : "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                                )}>
                                    <Icon className="h-7 w-7" />
                                </div>
                            </Link>
                        )
                    }

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="flex flex-col items-center justify-center px-3 gap-1 active:scale-95 transition-transform"
                        >
                            <Icon className={cn(
                                "h-6 w-6 transition-colors duration-300",
                                item.active ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-600"
                            )} />
                            <span className={cn(
                                "text-[9px] font-bold uppercase tracking-widest transition-colors duration-300",
                                item.active ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-600"
                            )}>
                                {item.label}
                            </span>
                            {item.active && (
                                <div className="absolute -bottom-1 h-1 w-1 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
                            )}
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
