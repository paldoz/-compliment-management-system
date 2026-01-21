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
import { Label } from "@/components/ui/label"
import { cn, openBase64InNewTab } from "@/lib/utils"
import { FeedbackModal } from "@/components/complaints/FeedbackModal"

export default function UserComplaintsPage() {
    const { data: session } = useSession()
    const [complaints, setComplaints] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")
    const [selectedComplaint, setSelectedComplaint] = useState<any>(null)
    const [newComment, setNewComment] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false)

    const fetchComplaints = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/user/complaints?status=${statusFilter !== "ALL" ? statusFilter : ""}`)
            const data = await res.json()
            setComplaints(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error(err)
            setComplaints([])
        } finally {
            setLoading(false)
        }
    }

    const refreshSelectedParams = async (id: string) => {
        const refreshed = await fetch(`/api/user/complaints?id=${id}`).then(r => r.json())
        setSelectedComplaint(refreshed)
        // Also update list to reflect changes if any
        fetchComplaints()
    }

    useEffect(() => {
        fetchComplaints()
    }, [statusFilter])

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
                toast.success("Comment sent successfully")
                setNewComment("")
                refreshSelectedParams(selectedComplaint.id)
            } else {
                toast.error("Failed to send comment")
            }
        } catch (err) {
            console.error(err)
            toast.error("An error occurred while sending comment")
        } finally {
            setSubmitting(false)
        }
    }

    const filtered = complaints.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.department?.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-8 pb-12 px-1">
            {/* World-Class 'Mirror Glass' Hero (Registry - Compact) */}
            <div className="relative overflow-hidden group rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl transition-all duration-700 hover:shadow-blue-500/20 bg-slate-950 border border-white/5">
                {/* Branding-Integrated Background Texture */}
                <div
                    className="absolute inset-0 z-0 opacity-20 bg-cover bg-center transition-transform duration-[20000ms] group-hover:scale-110"
                    style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                />

                {/* Sophisticated Radial Flows (Blue & Emerald) */}
                <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[70%] bg-emerald-500/10 blur-[100px] rounded-full animate-pulse delay-700" />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-4 lg:space-y-6">
                        <div className="space-y-1 lg:space-y-2">
                            <div className="flex items-center gap-4">
                                <div className="h-[2px] w-12 bg-gradient-to-r from-blue-500 to-transparent rounded-full" />
                                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-blue-400">Security Log</span>
                            </div>
                            <h1 className="text-3xl lg:text-5xl font-black tracking-tighter text-white uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-emerald-100 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                                Command <span className="text-emerald-400">Registry</span>
                            </h1>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] italic max-w-md">Official surveillance and resolution manifest for high-priority nodes</p>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-3xl rounded-2xl border border-white/10 p-4 px-8 text-center group-hover:bg-white/10 transition-colors">
                        <div className="text-3xl font-black text-white tabular-nums tracking-tighter italic">{complaints.length}</div>
                        <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Active Logs</div>
                    </div>
                </div>
            </div>

            <div className="flex gap-2">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <Input
                        placeholder="Search..."
                        className="pl-9 h-10 bg-white border-slate-200 rounded-xl focus:border-blue-500/30 transition-all font-bold text-xs dark:bg-slate-900 dark:border-slate-800"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[120px] h-10 bg-white border-slate-200 rounded-xl font-bold text-[10px] text-slate-600 dark:bg-slate-900 dark:border-slate-800">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-slate-200 shadow-xl dark:bg-slate-900 dark:border-slate-800">
                        <SelectItem value="ALL" className="font-bold text-[10px] py-2 dark:text-slate-400 uppercase">ALL</SelectItem>
                        <SelectItem value="PENDING" className="font-bold text-[10px] py-2 dark:text-slate-200 uppercase">PENDING</SelectItem>
                        <SelectItem value="IN_PROGRESS" className="font-bold text-[10px] py-2 dark:text-slate-200 uppercase">PROGRESS</SelectItem>
                        <SelectItem value="RESOLVED" className="font-bold text-[10px] py-2 dark:text-slate-200 uppercase">RESOLVED</SelectItem>
                        <SelectItem value="CLOSED" className="font-bold text-[10px] py-2 dark:text-slate-200 uppercase">CLOSED</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {loading ? (
                <div className="flex h-60 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary dark:text-white/20" />
                </div>
            ) : (
                <>
                    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:shadow-none overflow-x-auto custom-scrollbar">
                        <div className="min-w-full">
                            <Table>
                                <TableHeader className="bg-slate-50/50 dark:bg-slate-800/20">
                                    <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                                        <TableHead className="font-bold text-[9px] lg:text-[11px] uppercase tracking-wider text-slate-400 h-10 px-4 lg:px-6 dark:text-slate-500">Header</TableHead>
                                        <TableHead className="hidden lg:table-cell font-bold text-[11px] uppercase tracking-wider text-slate-400 h-12 px-6 dark:text-slate-500">Department</TableHead>
                                        <TableHead className="font-bold text-[9px] lg:text-[11px] uppercase tracking-wider text-slate-400 h-10 px-4 lg:px-6 text-center dark:text-slate-500">Status</TableHead>
                                        <TableHead className="font-bold text-[9px] lg:text-[11px] uppercase tracking-wider text-slate-400 h-10 px-4 lg:px-6 text-right dark:text-slate-500">Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.map((c) => (
                                        <Dialog key={c.id} onOpenChange={(open) => {
                                            if (open) {
                                                setSelectedComplaint(null) // Reset to loading state
                                                fetch(`/api/user/complaints?id=${c.id}`)
                                                    .then(r => r.json())
                                                    .then(data => setSelectedComplaint(data))
                                            }
                                        }}>
                                            <DialogTrigger asChild>
                                                <TableRow className="border-slate-50 hover:bg-slate-50/80 transition-all cursor-pointer group dark:border-slate-800/50 dark:hover:bg-slate-800/20">
                                                    <TableCell className="py-3 lg:py-5 px-4 lg:px-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-0.5 h-8 bg-blue-500/10 rounded-full group-hover:bg-blue-500/30 transition-all"></div>
                                                            <div className="flex flex-col min-w-0">
                                                                <span className="font-bold text-slate-800 text-xs lg:text-base tracking-tight truncate group-hover:text-blue-600 transition-colors dark:text-slate-200 dark:group-hover:text-blue-400">{c.title}</span>
                                                                <span className="lg:hidden text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{c.department?.name || 'Global'}</span>
                                                                <span className="hidden lg:inline text-[10px] font-semibold text-slate-300 uppercase tracking-widest mt-0.5 dark:text-slate-600">ID: {c.id.slice(0, 8)}</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="hidden lg:table-cell px-6">
                                                        <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg border-none font-bold text-[10px] uppercase tracking-wide px-2.5 py-1 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700">
                                                            {c.department?.name || "Global"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center px-4 lg:px-6">
                                                        <Badge className={cn(
                                                            "rounded-lg font-bold text-[8px] lg:text-[10px] tracking-wide px-2 lg:px-3.5 py-1 lg:py-1.5 border transition-all uppercase shrink-0",
                                                            c.status === "PENDING" && "bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-500",
                                                            c.status === "IN_PROGRESS" && "bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-500",
                                                            c.status === "RESOLVED" && "bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-500",
                                                            c.status === "CLOSED" && "bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-600"
                                                        )}>
                                                            {c.status.replace('_', ' ')}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right font-bold text-[10px] lg:text-sm text-slate-400 px-4 lg:px-6 tabular-nums dark:text-slate-500 shrink-0">
                                                        {new Date(c.createdAt).toLocaleDateString()}
                                                    </TableCell>
                                                </TableRow>
                                            </DialogTrigger>
                                            <DialogContent className="w-full h-full max-w-none rounded-none sm:rounded-2xl sm:max-w-4xl sm:w-[95vw] sm:h-[85vh] border-none shadow-2xl p-0 overflow-hidden flex flex-col bg-white dark:bg-slate-950 dark:shadow-none">
                                                <DialogTitle className="sr-only">Complaint Details</DialogTitle>
                                                {selectedComplaint ? (
                                                    <>
                                                        <div className="bg-primary p-5 sm:p-8 text-white relative dark:bg-slate-950 dark:border-b dark:border-slate-800 shrink-0 overflow-hidden">
                                                            {/* Branding texture */}
                                                            <div
                                                                className="absolute inset-0 z-0 opacity-20 bg-cover bg-center mix-blend-overlay"
                                                                style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                                                            />
                                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]" />
                                                            <div className="relative z-10 flex items-center justify-between gap-4">
                                                                <div className="space-y-1 min-w-0 flex-1">
                                                                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-blue-200/50 dark:text-slate-600">Incident Details</span>
                                                                    <div className="flex items-center gap-2 mt-0.5">
                                                                        <h2 className="text-lg sm:text-2xl font-black tracking-tighter truncate">{selectedComplaint.title}</h2>
                                                                        {selectedComplaint.organization?.isVerified && (
                                                                            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 fill-blue-400/10" />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <Badge className="bg-white/10 backdrop-blur-md text-white rounded-lg sm:rounded-xl border border-white/20 font-black uppercase text-[8px] sm:text-[10px] tracking-widest px-3 sm:px-4 py-1.5 sm:py-2 dark:bg-blue-500/10 dark:border-blue-500/20 whitespace-nowrap shrink-0">
                                                                    {selectedComplaint.status}
                                                                </Badge>
                                                            </div>
                                                        </div>

                                                        <div className="flex-1 overflow-y-auto p-4 sm:p-10 space-y-6 sm:space-y-10 bg-slate-50/30 dark:bg-slate-950">
                                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
                                                                <div className="lg:col-span-2 space-y-6 sm:space-y-10">
                                                                    <div className="space-y-3 sm:space-y-4">
                                                                        <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 dark:text-slate-500">
                                                                            <FileText className="h-4 w-4" /> Incident Record
                                                                        </h3>
                                                                        <p className="text-slate-600 font-medium leading-relaxed bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-100 italic dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 text-sm sm:text-base">
                                                                            "{selectedComplaint.description}"
                                                                        </p>
                                                                    </div>

                                                                    {selectedComplaint.attachments?.length > 0 && (
                                                                        <div className="space-y-4">
                                                                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 dark:text-slate-500">
                                                                                <Paperclip className="h-4 w-4" /> Supporting Evidence
                                                                            </h3>
                                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                                {selectedComplaint.attachments.map((file: any) => (
                                                                                    <div
                                                                                        key={file.id}
                                                                                        onClick={() => openBase64InNewTab(file.url)}
                                                                                        className="flex items-center gap-3.5 p-4 rounded-xl border border-slate-100 hover:border-primary/20 hover:bg-slate-50 transition-all bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:hover:border-blue-500/20 cursor-pointer"
                                                                                    >
                                                                                        <div className="p-2.5 bg-slate-50 rounded-lg text-slate-400 dark:bg-slate-800">
                                                                                            <Download className="h-4 w-4" />
                                                                                        </div>
                                                                                        <div className="flex flex-col min-w-0">
                                                                                            <span className="text-xs font-bold text-slate-700 truncate dark:text-slate-200">{file.name}</span>
                                                                                            <span className="text-[10px] text-slate-400 font-medium uppercase mt-0.5 dark:text-slate-500">{file.type.split('/')[1] || 'FILE'}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    <div className="space-y-4 sm:space-y-6 pt-4">
                                                                        <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 dark:text-slate-500">
                                                                            <MessageSquare className="h-4 w-4" /> Communication Hub
                                                                        </h3>
                                                                        <div className="space-y-4 sm:space-y-6">
                                                                            {selectedComplaint.comments?.map((comment: any) => (
                                                                                <div key={comment.id} className={cn(
                                                                                    "p-4 sm:p-5 rounded-xl sm:rounded-2xl border transition-all",
                                                                                    comment.user.role === "USER"
                                                                                        ? "bg-white border-slate-100 shadow-sm mr-6 sm:mr-12 dark:bg-slate-900 dark:border-slate-800"
                                                                                        : "bg-primary text-white border-none ml-6 sm:ml-12 shadow-lg shadow-blue-950/20 dark:bg-blue-600 dark:shadow-none"
                                                                                )}>
                                                                                    <div className="flex items-center justify-between mb-2 sm:mb-2.5 border-b border-current/10 pb-1.5 sm:pb-2">
                                                                                        <div className="flex items-center gap-2">
                                                                                            <UserCircle className="h-4 w-4" />
                                                                                            <span className="text-[10px] font-bold uppercase tracking-wider">{comment.user.name}</span>
                                                                                        </div>
                                                                                        <span className="text-[9px] font-medium opacity-60 tabular-nums">{new Date(comment.createdAt).toLocaleString()}</span>
                                                                                    </div>
                                                                                    <p className="text-sm font-medium leading-relaxed">
                                                                                        {comment.content}
                                                                                    </p>
                                                                                </div>
                                                                            ))}
                                                                            <div className="pt-6 space-y-3">
                                                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 dark:text-slate-600">Send a Response</Label>
                                                                                <div className="flex gap-2">
                                                                                    <Input
                                                                                        className="rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:border-primary/30 h-12 shadow-inner dark:bg-slate-900 dark:border-slate-800 dark:text-white dark:focus:bg-slate-950 dark:placeholder:text-slate-600"
                                                                                        placeholder="Type your message here..."
                                                                                        value={newComment}
                                                                                        onChange={(e) => setNewComment(e.target.value)}
                                                                                    />
                                                                                    <Button
                                                                                        className="bg-primary hover:bg-primary/95 text-white rounded-xl w-14 h-12 shadow-lg shadow-blue-900/10 shrink-0 transition-all active:scale-95 dark:bg-blue-600 dark:hover:bg-blue-500 dark:shadow-none"
                                                                                        onClick={handlePostComment}
                                                                                        disabled={submitting}
                                                                                    >
                                                                                        <Send className="h-4.5 w-4.5" />
                                                                                    </Button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-8">
                                                                    <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-6 space-y-6 dark:bg-slate-900 dark:border-slate-800">

                                                                        {/* Feedback Section */}
                                                                        {(selectedComplaint.status === "RESOLVED" || selectedComplaint.status === "CLOSED" || selectedComplaint.status === "APPROVED") && (
                                                                            <div className="space-y-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                                                                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">Resolution Feedback</h4>
                                                                                {selectedComplaint.rating ? (
                                                                                    <div className="bg-white p-4 rounded-xl border border-slate-100 dark:bg-slate-950 dark:border-slate-800 relative group">
                                                                                        <div className="flex gap-1 text-yellow-400 mb-2">
                                                                                            {[...Array(5)].map((_, i) => (
                                                                                                <span key={i} className={i < selectedComplaint.rating ? "fill-current" : "text-slate-200 dark:text-slate-800"}>★</span>
                                                                                            ))}
                                                                                        </div>
                                                                                        {selectedComplaint.feedback && <p className="text-xs text-slate-600 dark:text-slate-400 italic">"{selectedComplaint.feedback}"</p>}
                                                                                    </div>
                                                                                ) : (
                                                                                    <Button
                                                                                        variant="outline"
                                                                                        onClick={() => setFeedbackModalOpen(true)}
                                                                                        className="w-full justify-start gap-2 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
                                                                                    >
                                                                                        <span>⭐ Rate Resolution</span>
                                                                                    </Button>
                                                                                )}
                                                                            </div>
                                                                        )}

                                                                        <div className="space-y-4">
                                                                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">Assignment Details</h4>
                                                                            <div className="space-y-4 pt-1">
                                                                                <div className="space-y-1">
                                                                                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest dark:text-slate-700">Department</span>
                                                                                    <p className="font-bold text-slate-800 text-sm tracking-tight dark:text-slate-200">{selectedComplaint.department?.name || "Unassigned"}</p>
                                                                                </div>
                                                                                <div className="space-y-1">
                                                                                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest dark:text-slate-700">Active Status</span>
                                                                                    <div className="pt-1">
                                                                                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 rounded-lg font-bold uppercase text-[9px] tracking-widest px-3 py-1 border border-primary/20 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">
                                                                                            {selectedComplaint.status}
                                                                                        </Badge>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                                                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 dark:text-slate-600">
                                                                                <History className="h-4 w-4" /> Activity Log
                                                                            </h4>
                                                                            <div className="space-y-5 pt-2">
                                                                                {selectedComplaint.auditLogs?.map((log: any) => (
                                                                                    <div key={log.id} className="relative pl-6 border-l border-slate-200 dark:border-slate-800">
                                                                                        <div className="absolute -left-[4.5px] top-0 w-2 h-2 rounded-full bg-primary/40 border border-white shadow-sm dark:bg-blue-500/40 dark:border-slate-950"></div>
                                                                                        <span className="text-[10px] font-bold text-slate-700 block leading-tight dark:text-slate-300">
                                                                                            {log.action}
                                                                                        </span>
                                                                                        <p className="text-[9px] text-slate-400 font-medium leading-tight mt-1 truncate dark:text-slate-500">
                                                                                            {log.details}
                                                                                        </p>
                                                                                        <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter mt-1 block dark:text-slate-700">
                                                                                            {new Date(log.createdAt).toLocaleDateString()}
                                                                                        </span>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {feedbackModalOpen && (
                                                            <FeedbackModal
                                                                complaintId={selectedComplaint.id}
                                                                complaintTitle={selectedComplaint.title}
                                                                adminName={selectedComplaint.resolvedBy?.name}
                                                                isOpen={feedbackModalOpen}
                                                                onOpenChange={setFeedbackModalOpen}
                                                                onSuccess={() => refreshSelectedParams(selectedComplaint.id)}
                                                            />
                                                        )}
                                                    </>
                                                ) : (
                                                    <div className="flex h-[80vh] items-center justify-center">
                                                        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20 dark:text-white" />
                                                    </div>
                                                )}
                                            </DialogContent>
                                        </Dialog>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    {filtered.length === 0 && (
                        <div className="text-center py-20 bg-white dark:bg-slate-900">
                            <span className="text-xs font-bold text-slate-300 italic dark:text-slate-600">No inquiries found matching your filters</span>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
