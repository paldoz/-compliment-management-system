"use client"

import { useEffect, useState } from "react"
import { Loader2, ShieldCheck, User, Calendar, Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function AdminLogsPage() {
    const [logs, setLogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await fetch("/api/admin/audit-logs")
                const data = await res.json()
                setLogs(Array.isArray(data) ? data : [])
            } catch (err) {
                console.error(err)
                setLogs([])
            } finally {
                setLoading(false)
            }
        }
        fetchLogs()
    }, [])

    return (
        <div className="space-y-10 pb-24">
            {/* World-Class 'Domain Surveillance' Mirror Glass Hero (Compact) */}
            <div className="relative overflow-hidden group rounded-2xl lg:rounded-[2.5rem] p-6 lg:p-10 bg-slate-950 border border-white/5 shadow-2xl transition-all duration-700 shadow-blue-900/10 mx-2">
                {/* Branding-Integrated Background Texture */}
                <div
                    className="absolute inset-0 z-0 opacity-20 bg-cover bg-center transition-transform duration-[20000ms] group-hover:scale-110"
                    style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                />

                {/* Audit Radial Flows (Blue & Cyan) */}
                <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[70%] bg-cyan-500/15 blur-[100px] rounded-full animate-pulse delay-700" />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10">
                    <div className="space-y-4 lg:space-y-6">
                        <div className="space-y-1 lg:space-y-2">
                            <div className="flex items-center gap-5">
                                <div className="h-[2px] w-12 bg-gradient-to-r from-blue-500 to-transparent rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.6em] text-blue-400">Domain Surveillance</span>
                            </div>
                            <h1 className="text-3xl lg:text-5xl font-black tracking-tighter leading-none text-white uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white/70 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                Department <span className="text-blue-500">Audit</span>
                            </h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 backdrop-blur-2xl p-2.5 px-6 rounded-2xl">
                                <div className="h-8 w-8 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/30">
                                    <ShieldCheck className="h-4 w-4 text-blue-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Administrative Trace</span>
                                    <span className="text-sm font-black text-white italic">Immutable Records</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:flex flex-col items-end gap-1 text-right opacity-30 group-hover:opacity-60 transition-opacity">
                        <div className="text-[60px] font-black tracking-tighter text-white/5 leading-none">LOG</div>
                        <div className="text-[8px] font-black text-white/50 tracking-[1em] uppercase">Security Layer v2.4</div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex h-[400px] items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary/30 dark:text-white/20" />
                </div>
            ) : (
                <div className="relative px-2">
                    <div className="absolute left-[41px] top-0 w-0.5 h-full bg-slate-100/50 dark:bg-slate-800/50"></div>
                    <div className="space-y-8">
                        {logs.map((log) => (
                            <div key={log.id} className="relative pl-16 group">
                                <div className="absolute left-[33px] top-6 w-4 h-4 bg-white border-[3px] border-primary rounded-full z-10 shadow-sm group-hover:scale-125 transition-transform dark:bg-slate-900 dark:border-blue-500"></div>

                                <Card className="rounded-3xl border-none bg-white shadow-xl shadow-blue-900/5 p-8 hover:shadow-blue-900/10 transition-all border border-slate-50/50 dark:bg-slate-900 dark:shadow-none dark:border-slate-800">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="space-y-4 flex-1">
                                            <div className="flex items-center gap-3">
                                                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 rounded-lg font-bold uppercase text-[9px] tracking-widest px-3 py-1 border-none dark:bg-blue-500/10 dark:text-blue-400">
                                                    {log.action}
                                                </Badge>
                                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5 dark:text-slate-600">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(log.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-primary transition-colors dark:text-slate-200 dark:group-hover:text-blue-400">
                                                    {log.complaint.title}
                                                </h3>
                                                <div className="mt-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-50 text-sm text-slate-600 font-medium flex gap-3 italic dark:bg-slate-950/50 dark:border-slate-800/50 dark:text-slate-400">
                                                    <Info className="h-4 w-4 text-slate-300 shrink-0 mt-0.5 dark:text-slate-700" />
                                                    {log.details}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="shrink-0 flex items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-50 self-start md:self-center dark:bg-slate-950/50 dark:border-slate-800/50">
                                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm dark:bg-slate-900 dark:border-slate-800">
                                                <User className="h-5 w-5 text-primary dark:text-blue-400" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-tight dark:text-slate-200">{log.user.name}</span>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] dark:text-slate-500">{log.user.role}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))}
                        {logs.length === 0 && (
                            <div className="py-24 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                                <span className="text-slate-300 font-bold uppercase tracking-widest text-xs italic dark:text-slate-700">No audit logs recorded for this department yet.</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
