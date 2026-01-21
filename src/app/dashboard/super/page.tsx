"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import {
    Users,
    MessageSquare,
    CheckCircle2,
    Clock,
    Loader2,
    TrendingUp,
    BarChart3,
    ArrowUpRight,
    Building2,
    Check
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface GlobalStats {
    totalUsers: number
    totalOrganizations: number
    totalComplaints: number
    totalDepartments: number
    pendingComplaints: number
    inProgressComplaints: number
    resolvedComplaints: number
    miscComplaints: number
    totalAdmins: number
    recentComplaints: any[]
    recentOrganizations: any[]
    departmentVolume: { name: string, count: number }[]
    auditLogs: any[]
}

export default function SuperDashboard() {
    const { data: session } = useSession()
    const [stats, setStats] = useState<GlobalStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [mounted, setMounted] = useState(false)

    // Modal Data States
    const [viewData, setViewData] = useState<any[]>([])
    const [viewType, setViewType] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalLoading, setModalLoading] = useState(false)

    useEffect(() => {
        setMounted(true)
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/superadmin/stats")
                const data = await res.json()
                setStats(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
        const interval = setInterval(fetchStats, 30000)
        return () => clearInterval(interval)
    }, [])

    const handleViewDetails = async (type: string) => {
        setViewType(type)
        setIsModalOpen(true)
        setModalLoading(true)
        try {
            let data: any = null

            if (type === "Organizations") {
                const res = await fetch("/api/superadmin/organizations")
                data = await res.json()
                setViewData(Array.isArray(data) ? data : data.organizations || [])
            } else {
                let endpoint = ""
                if (type === "Users" || type === "Admins") {
                    endpoint = "/api/superadmin/users"
                } else if (type === "Complaints") {
                    endpoint = "/api/superadmin/stats"
                }

                if (!endpoint) return

                const res = await fetch(endpoint)
                data = await res.json()

                const rawUsers = Array.isArray(data.users) ? data.users : Array.isArray(data) ? data : []

                if (type === "Users") {
                    setViewData(rawUsers.filter((u: any) => u.role === "USER"))
                } else if (type === "Admins") {
                    setViewData(rawUsers.filter((u: any) => u.role === "ORG_ADMIN"))
                } else if (type === "Complaints") {
                    setViewData(Array.isArray(data.recentComplaints) ? data.recentComplaints : stats?.recentComplaints || [])
                }
            }
        } catch (err) {
            console.error(err)
        } finally {
            setModalLoading(false)
        }
    }

    const statCards = [
        {
            label: "Total Organizations",
            value: stats?.totalOrganizations ?? 0,
            icon: Building2,
            desc: "Active Entities",
            color: "text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400",
            onClick: () => handleViewDetails("Organizations")
        },
        {
            label: "Total Users",
            value: stats?.totalUsers ?? 0,
            icon: Users,
            desc: "System Nodes",
            color: "text-purple-600 bg-purple-50 dark:bg-purple-500/10 dark:text-purple-400",
            onClick: () => handleViewDetails("Users")
        },
        {
            label: "Global Registry",
            value: stats?.totalComplaints ?? 0,
            icon: MessageSquare,
            desc: "Complaint Vol",
            color: "text-slate-600 bg-slate-50 dark:bg-slate-500/10 dark:text-slate-400",
            onClick: () => handleViewDetails("Complaints")
        },
        {
            label: "Active Admins",
            value: stats?.totalAdmins ?? 0,
            icon: Shield,
            desc: "Personnel Assets",
            color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400",
            onClick: () => handleViewDetails("Admins")
        },
    ]

    return (
        <div className="space-y-4 lg:space-y-12 pb-8">
            {/* World-Class 'Global Authority' Hero Section (Super Admin - Compact) */}
            <div className="relative overflow-hidden group rounded-2xl lg:rounded-[2.5rem] p-6 lg:p-10 bg-slate-950 border border-white/5 shadow-2xl transition-all duration-700 shadow-blue-900/10">
                {/* Branding-Integrated Background Texture */}
                <div
                    className="absolute inset-0 z-0 opacity-20 bg-cover bg-center transition-transform duration-[20000ms] group-hover:scale-110 contrast-[1.2] hue-rotate-[20deg]"
                    style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                />

                {/* Authority Radial Flows (Blue & Rose) */}
                <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[80%] bg-blue-600/15 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[70%] bg-rose-500/10 blur-[100px] rounded-full animate-pulse delay-700" />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10">
                    <div className="space-y-4 lg:space-y-6">
                        <div className="space-y-1 lg:space-y-2">
                            <div className="flex items-center gap-5">
                                <div className="h-[2px] w-12 bg-gradient-to-r from-blue-500 to-transparent rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.6em] text-blue-400">System Root Authority</span>
                            </div>
                            <h1 className="text-3xl lg:text-6xl font-black tracking-tighter leading-none text-white uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-white/70 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                Global <span className="text-blue-500">Registry</span> Control
                            </h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 backdrop-blur-2xl p-2.5 px-6 rounded-2xl">
                                <div className="h-8 w-8 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/30">
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Architect Node</span>
                                    <span className="text-sm font-black text-white italic">{session?.user?.name}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-emerald-500/5 border border-emerald-500/20 backdrop-blur-2xl p-2.5 px-6 rounded-2xl">
                                <div className="text-right">
                                    <div className="text-xl lg:text-2xl font-black tracking-tighter text-emerald-400 flex items-center gap-2">
                                        100%
                                    </div>
                                    <div className="text-[7px] font-bold text-emerald-500/50 uppercase tracking-[0.3em]">Network Integrity</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:flex flex-col items-end gap-1 text-right opacity-30 group-hover:opacity-60 transition-opacity">
                        <div className="text-[70px] font-black tracking-tighter text-white/5 leading-none">CMS</div>
                        <div className="text-[8px] font-black text-white/50 tracking-[1em] uppercase">Security Protocol Alpha</div>
                    </div>
                </div>
            </div>

            {/* Global Metric Core - 2x2 Grid on mobile */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-8">
                {statCards.map((card: any, idx: number) => (
                    <Card
                        key={idx}
                        className={cn(
                            "group relative border-none rounded-2xl lg:rounded-[2.5rem] p-4 lg:p-10 transition-all duration-500 overflow-hidden shadow-xl",
                            "bg-white dark:bg-slate-900 dark:border dark:border-slate-800",
                            idx === 0 && "ring-1 ring-blue-500/10 dark:ring-blue-500/20 shadow-blue-900/5",
                            card.value > 0 && "cursor-pointer active:scale-95 lg:hover:scale-[1.02]"
                        )}
                        onClick={() => card.onClick?.()}
                    >
                        <div className="flex flex-row items-center justify-between mb-3 lg:mb-10 relative z-10">
                            <span className="text-[9px] lg:text-[11px] font-black uppercase tracking-wider lg:tracking-[0.2em] text-slate-400 group-hover:text-blue-500 transition-colors truncate">
                                {card.label}
                            </span>
                            <div className={cn("h-8 w-8 lg:h-14 lg:w-14 rounded-xl lg:rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner", card.color)}>
                                <card.icon className="h-4 w-4 lg:h-7 lg:w-7" />
                            </div>
                        </div>
                        <div className="relative z-10 transition-transform duration-500 group-hover:translate-x-1">
                            <div className="text-3xl lg:text-7xl font-black tracking-tighter mb-1 lg:mb-3 tabular-nums dark:text-white">{card.value}</div>
                            <p className="text-[8px] lg:text-[11px] font-bold lg:font-black lg:italic uppercase tracking-wide lg:tracking-[0.1em] text-slate-500 line-clamp-1">{card.desc}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="w-full h-full max-w-none sm:max-w-xl sm:h-auto sm:max-h-[85vh] p-0 overflow-hidden rounded-none sm:rounded-2xl border-none shadow-2xl dark:bg-slate-950">
                    <DialogHeader className="p-5 sm:p-8 bg-slate-900 text-white relative overflow-hidden dark:bg-slate-950 shrink-0 border-b border-white/5">
                        {/* Branding texture */}
                        <div
                            className="absolute inset-0 z-0 opacity-20 bg-cover bg-center mix-blend-overlay"
                            style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                        />
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-[40px] rounded-full dark:bg-blue-900/20" />
                        <DialogTitle className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight z-10">{viewType} Registry</DialogTitle>
                        <DialogDescription className="text-blue-100 font-medium z-10 text-[10px] sm:text-xs dark:text-slate-400">Surveillance data: {viewType?.toLowerCase()}.</DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 min-h-0 p-3 sm:p-6 bg-white dark:bg-slate-950">
                        <ScrollArea className="h-[350px] pr-4">
                            {modalLoading ? (
                                <div className="flex h-40 items-center justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-slate-100 hover:bg-transparent dark:border-slate-800">
                                            {viewType === "Complaints" ? (
                                                <>
                                                    <TableHead className="font-black uppercase text-[9px] tracking-widest text-slate-400 dark:text-slate-600 px-2">Subject</TableHead>
                                                    <TableHead className="hidden sm:table-cell font-black uppercase text-[9px] tracking-widest text-slate-400 dark:text-slate-600">Org</TableHead>
                                                    <TableHead className="font-black uppercase text-[9px] tracking-widest text-slate-400 dark:text-slate-600 text-right px-2">Status</TableHead>
                                                </>
                                            ) : viewType === "Organizations" ? (
                                                <>
                                                    <TableHead className="font-black uppercase text-[9px] tracking-widest text-slate-400 dark:text-slate-600 px-2">Org</TableHead>
                                                    <TableHead className="font-black uppercase text-[9px] tracking-widest text-slate-400 dark:text-slate-600 px-2">Status</TableHead>
                                                    <TableHead className="font-black uppercase text-[9px] tracking-widest text-slate-400 dark:text-slate-600 text-right px-2">Act</TableHead>
                                                </>
                                            ) : (
                                                <>
                                                    <TableHead className="font-black uppercase text-[9px] tracking-widest text-slate-400 dark:text-slate-600 px-2">Identity</TableHead>
                                                    <TableHead className="font-black uppercase text-[9px] tracking-widest text-slate-400 dark:text-slate-600 text-right px-2">Role</TableHead>
                                                </>
                                            )}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Array.isArray(viewData) && viewData.map((item, idx) => (
                                            <TableRow key={idx} className="border-slate-50 hover:bg-slate-50/50 transition-colors dark:border-slate-800/50 dark:hover:bg-slate-800/20">
                                                {viewType === "Complaints" ? (
                                                    <>
                                                        <TableCell className="px-2">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-slate-900 text-[11px] sm:text-xs dark:text-slate-200 line-clamp-1">{item.title}</span>
                                                                <span className="sm:hidden text-[9px] text-slate-400 uppercase font-medium">{item.organization?.name}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="hidden sm:table-cell text-slate-500 font-medium text-[10px] uppercase dark:text-slate-400">{item.organization?.name}</TableCell>
                                                        <TableCell className="text-right px-2">
                                                            <Badge className={cn(
                                                                "font-bold text-[8px] sm:text-[10px] uppercase tracking-widest px-2 sm:py-1.5 rounded-lg sm:rounded-xl border-none",
                                                                item.status === "RESOLVED" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" :
                                                                    item.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400" : "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                                                            )}>{item.status}</Badge>
                                                        </TableCell>
                                                    </>
                                                ) : viewType === "Organizations" ? (
                                                    <>
                                                        <TableCell className="px-2">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-slate-900 text-[11px] sm:text-xs dark:text-slate-200 truncate max-w-[80px] sm:max-w-none">{item.name}</span>
                                                                <span className="text-[8px] text-slate-400 font-mono tracking-tight dark:text-slate-500">{item.slug}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="px-2">
                                                            <Badge className={cn(
                                                                "font-bold text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-lg border-none",
                                                                item.isActive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-500"
                                                            )}>{item.isActive ? "Act" : "Arc"}</Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right px-2">
                                                            <Link href="/dashboard/super/organizations">
                                                                <div className="inline-flex items-center gap-0.5 text-[9px] font-black text-blue-600 hover:text-blue-700 uppercase dark:text-blue-400">
                                                                    <ArrowUpRight className="h-3 w-3" />
                                                                </div>
                                                            </Link>
                                                        </TableCell>
                                                    </>
                                                ) : (
                                                    <>
                                                        <TableCell className="px-2">
                                                            <div className="flex items-center gap-2 sm:gap-3">
                                                                <Avatar className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg">
                                                                    <AvatarImage src={item.image || `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(item.username || item.name)}&top=${item.gender === 'FEMALE' ? 'longButNotTooLong,straight01,straight02' : 'shortFlat,shortRound,theCaesar'}`} />
                                                                    <AvatarFallback className="text-[9px] font-bold bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                                                        {item.name?.[0]?.toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex flex-col">
                                                                    <span className="font-bold text-slate-900 text-[11px] sm:text-xs dark:text-slate-200">{item.name}</span>
                                                                    <span className="text-[8px] sm:text-[10px] text-slate-400 font-medium dark:text-slate-500 truncate max-w-[100px] sm:max-w-none">{item.email}</span>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right px-2">
                                                            <Badge className="font-bold text-[8px] sm:text-[10px] uppercase tracking-widest px-2 sm:py-1.5 rounded-lg sm:rounded-xl border-none bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">{item.role === 'ORG_ADMIN' ? 'Admin' : 'User'}</Badge>
                                                        </TableCell>
                                                    </>
                                                )}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </ScrollArea>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Admin Solved Complaints (Replacing Breakdown) */}
                <Card className="lg:col-span-3 rounded-2xl border border-slate-100 bg-white p-12 relative overflow-hidden shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:shadow-none">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-full blur-3xl dark:bg-emerald-500/5" />
                    <div className="relative z-10 space-y-10">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none dark:text-white">Admin Solved Complaints</h2>
                            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 uppercase tracking-widest font-bold text-[9px] px-4 py-2 flex items-center gap-2 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-400/20">
                                <CheckCircle2 className="h-3 w-3" />
                                Efficiency Milestone
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {loading && !stats ? (
                                <div className="flex flex-col items-center justify-center h-40 gap-4">
                                    <Loader2 className="h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-400" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 dark:text-slate-700">Scanning Resolved Units...</span>
                                </div>
                            ) : (stats as any)?.resolvedComplaints?.length === 0 ? (
                                <div className="text-center py-10 font-medium text-slate-300 italic dark:text-slate-700">
                                    No resolved complaints found in the registry.
                                </div>
                            ) : (stats as any)?.resolvedComplaints?.slice(0, 3).map((complaint: any) => (
                                <div key={complaint.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:p-6 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/10 transition-all group dark:bg-slate-800/50 dark:border-slate-800 dark:hover:border-emerald-500/50">
                                    <div className="flex items-center gap-4 md:gap-5">
                                        <div className="p-3 bg-emerald-100 rounded-xl dark:bg-emerald-500/10 relative overflow-hidden">
                                            <Avatar className="h-6 w-6 absolute inset-0 opacity-20">
                                                <AvatarImage src={complaint.user?.image || `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(complaint.user?.username || complaint.user?.name)}&top=${complaint.user?.gender === 'FEMALE' ? 'longButNotTooLong,straight01,straight02' : 'shortFlat,shortRound,theCaesar'}`} />
                                            </Avatar>
                                            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 relative z-10" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-extrabold text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors uppercase dark:text-slate-200 dark:group-hover:text-emerald-400">{complaint.title}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider dark:text-slate-600">{complaint.organization?.name}</span>
                                                <div className="h-1 w-1 rounded-full bg-slate-200 dark:bg-slate-700" />
                                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest dark:text-emerald-400">RESOLVE</span>
                                                {complaint.auditLogs?.[0]?.user?.name && (
                                                    <>
                                                        <div className="h-1 w-1 rounded-full bg-slate-200 dark:bg-slate-700" />
                                                        <span className="text-[9px] font-bold text-blue-500 uppercase tracking-tight dark:text-blue-400">MOD: {complaint.auditLogs[0].user.name}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 dark:text-slate-500">Solved Date</div>
                                        <div className="text-xs font-bold text-slate-900 tabular-nums dark:text-slate-300">
                                            {mounted ? new Date(complaint.updatedAt).toLocaleDateString() : ""}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-1 gap-12">
                {/* Activity Ledger */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-xl dark:bg-blue-500/10">
                                <TrendingUp className="h-6 w-6 text-primary dark:text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Activity Ledger</h2>
                                <p className="text-[11px] font-medium text-slate-400 mt-0.5 dark:text-slate-500">Last 5 Security Surveillance Logs</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {loading && !stats ? (
                            <div className="py-20 flex flex-col items-center justify-center gap-4 bg-white rounded-2xl border border-dashed border-slate-200 dark:bg-slate-900/50 dark:border-slate-800">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-600/20" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 dark:text-slate-600">Synchronizing Surveillance Logs...</span>
                            </div>
                        ) : stats?.auditLogs && stats.auditLogs.length > 0 ? (
                            stats.auditLogs.slice(0, 5).map((log, idx) => (
                                <div
                                    key={log.id}
                                    className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-900/5 transition-all group animate-in fade-in slide-in-from-bottom-8 fill-mode-both dark:bg-slate-900 dark:border-slate-800 dark:shadow-none dark:hover:bg-slate-800"
                                    style={{ animationDelay: `${idx * 150}ms` }}
                                >
                                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 md:gap-10 flex-1 min-w-0">
                                        <div className="hidden lg:block h-16 w-[3px] bg-blue-600/10 rounded-full group-hover:bg-blue-600 group-hover:h-20 transition-all duration-500 dark:bg-slate-800"></div>
                                        <div className="space-y-2 w-full min-w-0">
                                            <div className="flex flex-wrap items-center gap-3 md:gap-4">
                                                <Badge className="bg-blue-600 text-white font-black text-[9px] uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border-none shadow-lg shadow-blue-600/20 italic whitespace-nowrap">
                                                    {log.action}
                                                </Badge>
                                                <span className="text-[10px] font-black text-slate-300 tabular-nums uppercase tracking-widest dark:text-slate-600">{mounted ? new Date(log.createdAt).toLocaleString().toUpperCase() : ""}</span>
                                            </div>
                                            <h3 className="text-lg md:text-2xl font-black tracking-tighter text-slate-800 group-hover:text-blue-600 transition-colors uppercase italic dark:text-slate-200 dark:group-hover:text-blue-400 break-words leading-tight">
                                                {log.entity}: <span className="text-slate-400 font-bold dark:text-slate-500 not-italic lowercase break-all">{log.details || "No additional details"}</span>
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 px-4 py-2 bg-slate-950 rounded-2xl border border-white/5 shadow-xl self-start lg:self-center">
                                        <Avatar className="h-8 w-8 rounded-xl border border-white/10 shrink-0">
                                            <AvatarImage src={log.user.image || `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(log.user.username || log.user.name)}&top=${log.user.gender === 'FEMALE' ? 'longButNotTooLong,straight01,straight02' : 'shortFlat,shortRound,theCaesar'}`} />
                                            <AvatarFallback className="text-[10px] bg-blue-600 text-white font-black">
                                                {log.user.name?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Moderator</span>
                                            <span className="text-xs font-black text-white uppercase italic tracking-tight truncate">
                                                {log.user.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 dark:bg-slate-900/50 dark:border-slate-800">
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs dark:text-slate-600">Registry activity clear.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function Shield(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        </svg>
    )
}
