"use client"

import { useEffect, useState } from "react"
import {
    ShieldAlert,
    Search,
    Loader2,
    Terminal,
    History,
    FileText,
    User,
    Clock
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function GlobalLogsPage() {
    const [logs, setLogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await fetch("/api/superadmin/logs")
                const data = await res.json()
                setLogs(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchLogs()
    }, [])

    const filtered = logs.filter(l =>
        l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.details?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-4 lg:space-y-12 pb-24 px-2 md:px-0">
            {/* World-Class 'Master Registry' Mirror Glass Hero (Compact) */}
            <div className="relative overflow-hidden group rounded-2xl lg:rounded-[2.5rem] p-6 lg:p-10 bg-slate-950 border border-white/5 shadow-2xl transition-all duration-700 shadow-blue-900/10 mx-2">
                {/* Branding-Integrated Background Texture */}
                <div
                    className="absolute inset-0 z-0 opacity-20 bg-cover bg-center transition-transform duration-[20000ms] group-hover:scale-110 contrast-[1.1] hue-rotate-[180deg]"
                    style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                />

                {/* Surveillance Radial Flows (Cyan & Slate) */}
                <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-cyan-500/15 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[70%] bg-slate-500/10 blur-[100px] rounded-full animate-pulse delay-700" />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10">
                    <div className="space-y-4 lg:space-y-6">
                        <div className="space-y-1 lg:space-y-2">
                            <div className="flex items-center gap-5">
                                <div className="h-[2px] w-12 bg-gradient-to-r from-cyan-500 to-transparent rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
                                <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.6em] text-cyan-400">Security Surveillance</span>
                            </div>
                            <h1 className="text-3xl lg:text-5xl font-black tracking-tighter leading-none text-white uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-white/70 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                System <span className="text-cyan-500">Archives</span>
                            </h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 backdrop-blur-2xl p-2.5 px-6 rounded-2xl">
                                <div className="h-8 w-8 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30">
                                    <ShieldAlert className="h-4 w-4 text-cyan-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Integrity Registry</span>
                                    <span className="text-sm font-black text-white italic">Immutable Logs</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:flex flex-col items-end gap-1 text-right opacity-30 group-hover:opacity-60 transition-opacity">
                        <div className="text-[60px] font-black tracking-tighter text-white/5 leading-none">AUDIT</div>
                        <div className="text-[8px] font-black text-white/50 tracking-[1em] uppercase">Protocol Chain v2.1</div>
                    </div>
                </div>
            </div>

            <div className="relative group max-w-2xl px-4 md:px-2">
                <Search className="absolute left-9 md:left-7 top-1/2 -translate-y-1/2 h-4 md:h-5 w-4 md:w-5 text-slate-400 group-focus-within:text-primary transition-colors dark:text-slate-600 dark:group-focus-within:text-blue-400" />
                <Input
                    placeholder="Scan registry by action..."
                    className="pl-12 md:pl-14 h-12 md:h-14 border-slate-200 bg-white rounded-2xl focus:border-primary/30 focus:ring-primary/10 font-medium transition-all shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-blue-500/30 dark:focus:ring-blue-500/5 dark:shadow-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="flex h-60 items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary/30 dark:text-white/20" />
                </div>
            ) : (
                <div className="space-y-4 px-2">
                    {filtered.map((log) => (
                        <Card key={log.id} className="mx-4 md:mx-2 rounded-2xl md:rounded-3xl border-none bg-white shadow-xl shadow-blue-900/5 hover:shadow-blue-900/10 transition-all group overflow-hidden dark:bg-slate-900 dark:shadow-none dark:hover:bg-slate-800/50">
                            <div className="flex flex-col md:flex-row">
                                <div className="w-full md:w-[260px] bg-slate-50/50 p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 italic font-medium dark:bg-slate-950/40 dark:border-slate-800">
                                    <div className="space-y-3">
                                        <Badge className="bg-primary text-white hover:bg-primary rounded-lg font-bold text-[10px] uppercase tracking-widest px-3 py-1 border-none shadow-sm dark:bg-blue-600 dark:shadow-none">
                                            {log.action}
                                        </Badge>
                                        <div className="flex items-center gap-2 text-slate-400 text-[10px] md:text-[11px] font-bold dark:text-slate-600">
                                            <Clock className="h-3.5 w-3.5" />
                                            {new Date(log.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 mt-4 md:mt-6 bg-white p-3 rounded-xl md:rounded-2xl border border-slate-100 shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:shadow-none">
                                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden dark:bg-blue-500/10 shrink-0">
                                            <User className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary dark:text-blue-400" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[10px] md:text-[11px] font-bold text-slate-900 truncate dark:text-slate-200">{log.user.name}</span>
                                            <span className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase tracking-wider dark:text-slate-500">{log.user.role}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 p-6 md:p-8 space-y-4">
                                    <div className="flex items-center gap-2 text-slate-300 dark:text-slate-700">
                                        <Terminal className="h-4 w-4" />
                                        <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em]">Activity Trace</span>
                                    </div>
                                    <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed bg-slate-50/30 p-4 rounded-xl md:rounded-2xl border border-slate-50 dark:bg-slate-950/30 dark:border-slate-800 dark:text-slate-400">
                                        {log.details}
                                    </p>
                                    <div className="flex items-center gap-4 pt-1">
                                        <div className="flex items-center gap-2 bg-blue-50/50 px-3 py-1.5 rounded-lg border border-blue-50 dark:bg-blue-900/20 dark:border-blue-900/30">
                                            <span className="text-[9px] md:text-[10px] font-bold text-primary uppercase tracking-widest dark:text-blue-400">{log.entity}:</span>
                                            <span className="text-[9px] md:text-[10px] font-mono text-slate-400 font-medium dark:text-slate-600 truncate max-w-[120px] md:max-w-none">{log.entityId}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                    {filtered.length === 0 && (
                        <div className="py-24 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                            <History className="h-12 w-12 text-slate-100 mx-auto mb-4 dark:text-slate-800" />
                            <span className="text-slate-300 font-bold uppercase tracking-widest text-xs dark:text-slate-600">No matching activities found in the master registry.</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
