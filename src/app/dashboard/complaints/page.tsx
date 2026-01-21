"use client"

import { useEffect, useState, Suspense } from "react"
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
    Building2,
    X,
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
import { Label } from "@/components/ui/label"
import { cn, openBase64InNewTab } from "@/lib/utils"
import { FeedbackModal } from "@/components/complaints/FeedbackModal"

function ComplaintsContent() {
    const { data: session } = useSession()
    const [complaints, setComplaints] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")
    const [selectedComplaint, setSelectedComplaint] = useState<any>(null)
    const [newComment, setNewComment] = useState("")
    const [submittingComment, setSubmittingComment] = useState(false)
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)

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

    useEffect(() => {
        fetchComplaints()
    }, [statusFilter])

    const handleAddComment = async (complaintId: string) => {
        if (!newComment.trim()) return
        setSubmittingComment(true)
        try {
            const res = await fetch("/api/user/complaints/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ complaintId, content: newComment })
            })
            if (res.ok) {
                setNewComment("")
                // Fetch details again or update local state
                const detailsRes = await fetch(`/api/user/complaints?id=${complaintId}`)
                const updated = await detailsRes.json()
                setSelectedComplaint(updated)
                fetchComplaints()
            }
        } catch (err) {
            console.error(err)
        } finally {
            setSubmittingComment(false)
        }
    }

    const filtered = complaints.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.department?.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-10 pb-24">
            {/* World-Class 'Observation Deck' Mirror Glass Hero */}
            <div className="relative overflow-hidden group rounded-2xl lg:rounded-[2.5rem] p-6 lg:p-10 bg-slate-950 border border-white/5 shadow-2xl transition-all duration-700 shadow-blue-900/10 mx-2 lg:mx-0">
                {/* Branding-Integrated Background Texture */}
                <div
                    className="absolute inset-0 z-0 opacity-20 bg-cover bg-center transition-transform duration-[20000ms] group-hover:scale-110 contrast-[1.1]"
                    style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                />

                {/* Sub-Atmospheric Radial Flows (Blue & Slate) */}
                <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[70%] bg-slate-500/10 blur-[100px] rounded-full animate-pulse delay-700" />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10">
                    <div className="space-y-4 lg:space-y-6">
                        <div className="space-y-1 lg:space-y-2">
                            <div className="flex items-center gap-5">
                                <div className="h-[2px] w-12 bg-gradient-to-r from-blue-500 to-transparent rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.6em] text-blue-400">Communication Node</span>
                            </div>
                            <h1 className="text-3xl lg:text-5xl font-black tracking-tighter leading-none text-white uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white/70 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                Inbound <span className="text-blue-500">Transmissions</span>
                            </h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 backdrop-blur-2xl p-2.5 px-6 rounded-2xl">
                                <div className="h-8 w-8 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/30">
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Link Integrity</span>
                                    <span className="text-sm font-black text-white italic">Node Active</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-blue-500/5 border border-blue-500/20 backdrop-blur-2xl p-2.5 px-6 rounded-2xl">
                                <div className="text-right">
                                    <div className="text-xl lg:text-2xl font-black tracking-tighter text-blue-400 flex items-center gap-2 tabular-nums">
                                        {complaints.length}
                                    </div>
                                    <div className="text-[7px] font-bold text-blue-500/50 uppercase tracking-[0.3em]">Total Archives</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:flex flex-col items-end gap-1 text-right opacity-30 group-hover:opacity-60 transition-opacity">
                        <div className="text-[60px] font-black tracking-tighter text-white/5 leading-none">RX</div>
                        <div className="text-[8px] font-black text-white/50 tracking-[1em] uppercase">Intelligence Layer Alpha</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 px-2 lg:px-0">
                <div className="relative group flex-1">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Scan archives by title or unit..."
                        className="pl-14 h-14 border-slate-200 bg-white rounded-2xl focus:border-primary/30 focus:ring-primary/10 font-medium transition-all shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[240px] h-14 border-slate-200 bg-white rounded-2xl focus:ring-primary/10 font-bold text-slate-700 shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400">
                        <SelectValue placeholder="System Filter" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-100 shadow-2xl dark:bg-slate-900 dark:border-slate-800">
                        <SelectItem value="ALL" className="font-bold text-slate-400">ALL RECORDS</SelectItem>
                        <SelectItem value="PENDING" className="font-semibold text-sm py-2.5 dark:text-slate-200">PENDING</SelectItem>
                        <SelectItem value="IN_PROGRESS" className="font-semibold text-sm py-2.5 dark:text-slate-200">IN PROGRESS</SelectItem>
                        <SelectItem value="RESOLVED" className="font-semibold text-sm py-2.5 dark:text-slate-200">RESOLVED</SelectItem>
                        <SelectItem value="CLOSED" className="font-semibold text-sm py-2.5 dark:text-slate-200">CLOSED</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {loading ? (
                <div className="flex h-60 items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary/30" />
                </div>
            ) : (
                <Card className="rounded-[2.5rem] border-none bg-white shadow-xl shadow-blue-900/5 overflow-hidden dark:bg-slate-900 dark:shadow-none">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 border-slate-100 hover:bg-slate-50/50 dark:bg-slate-950/20 dark:border-slate-800">
                                <TableHead className="py-5 px-8 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Archive Record</TableHead>
                                <TableHead className="py-5 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Functional Unit</TableHead>
                                <TableHead className="py-5 font-bold text-slate-400 uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                                <TableHead className="py-5 px-8 font-bold text-slate-400 uppercase text-[10px] tracking-widest text-right">Timestamp</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((c) => (
                                <Dialog key={c.id}>
                                    <DialogTrigger asChild>
                                        <TableRow
                                            className="border-slate-50 hover:bg-slate-50/30 transition-colors cursor-pointer group dark:border-slate-800 dark:hover:bg-slate-800/30"
                                            onClick={async () => {
                                                const res = await fetch(`/api/user/complaints?id=${c.id}`)
                                                const data = await res.json()
                                                setSelectedComplaint(data)
                                            }}
                                        >
                                            <TableCell className="py-6 px-8">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-bold text-slate-900 text-base group-hover:text-primary transition-colors leading-tight dark:text-white dark:group-hover:text-blue-400">{c.title}</span>
                                                    <span className="text-[10px] font-mono text-slate-300 font-medium tracking-tight dark:text-slate-700">TXID-{c.id.slice(0, 8).toUpperCase()}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 rounded-lg font-bold text-[9px] uppercase tracking-widest px-2.5 py-1 border-none dark:bg-slate-800 dark:text-slate-400">
                                                    {c.department?.name || "Global"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge className={cn(
                                                    "rounded-lg font-bold uppercase text-[9px] tracking-widest px-3 py-1.5 shadow-sm border-none transition-all duration-300",
                                                    c.status === "PENDING" && "bg-amber-500 text-white shadow-amber-500/20",
                                                    c.status === "IN_PROGRESS" && "bg-primary text-white shadow-blue-500/20",
                                                    c.status === "RESOLVED" && "bg-emerald-500 text-white shadow-emerald-500/20",
                                                    c.status === "CLOSED" && "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600"
                                                )}>
                                                    {c.status.replace('_', ' ')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-xs text-slate-400 px-8 tabular-nums dark:text-slate-600">
                                                {new Date(c.createdAt).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    </DialogTrigger>
                                    <DialogContent className="w-full h-full max-w-none rounded-none sm:rounded-[3rem] sm:max-w-3xl sm:max-h-[85vh] border-none shadow-2xl p-0 overflow-hidden flex flex-col dark:bg-slate-950">
                                        <DialogTitle className="sr-only">Transmission Analysis</DialogTitle>
                                        {selectedComplaint ? (
                                            <>
                                                {/* Analysis Hero Section */}
                                                <div className="bg-slate-950 p-6 sm:p-10 text-white relative overflow-hidden shrink-0 group">
                                                    {/* Branding texture */}
                                                    <div
                                                        className="absolute inset-0 z-0 opacity-20 bg-cover bg-center mix-blend-overlay transition-transform duration-[20000ms] group-hover:scale-110"
                                                        style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                                                    />

                                                    {/* Analysis Radial Flows (Blue & Ember) */}
                                                    <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                                                        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-blue-600/20 blur-[130px] rounded-full animate-pulse" />
                                                        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[70%] bg-amber-500/10 blur-[100px] rounded-full animate-pulse delay-700" />
                                                    </div>

                                                    <div className="relative z-10 flex flex-col gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <Badge className="bg-blue-500 rounded-lg text-[9px] font-black tracking-[0.2em] px-3 h-6 uppercase border-none">Analysis Protocol</Badge>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest tabular-nums">ID: {selectedComplaint.id.slice(0, 12)}</span>
                                                        </div>
                                                        <h2 className="text-2xl sm:text-4xl font-black tracking-tighter leading-tight text-white uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white/70">
                                                            {selectedComplaint.title}
                                                        </h2>
                                                    </div>
                                                </div>

                                                <div className="flex-1 overflow-y-auto min-h-0 bg-white dark:bg-slate-950 custom-scrollbar">
                                                    <div className="p-8 sm:p-10 space-y-12">
                                                        {/* Narratives & Metadata */}
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                                            <div className="md:col-span-2 space-y-4">
                                                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600 ml-1">Transmission Cipher</h3>
                                                                <div className="relative group">
                                                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-transparent rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                    <p className="relative text-slate-700 dark:text-slate-300 font-medium leading-relaxed bg-slate-50/50 dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 text-lg">
                                                                        {selectedComplaint.description}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-8">
                                                                <div className="space-y-4">
                                                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600 ml-1">Contextual State</h3>
                                                                    <div className="space-y-3">
                                                                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em]">Unit</span>
                                                                            <span className="font-bold text-slate-900 dark:text-white text-xs uppercase">{selectedComplaint.department?.name || "Global"}</span>
                                                                        </div>
                                                                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em]">Status</span>
                                                                            <Badge className="bg-primary/10 text-primary dark:bg-blue-500/10 dark:text-blue-400 border-none rounded-lg text-[9px] font-black px-2.5">
                                                                                {selectedComplaint.status}
                                                                            </Badge>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Attachments Section */}
                                                                {selectedComplaint.attachments?.length > 0 && (
                                                                    <div className="space-y-4">
                                                                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600 ml-1">Payload Assets</h3>
                                                                        <div className="grid grid-cols-1 gap-3">
                                                                            {selectedComplaint.attachments.map((at: any) => (
                                                                                <button
                                                                                    key={at.id}
                                                                                    onClick={() => openBase64InNewTab(at.url)}
                                                                                    className="flex items-center gap-3 p-3.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-primary/30 hover:shadow-md transition-all group"
                                                                                >
                                                                                    <div className="h-9 w-9 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                                                        <Paperclip className="h-4 w-4 text-slate-400 group-hover:text-primary" />
                                                                                    </div>
                                                                                    <div className="flex flex-col items-start min-w-0">
                                                                                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate w-full">{at.name}</span>
                                                                                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{at.type.split('/')[1]} asset</span>
                                                                                    </div>
                                                                                    <Download className="h-3.5 w-3.5 ml-auto text-slate-200 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Activity Log / Feed Section */}
                                                        <div className="space-y-8">
                                                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="h-10 w-10 rounded-2xl bg-slate-900 dark:bg-blue-600 flex items-center justify-center">
                                                                        <History className="h-5 w-5 text-white" />
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Activity Chronicle</h3>
                                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Temporal Feed</p>
                                                                    </div>
                                                                </div>
                                                                {selectedComplaint.status === 'RESOLVED' && (
                                                                    <Button
                                                                        onClick={() => setIsFeedbackOpen(true)}
                                                                        className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] uppercase tracking-widest px-6 h-10 shadow-lg shadow-amber-500/20 active:scale-95"
                                                                    >
                                                                        Transmit Feedback
                                                                    </Button>
                                                                )}
                                                            </div>

                                                            <div className="space-y-6">
                                                                <div className="grid gap-6">
                                                                    {selectedComplaint.comments?.map((comment: any) => (
                                                                        <div key={comment.id} className="flex gap-5 animate-in slide-in-from-bottom-2 duration-500">
                                                                            <div className="flex flex-col items-center">
                                                                                <div className={cn(
                                                                                    "h-10 w-10 rounded-2xl flex items-center justify-center p-0.5 border-2 shrink-0",
                                                                                    comment.user.role === 'USER' ? "border-slate-100 bg-slate-50 dark:bg-slate-900 dark:border-slate-800" : "border-primary/20 bg-primary/5 dark:bg-blue-600 shadow-blue-500/10"
                                                                                )}>
                                                                                    <UserCircle className={cn("h-6 w-6", comment.user.role === 'USER' ? "text-slate-300" : "text-primary dark:text-white")} />
                                                                                </div>
                                                                                <div className="w-[2px] flex-1 bg-slate-100 dark:bg-slate-800 my-2 rounded-full" />
                                                                            </div>
                                                                            <div className="flex-1 space-y-2 pb-6">
                                                                                <div className="flex items-center justify-between">
                                                                                    <div className="flex items-center gap-3">
                                                                                        <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{comment.user.name}</span>
                                                                                        <Badge className={cn(
                                                                                            "text-[8px] font-black tracking-[0.15em] px-2 h-4 border-none",
                                                                                            comment.user.role === 'USER' ? "bg-slate-100 text-slate-400" : "bg-blue-600 text-white"
                                                                                        )}>
                                                                                            {comment.user.role.replace('_', ' ')}
                                                                                        </Badge>
                                                                                    </div>
                                                                                    <span className="text-[9px] font-bold text-slate-300 dark:text-slate-700 italic">{new Date(comment.createdAt).toLocaleString()}</span>
                                                                                </div>
                                                                                <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-800">
                                                                                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{comment.content}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>

                                                                {/* Comment Input */}
                                                                <div className="pt-4 sticky bottom-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl -mx-2 px-2 pb-2">
                                                                    <div className="relative group">
                                                                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-[2rem] blur opacity-10 group-focus-within:opacity-25 transition-opacity" />
                                                                        <div className="relative flex gap-3 bg-white dark:bg-slate-900 p-3 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl">
                                                                            <Textarea
                                                                                placeholder="Type transmission..."
                                                                                className="min-h-[56px] h-[56px] border-none focus-visible:ring-0 bg-transparent py-4 px-4 font-medium resize-none text-slate-700 dark:text-slate-200"
                                                                                value={newComment}
                                                                                onChange={(e) => setNewComment(e.target.value)}
                                                                            />
                                                                            <Button
                                                                                size="icon"
                                                                                disabled={submittingComment || !newComment.trim()}
                                                                                onClick={() => handleAddComment(selectedComplaint.id)}
                                                                                className="h-10 w-10 shrink-0 bg-slate-900 hover:bg-black text-white rounded-2xl shadow-lg active:scale-95 transition-all dark:bg-blue-600 dark:hover:bg-blue-500"
                                                                            >
                                                                                {submittingComment ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="h-96 flex flex-col items-center justify-center p-10 space-y-4">
                                                <Loader2 className="h-10 w-10 animate-spin text-primary/20" />
                                                <span className="text-[11px] font-black text-slate-300 uppercase tracking-[0.4em]">Deciphering Archive...</span>
                                            </div>
                                        )}
                                    </DialogContent>
                                </Dialog>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}

            {selectedComplaint && (
                <FeedbackModal
                    isOpen={isFeedbackOpen}
                    onOpenChange={setIsFeedbackOpen}
                    complaintId={selectedComplaint.id}
                    complaintTitle={selectedComplaint.title}
                    adminName={selectedComplaint.admin?.name}
                    existingRating={selectedComplaint.rating}
                    existingFeedback={selectedComplaint.feedback}
                    onSuccess={() => {
                        fetchComplaints()
                        // Refresh details
                        fetch(`/api/user/complaints?id=${selectedComplaint.id}`)
                            .then(res => res.json())
                            .then(data => setSelectedComplaint(data))
                    }}
                />
            )}
        </div>
    )
}

export default function UserComplaintsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-96 items-center justify-center p-12">
                <div className="flex flex-col items-center gap-6">
                    <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
                    <div className="space-y-1 text-center">
                        <span className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400 block">System Synchronization</span>
                        <p className="text-[9px] font-bold text-slate-300 uppercase italic tracking-widest">Initializing Secure Comms Layer</p>
                    </div>
                </div>
            </div>
        }>
            <ComplaintsContent />
        </Suspense>
    )
}
