"use client"

import { useEffect, useState } from "react"
import {
    Building2,
    Plus,
    Edit2,
    Trash2,
    Loader2,
    Search,
    Users,
    FileText,
    CheckCircle2,
    XCircle,
    UserPlus,
    Calendar
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState<any[]>([])
    const [availableUsers, setAvailableUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [formData, setFormData] = useState({ id: "", name: "", slug: "", description: "", isActive: true })
    const [submitting, setSubmitting] = useState(false)

    const fetchData = async () => {
        setLoading(true)
        try {
            const [deptRes, userRes] = await Promise.all([
                fetch("/api/superadmin/departments"),
                fetch("/api/superadmin/users")
            ])
            const deptData = await deptRes.json()
            const userData = await userRes.json()
            setDepartments(deptData)
            setAvailableUsers(userData.filter((u: any) => u.role !== "SUPER_ADMIN"))
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            const method = formData.id ? "PATCH" : "POST"
            const res = await fetch("/api/superadmin/departments", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                setIsCreateOpen(false)
                setIsEditOpen(false)
                setFormData({ id: "", name: "", slug: "", description: "", isActive: true })
                fetchData()
            }
        } catch (err) {
            console.error(err)
        } finally {
            setSubmitting(false)
        }
    }

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        if (!confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this department?`)) return
        try {
            await fetch("/api/superadmin/departments", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, isActive: !currentStatus })
            })
            fetchData()
        } catch (err) {
            console.error(err)
        }
    }

    const filtered = departments.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.slug.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-10 pb-24">
            {/* World-Class 'Structural Hierarchy' Mirror Glass Hero (Compact) */}
            <div className="relative overflow-hidden group rounded-2xl lg:rounded-[2.5rem] p-6 lg:p-10 bg-slate-950 border border-white/5 shadow-2xl transition-all duration-700 shadow-blue-900/10 mx-2">
                {/* Branding-Integrated Background Texture */}
                <div
                    className="absolute inset-0 z-0 opacity-20 bg-cover bg-center transition-transform duration-[20000ms] group-hover:scale-110 contrast-[1.1]"
                    style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                />

                {/* Infrastructure Radial Flows (Indigo & Violet) */}
                <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-indigo-600/20 blur-[130px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[70%] bg-violet-500/15 blur-[110px] rounded-full animate-pulse delay-700" />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10">
                    <div className="space-y-4 lg:space-y-6">
                        <div className="space-y-1 lg:space-y-2">
                            <div className="flex items-center gap-5">
                                <div className="h-[2px] w-12 bg-gradient-to-r from-indigo-500 to-transparent rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                                <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.6em] text-indigo-400">Governance Framework</span>
                            </div>
                            <h1 className="text-3xl lg:text-5xl font-black tracking-tighter leading-none text-white uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-white/70 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                Structural <span className="text-indigo-500">Units</span>
                            </h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 backdrop-blur-2xl p-2.5 px-6 rounded-2xl">
                                <div className="h-8 w-8 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/30">
                                    <Building2 className="h-4 w-4 text-indigo-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Functional Node</span>
                                    <span className="text-sm font-black text-white italic">Governance Layer</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:flex flex-col items-end gap-1 text-right opacity-30 group-hover:opacity-60 transition-opacity">
                        <div className="text-[60px] font-black tracking-tighter text-white/5 leading-none">CORE</div>
                        <div className="text-[8px] font-black text-white/50 tracking-[1em] uppercase">Stack Layer v1.8</div>
                    </div>
                </div>
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/95 text-white rounded-2xl h-14 px-8 font-bold shadow-xl shadow-blue-900/20 transition-all active:scale-95">
                        <Plus className="mr-2.5 h-5 w-5" /> Deploy New Unit
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-full h-full max-w-none rounded-none sm:rounded-[3rem] sm:max-w-2xl sm:h-auto border-none shadow-2xl p-0 overflow-hidden flex flex-col bg-white dark:bg-slate-950">
                    <div className="bg-slate-950 p-6 sm:p-10 text-white relative overflow-hidden shrink-0 border-b border-white/5 group">
                        {/* Branding texture */}
                        <div
                            className="absolute inset-0 z-0 opacity-20 bg-cover bg-center mix-blend-overlay transition-transform duration-[20000ms] group-hover:scale-110"
                            style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                        />

                        {/* Infrastructure Radial Flows (Indigo & Blue) */}
                        <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-indigo-600/20 blur-[130px] rounded-full animate-pulse" />
                            <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[70%] bg-blue-500/10 blur-[100px] rounded-full animate-pulse delay-700" />
                        </div>

                        <div className="relative z-10">
                            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.6em] text-indigo-400 block mb-2">Unit Deployment Protocol</span>
                            <DialogTitle className="text-2xl sm:text-4xl font-black tracking-tighter leading-tight text-white uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-white/70">
                                Strategic <span className="text-indigo-500">Deployment</span>
                            </DialogTitle>
                            <DialogDescription className="text-slate-500 font-bold uppercase tracking-widest text-[8px] sm:text-[9px] mt-2">Initializing new functional node in organizational hierarchy</DialogDescription>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 sm:p-10 space-y-6 bg-white dark:bg-slate-950">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Identity Name</Label>
                                    <Input
                                        className="h-12 rounded-xl border-slate-200 focus:border-primary/30 focus:ring-primary/10 font-medium dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                                        placeholder="Water Resources"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">System Slug</Label>
                                    <Input
                                        className="h-12 rounded-xl border-slate-200 bg-slate-50/50 font-mono text-[10px] sm:text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                                        placeholder="water-resources"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Functional Description</Label>
                                <Textarea
                                    className="rounded-xl border-slate-200 h-28 focus:border-primary/30 focus:ring-primary/10 resize-none font-medium text-sm p-4 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                                    placeholder="Management of water supply and billing issues."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 sm:p-5 bg-slate-50/50 rounded-2xl border border-slate-100 dark:bg-slate-900/50 dark:border-slate-800">
                                <div className="space-y-1">
                                    <Label className="font-bold text-slate-900 text-sm">Active Operational Status</Label>
                                    <p className="text-xs text-slate-400 font-medium">Enable or disable this organizational node</p>
                                </div>
                                <Switch
                                    checked={formData.isActive}
                                    onCheckedChange={(val) => setFormData({ ...formData, isActive: val })}
                                />
                            </div>
                            <div className="pt-4">
                                <Button type="submit" className="w-full bg-primary hover:bg-primary/95 text-white font-bold h-14 rounded-2xl shadow-xl shadow-blue-900/10 transition-all active:scale-[0.98] dark:bg-blue-600 dark:hover:bg-blue-500 dark:shadow-none" disabled={submitting}>
                                    {submitting ? "Processing Node..." : "Authorize Unit Deployment"}
                                </Button>
                            </div>
                        </form>
                    </div>
            </Dialog>

            <div className="relative group px-2">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input
                    placeholder="Search units by name or identifier..."
                    className="pl-14 h-14 border-slate-200 bg-white rounded-2xl focus:border-primary/30 focus:ring-primary/10 font-medium transition-all shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {
                loading ? (
                    <div className="flex h-60 items-center justify-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary/30" />
                    </div>
                ) : (
                    <Card className="rounded-[2.5rem] border-none bg-white shadow-xl shadow-blue-900/5 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50 border-slate-100 hover:bg-slate-50/50">
                                    <TableHead className="py-5 px-8 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Structural Unit</TableHead>
                                    <TableHead className="py-5 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Administrative Lead</TableHead>
                                    <TableHead className="py-5 font-bold text-slate-400 uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                                    <TableHead className="py-5 font-bold text-slate-400 uppercase text-[10px] tracking-widest text-center">Created</TableHead>
                                    <TableHead className="py-5 px-8 font-bold text-slate-400 uppercase text-[10px] tracking-widest text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((dept) => (
                                    <TableRow key={dept.id} className="border-slate-50 hover:bg-slate-50/30 transition-colors group">
                                        <TableCell className="py-6 px-8">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-bold text-slate-900 text-base group-hover:text-primary transition-colors">{dept.name}</span>
                                                <span className="text-[10px] font-mono text-slate-300 font-medium uppercase tracking-tighter">{dept.slug}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-[200px]">
                                            <div className="flex flex-wrap gap-1.5">
                                                {dept.users && dept.users.length > 0 ? (
                                                    dept.users.map((u: any) => (
                                                        <Badge key={u.id} className="bg-blue-50/50 text-primary hover:bg-blue-50 rounded-lg border border-blue-100/50 text-[9px] font-bold uppercase py-1 px-2.5">
                                                            {u.name}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-slate-300 text-[10px] font-bold uppercase tracking-wider ml-1">Unassigned</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge className={cn(
                                                "rounded-lg font-bold uppercase text-[9px] tracking-widest px-3 py-1.5 shadow-sm border-none",
                                                dept.isActive ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                                            )}>
                                                {dept.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center font-bold text-[11px] text-slate-400 tabular-nums">
                                            <div className="flex items-center justify-center gap-2">
                                                <Calendar className="h-3 w-3 text-slate-200" />
                                                {new Date(dept.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right px-8">
                                            <div className="flex justify-end gap-3">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="rounded-xl border-slate-200 hover:border-primary hover:text-primary font-bold text-[10px] h-9 px-4 transition-all"
                                                    onClick={() => {
                                                        setFormData({ id: dept.id, name: dept.name, slug: dept.slug, description: dept.description || "", isActive: dept.isActive })
                                                        setIsEditOpen(true)
                                                    }}
                                                >
                                                    Modify
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className={cn(
                                                        "rounded-xl border-slate-200 font-bold text-[10px] h-9 w-28 transition-all",
                                                        dept.isActive ? "hover:bg-red-50 hover:border-red-100 hover:text-red-500" : "bg-slate-900 border-slate-900 text-white hover:bg-slate-800"
                                                    )}
                                                    onClick={() => toggleStatus(dept.id, dept.isActive)}
                                                >
                                                    {dept.isActive ? "Deactivate" : "Authorize"}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                )
            }

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="w-full h-full max-w-none rounded-none sm:rounded-[3rem] sm:max-w-lg sm:h-auto border-none shadow-2xl p-0 overflow-hidden flex flex-col bg-white dark:bg-slate-950">
                    <div className="bg-slate-950 p-6 sm:p-8 text-white relative overflow-hidden shrink-0 border-b border-white/5 group">
                        {/* Branding texture */}
                        <div
                            className="absolute inset-0 z-0 opacity-20 bg-cover bg-center mix-blend-overlay transition-transform duration-[20000ms] group-hover:scale-110"
                            style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                        />

                        {/* Infrastructure Radial Flows (Indigo & Blue) */}
                        <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-indigo-600/20 blur-[130px] rounded-full animate-pulse" />
                            <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[70%] bg-blue-500/10 blur-[100px] rounded-full animate-pulse delay-700" />
                        </div>

                        <div className="relative z-10">
                            <span className="text-[9px] font-black uppercase tracking-[0.6em] text-indigo-400 block mb-1">Governance Adjustment</span>
                            <DialogTitle className="text-xl sm:text-3xl font-black tracking-tighter leading-tight text-white uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-white/70">
                                Modify <span className="text-indigo-500">Structural Unit</span>
                            </DialogTitle>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-white dark:bg-slate-950">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Official Name</Label>
                                <Input
                                    className="h-12 rounded-xl border-slate-200 focus:border-primary/30 focus:ring-primary/10 font-medium"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Functional Mission</Label>
                                <Textarea
                                    className="rounded-xl border-slate-200 h-28 focus:border-primary/30 focus:ring-primary/10 resize-none font-medium text-sm p-4"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                                <div className="space-y-1">
                                    <Label className="font-bold text-slate-900 text-sm">Operational State</Label>
                                    <p className="text-xs text-slate-400 font-medium">Node is currently {formData.isActive ? 'ONLINE' : 'OFFLINE'}</p>
                                </div>
                                <Switch
                                    checked={formData.isActive}
                                    onCheckedChange={(val) => setFormData({ ...formData, isActive: val })}
                                />
                            </div>
                            <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-14 rounded-2xl shadow-xl shadow-blue-900/10 transition-all active:scale-[0.98] mt-2 dark:bg-blue-600 dark:hover:bg-blue-500 dark:shadow-none" disabled={submitting}>
                                {submitting ? "Updating Registry..." : "Commit Structural Changes"}
                            </Button>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </div >
    )
}
