"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import {
    FileText,
    Search,
    Filter,
    MessageSquare,
    Paperclip,
    Clock,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ChevronRight,
    History,
    MoreHorizontal,
    Send,
    Download,
    UserCircle,
    ArrowLeft,
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export default function GlobalComplaintsPage() {
    const { data: session } = useSession()
    const [complaints, setComplaints] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")
    const [selectedComplaint, setSelectedComplaint] = useState<any>(null)

    const fetchComplaints = async () => {
        setLoading(true)
        try {
            // Reusing the admin complaints API which supports SUPER_ADMIN global view
            const res = await fetch(`/api/admin/complaints?status=${statusFilter !== "ALL" ? statusFilter : ""}`)
            const data = await res.json()
            setComplaints(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error(err)
            setComplaints([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchComplaints()
    }, [statusFilter])

    const filtered = complaints.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.department?.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-10 pb-24">
            {/* World-Class 'Global Registry' Mirror Glass Hero */}
            <div className="relative overflow-hidden group rounded-2xl lg:rounded-[2.5rem] p-6 lg:p-10 bg-slate-950 border border-white/5 shadow-2xl transition-all duration-700 shadow-blue-900/10 mx-2">
                {/* Branding-Integrated Background Texture */}
                <div
                    className="absolute inset-0 z-0 opacity-20 bg-cover bg-center transition-transform duration-[20000ms] group-hover:scale-110 contrast-[1.2] brightness-[0.8]"
                    style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                />

                {/* Azure Radial Flows (Cyan & Blue) */}
                <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-cyan-600/20 blur-[130px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[70%] bg-blue-500/15 blur-[100px] rounded-full animate-pulse delay-700" />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10">
                    <div className="space-y-4 lg:space-y-6">
                        <div className="space-y-1 lg:space-y-2">
                            <div className="flex items-center gap-5">
                                <div className="h-[2px] w-12 bg-gradient-to-r from-blue-500 to-transparent rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.6em] text-blue-400">Governance Oversight</span>
                            </div>
                            <h1 className="text-3xl lg:text-5xl font-black tracking-tighter leading-none text-white uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-white/70 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                Global <span className="text-cyan-500">Registry</span>
                            </h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 backdrop-blur-2xl p-2.5 px-6 rounded-2xl">
                                <div className="h-8 w-8 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30">
                                    <Building2 className="h-4 w-4 text-cyan-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Administrative Node</span>
                                    <span className="text-sm font-black text-white italic">Control Center</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-blue-500/5 border border-blue-500/20 backdrop-blur-2xl p-2.5 px-6 rounded-2xl">
                                <div className="text-right">
                                    <div className="text-xl lg:text-2xl font-black tracking-tighter text-blue-400 flex items-center gap-2 tabular-nums">
                                        {complaints.length}
                                    </div>
                                    <div className="text-[7px] font-bold text-blue-500/50 uppercase tracking-[0.3em]">Total Inquiries</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:flex flex-col items-end gap-1 text-right opacity-30 group-hover:opacity-60 transition-opacity">
                        <div className="text-[60px] font-black tracking-tighter text-white/5 leading-none">OSC</div>
                        <div className="text-[8px] font-black text-white/50 tracking-[1em] uppercase">Observation Layer v2.1</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 px-2">
                <div className="relative group flex-1">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search by title, user, or department..."
                        className="pl-14 h-14 border-slate-200 bg-white rounded-2xl focus:border-primary/30 focus:ring-primary/10 font-medium transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[240px] h-14 border-slate-200 bg-white rounded-2xl focus:ring-primary/10 font-bold text-slate-700 shadow-sm">
                        <SelectValue placeholder="Global Filter" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                        <SelectItem value="ALL" className="font-bold text-slate-400">ALL STATUSES</SelectItem>
                        <SelectItem value="PENDING" className="font-semibold text-sm py-2.5">PENDING</SelectItem>
                        <SelectItem value="IN_PROGRESS" className="font-semibold text-sm py-2.5">IN PROGRESS</SelectItem>
                        <SelectItem value="RESOLVED" className="font-semibold text-sm py-2.5">RESOLVED</SelectItem>
                        <SelectItem value="CLOSED" className="font-semibold text-sm py-2.5">CLOSED</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {loading ? (
                <div className="flex h-60 items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary/30" />
                </div>
            ) : (
                <Card className="rounded-[2.5rem] border-none bg-white shadow-xl shadow-blue-900/5 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 border-slate-100 hover:bg-slate-50/50">
                                <TableHead className="py-5 px-8 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Inbound Report</TableHead>
                                <TableHead className="py-5 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Origin Node</TableHead>
                                <TableHead className="py-5 font-bold text-slate-400 uppercase text-[10px] tracking-widest text-center">Identity</TableHead>
                                <TableHead className="py-5 font-bold text-slate-400 uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                                <TableHead className="py-5 px-8 font-bold text-slate-400 uppercase text-[10px] tracking-widest text-right">Registered</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((c) => (
                                <Dialog key={c.id}>
                                    <DialogTrigger asChild>
                                        <TableRow className="border-slate-50 hover:bg-slate-50/30 transition-colors cursor-pointer group">
                                            <TableCell className="py-6 px-8">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-bold text-slate-900 text-base group-hover:text-primary transition-colors leading-tight">{c.title}</span>
                                                    <span className="text-[10px] font-mono text-slate-300 font-medium tracking-tight">#{c.id.slice(0, 8)}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 rounded-lg font-bold text-[9px] uppercase tracking-widest px-2.5 py-1 border-none">
                                                    {c.department?.name || "Global"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="font-bold text-slate-700 text-xs leading-none mb-1">{c.user.name}</span>
                                                    <span className="text-[10px] text-slate-400 font-medium lowercase tracking-tight">{c.user.email.slice(0, 15)}...</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge className={cn(
                                                    "rounded-lg font-bold uppercase text-[9px] tracking-widest px-3 py-1.5 shadow-sm border-none",
                                                    c.status === "PENDING" && "bg-amber-500 text-white",
                                                    c.status === "IN_PROGRESS" && "bg-primary text-white",
                                                    c.status === "RESOLVED" && "bg-emerald-500 text-white",
                                                    c.status === "CLOSED" && "bg-slate-100 text-slate-400"
                                                )}>
                                                    {c.status.replace('_', ' ')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-xs text-slate-400 px-8 tabular-nums">
                                                {new Date(c.createdAt).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl rounded-[3rem] border-none shadow-2xl p-0 overflow-hidden">
                                        <DialogTitle className="sr-only">Global Complaint Registry Details</DialogTitle>
                                        <div className="bg-slate-950 p-6 sm:p-10 text-white relative overflow-hidden shrink-0 border-b border-white/5 group">
                                            {/* Branding texture */}
                                            <div
                                                className="absolute inset-0 z-0 opacity-20 bg-cover bg-center mix-blend-overlay transition-transform duration-[20000ms] group-hover:scale-110"
                                                style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                                            />

                                            {/* Registry Radial Flows (Cyan & Slate) */}
                                            <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                                                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-cyan-600/20 blur-[130px] rounded-full animate-pulse" />
                                                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[70%] bg-slate-500/10 blur-[100px] rounded-full animate-pulse delay-700" />
                                            </div>

                                            <div className="relative z-10">
                                                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.6em] text-cyan-400 block mb-2">Registry Record Node</span>
                                                <h2 className="text-2xl sm:text-4xl font-black tracking-tighter leading-tight text-white uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-white/70">
                                                    {c.title}
                                                </h2>
                                            </div>
                                        </div>
                                        <div className="p-10 space-y-10 bg-white">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                <div className="space-y-4">
                                                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 border-b border-slate-50 pb-3">Report Disclosure</h3>
                                                    <p className="text-slate-600 font-medium leading-relaxed bg-slate-50/50 p-6 rounded-2xl border border-slate-50 italic">
                                                        "{c.description}"
                                                    </p>
                                                </div>
                                                <div className="space-y-4">
                                                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 border-b border-slate-50 pb-3">Context Metadata</h3>
                                                    <div className="space-y-3 pt-2">
                                                        <div className="flex justify-between items-center bg-slate-50/80 px-4 py-3 rounded-xl border border-slate-50">
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Origin Node:</span>
                                                            <span className="font-bold text-slate-900 text-[10px] uppercase tracking-wider">{c.department?.name}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center bg-slate-50/80 px-4 py-3 rounded-xl border border-slate-50">
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reporter identity:</span>
                                                            <span className="font-bold text-slate-900 text-[10px] uppercase tracking-wider">{c.user.name}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center bg-slate-50/80 px-4 py-3 rounded-xl border border-slate-50">
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current State:</span>
                                                            <Badge className="bg-primary/10 text-primary rounded-lg text-[9px] font-bold uppercase px-3 h-6 border-none">{c.status}</Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="pt-8 border-t border-slate-100 flex justify-end">
                                                <DialogClose asChild>
                                                    <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-widest rounded-2xl h-14 px-10 shadow-xl shadow-blue-900/10 transition-all active:scale-95">Dismiss Registry Node</Button>
                                                </DialogClose>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}
        </div>
    )
}
