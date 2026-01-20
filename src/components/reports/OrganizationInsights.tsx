"use client"

import { Building2, TrendingUp, Award } from "lucide-react"

interface OrgInsight {
    id: string
    name: string
    totalComplaints: number
    resolvedCount: number
    resolutionRate: number
}

export function OrganizationInsights({ orgInsights }: { orgInsights: OrgInsight[] }) {
    const topByVolume = [...orgInsights].sort((a, b) => b.totalComplaints - a.totalComplaints).slice(0, 5)
    const topByResolution = [...orgInsights].filter(o => o.totalComplaints > 0).sort((a, b) => b.resolutionRate - a.resolutionRate).slice(0, 5)

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
                    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[70%] bg-amber-500/15 blur-[100px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[60%] bg-orange-600/15 blur-[80px] rounded-full animate-pulse delay-500" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-[2px] w-10 bg-gradient-to-r from-amber-500 to-transparent rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                        <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.5em] text-amber-400">Organization Intelligence</span>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-black tracking-tighter leading-none text-white uppercase italic">
                        Organization <span className="text-amber-500">Insights</span>
                    </h2>
                    <p className="text-slate-400 text-sm mt-3 max-w-xl">
                        Organizations ranked by complaint volume and resolution efficiency.
                    </p>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Most Complaints */}
                <div className="relative overflow-hidden group rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div
                        className="absolute inset-0 z-0 opacity-[0.02] dark:opacity-[0.04] bg-cover bg-center pointer-events-none"
                        style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                    />
                    <div className="relative z-10 p-5 lg:p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2 bg-rose-50 dark:bg-rose-500/10 rounded-xl">
                                <TrendingUp className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Most Complaints</h4>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Top 5 organizations</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {topByVolume.map((org, index) => (
                                <div key={org.id} className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${index === 0 ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' :
                                        index === 1 ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' :
                                            'bg-slate-50 text-slate-500 dark:bg-slate-800/50 dark:text-slate-500'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">{org.name}</span>
                                            <span className="font-bold text-rose-600 dark:text-rose-400 shrink-0 tabular-nums">{org.totalComplaints}</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1.5">
                                            <div
                                                className="h-full bg-gradient-to-r from-rose-500 to-orange-500 rounded-full"
                                                style={{ width: `${Math.min((org.totalComplaints / (topByVolume[0]?.totalComplaints || 1)) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {topByVolume.length === 0 && (
                                <div className="text-center py-8 text-slate-400 text-sm">No data available</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Highest Resolution Rate */}
                <div className="relative overflow-hidden group rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div
                        className="absolute inset-0 z-0 opacity-[0.02] dark:opacity-[0.04] bg-cover bg-center pointer-events-none"
                        style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                    />
                    <div className="relative z-10 p-5 lg:p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
                                <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Best Resolution Rate</h4>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Top 5 performers</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {topByResolution.map((org, index) => (
                                <div key={org.id} className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${index === 0 ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' :
                                        index === 1 ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' :
                                            'bg-slate-50 text-slate-500 dark:bg-slate-800/50 dark:text-slate-500'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">{org.name}</span>
                                            <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0 tabular-nums">{org.resolutionRate}%</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1.5">
                                            <div
                                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                                                style={{ width: `${org.resolutionRate}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {topByResolution.length === 0 && (
                                <div className="text-center py-8 text-slate-400 text-sm">No data available</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
