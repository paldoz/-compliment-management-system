"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Loader2, FileText, Clock, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Complaint {
    id: string
    title: string
    status: string
    priority: string
    createdAt: string
    department?: { name: string }
    user?: { name: string; email: string }
}

interface StatsDetailModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    type: "total" | "pending" | "inProgress" | "resolved"
    title: string
    apiUrl: string
    role: "user" | "admin"
}

const typeConfig = {
    total: {
        icon: FileText,
        color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
        headerBg: "from-blue-600 to-blue-700"
    },
    pending: {
        icon: Clock,
        color: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
        headerBg: "from-amber-500 to-amber-600"
    },
    inProgress: {
        icon: AlertCircle,
        color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
        headerBg: "from-purple-600 to-purple-700"
    },
    resolved: {
        icon: CheckCircle2,
        color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
        headerBg: "from-emerald-600 to-emerald-700"
    }
}

export function StatsDetailModal({
    isOpen,
    onOpenChange,
    type,
    title,
    apiUrl,
    role
}: StatsDetailModalProps) {
    const [loading, setLoading] = useState(true)
    const [complaints, setComplaints] = useState<Complaint[]>([])

    const config = typeConfig[type]
    const Icon = config.icon

    useEffect(() => {
        if (isOpen) {
            fetchData()
        }
    }, [isOpen, type])

    const fetchData = async () => {
        setLoading(true)
        try {
            const res = await fetch(apiUrl)
            if (res.ok) {
                const data = await res.json()
                setComplaints(Array.isArray(data) ? data : [])
            }
        } catch (error) {
            console.error("Failed to fetch details:", error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
            IN_PROGRESS: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
            RESOLVED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
            CLOSED: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500",
            APPROVED: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
            REJECTED: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
        }
        return styles[status] || styles.PENDING
    }

    const getPriorityBadge = (priority: string) => {
        const styles: Record<string, string> = {
            LOW: "border-slate-200 text-slate-500 dark:border-slate-700",
            MEDIUM: "border-amber-200 text-amber-600 dark:border-amber-500/30 dark:text-amber-400",
            HIGH: "border-red-200 text-red-600 dark:border-red-500/30 dark:text-red-400"
        }
        return styles[priority] || styles.MEDIUM
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="w-full h-full max-w-none rounded-none sm:rounded-3xl sm:max-w-2xl sm:h-auto sm:max-h-[85vh] border-none shadow-2xl p-0 overflow-hidden flex flex-col bg-white dark:bg-slate-950">
                {/* Header */}
                <div className={cn("p-4 sm:p-6 text-white relative overflow-hidden shrink-0 border-b border-white/5 group bg-slate-950")}>
                    {/* Branding texture */}
                    <div
                        className="absolute inset-0 z-0 opacity-20 bg-cover bg-center mix-blend-overlay transition-transform duration-[20000ms] group-hover:scale-110"
                        style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                    />

                    {/* Dynamic Radial Flows based on Type */}
                    <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                        <div className={cn(
                            "absolute top-[-20%] right-[-10%] w-[60%] h-[80%] blur-[100px] rounded-full animate-pulse",
                            type === 'total' && "bg-blue-600/20",
                            type === 'pending' && "bg-amber-600/20",
                            type === 'inProgress' && "bg-purple-600/20",
                            type === 'resolved' && "bg-emerald-600/20"
                        )} />
                        <div className={cn(
                            "absolute bottom-[-20%] left-[-10%] w-[50%] h-[70%] blur-[80px] rounded-full animate-pulse delay-700",
                            type === 'total' && "bg-indigo-500/10",
                            type === 'pending' && "bg-orange-500/10",
                            type === 'inProgress' && "bg-fuchsia-500/10",
                            type === 'resolved' && "bg-teal-500/10"
                        )} />
                    </div>

                    <DialogHeader className="relative z-10">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className={cn(
                                "h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-2xl transition-transform group-hover:scale-110",
                                type === 'total' && "bg-blue-500/10 text-blue-400",
                                type === 'pending' && "bg-amber-500/10 text-amber-400",
                                type === 'inProgress' && "bg-purple-500/10 text-purple-400",
                                type === 'resolved' && "bg-emerald-500/10 text-emerald-400"
                            )}>
                                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg sm:text-xl font-black tracking-tighter uppercase italic leading-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                                    {title}
                                </DialogTitle>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <div className={cn(
                                        "h-1.5 w-1.5 rounded-full animate-pulse",
                                        type === 'total' && "bg-blue-500",
                                        type === 'pending' && "bg-amber-500",
                                        type === 'inProgress' && "bg-purple-500",
                                        type === 'resolved' && "bg-emerald-500"
                                    )} />
                                    <DialogDescription className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[8px] sm:text-[10px]">
                                        {complaints.length} Records Detected in Active Queue
                                    </DialogDescription>
                                </div>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-50/30 dark:bg-slate-950">
                    {loading ? (
                        <div className="flex items-center justify-center h-48">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : complaints.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            <Icon className="h-12 w-12 mx-auto mb-3 opacity-20" />
                            <p className="font-medium">No complaints in this category</p>
                        </div>
                    ) : (
                        <div className="space-y-2 sm:space-y-3">
                            {complaints.slice(0, 15).map((complaint) => (
                                <Link
                                    key={complaint.id}
                                    href={`/dashboard/complaints?id=${complaint.id}`}
                                    onClick={() => onOpenChange(false)}
                                    className="block active:scale-[0.98] transition-transform"
                                >
                                    <div className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:shadow-lg hover:border-primary/30 dark:hover:border-blue-500/30 transition-all cursor-pointer">
                                        <div className="flex items-start justify-between gap-3 sm:gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                                                    <h4 className="font-bold text-sm sm:text-base text-slate-800 dark:text-white truncate group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">
                                                        {complaint.title}
                                                    </h4>
                                                </div>
                                                <div className="flex items-center gap-2 text-[9px] sm:text-xs text-slate-400 mb-2 sm:mb-0">
                                                    {complaint.department && (
                                                        <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-tight text-slate-500 dark:text-slate-400">
                                                            {complaint.department.name}
                                                        </span>
                                                    )}
                                                    <span className="hidden sm:inline">•</span>
                                                    <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 sm:gap-2 shrink-0">
                                                <div className="flex items-center gap-1.5 sm:gap-2">
                                                    <Badge variant="outline" className={cn("text-[8px] sm:text-[9px] font-black uppercase px-2 py-0 sm:py-0.5", getPriorityBadge(complaint.priority))}>
                                                        {complaint.priority}
                                                    </Badge>
                                                    <Badge className={cn("text-[8px] sm:text-[9px] font-black uppercase border-none px-2 py-0.5 sm:py-1", getStatusBadge(complaint.status))}>
                                                        {complaint.status.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                                <ArrowRight className="hidden sm:block h-4 w-4 text-slate-300 group-hover:text-primary dark:group-hover:text-blue-400 transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}

                            {complaints.length > 10 && (
                                <div className="text-center pt-4">
                                    <Link
                                        href={`/dashboard/complaints${type !== 'total' ? `?status=${type === 'inProgress' ? 'IN_PROGRESS' : type.toUpperCase()}` : ''}`}
                                        onClick={() => onOpenChange(false)}
                                        className="text-sm font-bold text-primary dark:text-blue-400 hover:underline"
                                    >
                                        View all {complaints.length} complaints →
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
