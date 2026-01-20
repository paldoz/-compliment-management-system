import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Sidebar } from "@/components/Sidebar"
import { MobileNav } from "@/components/MobileNav"
import { BottomNav } from "@/components/dashboard/BottomNav"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Server-side session check - redirect to login if not authenticated
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        redirect("/login")
    }

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-slate-50/50 dark:bg-slate-950 overflow-hidden">
            {/* Mobile Header - Fixed at top */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex h-14 items-center px-6 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md justify-between shrink-0 relative overflow-hidden group">
                {/* Mobile Branding Texture Overlay */}
                <div
                    className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] bg-cover bg-center pointer-events-none"
                    style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                />

                <div className="flex items-center gap-2.5 relative z-10">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                    <span className="text-lg font-black tracking-tighter text-slate-900 dark:text-white leading-none uppercase italic">Console<span className="text-blue-600 italic">.</span></span>
                </div>
                <div className="relative z-10">
                    <MobileNav />
                </div>
            </div>

            <Sidebar />

            <main className="flex-1 overflow-y-auto pt-20 pb-32 lg:pt-10 lg:pb-10 px-4 md:px-10 custom-scrollbar relative">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

            <BottomNav />
        </div>
    )
}
