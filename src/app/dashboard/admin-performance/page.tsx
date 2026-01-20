"use client"

import { useEffect, useState } from "react"
import { AdminRankings } from "@/components/dashboard/AdminRankings"
import { AdminMetricsTable } from "@/components/dashboard/AdminMetricsTable"
import { AdminAlerts } from "@/components/dashboard/AdminAlerts"
import { ReportsFilters } from "@/components/reports/ReportsFilters"
import { ComplaintSummaryReport } from "@/components/reports/ComplaintSummaryReport"
import { DepartmentReport } from "@/components/reports/DepartmentReport"
import { OrganizationInsights } from "@/components/reports/OrganizationInsights"
import { ComplaintCharts } from "@/components/reports/ComplaintCharts"
import { ReportExporter } from "@/components/reports/ReportExporter"
import { Loader2, TrendingUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminPerformancePage() {
    const [admins, setAdmins] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Reports data state
    const [reportsData, setReportsData] = useState<any>(null)
    const [reportsLoading, setReportsLoading] = useState(false)
    const [filters, setFilters] = useState({
        organizationId: "",
        departmentId: "",
        adminId: "",
        status: "",
        startDate: "",
        endDate: "",
        search: ""
    })

    // Fetch admin metrics (existing functionality - unchanged)
    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const res = await fetch("/api/super-admin/metrics")
                const data = await res.json()
                if (Array.isArray(data)) {
                    setAdmins(data)
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchMetrics()
    }, [])

    // Fetch reports data
    const fetchReportsData = async () => {
        setReportsLoading(true)
        try {
            const params = new URLSearchParams()
            if (filters.organizationId && filters.organizationId !== "all") params.set("organizationId", filters.organizationId)
            if (filters.departmentId && filters.departmentId !== "all") params.set("departmentId", filters.departmentId)
            if (filters.adminId && filters.adminId !== "all") params.set("adminId", filters.adminId)
            if (filters.status && filters.status !== "all") params.set("status", filters.status)
            if (filters.startDate) params.set("startDate", filters.startDate)
            if (filters.endDate) params.set("endDate", filters.endDate)
            if (filters.search) params.set("search", filters.search)

            const res = await fetch(`/api/super-admin/reports?${params.toString()}`)
            const data = await res.json()
            setReportsData(data)
        } catch (error) {
            console.error("Failed to fetch reports:", error)
        } finally {
            setReportsLoading(false)
        }
    }

    // Initial reports fetch
    useEffect(() => {
        fetchReportsData()
    }, [])

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary opacity-20" />
            </div>
        )
    }

    return (
        <div className="space-y-4 lg:space-y-12 pb-8 md:pb-12">
            {/* World-Class 'Resolution Analytics' Mirror Glass Hero (Compact) */}
            <div className="relative overflow-hidden group rounded-2xl lg:rounded-[2.5rem] p-6 lg:p-10 bg-slate-950 border border-white/5 shadow-2xl transition-all duration-700 shadow-blue-900/10">
                {/* Branding-Integrated Background Texture */}
                <div
                    className="absolute inset-0 z-0 opacity-20 bg-cover bg-center transition-transform duration-[20000ms] group-hover:scale-110 contrast-[1.1]"
                    style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                />

                {/* Authority Radial Flows (Emerald & Blue) */}
                <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-emerald-500/15 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[70%] bg-blue-600/15 blur-[100px] rounded-full animate-pulse delay-700" />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10">
                    <div className="space-y-4 lg:space-y-6">
                        <div className="space-y-1 lg:space-y-2">
                            <div className="flex items-center gap-5">
                                <div className="h-[2px] w-12 bg-gradient-to-r from-emerald-500 to-transparent rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.6em] text-emerald-400">Resolution Analytics</span>
                            </div>
                            <h1 className="text-3xl lg:text-5xl font-black tracking-tighter leading-none text-white uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-100 to-white/70 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                Admin <span className="text-emerald-500">Performance</span>
                            </h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 backdrop-blur-2xl p-2.5 px-6 rounded-2xl">
                                <div className="h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Surveillance Pulse</span>
                                    <span className="text-sm font-black text-white italic">Real-time Metrics</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-emerald-500/5 border border-emerald-500/20 backdrop-blur-2xl p-2.5 px-6 rounded-2xl">
                                <div className="text-right">
                                    <div className="text-xl lg:text-2xl font-black tracking-tighter text-emerald-400 flex items-center gap-2 tabular-nums">
                                        {admins.length}
                                    </div>
                                    <div className="text-[7px] font-bold text-emerald-500/50 uppercase tracking-[0.3em]">Tracked Nodes</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:flex flex-col items-end gap-1 text-right opacity-30 group-hover:opacity-60 transition-opacity">
                        <div className="text-[60px] font-black tracking-tighter text-white/5 leading-none">KPI</div>
                        <div className="text-[8px] font-black text-white/50 tracking-[1em] uppercase">Intelligence Layer Alpha</div>
                    </div>
                </div>
            </div>

            <AdminAlerts admins={admins} />

            <AdminRankings admins={admins} />

            <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white px-1">Detailed Metrics</h2>
                <AdminMetricsTable admins={admins} />
            </div>

            {/* ================================================== */}
            {/* NEW REPORTS SECTION - Everything below is new */}
            {/* ================================================== */}

            {/* Section Divider */}
            <div className="relative py-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-slate-50 dark:bg-slate-950 px-6 text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
                        Extended Reports
                    </span>
                </div>
            </div>

            {/* Reports Tabs */}
            <Tabs defaultValue="summary" className="space-y-6">
                <TabsList className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-1 rounded-xl">
                    <TabsTrigger value="summary" className="text-xs font-bold data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg px-4">
                        Summary
                    </TabsTrigger>
                    <TabsTrigger value="departments" className="text-xs font-bold data-[state=active]:bg-violet-500 data-[state=active]:text-white rounded-lg px-4">
                        Departments
                    </TabsTrigger>
                    <TabsTrigger value="organizations" className="text-xs font-bold data-[state=active]:bg-amber-500 data-[state=active]:text-white rounded-lg px-4">
                        Organizations
                    </TabsTrigger>
                    <TabsTrigger value="charts" className="text-xs font-bold data-[state=active]:bg-pink-500 data-[state=active]:text-white rounded-lg px-4">
                        Visual Analytics
                    </TabsTrigger>
                </TabsList>

                {/* Filters - Always visible */}
                {reportsData && (
                    <ReportsFilters
                        filterOptions={reportsData.filterOptions || { organizations: [], departments: [], admins: [] }}
                        filters={filters}
                        onFiltersChange={setFilters}
                        onApply={fetchReportsData}
                    />
                )}

                {/* Export Section */}
                {reportsData && (
                    <ReportExporter
                        data={{
                            complaints: reportsData.complaints || [],
                            summary: reportsData.summary || { totalComplaints: 0, statusCounts: { PENDING: 0, APPROVED: 0, RESOLVED: 0, REJECTED: 0 } },
                            departmentStats: reportsData.departmentStats || []
                        }}
                    />
                )}

                {reportsLoading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary opacity-20" />
                    </div>
                ) : reportsData ? (
                    <>
                        <TabsContent value="summary" className="space-y-6 mt-0">
                            <ComplaintSummaryReport
                                summary={reportsData.summary || { totalComplaints: 0, statusCounts: { PENDING: 0, APPROVED: 0, RESOLVED: 0, REJECTED: 0 }, complaintsPerOrg: [] }}
                            />
                        </TabsContent>

                        <TabsContent value="departments" className="space-y-6 mt-0">
                            <DepartmentReport
                                departmentStats={reportsData.departmentStats || []}
                                repeatedComplaintsDepts={reportsData.repeatedComplaintsDepts || []}
                                repeatedIssues={reportsData.repeatedIssues || []}
                            />
                        </TabsContent>

                        <TabsContent value="organizations" className="space-y-6 mt-0">
                            <OrganizationInsights orgInsights={reportsData.orgInsights || []} />
                        </TabsContent>

                        <TabsContent value="charts" className="space-y-6 mt-0">
                            <ComplaintCharts
                                departmentStats={reportsData.departmentStats || []}
                                statusCounts={reportsData.summary?.statusCounts || { PENDING: 0, APPROVED: 0, RESOLVED: 0, REJECTED: 0 }}
                                dailyTrends={reportsData.dailyTrends || []}
                                monthlyTrends={reportsData.monthlyTrends || []}
                            />
                        </TabsContent>
                    </>
                ) : (
                    <div className="text-center py-12 text-slate-400">Failed to load reports data</div>
                )}
            </Tabs>
        </div>
    )
}
