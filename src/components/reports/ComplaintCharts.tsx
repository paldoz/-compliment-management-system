"use client"

import { useState } from "react"
import { BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon } from "lucide-react"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
    LineChart, Line, Area, AreaChart
} from "recharts"
import { Button } from "@/components/ui/button"

interface DepartmentStat {
    id: string
    name: string
    organization: string
    totalComplaints: number
    unresolvedCount: number
}

interface StatusCounts {
    PENDING: number
    APPROVED: number
    RESOLVED: number
    REJECTED: number
}

interface TrendData {
    date?: string
    month?: string
    count: number
}

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#ec4899']

export function ComplaintCharts({
    departmentStats,
    statusCounts,
    dailyTrends,
    monthlyTrends
}: {
    departmentStats: DepartmentStat[]
    statusCounts: StatusCounts
    dailyTrends: TrendData[]
    monthlyTrends: TrendData[]
}) {
    const [trendView, setTrendView] = useState<'daily' | 'monthly'>('daily')

    // Bar chart data - top 10 departments
    const barData = departmentStats.slice(0, 10).map(dept => ({
        name: dept.name.length > 15 ? dept.name.substring(0, 15) + '...' : dept.name,
        complaints: dept.totalComplaints,
        unresolved: dept.unresolvedCount
    }))

    // Pie chart data
    const pieData = [
        { name: 'Pending', value: statusCounts.PENDING, color: '#f59e0b' },
        { name: 'Approved/In Progress', value: statusCounts.APPROVED, color: '#3b82f6' },
        { name: 'Resolved/Closed', value: statusCounts.RESOLVED, color: '#10b981' },
        { name: 'Rejected', value: statusCounts.REJECTED, color: '#ef4444' }
    ].filter(d => d.value > 0)

    // Line chart data
    const lineData = trendView === 'daily' ? dailyTrends.map(d => ({
        label: d.date?.substring(5) || '', // MM-DD format
        count: d.count
    })) : monthlyTrends.map(d => ({
        label: d.month || '',
        count: d.count
    }))

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
                    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[70%] bg-pink-500/15 blur-[100px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[60%] bg-rose-600/15 blur-[80px] rounded-full animate-pulse delay-500" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-[2px] w-10 bg-gradient-to-r from-pink-500 to-transparent rounded-full shadow-[0_0_15px_rgba(236,72,153,0.5)]" />
                        <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.5em] text-pink-400">Data Visualization</span>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-black tracking-tighter leading-none text-white uppercase italic">
                        Visual <span className="text-pink-500">Analytics</span>
                    </h2>
                    <p className="text-slate-400 text-sm mt-3 max-w-xl">
                        Bar charts, pie charts, and trend lines for comprehensive complaint analysis.
                    </p>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart - Complaints per Department */}
                <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div
                        className="absolute inset-0 z-0 opacity-[0.02] dark:opacity-[0.04] bg-cover bg-center pointer-events-none"
                        style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                    />
                    <div className="relative z-10 p-5 lg:p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
                                <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Complaints by Department</h4>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Top 10 departments</p>
                            </div>
                        </div>
                        <div className="h-72">
                            {barData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barData} layout="vertical" margin={{ left: 0, right: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={true} vertical={false} />
                                        <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                        <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} width={100} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                                border: 'none',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                color: '#fff'
                                            }}
                                        />
                                        <Bar dataKey="complaints" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-400 text-sm">No data available</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Pie Chart - Status Distribution */}
                <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div
                        className="absolute inset-0 z-0 opacity-[0.02] dark:opacity-[0.04] bg-cover bg-center pointer-events-none"
                        style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                    />
                    <div className="relative z-10 p-5 lg:p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
                                <PieChartIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Status Distribution</h4>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider">All complaints by status</p>
                            </div>
                        </div>
                        <div className="h-72">
                            {pieData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                                border: 'none',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                color: '#fff'
                                            }}
                                        />
                                        <Legend
                                            verticalAlign="bottom"
                                            height={36}
                                            formatter={(value) => <span className="text-xs text-slate-600 dark:text-slate-400">{value}</span>}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-400 text-sm">No data available</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Line/Area Chart - Trends */}
            <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                <div
                    className="absolute inset-0 z-0 opacity-[0.02] dark:opacity-[0.04] bg-cover bg-center pointer-events-none"
                    style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                />
                <div className="relative z-10 p-5 lg:p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-violet-50 dark:bg-violet-500/10 rounded-xl">
                                <LineChartIcon className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Complaint Trends</h4>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                                    {trendView === 'daily' ? 'Last 30 days' : 'Last 12 months'}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                            <Button
                                variant={trendView === 'daily' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setTrendView('daily')}
                                className={`text-xs h-7 ${trendView === 'daily' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}
                            >
                                Daily
                            </Button>
                            <Button
                                variant={trendView === 'monthly' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setTrendView('monthly')}
                                className={`text-xs h-7 ${trendView === 'monthly' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}
                            >
                                Monthly
                            </Button>
                        </div>
                    </div>
                    <div className="h-72">
                        {lineData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={lineData} margin={{ left: 0, right: 20, top: 10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                    <XAxis
                                        dataKey="label"
                                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                                        axisLine={false}
                                        tickLine={false}
                                        interval={trendView === 'daily' ? 4 : 0}
                                    />
                                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                            border: 'none',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            color: '#fff'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#8b5cf6"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorCount)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400 text-sm">No trend data available</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
