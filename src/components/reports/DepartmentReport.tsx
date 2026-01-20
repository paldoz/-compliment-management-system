"use client"

import { Building, AlertTriangle, Clock, CheckCircle2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface DepartmentStat {
    id: string
    name: string
    organization: string
    totalComplaints: number
    unresolvedCount: number
    resolvedCount: number
    avgResolutionTime: number
}

export function DepartmentReport({
    departmentStats,
    repeatedComplaintsDepts,
    repeatedIssues = []
}: {
    departmentStats: DepartmentStat[]
    repeatedComplaintsDepts: DepartmentStat[]
    repeatedIssues?: { title: string; count: number; deptName: string; orgName: string; deptId: string }[]
}) {
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
                    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[70%] bg-violet-500/15 blur-[100px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[60%] bg-indigo-600/15 blur-[80px] rounded-full animate-pulse delay-500" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-[2px] w-10 bg-gradient-to-r from-violet-500 to-transparent rounded-full shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
                        <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.5em] text-violet-400">Department Analytics</span>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-black tracking-tighter leading-none text-white uppercase italic">
                        Department <span className="text-violet-500">Report</span>
                    </h2>
                    <p className="text-slate-400 text-sm mt-3 max-w-xl">
                        Departments with repeated complaints, highest unresolved complaints, and average resolution times.
                    </p>
                </div>
            </div>

            {/* Repeated Complaints Alert */}
            {(repeatedComplaintsDepts.length > 0 || repeatedIssues.length > 0) && (
                <div className="relative overflow-hidden group rounded-2xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 p-5">
                    <div
                        className="absolute inset-0 z-0 opacity-[0.02] dark:opacity-[0.04] bg-cover bg-center pointer-events-none"
                        style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                    />
                    <div className="relative z-10 flex items-start gap-4">
                        <div className="p-2 bg-amber-100 dark:bg-amber-500/10 rounded-xl shrink-0">
                            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="space-y-4 flex-1">
                            <div>
                                <h4 className="font-bold text-amber-900 dark:text-amber-100 text-sm mb-2 uppercase tracking-wide">Departments with High Complaint Volume (5+)</h4>
                                <div className="flex flex-wrap gap-2">
                                    {repeatedComplaintsDepts.map(dept => (
                                        <Badge key={dept.id} variant="outline" className="border-amber-300 text-amber-700 dark:border-amber-500/30 dark:text-amber-400">
                                            {dept.name} ({dept.totalComplaints})
                                        </Badge>
                                    ))}
                                    {repeatedComplaintsDepts.length === 0 && <span className="text-xs text-slate-400 italic">No departments with 5+ complaints.</span>}
                                </div>
                            </div>

                            {repeatedIssues.length > 0 && (
                                <div className="pt-4 border-t border-amber-200/50 dark:border-amber-500/10">
                                    <h4 className="font-bold text-amber-900 dark:text-amber-100 text-sm mb-3 uppercase tracking-wide">Specific Repeated Issues</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {repeatedIssues.slice(0, 10).map((issue, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-amber-200/50 dark:border-amber-500/10">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{issue.title}</span>
                                                    <span className="text-[10px] text-slate-500">{issue.deptName} • {issue.orgName}</span>
                                                </div>
                                                <Badge className="bg-amber-500 text-white font-black text-[10px] h-5">
                                                    {issue.count}x
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                    {repeatedIssues.length > 10 && (
                                        <p className="text-[10px] text-slate-400 mt-3 italic">+ {repeatedIssues.length - 10} more repeated issues found</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Department Stats Table */}
            <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                <div
                    className="absolute inset-0 z-0 opacity-[0.02] dark:opacity-[0.04] bg-cover bg-center pointer-events-none"
                    style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                />
                <div className="relative z-10">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-violet-50 dark:bg-violet-500/10 rounded-xl">
                                <Building className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">All Departments</h4>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Sorted by unresolved count</p>
                            </div>
                        </div>
                    </div>
                    <Table>
                        <TableHeader className="bg-slate-50/50 dark:bg-slate-800/20">
                            <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                                <TableHead className="font-bold text-[10px] uppercase tracking-wider text-slate-400 h-11 px-5">Department</TableHead>
                                <TableHead className="font-bold text-[10px] uppercase tracking-wider text-slate-400 h-11 px-5">Organization</TableHead>
                                <TableHead className="font-bold text-[10px] uppercase tracking-wider text-slate-400 h-11 px-5 text-center">Total</TableHead>
                                <TableHead className="font-bold text-[10px] uppercase tracking-wider text-slate-400 h-11 px-5 text-center">Unresolved</TableHead>
                                <TableHead className="font-bold text-[10px] uppercase tracking-wider text-slate-400 h-11 px-5 text-center">Resolved</TableHead>
                                <TableHead className="font-bold text-[10px] uppercase tracking-wider text-slate-400 h-11 px-5 text-right">Avg Time (Hrs)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {departmentStats.map((dept) => (
                                <TableRow key={dept.id} className="border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/80 dark:hover:bg-slate-800/20">
                                    <TableCell className="px-5 py-4 font-semibold text-slate-700 dark:text-slate-200">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500/10 to-indigo-500/10 flex items-center justify-center border border-violet-500/20">
                                                <Building className="h-3.5 w-3.5 text-violet-500" />
                                            </div>
                                            {dept.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5">
                                        <Badge variant="outline" className="border-slate-200 text-slate-500 text-[10px] uppercase font-bold dark:border-slate-700 dark:text-slate-400">
                                            {dept.organization}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-5 text-center font-bold text-slate-600 dark:text-slate-300">
                                        {dept.totalComplaints}
                                    </TableCell>
                                    <TableCell className="px-5 text-center">
                                        <span className={`font-bold ${dept.unresolvedCount > 5 ? 'text-red-500' : dept.unresolvedCount > 0 ? 'text-amber-500' : 'text-slate-400'}`}>
                                            {dept.unresolvedCount}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-5 text-center">
                                        <span className="font-bold text-emerald-500">{dept.resolvedCount}</span>
                                    </TableCell>
                                    <TableCell className="px-5 text-right font-mono text-xs text-slate-500">
                                        {dept.avgResolutionTime > 0 ? `${dept.avgResolutionTime}hr` : '--'}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {departmentStats.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                                        No department data available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
