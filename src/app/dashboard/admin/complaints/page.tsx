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
    History,
    MoreHorizontal,
    Send,
    Download,
    UserCircle,
    ArrowLeft
} from "lucide-react"
import { toast } from "sonner"
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

export default function DeptAdminComplaintsPage() {
    const { data: session } = useSession()
    const [complaints, setComplaints] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")
    const [selectedComplaint, setSelectedComplaint] = useState<any>(null)
    const [resolutionNote, setResolutionNote] = useState("")
    const [newComment, setNewComment] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const fetchComplaints = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/admin/complaints?status=${statusFilter !== "ALL" ? statusFilter : ""}`)
            const data = await res.json()
            if (Array.isArray(data)) {
                setComplaints(data)
            } else {
                console.error("Failed to fetch complaints:", data.error || "Unknown error")
                setComplaints([])
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchComplaints()
    }, [statusFilter])

    const handleUpdateStatus = async (status: string) => {
        setSubmitting(true)
        try {
            const res = await fetch("/api/admin/complaints", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: selectedComplaint.id,
                    status,
                    resolutionNote
                })
            })
            if (res.ok) {
                toast.success(`Complaint status updated to ${status}`)
                setResolutionNote("")
                fetchComplaints()
                // Refresh modal data
                const updated = await res.json()
                setSelectedComplaint(updated)
            } else {
                toast.error("Failed to update status")
            }
        } catch (err) {
            console.error(err)
            toast.error("An error occurred while updating status")
        } finally {
            setSubmitting(false)
        }
    }

    const handlePostComment = async () => {
        if (!newComment.trim()) return
        setSubmitting(true)
        try {
            const res = await fetch(`/api/complaints/${selectedComplaint.id}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newComment })
            })
            if (res.ok) {
                toast.success("Response transmitted successfully")
                setNewComment("")
                // Refresh complaint details with new comments/logs
                const refreshed = await fetch(`/api/admin/complaints?id=${selectedComplaint.id}`).then(r => r.json())
                setSelectedComplaint(refreshed)
            } else {
                toast.error("Failed to transmit response")
            }
        } catch (err) {
            console.error(err)
            toast.error("An error occurred during transmission")
        } finally {
            setSubmitting(false)
        }
    }

    const filtered = Array.isArray(complaints) ? complaints.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) : []

    return (
        <div className="space-y-8 pb-24">
            {/* World-Class 'Mirror Glass' Hero (Processing Hub - Compact) */}
            <div className="relative overflow-hidden group rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl transition-all duration-700 hover:shadow-blue-500/20 bg-slate-950 border border-white/5 mx-2">
                {/* Branding-Integrated Background Texture */}
                <div
                    className="absolute inset-0 z-0 opacity-20 bg-cover bg-center transition-transform duration-[20000ms] group-hover:scale-110"
                    style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                />

                {/* Authority Radial Flows (Blue & Emerald) */}
                <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[70%] bg-emerald-500/10 blur-[100px] rounded-full animate-pulse delay-700" />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-4 lg:space-y-6">
                        <div className="space-y-1 lg:space-y-2">
                            <div className="flex items-center gap-4">
                                <div className="h-[2px] w-12 bg-gradient-to-r from-blue-500 to-transparent rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-blue-400">Resolution Node</span>
                            </div>
                            <h1 className="text-3xl lg:text-5xl font-black tracking-tighter text-white uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-emerald-100 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                                Inbound <span className="text-emerald-400">Terminal</span>
                            </h1>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] italic max-w-md">Administrative processing and resolution center for high-priority reports</p>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-3xl rounded-2xl border border-white/10 p-4 px-8 text-center group-hover:bg-white/10 transition-colors">
                        <div className="text-3xl font-black text-white tabular-nums tracking-tighter italic">{complaints?.length || 0}</div>
                        <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Awaiting Command</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 px-2">
                <div className="relative group flex-1">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors dark:text-slate-600 dark:group-focus-within:text-blue-400" />
                    <Input
                        placeholder="Search by title or user email..."
                        className="pl-14 h-14 border-slate-200 bg-white rounded-2xl focus:border-primary/30 focus:ring-primary/10 font-medium transition-all shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-blue-500/30"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[240px] h-14 border-slate-200 bg-white rounded-2xl focus:ring-primary/10 font-bold text-slate-700 shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200">
                        <SelectValue placeholder="Filter Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-100 shadow-2xl dark:bg-slate-900 dark:border-slate-800">
                        <SelectItem value="ALL" className="font-bold text-slate-400 dark:text-slate-500">ALL STATUSES</SelectItem>
                        <SelectItem value="PENDING" className="font-semibold text-sm py-2.5 dark:text-slate-200">PENDING</SelectItem>
                        <SelectItem value="IN_PROGRESS" className="font-semibold text-sm py-2.5 dark:text-slate-200">IN PROGRESS</SelectItem>
                        <SelectItem value="RESOLVED" className="font-semibold text-sm py-2.5 dark:text-slate-200">RESOLVED</SelectItem>
                        <SelectItem value="CLOSED" className="font-semibold text-sm py-2.5 dark:text-slate-200">CLOSED</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {loading ? (
                <div className="flex h-60 items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary/30 dark:text-white/20" />
                </div>
            ) : (
                <Card className="rounded-[2.5rem] border-none bg-white shadow-xl shadow-blue-900/5 overflow-hidden dark:bg-slate-900 dark:shadow-none">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 border-slate-100 hover:bg-slate-50/50 dark:bg-slate-800/20 dark:border-slate-800">
                                <TableHead className="py-5 px-8 font-bold text-slate-400 uppercase text-[10px] tracking-widest dark:text-slate-500">Inbound Report</TableHead>
                                <TableHead className="py-5 font-bold text-slate-400 uppercase text-[10px] tracking-widest dark:text-slate-500">Identification</TableHead>
                                <TableHead className="py-5 font-bold text-slate-400 uppercase text-[10px] tracking-widest text-center dark:text-slate-500">Status</TableHead>
                                <TableHead className="py-5 px-8 font-bold text-slate-400 uppercase text-[10px] tracking-widest text-right dark:text-slate-500">Registered</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((c) => (
                                <Dialog key={c.id} onOpenChange={(open) => open && setSelectedComplaint(c)}>
                                    <DialogTrigger asChild>
                                        <TableRow className="border-slate-50 hover:bg-slate-50/30 transition-colors cursor-pointer group dark:border-slate-800/50 dark:hover:bg-slate-800/20">
                                            <TableCell className="py-6 px-8">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-bold text-slate-900 text-base group-hover:text-primary transition-colors leading-tight dark:text-slate-200 dark:group-hover:text-blue-400">{c.title}</span>
                                                    <span className="text-[10px] font-mono text-slate-300 font-medium dark:text-slate-600">ID: #{c.id.slice(0, 8)}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shadow-inner dark:bg-slate-800 dark:shadow-none">
                                                        <UserCircle className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-700 text-sm leading-none mb-1 dark:text-slate-300">{c.user.name}</span>
                                                        <span className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase dark:text-slate-500">{c.user.id.slice(0, 8)}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge className={cn(
                                                    "rounded-lg font-bold uppercase text-[9px] tracking-widest px-3 py-1.5 shadow-sm border-none",
                                                    c.status === "PENDING" && "bg-amber-500 text-white dark:bg-amber-500/10 dark:text-amber-400",
                                                    c.status === "IN_PROGRESS" && "bg-primary text-white dark:bg-blue-500/10 dark:text-blue-400",
                                                    c.status === "RESOLVED" && "bg-emerald-500 text-white dark:bg-emerald-500/10 dark:text-emerald-400",
                                                    c.status === "CLOSED" && "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600"
                                                )}>
                                                    {c.status.replace('_', ' ')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-xs text-slate-400 px-8 tabular-nums dark:text-slate-500">
                                                {new Date(c.createdAt).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: '2-digit',
                                                    year: 'numeric'
                                                })}
                                            </TableCell>
                                        </TableRow>
                                    </DialogTrigger>
                                    <DialogContent className="w-full h-full max-w-none rounded-none sm:rounded-[3rem] sm:max-w-5xl sm:h-[85vh] border-none shadow-2xl p-0 overflow-hidden flex flex-col dark:bg-slate-950 dark:shadow-none">
                                        <DialogTitle className="sr-only">Complaint Processing Node</DialogTitle>
                                        {selectedComplaint && (
                                            <>
                                                <div className="bg-slate-900 p-6 sm:p-10 text-white relative overflow-hidden shrink-0 dark:bg-slate-950 dark:border-b dark:border-slate-800">
                                                    {/* Branding texture */}
                                                    <div
                                                        className="absolute inset-0 z-0 opacity-20 bg-cover bg-center mix-blend-overlay"
                                                        style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                                                    />
                                                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[80px] rounded-full -mr-48 -mt-48 dark:bg-blue-500/10" />
                                                    <div className="relative z-10 flex items-center justify-between">
                                                        <div className="space-y-1">
                                                            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-600">Processing Node</span>
                                                            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight mt-1">{selectedComplaint.title}</h2>
                                                        </div>
                                                        <Badge className="bg-white/10 backdrop-blur-md text-white rounded-lg sm:rounded-xl border border-white/10 font-bold uppercase tracking-widest px-3 sm:px-5 py-1.5 sm:py-2.5 text-[9px] sm:text-[10px] dark:bg-blue-500/10 dark:border-blue-500/20">
                                                            {selectedComplaint.status}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-12">
                                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                                                        <div className="lg:col-span-2 space-y-10">
                                                            <div className="space-y-4">
                                                                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 dark:text-slate-500">
                                                                    <FileText className="h-4 w-4 text-primary dark:text-blue-400" /> Report Detail
                                                                </h3>
                                                                <p className="text-slate-600 font-medium leading-relaxed bg-slate-50/50 p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-slate-50 italic dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 text-sm sm:text-base">
                                                                    "{selectedComplaint.description}"
                                                                </p>
                                                            </div>

                                                            {/* Attachments */}
                                                            {selectedComplaint.attachments?.length > 0 && (
                                                                <div className="space-y-4">
                                                                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                                                        <Paperclip className="h-4 w-4 text-primary" /> Captured Evidence
                                                                    </h3>
                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                        {selectedComplaint.attachments.map((file: any) => (
                                                                            <a
                                                                                key={file.id}
                                                                                href={file.url}
                                                                                target="_blank"
                                                                                className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-100 hover:border-primary/30 hover:shadow-lg hover:shadow-blue-900/5 transition-all group dark:bg-slate-900 dark:border-slate-800 dark:hover:border-blue-500/30"
                                                                            >
                                                                                <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors dark:bg-slate-800 dark:group-hover:bg-blue-600">
                                                                                    <Download className="h-5 w-5" />
                                                                                </div>
                                                                                <div className="flex flex-col min-w-0">
                                                                                    <span className="text-xs font-bold text-slate-900 truncate">{file.name}</span>
                                                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{file.type}</span>
                                                                                </div>
                                                                            </a>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Comments */}
                                                            <div className="space-y-6">
                                                                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 dark:text-slate-500">
                                                                    <MessageSquare className="h-4 w-4 text-primary dark:text-blue-400" /> Discussion Thread
                                                                </h3>
                                                                <div className="space-y-6">
                                                                    <div className="space-y-4">
                                                                        {selectedComplaint.comments?.map((comment: any) => (
                                                                            <div key={comment.id} className="p-5 bg-white rounded-2xl border border-slate-100/80 shadow-sm relative overflow-hidden group dark:bg-slate-900 dark:border-slate-800">
                                                                                <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors dark:bg-blue-500/20 dark:group-hover:bg-blue-600" />
                                                                                <div className="flex items-center justify-between mb-3">
                                                                                    <span className="text-[10px] font-bold uppercase text-primary bg-blue-50 px-2 py-0.5 rounded-md dark:bg-blue-500/10 dark:text-blue-400">{comment.user.name}</span>
                                                                                    <span className="text-[9px] font-bold text-slate-300 tabular-nums dark:text-slate-600">{new Date(comment.createdAt).toLocaleString()}</span>
                                                                                </div>
                                                                                <p className="text-sm text-slate-600 font-medium leading-relaxed dark:text-slate-400">
                                                                                    {comment.content}
                                                                                </p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    <div className="pt-2 space-y-3">
                                                                        <div className="space-y-6">
                                                                            <div className="flex flex-col gap-4">
                                                                                <div className="flex items-center justify-between px-1">
                                                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">Quick Response Matrix</span>
                                                                                    <div className="h-px flex-1 bg-slate-100 mx-4 dark:bg-slate-800" />
                                                                                </div>
                                                                                <div className="flex flex-wrap gap-3">
                                                                                    {[
                                                                                        { label: "Analyzing", text: "We have received your report and our technical team is currently investigating the root cause. We will update you shortly.", color: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/5 dark:text-blue-400 dark:border-blue-500/20" },
                                                                                        { label: "Fix in Progress", text: "We have identified the issue. A correction is currently being implemented by the relevant department.", color: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/5 dark:text-amber-400 dark:border-amber-500/20" },
                                                                                        { label: "Resolved", text: "The issue has been successfully resolved. Please verify on your end and let us know if you need further assistance.", color: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/5 dark:text-emerald-400 dark:border-emerald-500/20" },
                                                                                        { label: "Need Info", text: "Could you please provide more details regarding this incident to help us proceed with the investigation?", color: "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-500/5 dark:text-purple-400 dark:border-purple-500/20" },
                                                                                    ].map((btn) => (
                                                                                        <Button
                                                                                            key={btn.label}
                                                                                            variant="outline"
                                                                                            size="sm"
                                                                                            className={cn("rounded-xl font-bold text-[10px] uppercase tracking-wider h-9 px-4 transition-all hover:scale-105 active:scale-95", btn.color)}
                                                                                            onClick={() => setNewComment(btn.text)}
                                                                                        >
                                                                                            {btn.label}
                                                                                        </Button>
                                                                                    ))}
                                                                                </div>
                                                                            </div>

                                                                            <div className="relative group">
                                                                                <Textarea
                                                                                    placeholder="Type your official administrative response..."
                                                                                    className="min-h-[150px] rounded-2xl sm:rounded-[2rem] border-slate-100 bg-slate-50/50 p-6 sm:p-8 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all resize-none text-slate-700 font-medium leading-relaxed dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 dark:focus:bg-slate-900 text-sm"
                                                                                    value={newComment}
                                                                                    onChange={(e) => setNewComment(e.target.value)}
                                                                                />
                                                                                <div className="absolute bottom-6 right-6 flex items-center gap-4">
                                                                                    <div className="flex -space-x-2">
                                                                                        {[1, 2, 3].map(i => (
                                                                                            <div key={i} className="h-2 w-2 rounded-full bg-primary/20 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                                                                                        ))}
                                                                                    </div>
                                                                                    <Button
                                                                                        onClick={handlePostComment}
                                                                                        disabled={!newComment.trim() || submitting}
                                                                                        className="rounded-2xl px-8 h-12 font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all dark:bg-blue-600 dark:hover:bg-blue-500 dark:shadow-none"
                                                                                    >
                                                                                        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                                                                                        Transmit
                                                                                    </Button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-10">
                                                            {/* Status Management */}
                                                            <div className="space-y-4">
                                                                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 pb-3 dark:border-slate-800 dark:text-slate-500">Command Dispatch</h3>
                                                                <div className="space-y-5 pt-2">
                                                                    <div className="space-y-2">
                                                                        <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Transition Status</label>
                                                                        <Select
                                                                            defaultValue={selectedComplaint.status}
                                                                            onValueChange={(val) => handleUpdateStatus(val)}
                                                                        >
                                                                            <SelectTrigger className="rounded-2xl border-slate-200 h-14 font-bold text-slate-700 bg-slate-50/50 focus:ring-primary/10 transition-all dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200">
                                                                                <SelectValue />
                                                                            </SelectTrigger>
                                                                            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl dark:bg-slate-900 dark:border-slate-800">
                                                                                <SelectItem value="PENDING" className="font-semibold text-sm py-2.5">PENDING</SelectItem>
                                                                                <SelectItem value="IN_PROGRESS" className="font-semibold text-sm py-2.5">IN PROGRESS</SelectItem>
                                                                                <SelectItem value="RESOLVED" className="font-semibold text-sm py-2.5">RESOLVED</SelectItem>
                                                                                <SelectItem value="CLOSED" className="font-semibold text-sm py-2.5">CLOSED</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Resolution Protocol</label>
                                                                        <Textarea
                                                                            className="rounded-2xl border-slate-200 bg-slate-50/50 h-32 placeholder:text-slate-300 font-medium focus:border-primary/30 transition-all p-4 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 dark:placeholder:text-slate-600"
                                                                            placeholder="Document the resolution path or internal notes..."
                                                                            value={resolutionNote}
                                                                            onChange={(e) => setResolutionNote(e.target.value)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Audit Logs */}
                                                            <div className="space-y-4">
                                                                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 pb-3 flex items-center gap-2 dark:border-slate-800 dark:text-slate-500">
                                                                    <History className="h-4 w-4 text-primary" /> Trace Logs
                                                                </h3>
                                                                <div className="space-y-6 pt-3 px-1">
                                                                    {selectedComplaint.auditLogs?.map((log: any) => (
                                                                        <div key={log.id} className="relative pl-6 border-l-2 border-slate-100 py-1 dark:border-slate-800">
                                                                            <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-primary/30 border-2 border-white shadow-sm dark:bg-blue-500/30 dark:border-slate-950" />
                                                                            <span className="text-[10px] font-bold uppercase text-slate-900 mb-1 block dark:text-slate-200">
                                                                                {log.action}
                                                                            </span>
                                                                            <p className="text-[10px] text-slate-500 font-medium leading-tight mb-2 italic dark:text-slate-500">
                                                                                "{log.details}"
                                                                            </p>
                                                                            <div className="flex items-center gap-2 text-[9px] font-bold text-slate-300 uppercase tracking-wider">
                                                                                <span className="text-primary/70">{log.user.name}</span>
                                                                                <span>•</span>
                                                                                <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
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
