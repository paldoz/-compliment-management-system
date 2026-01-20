"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    FileText,
    PlusCircle,
    Clock,
    CheckCircle2,
    Loader2,
    ArrowUpRight,
    MessageSquare,
    AlertCircle,
    Building2,
    Users
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { StatsDetailModal } from "@/components/dashboard/StatsDetailModal"

export default function UserDashboard() {
    const { data: session, status } = useSession()
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedStat, setSelectedStat] = useState<{ type: "total" | "pending" | "inProgress" | "resolved", title: string } | null>(null)

    // Immediate redirect check for admin roles - runs before any rendering
    useEffect(() => {
        if (status === "loading") return // Wait for session

        if (session?.user?.role === "SUPER_ADMIN") {
            router.replace("/dashboard/super")
            return
        }
        if (session?.user?.role === "ORG_ADMIN") {
            router.replace("/dashboard/admin")
            return
        }

        const fetchStats = async () => {
            try {
                const res = await fetch("/api/user/stats")
                const data = await res.json()
                setStats(data?.error ? null : data)
            } catch (err) {
                console.error(err)
                setStats(null)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [session, status, router])

    // Show loading while redirecting admin users
    if (status === "loading" || session?.user?.role === "SUPER_ADMIN" || session?.user?.role === "ORG_ADMIN") {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-black dark:text-white" />
                    <span className="text-xs font-black uppercase tracking-[0.4em] text-zinc-300 dark:text-slate-600">Redirecting...</span>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-black dark:text-white" />
                    <span className="text-xs font-black uppercase tracking-[0.4em] text-zinc-300 dark:text-slate-600">Retrieving Status...</span>
                </div>
            </div>
        )
    }

    const cards = [
        { label: "Compliment Registry", value: stats?.total || 0, icon: FileText, desc: "Cumulative History", color: "bg-zinc-100", type: "total" as const },
        { label: "Pending Review", value: stats?.pending || 0, icon: Clock, desc: "Administrative Queue", color: "bg-black text-white", type: "pending" as const },
        { label: "Active Processing", value: stats?.inProgress || 0, icon: AlertCircle, desc: "Status Updates", color: "bg-zinc-100", type: "inProgress" as const },
        { label: "Resolved", value: stats?.resolved || 0, icon: CheckCircle2, desc: "Successful Closure", color: "bg-zinc-100", type: "resolved" as const },
    ]

    const handleCardClick = (card: typeof cards[0]) => {
        if (card.value > 0) {
            setSelectedStat({ type: card.type, title: card.label })
            setModalOpen(true)
        }
    }

    const getApiUrl = (type: string) => {
        const statusMap: Record<string, string> = {
            total: "",
            pending: "?status=PENDING",
            inProgress: "?status=IN_PROGRESS",
            resolved: "?status=RESOLVED"
        }
        return `/api/user/complaints${statusMap[type] || ""}`
    }

    return (
        <div className="space-y-4 md:space-y-12 pb-8 md:pb-24 px-1 md:px-0">
            {/* World-Class 'Mirror Glass' Hero Section (Compact) */}
            <div className="relative overflow-hidden group rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl transition-all duration-700 hover:shadow-blue-500/20 bg-slate-950 border border-white/5">
                {/* Branding-Integrated Background Texture */}
                <div
                    className="absolute inset-0 z-0 opacity-20 bg-cover bg-center transition-transform duration-[20000ms] group-hover:scale-110"
                    style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                />

                {/* Sophisticated Radial Flows */}
                <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[70%] bg-emerald-500/10 blur-[100px] rounded-full animate-pulse delay-700" />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10">
                    <div className="space-y-2 lg:space-y-4">
                        <div className="space-y-1 lg:space-y-2">
                            <div className="flex items-center gap-4">
                                <div className="h-[2px] w-12 bg-gradient-to-r from-blue-500 to-transparent rounded-full" />
                                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-blue-400/80">Active Security Node</span>
                            </div>
                            <h1 className="text-3xl lg:text-6xl font-black tracking-tighter text-white uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-emerald-100 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                                Command Center
                            </h1>
                            <div className="flex items-center gap-3 py-1 px-4 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 w-fit">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                                    {session?.user?.name || 'Authorized User'} • Secured
                                </p>
                            </div>
                        </div>
                    </div>

                    <Link href="/dashboard/complaints/new" className="w-full lg:w-auto group/btn">
                        <Button className="group relative w-full lg:w-auto h-14 lg:h-20 px-8 lg:px-14 rounded-2xl lg:rounded-[2rem] bg-blue-600 hover:bg-blue-500 text-white transition-all duration-500 font-black overflow-hidden shadow-2xl shadow-blue-600/40 active:scale-95 border border-blue-400/30">
                            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/30 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-500" />
                            <div className="relative flex items-center justify-center gap-4">
                                <PlusCircle className="h-6 w-6 lg:h-8 lg:w-8 group-hover/btn:rotate-90 transition-transform duration-500" />
                                <span className="text-sm lg:text-xl uppercase tracking-tighter italic">Initiate Compliment</span>
                            </div>
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Organization Identity Grid - Hidden on mobile */}
            {stats?.organization && (
                <div className="hidden md:grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 relative overflow-hidden bg-white rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 border border-slate-100 shadow-sm dark:bg-slate-900/40 dark:border-slate-800/60 backdrop-blur-xl group">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[80px] -mr-48 -mt-48 pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-1000" />

                        <div className="relative z-10 space-y-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 shadow-inner">
                                        <Building2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-slate-100 uppercase">{stats.organization.name}</h2>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500/60">Entity Overview</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 px-2">
                                        <Users className="h-4 w-4 text-slate-400" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Security Command</span>
                                    </div>
                                    <div className="space-y-3">
                                        {stats.organization.admins?.map((admin: any) => (
                                            <div key={admin.email} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50 dark:bg-slate-950/30 dark:border-slate-800/40 hover:bg-white dark:hover:bg-slate-900/80 transition-all duration-300 group/item">
                                                <Avatar className="h-12 w-12 rounded-xl border-2 border-white dark:border-slate-800 shadow-lg transition-transform group-hover/item:scale-110">
                                                    <AvatarImage src={admin.image || `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(admin.username || admin.name)}&top=${admin.gender === 'FEMALE' ? 'longButNotTooLong,straight01,straight02' : 'shortFlat,shortRound,theCaesar'}`} />
                                                    <AvatarFallback className="bg-blue-500 text-white font-black">{admin.name?.[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm text-slate-900 dark:text-slate-200">{admin.name}</span>
                                                    <span className="text-[10px] font-medium text-slate-400 tabular-nums lowercase">{admin.email}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="relative group/accent">
                                    <div className="absolute inset-0 bg-slate-900 dark:bg-black rounded-3xl -rotate-1 group-hover/accent:rotate-0 transition-transform shadow-2xl overflow-hidden">
                                        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/20 rounded-full blur-[60px]" />
                                    </div>
                                    <div className="relative bg-slate-900 dark:bg-slate-950 p-8 rounded-3xl text-white space-y-8 border border-white/5 shadow-2xl">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Global Metrics</span>
                                            <div className="h-2 w-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                                        </div>
                                        <div className="space-y-6">
                                            <div>
                                                <div className="text-4xl font-black tracking-tighter text-white">98.2%</div>
                                                <div className="text-[10px] font-bold text-blue-500/80 uppercase tracking-widest mt-1">Resolution Compliance</div>
                                            </div>
                                            <div className="h-px bg-slate-800/50" />
                                            <div>
                                                <div className="text-xl font-bold text-slate-200 tracking-tight">24-Hr Cycle</div>
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Avg Tactical Response</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Sidebar Card */}
                    <Card className="rounded-[2.5rem] border-none bg-blue-600 p-10 text-white relative overflow-hidden shadow-2xl dark:bg-blue-700/80">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.4),transparent)]" />
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32" />

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="space-y-4">
                                <div className="h-1.5 w-12 bg-white/30 rounded-full" />
                                <h3 className="text-2xl font-black uppercase tracking-tight">Active Pulse</h3>
                                <p className="text-xs text-blue-100/70 font-medium leading-relaxed">System-wide monitoring of your personal compliant history and real-time status buffers.</p>
                            </div>

                            <div className="space-y-8 mt-12">
                                <div className="flex items-end justify-between border-b border-white/10 pb-4">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-200/60">Total Logs</span>
                                        <div className="text-4xl font-black text-white tabular-nums tracking-tighter">{stats?.total || 0}</div>
                                    </div>
                                    <FileText className="h-8 w-8 text-white/50 mb-1" />
                                </div>
                                <div className="flex items-end justify-between border-b border-white/10 pb-4">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-200/60">Success Rate</span>
                                        <div className="text-4xl font-black text-white tabular-nums tracking-tighter">100%</div>
                                    </div>
                                    <CheckCircle2 className="h-8 w-8 text-white/50 mb-1" />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Tactical Metric Grid - Compact 2x2 on mobile */}
            <div className="grid grid-cols-2 gap-3 lg:gap-8">
                {cards.map((card, idx) => (
                    <Card
                        key={card.label}
                        onClick={() => handleCardClick(card)}
                        className={cn(
                            "group relative border-none rounded-2xl lg:rounded-[2rem] p-4 lg:p-8 transition-all duration-500 overflow-hidden shadow-md lg:shadow-xl",
                            "bg-white dark:bg-slate-900/60 dark:border dark:border-slate-800/50 hover:dark:bg-slate-900",
                            idx === 1 && "dark:ring-1 dark:ring-blue-500/30",
                            card.value > 0 && "cursor-pointer active:scale-95 lg:hover:scale-[1.02] lg:hover:shadow-2xl"
                        )}
                    >
                        <div className="hidden md:block absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex flex-row items-center justify-between mb-3 lg:mb-8 relative z-10">
                            <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-wider lg:tracking-[0.2em] text-slate-400 group-hover:text-blue-500 transition-colors truncate">
                                {card.label}
                            </span>
                            <div className="h-8 w-8 lg:h-11 lg:w-11 bg-slate-50 rounded-xl lg:rounded-2xl flex items-center justify-center dark:bg-slate-800 ring-1 ring-slate-100 dark:ring-slate-700 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shrink-0">
                                <card.icon className="h-4 w-4 lg:h-5 lg:w-5" />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <div className="text-3xl lg:text-6xl font-black tracking-tighter mb-1 lg:mb-2 tabular-nums dark:text-white transition-transform group-hover:scale-105 duration-500 origin-left">
                                {card.value}
                            </div>
                            <p className="text-[8px] lg:text-[10px] font-bold lg:font-black lg:italic uppercase tracking-wide lg:tracking-widest text-slate-400 lg:text-slate-500 group-hover:text-slate-400 truncate">
                                {card.desc} <span className="hidden lg:inline">{card.value > 0 && <span className="text-blue-500">→ Click</span>}</span>
                            </p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Stats Detail Modal */}
            {selectedStat && (
                <StatsDetailModal
                    isOpen={modalOpen}
                    onOpenChange={setModalOpen}
                    type={selectedStat.type}
                    title={selectedStat.title}
                    apiUrl={getApiUrl(selectedStat.type)}
                    role="user"
                />
            )}

            {/* Activity Ledger System - Hidden on mobile for compact view */}
            <div className="hidden md:block space-y-10">
                <div className="flex items-center justify-between px-6">
                    <div className="flex items-center gap-6">
                        <div className="bg-white p-4 rounded-[1.5rem] shadow-xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800 ring-4 ring-blue-500/5">
                            <MessageSquare className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase lg:text-5xl">Activity <span className="text-slate-200 dark:text-slate-800">Ledger</span></h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-1">Real-time surveillance updates</p>
                        </div>
                    </div>
                    <Link href="/dashboard/complaints" className="group flex items-center gap-4 bg-slate-950 text-white px-8 py-4 rounded-2xl hover:bg-black transition-all shadow-2xl dark:bg-white dark:text-slate-950">
                        <span className="text-xs font-black uppercase tracking-widest">Full Archives</span>
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {stats?.recent && stats.recent.length > 0 ? (
                        stats.recent.map((complaint: any, idx: number) => (
                            <Link
                                key={complaint.id}
                                href={`/dashboard/complaints?id=${complaint.id}`}
                                className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                                style={{ animationDelay: `${idx * 150}ms` }}
                            >
                                <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] flex items-center justify-between hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-900/5 transition-all group dark:bg-slate-900/40 dark:border-slate-800/60 dark:hover:bg-slate-900 backdrop-blur-md">
                                    <div className="flex items-center gap-10">
                                        <div className="h-16 w-[3px] bg-blue-600/10 rounded-full group-hover:bg-blue-600 group-hover:h-20 transition-all duration-500 dark:bg-slate-800"></div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-4">
                                                <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 shadow-sm">
                                                    {complaint.department?.name || "Global Node"}
                                                </span>
                                                <span className="text-[10px] font-black text-slate-300 tabular-nums dark:text-slate-600 tracking-[0.2em]">
                                                    {new Date(complaint.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-black tracking-tight text-slate-800 group-hover:text-blue-600 transition-colors dark:text-slate-200 dark:group-hover:text-blue-400 uppercase italic">
                                                {complaint.title}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-12">
                                        <div className={cn(
                                            "font-black text-[10px] tracking-[0.2em] px-6 py-3 rounded-2xl border transition-all uppercase shadow-sm italic",
                                            complaint.status === "PENDING" && "bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-500 shadow-amber-900/5",
                                            complaint.status === "IN_PROGRESS" && "bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-500 shadow-blue-900/5",
                                            complaint.status === "RESOLVED" && "bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400 shadow-emerald-900/5",
                                            complaint.status === "CLOSED" && "bg-slate-50 border-slate-100 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-600"
                                        )}>
                                            {complaint.status.replace('_', ' ')}
                                        </div>
                                        <div className="h-14 w-14 rounded-2xl border border-slate-100 flex items-center justify-center group-hover:bg-slate-950 group-hover:text-white group-hover:border-slate-950 transition-all dark:border-slate-800 dark:group-hover:bg-white dark:group-hover:text-slate-950 dark:group-hover:border-white shadow-xl shadow-slate-200/20">
                                            <ArrowUpRight className="h-6 w-6" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-32 bg-slate-50/50 border-4 border-dashed border-slate-100 rounded-[3rem] dark:bg-slate-900/20 dark:border-slate-800 transition-colors hover:bg-white dark:hover:bg-slate-900/40 cursor-default">
                            <div className="flex flex-col items-center gap-6 opacity-20 group-hover:opacity-40 transition-opacity">
                                <FileText className="h-20 w-20 text-slate-300" />
                                <div className="space-y-2">
                                    <span className="text-xl font-black text-slate-400 uppercase tracking-[0.4em] block dark:text-slate-500">Registry Clear</span>
                                    <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">No active compliant traces detected in system buffers</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    )
}
