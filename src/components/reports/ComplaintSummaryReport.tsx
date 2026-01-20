"use client"

import { Building2, Clock, CheckCircle2, AlertCircle, XCircle } from "lucide-react"

interface SummaryData {
    totalComplaints: number
    statusCounts: {
        PENDING: number
        APPROVED: number
        RESOLVED: number
        REJECTED: number
    }
    complaintsPerOrg: { id: string; name: string; count: number }[]
}

export function ComplaintSummaryReport({ summary }: { summary: SummaryData }) {
    const statusCards = [
        {
            label: "Pending",
            value: summary.statusCounts.PENDING,
            icon: Clock,
            color: "amber",
            bgClass: "bg-amber-50 dark:bg-amber-500/10",
            textClass: "text-amber-600 dark:text-amber-400",
            borderClass: "border-amber-200 dark:border-amber-500/20"
        },
        {
            label: "Approved / In Progress",
            value: summary.statusCounts.APPROVED,
            icon: CheckCircle2,
            color: "blue",
            bgClass: "bg-blue-50 dark:bg-blue-500/10",
            textClass: "text-blue-600 dark:text-blue-400",
            borderClass: "border-blue-200 dark:border-blue-500/20"
        },
        {
            label: "Resolved / Closed",
            value: summary.statusCounts.RESOLVED,
            icon: CheckCircle2,
            color: "emerald",
            bgClass: "bg-emerald-50 dark:bg-emerald-500/10",
            textClass: "text-emerald-600 dark:text-emerald-400",
            borderClass: "border-emerald-200 dark:border-emerald-500/20"
        },
        {
            label: "Rejected",
            value: summary.statusCounts.REJECTED,
            icon: XCircle,
            color: "red",
            bgClass: "bg-red-50 dark:bg-red-500/10",
            textClass: "text-red-600 dark:text-red-400",
            borderClass: "border-red-200 dark:border-red-500/20"
        }
    ]

    return (
        <div className="space-y-6">
            {/* Section Header */}
            <div className="relative overflow-hidden group rounded-2xl lg:rounded-[2rem] p-6 lg:p-8 bg-slate-950 border border-white/5 shadow-2xl">
                {/* Branding Background */}
                <div
                    className="absolute inset-0 z-0 opacity-20 bg-cover bg-center transition-transform duration-[20000ms] group-hover:scale-110 contrast-[1.1]"
                    style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                />

                {/* Radial Glows */}
                <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[70%] bg-cyan-500/15 blur-[100px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[60%] bg-blue-600/15 blur-[80px] rounded-full animate-pulse delay-500" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-[2px] w-10 bg-gradient-to-r from-cyan-500 to-transparent rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
                        <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400">Complaint Analytics</span>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-black tracking-tighter leading-none text-white uppercase italic">
                        Summary <span className="text-cyan-500">Report</span>
                    </h2>
                    <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-2xl p-2 px-4 rounded-xl">
                            <div className="h-6 w-6 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30">
                                <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Total Complaints</span>
                                <span className="text-lg font-black text-white tabular-nums">{summary.totalComplaints}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statusCards.map((card) => (
                    <div
                        key={card.label}
                        className={`relative overflow-hidden group/card rounded-2xl p-5 bg-white dark:bg-slate-900 border ${card.borderClass} shadow-sm transition-all hover:shadow-lg hover:scale-[1.02]`}
                    >
                        <div
                            className="absolute inset-0 z-0 opacity-[0.02] dark:opacity-[0.04] bg-cover bg-center pointer-events-none"
                            style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                        />
                        <div className="relative z-10">
                            <div className={`p-2.5 ${card.bgClass} rounded-xl w-fit mb-3`}>
                                <card.icon className={`h-5 w-5 ${card.textClass}`} />
                            </div>
                            <div className={`text-3xl font-black ${card.textClass} tabular-nums`}>{card.value}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{card.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Complaints Per Organization */}
            <div className="relative overflow-hidden group rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                <div
                    className="absolute inset-0 z-0 opacity-[0.02] dark:opacity-[0.04] bg-cover bg-center pointer-events-none"
                    style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                />
                <div className="relative z-10 p-5 lg:p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                            <Building2 className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Complaints Per Organization</h4>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Ranked by volume</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {summary.complaintsPerOrg.slice(0, 10).map((org, index) => (
                            <div key={org.id} className="flex items-center gap-4">
                                <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{org.name}</span>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">{org.count}</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min((org.count / (summary.complaintsPerOrg[0]?.count || 1)) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {summary.complaintsPerOrg.length === 0 && (
                            <div className="text-center py-8 text-slate-400 text-sm">No organization data available</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
