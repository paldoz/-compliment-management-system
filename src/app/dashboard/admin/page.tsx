"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import {
    FileText,
    Clock,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ChevronRight,
    TrendingUp,
    Building2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { StatsDetailModal } from "@/components/dashboard/StatsDetailModal"

interface Stats {
    total: number
    pending: number
    inProgress: number
    resolved: number
    recent: any[]
    organization?: {
        id: string
        name: string
        description?: string
        _count: { departments: number; complaints: number; users: number }
    }
}

export default function AdminDashboard() {
    const { data: session } = useSession()
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)
    const [mounted, setMounted] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedStat, setSelectedStat] = useState<{ type: "total" | "pending" | "inProgress" | "resolved", title: string } | null>(null)

    useEffect(() => {
        setMounted(true)
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/admin/stats")
                const data = await res.json()
                setStats(data?.error ? null : data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
        // Auto-refresh every 60 seconds
        const timer = setInterval(fetchStats, 60000)
        return () => clearInterval(timer)
    }, [])

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary/20 dark:text-blue-500/20" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-300 dark:text-slate-600">Synchronizing Board...</span>
                </div>
            </div>
        )
    }

    const statCards = [
        { label: "Total Reports", value: stats?.total || 0, icon: FileText, desc: "Lifetime Volume", color: "text-blue-500 bg-blue-50", type: "total" as const },
        { label: "Pending Review", value: stats?.pending || 0, icon: Clock, desc: "Awaiting Action", color: "text-amber-500 bg-amber-50", type: "pending" as const },
        { label: "In Progress", value: stats?.inProgress || 0, icon: Loader2, desc: "Active Investigations", color: "text-purple-500 bg-purple-50", type: "inProgress" as const },
        { label: "Resolved", value: stats?.resolved || 0, icon: CheckCircle2, desc: "Successful Closures", color: "text-emerald-500 bg-emerald-50", type: "resolved" as const },
    ]

    const handleCardClick = (card: typeof statCards[0]) => {
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
        return `/api/admin/complaints${statusMap[type] || ""}`
    }

    return (
        <div className="space-y-6 md:space-y-10 pb-16 md:pb-24 px-2 md:px-0">



            {/* World-Class 'Secure Hub' Mirror Glass Hero (Admin - Compact) */}
            {stats?.organization && (
                <div className="relative overflow-hidden group rounded-2xl lg:rounded-[2.5rem] p-6 lg:p-10 bg-slate-950 border border-white/5 shadow-2xl transition-all duration-700 shadow-blue-900/10">
                    {/* Branding-Integrated Background Texture */}
                    <div
                        className="absolute inset-0 z-0 opacity-20 bg-cover bg-center transition-transform duration-[20000ms] group-hover:scale-110"
                        style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                    />

                    {/* Security Radial Flows (Blue & Emerald) */}
                    <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-blue-600/20 blur-[130px] rounded-full animate-pulse" />
                        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[70%] bg-emerald-500/15 blur-[100px] rounded-full animate-pulse delay-700" />
                    </div>

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-10">
                        <div className="space-y-4 lg:space-y-6">
                            <div className="space-y-1 lg:space-y-2">
                                <div className="flex items-center gap-5">
                                    <div className="h-[2px] w-12 bg-gradient-to-r from-blue-500 to-transparent rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                    <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.6em] text-blue-400">Administrative Command Hub</span>
                                </div>
                                <h1 className="text-3xl lg:text-6xl font-black tracking-tighter leading-none text-white uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white/70 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                    {stats.organization.name}
                                </h1>
                            </div>

                            <div className="flex flex-wrap items-center gap-6 lg:gap-8 py-3 px-8 bg-white/5 backdrop-blur-3xl rounded-[1.5rem] border border-white/10 w-fit">
                                <div className="text-center group/stat">
                                    <div className="text-2xl lg:text-3xl font-black tracking-tighter text-white group-hover/stat:text-blue-400 transition-colors tabular-nums">{stats.organization._count.departments}</div>
                                    <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Departments</div>
                                </div>
                                <div className="h-8 w-[1px] bg-white/10" />
                                <div className="text-center group/stat">
                                    <div className="text-2xl lg:text-3xl font-black tracking-tighter text-white group-hover/stat:text-blue-400 transition-colors tabular-nums">{stats.organization._count.complaints}</div>
                                    <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Registry Vol</div>
                                </div>
                                <div className="h-8 w-[1px] bg-white/10" />
                                <div className="text-center group/stat">
                                    <div className="text-2xl lg:text-3xl font-black tracking-tighter text-blue-400 group-hover/stat:text-blue-300 transition-colors tabular-nums">{stats.organization._count.users}</div>
                                    <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Org Admins</div>
                                </div>
                            </div>
                        </div>

                        <div className="hidden lg:flex items-center justify-center h-40 w-40 rounded-[2.5rem] bg-white/5 border border-white/10 relative group/icon overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity" />
                            <Building2 className="h-16 w-16 text-blue-500 group-hover/icon:scale-110 transition-transform duration-700" />
                        </div>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                    <h1 className="text-xl lg:text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
                        Overview
                    </h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Department Hub
                    </p>
                </div>
                <div className="bg-white/50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[9px] font-black uppercase text-slate-400">Live</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                {statCards.map((card, idx) => (
                    <Card
                        key={card.label}
                        onClick={() => handleCardClick(card)}
                        className={cn(
                            "border-none rounded-xl md:rounded-[2rem] bg-white shadow-lg md:shadow-xl shadow-blue-900/5 hover:shadow-blue-900/10 transition-all group overflow-hidden dark:bg-slate-900 dark:shadow-none",
                            card.value > 0 && "cursor-pointer hover:scale-[1.02] active:scale-95"
                        )}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 md:pb-4 pt-4 md:pt-6 px-4 md:px-6">
                            <CardTitle className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                {card.label}
                            </CardTitle>
                            <div className={cn("p-1.5 md:p-2 rounded-lg md:rounded-xl transition-transform group-hover:scale-110", card.color, "dark:bg-slate-800 dark:text-blue-400")}>
                                <card.icon className="h-3 w-3 md:h-4 md:w-4" />
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
                            <div className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">{card.value}</div>
                            <p className="text-[8px] md:text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1 md:mt-2 dark:text-slate-600">
                                {card.desc} {card.value > 0 && <span className="text-blue-500 hidden md:inline">→</span>}
                            </p>
                        </CardContent>
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
                    role="admin"
                />
            )}

            {/* Recent List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3 dark:text-slate-100">
                        Recent Inbound <TrendingUp className="h-5 w-5 text-primary dark:text-blue-400" />
                    </h2>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest dark:text-slate-600">Active Priority Queue</span>
                </div>

                <Card className="rounded-[2.5rem] border-none bg-white shadow-xl shadow-blue-900/5 overflow-hidden dark:bg-slate-900 dark:shadow-none">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 border-slate-100 hover:bg-slate-50/50 dark:bg-slate-800/20 dark:border-slate-800">
                                <TableHead className="py-5 px-8 font-bold text-slate-400 uppercase text-[10px] tracking-widest dark:text-slate-500">Complaint Title</TableHead>
                                <TableHead className="py-5 font-bold text-slate-400 uppercase text-[10px] tracking-widest dark:text-slate-500">Submitter</TableHead>
                                <TableHead className="py-5 font-bold text-slate-400 uppercase text-[10px] tracking-widest text-center dark:text-slate-500">Status</TableHead>
                                <TableHead className="py-5 px-8 font-bold text-slate-400 uppercase text-[10px] tracking-widest text-right dark:text-slate-500">Timestamp</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.isArray(stats?.recent) && stats.recent.map((complaint, idx) => (
                                <TableRow
                                    key={complaint.id}
                                    className="border-slate-50 hover:bg-slate-950/5 transition-all group animate-in fade-in slide-in-from-bottom-4 fill-mode-both dark:border-slate-800/50 dark:hover:bg-slate-800/20"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    <TableCell className="py-8 px-10">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-extrabold text-slate-900 text-lg group-hover:text-blue-600 transition-colors uppercase italic tracking-tighter dark:text-slate-100 dark:group-hover:text-blue-400">
                                                {complaint.title}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <div className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest dark:text-slate-600 uppercase">Artifact ID::{complaint.id.slice(0, 8)}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-black text-sm text-slate-900 uppercase dark:text-slate-300">{complaint.user.name}</span>
                                            <span className="text-[10px] text-slate-400 font-bold dark:text-slate-500 italic">{complaint.user.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge className={cn(
                                            "rounded-lg font-black uppercase text-[9px] tracking-[0.2em] px-4 py-2 shadow-lg italic transition-all group-hover:scale-110",
                                            complaint.status === "PENDING" && "bg-amber-500 text-white shadow-amber-500/20",
                                            complaint.status === "IN_PROGRESS" && "bg-blue-600 text-white shadow-blue-600/20",
                                            complaint.status === "RESOLVED" && "bg-emerald-500 text-white shadow-emerald-500/20",
                                            complaint.status === "CLOSED" && "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600"
                                        )}>
                                            {complaint.status.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right px-10 font-black text-xs text-slate-400 tabular-nums dark:text-slate-500">
                                        {mounted ? new Date(complaint.createdAt).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: '2-digit'
                                        }).toUpperCase() : ""}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!stats || stats.recent.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-32 text-slate-300 font-bold uppercase tracking-widest text-xs dark:text-slate-700">
                                        No recent records detected in queue
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </div>
    )
}
