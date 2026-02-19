"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import {
    LayoutDashboard,
    FileText,
    Building,
    Users,
    Settings,
    LogOut,
    PlusCircle,
    ShieldAlert,
    Building2,
    TrendingUp,
    Menu
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { NotificationBell } from "./NotificationBell"

export function SidebarContent() {
    const pathname = usePathname()
    const { data: session } = useSession()
    const role = session?.user?.role

    const overviewHref = role === "SUPER_ADMIN" ? "/dashboard/super" : role === "ORG_ADMIN" ? "/dashboard/admin" : "/dashboard"

    const routes = [
        {
            label: "Overview",
            icon: LayoutDashboard,
            href: overviewHref,
            active: pathname === "/dashboard" || pathname === "/dashboard/super" || pathname === "/dashboard/admin",
            roles: ["SUPER_ADMIN", "ORG_ADMIN", "USER"]
        },
        {
            label: "Active Compliments",
            icon: FileText,
            href: "/dashboard/complaints",
            active: pathname === "/dashboard/complaints",
            roles: ["USER"]
        },
        {
            label: "New Compliment",
            icon: PlusCircle,
            href: "/dashboard/complaints/new",
            active: pathname === "/dashboard/complaints/new",
            roles: ["USER"]
        },
        {
            label: "Organization Registry",
            icon: Building2,
            href: "/dashboard/super/organizations",
            active: pathname === "/dashboard/super/organizations",
            roles: ["SUPER_ADMIN"]
        },
        {
            label: "Personnel Assets",
            icon: Users,
            href: "/dashboard/users",
            active: pathname === "/dashboard/users",
            roles: ["SUPER_ADMIN"]
        },
        {
            label: "System Security",
            icon: ShieldAlert,
            href: "/dashboard/audit-logs",
            active: pathname === "/dashboard/audit-logs",
            roles: ["SUPER_ADMIN"]
        },
        {
            label: "Organization Board",
            icon: FileText,
            href: "/dashboard/admin/complaints",
            active: pathname === "/dashboard/admin/complaints",
            roles: ["ORG_ADMIN"]
        },
        {
            label: "Settings",
            icon: Settings,
            href: "/dashboard/settings",
            active: pathname === "/dashboard/settings",
            roles: ["USER", "ORG_ADMIN", "SUPER_ADMIN"]
        },
        {
            label: "Reports",
            icon: TrendingUp,
            href: "/dashboard/admin-performance",
            active: pathname === "/dashboard/admin-performance",
            roles: ["SUPER_ADMIN"]
        },
    ]

    const filteredRoutes = routes.filter(route =>
        !role || route.roles.includes(role)
    )

    return (
        <div className="flex h-full flex-col bg-white dark:bg-[#0B1120] relative overflow-hidden transition-colors duration-300">
            {/* Clean, Premium Background - Subtle gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/50 dark:to-slate-900/20 pointer-events-none" />

            <div className="flex-1 flex flex-col pt-8 px-4 gap-1 relative z-10">
                <div className="px-4 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 drop-shadow-sm">Main Menu</span>
                </div>
                {filteredRoutes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                            "group flex items-center gap-3.5 px-4 py-3 text-[13px] font-bold rounded-xl transition-all duration-300 ease-out",
                            route.active
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-600/20 border border-blue-500/50"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200"
                        )}
                    >
                        <route.icon className={cn(
                            "h-4.5 w-4.5 transition-all duration-300",
                            "group-hover:scale-110 group-hover:rotate-3",
                            route.active
                                ? "text-white"
                                : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                        )} />
                        <span className="drop-shadow-sm transition-all duration-300 group-hover:tracking-wide">{route.label}</span>
                    </Link>
                ))}
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 relative z-10">
                <div className="flex items-center gap-4 mb-6 px-2">
                    <Avatar className="h-10 w-10 rounded-xl shadow-sm border border-white dark:border-slate-800">
                        <AvatarImage
                            key={(session?.user as any)?.gender + (session?.user as any)?.username}
                            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent((session?.user as any)?.username || 'User')}&top=${(session?.user as any)?.gender === 'FEMALE' ? 'longButNotTooLong,straight01,straight02' : 'shortFlat,shortRound,theCaesar'}`}
                        />
                        <AvatarFallback className="rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-400 font-bold text-xs">
                            {session?.user?.name?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold truncate text-slate-900 dark:text-white leading-tight">{session?.user?.name || "Member Node"}</span>
                        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 truncate mt-0.5 capitalize">
                            {role?.toLowerCase().replace("_", " ")}
                        </span>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-100 dark:hover:border-red-900/30 transition-all h-11"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </div>
    )
}

export function Sidebar() {
    return (
        <div className="hidden lg:flex h-full w-72 flex-col bg-white dark:bg-[#0B1120] border-r border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
            <div className="flex h-20 items-center px-8 border-b border-slate-100 dark:border-slate-800 justify-between relative overflow-hidden group">
                {/* Subtle Refined Logo Glow */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 dark:bg-blue-400/10 blur-[28px] rounded-full -mr-10 -mt-10 pointer-events-none" />

                <div className="flex items-center gap-3 relative z-10">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white leading-none uppercase italic">Console<span className="text-primary italic">.</span></span>
                </div>
                <div className="relative z-10">
                    <NotificationBell />
                </div>
            </div>
            <SidebarContent />
        </div>
    )
}
