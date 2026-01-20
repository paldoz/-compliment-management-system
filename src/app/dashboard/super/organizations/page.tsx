"use client"

import { useEffect, useState } from "react"
import {
    Building2,
    Plus,
    Users,
    Trash2,
    Edit2,
    CheckCircle2,
    XCircle,
    Loader2,
    Search,
    UserPlus,
    Building,
    Activity,
    LineChart,
    ArrowLeft,
    Clock,
    CheckCircle,
    AlertCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface Department {
    id: string
    name: string
    slug: string
    _count: {
        complaints: number
    }
}

interface Organization {
    id: string
    name: string
    slug: string
    description: string | null
    isActive: boolean
    isVerified: boolean
    departments: Department[]
    _count: {
        departments: number
        users: number
        complaints: number
    }
}

// Enhanced Interfaces
interface User {
    id: string
    name: string
    email: string
    role: string
    image?: string | null
}

interface DetailedComplaint {
    id: string
    title: string
    status: string
    priority: string
    createdAt: string
    user: {
        id: string
        name: string
        email: string
        image: string | null
        username?: string | null
        gender?: string | null
    }
    resolvedBy?: {
        id: string
        name: string
        email: string
        image: string | null
        username?: string | null
        gender?: string | null
    } | null
}

interface DetailedDepartment extends Department {
    complaints: DetailedComplaint[]
    _count: {
        complaints: number
        users: number
    }
}

export default function OrganizationsPage() {
    const [organizations, setOrganizations] = useState<Organization[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    // Create Org Modal State
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newOrg, setNewOrg] = useState<{ name: string, slug: string, description: string, isVerified: boolean, departments: { name: string, slug: string }[] }>({
        name: "",
        slug: "",
        description: "",
        isVerified: false,
        departments: []
    })
    const [tempDeptName, setTempDeptName] = useState("")
    const [submitting, setSubmitting] = useState(false)

    // Assign Admin Modal State
    const [isAssignOpen, setIsAssignOpen] = useState(false)
    const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null)
    const [selectedUserId, setSelectedUserId] = useState<string>("")

    // Manage Depts Modal State
    const [isDeptOpen, setIsDeptOpen] = useState(false)
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)
    const [editDeptId, setEditDeptId] = useState<string | null>(null)
    const [editDeptName, setEditDeptName] = useState("")
    const [isAddingDept, setIsAddingDept] = useState(false)
    const [newDeptName, setNewDeptName] = useState("")

    // Detailed Dept View State
    const [viewingDeptId, setViewingDeptId] = useState<string | null>(null)
    const [detailedDept, setDetailedDept] = useState<DetailedDepartment | null>(null)
    const [loadingDept, setLoadingDept] = useState(false)

    useEffect(() => {
        fetchOrganizations()
        fetchUsers()
    }, [])

    const fetchDepartmentDetails = async (deptId: string) => {
        setLoadingDept(true)
        setViewingDeptId(deptId)
        try {
            const res = await fetch(`/api/superadmin/departments/${deptId}`)
            if (res.ok) {
                const data = await res.json()
                setDetailedDept(data)
            } else {
                toast.error("Failed to fetch department details")
                setViewingDeptId(null)
            }
        } catch (err) {
            toast.error("Error loading analytics")
            setViewingDeptId(null)
        } finally {
            setLoadingDept(false)
        }
    }

    const handleAddDept = async () => {
        if (!newDeptName.trim() || !selectedOrg) return
        setSubmitting(true)
        try {
            const res = await fetch("/api/superadmin/departments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newDeptName,
                    slug: newDeptName.toLowerCase().replace(/\s+/g, '-'),
                    organizationId: selectedOrg.id
                })
            })
            if (res.ok) {
                toast.success("New node provisioned")
                setNewDeptName("")
                setIsAddingDept(false)
                fetchOrganizations()
                // Update local state
                const added = await res.json()
                setSelectedOrg({
                    ...selectedOrg,
                    departments: [...selectedOrg.departments, { ...added, _count: { complaints: 0 } }]
                })
            } else {
                toast.error("Failed to provision node")
            }
        } catch (err) {
            toast.error("Error provisioning node")
        } finally {
            setSubmitting(false)
        }
    }

    const fetchOrganizations = async () => {
        try {
            const res = await fetch("/api/superadmin/organizations")
            const data = await res.json()
            setOrganizations(data)
        } catch (err) {
            toast.error("Failed to fetch organizations")
        } finally {
            setLoading(false)
        }
    }

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/superadmin/users")
            const data = await res.json()
            // Filter only regular users or those without orgs to assign as admins
            setUsers(data.filter((u: User) => u.role !== "SUPER_ADMIN"))
        } catch (err) {
            toast.error("Failed to fetch users")
        }
    }

    const handleCreateOrg = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            const res = await fetch("/api/superadmin/organizations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newOrg)
            })
            const data = await res.json()
            if (res.ok) {
                toast.success("Organization created with 4 default departments!")
                setIsCreateOpen(false)
                setNewOrg({ name: "", slug: "", description: "", isVerified: false, departments: [] })
                fetchOrganizations()
            } else {
                toast.error(data.error || "Failed to create organization")
            }
        } catch (err) {
            toast.error("Error creating organization")
        } finally {
            setSubmitting(false)
        }
    }

    const handleUpdateDept = async (id: string) => {
        if (!editDeptName.trim()) return
        setSubmitting(true)
        try {
            const res = await fetch("/api/superadmin/departments", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, name: editDeptName })
            })
            if (res.ok) {
                toast.success("Department updated")
                setEditDeptId(null)
                fetchOrganizations()
                // Update local state if needed
                if (selectedOrg) {
                    const updatedDepts = selectedOrg.departments.map(d =>
                        d.id === id ? { ...d, name: editDeptName } : d
                    )
                    setSelectedOrg({ ...selectedOrg, departments: updatedDepts })
                }
            } else {
                toast.error("Failed to update department")
            }
        } catch (err) {
            toast.error("Error updating department")
        } finally {
            setSubmitting(false)
        }
    }

    const handleAssignAdmin = async () => {
        if (!selectedOrgId || !selectedUserId) return
        setSubmitting(true)
        try {
            const res = await fetch("/api/superadmin/organizations/admins", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ organizationId: selectedOrgId, userIds: [selectedUserId] })
            })
            if (res.ok) {
                toast.success("Admin assigned successfully")
                setIsAssignOpen(false)
                setSelectedUserId("")
                fetchOrganizations()
            } else {
                const data = await res.json()
                toast.error(data.error || "Failed to assign admin")
            }
        } catch (err) {
            toast.error("Error assigning admin")
        } finally {
            setSubmitting(false)
        }
    }

    const toggleVerification = async (id: string, currentStatus: boolean) => {
        const newStatus = !currentStatus
        // Optimistic update
        setOrganizations(prev => prev.map(o => o.id === id ? { ...o, isVerified: newStatus } : o))

        try {
            const res = await fetch("/api/superadmin/organizations", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, isVerified: newStatus })
            })
            if (!res.ok) {
                toast.error("Failed to update status")
                setOrganizations(prev => prev.map(o => o.id === id ? { ...o, isVerified: currentStatus } : o))
            } else {
                toast.success(`Entity ${newStatus ? 'Verified' : 'Unverified'}`)
            }
        } catch (err) {
            toast.error("Error updating status")
            setOrganizations(prev => prev.map(o => o.id === id ? { ...o, isVerified: currentStatus } : o))
        }
    }

    const handleDeleteOrg = async (id: string) => {
        if (!confirm("Are you sure? This will delete all departments and data associated with this organization.")) return

        // Optimistic update
        const previousOrgs = [...organizations]
        setOrganizations(prev => prev.filter(o => o.id !== id))

        try {
            const res = await fetch(`/api/superadmin/organizations?id=${id}`, { method: "DELETE" })
            if (res.ok) {
                toast.success("Organization deleted")
            } else {
                toast.error("Failed to delete organization")
                setOrganizations(previousOrgs)
            }
        } catch (err) {
            toast.error("Error deleting organization")
            setOrganizations(previousOrgs)
        }
    }

    const filteredOrgs = organizations.filter(org =>
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.slug.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Helper to find dept with most complaints
    const getTopDept = (depts: Department[]) => {
        if (!depts.length) return null
        return [...depts].sort((a, b) => b._count.complaints - a._count.complaints)[0]
    }

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-black dark:text-white" />
            </div>
        )
    }

    return (
        <div className="space-y-8 md:space-y-12 pb-16 md:pb-24">
            {/* World-Class 'Entity Registry' Hero (Compact) */}
            <div className="relative overflow-hidden group rounded-2xl lg:rounded-[2.5rem] p-6 lg:p-10 bg-slate-950 border border-white/5 shadow-2xl transition-all duration-700">
                <div
                    className="absolute inset-0 z-0 opacity-20 bg-cover bg-center transition-transform duration-[20000ms] group-hover:scale-110 contrast-[1.1] hue-rotate-[15deg]"
                    style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                />

                <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-blue-600/15 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[70%] bg-cyan-500/10 blur-[100px] rounded-full animate-pulse delay-700" />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10">
                    <div className="space-y-4 lg:space-y-6">
                        <div className="space-y-1 lg:space-y-2">
                            <div className="flex items-center gap-4">
                                <div className="h-[2px] w-12 bg-gradient-to-r from-blue-500 to-transparent rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-blue-400">Registry Infrastructure</span>
                            </div>
                            <h1 className="text-3xl lg:text-6xl font-black tracking-tighter text-white uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white/70">
                                Management <span className="text-blue-500">Nodes</span>
                            </h1>
                        </div>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="group relative w-full lg:w-auto h-14 lg:h-16 px-8 lg:px-12 rounded-2xl lg:rounded-[1.5rem] bg-blue-600 hover:bg-blue-500 text-white transition-all duration-500 font-black overflow-hidden shadow-2xl shadow-blue-600/40 active:scale-95 border border-blue-400/30">
                                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                                <div className="relative flex items-center justify-center gap-4">
                                    <Plus className="h-5 w-5 lg:h-6 lg:w-6 group-hover:rotate-90 transition-transform duration-500" />
                                    <span className="text-sm lg:text-base uppercase tracking-tighter italic">Provision Entity</span>
                                </div>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="w-full h-full max-w-none rounded-none sm:rounded-[3rem] sm:max-w-xl sm:h-auto sm:max-h-[90vh] p-0 overflow-hidden border-none shadow-2xl flex flex-col bg-white dark:bg-slate-950">
                            <DialogHeader className="bg-slate-950 p-6 sm:p-10 rounded-t-[2.5rem] relative overflow-hidden border-b border-white/5 group">
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
                                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.6em] text-indigo-400 block mb-2">Structural Provisioning Protocol</span>
                                    <DialogTitle className="text-xl sm:text-3xl font-black tracking-tighter leading-tight text-white uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-white/70">
                                        Entity <span className="text-indigo-500">Launchpad</span>
                                    </DialogTitle>
                                    <DialogDescription className="text-slate-500 font-bold uppercase tracking-widest text-[8px] sm:text-[9px] mt-2">Automatic structural provisioning enabled for new organizational node</DialogDescription>
                                </div>
                            </DialogHeader>
                            <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6">
                                <form onSubmit={handleCreateOrg} className="space-y-6">
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1 dark:text-slate-500">Official Name</label>
                                            <Input
                                                required
                                                className="h-12 rounded-xl border-slate-200 focus:border-primary/30 font-bold shadow-inner dark:bg-slate-900 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-blue-500/30"
                                                value={newOrg.name}
                                                onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                                                placeholder="e.g. Health Ministry"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1 dark:text-slate-500">System ID</label>
                                            <Input
                                                required
                                                className="h-12 rounded-xl border-slate-200 focus:border-primary/30 font-mono text-xs shadow-inner uppercase tracking-wider dark:bg-slate-900 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-blue-500/30"
                                                value={newOrg.slug}
                                                onChange={(e) => setNewOrg({ ...newOrg, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                                placeholder="e.g. health-ministry"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1 dark:text-slate-500">Description</label>
                                            <Input
                                                className="h-12 rounded-xl border-slate-200 focus:border-primary/30 font-medium shadow-inner dark:bg-slate-900 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-blue-500/30"
                                                value={newOrg.description}
                                                onChange={(e) => setNewOrg({ ...newOrg, description: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1 dark:text-slate-500">Initial Structure (Optional)</label>
                                        <div className="flex gap-2">
                                            <Input
                                                className="h-11 rounded-xl border-slate-200 font-medium shadow-inner text-sm dark:bg-slate-900 dark:border-slate-800 dark:text-white dark:focus:border-blue-500/30"
                                                value={tempDeptName}
                                                onChange={(e) => setTempDeptName(e.target.value)}
                                                placeholder="Add custom department..."
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault()
                                                        if (tempDeptName.trim()) {
                                                            setNewOrg({
                                                                ...newOrg,
                                                                departments: [...newOrg.departments, {
                                                                    name: tempDeptName,
                                                                    slug: tempDeptName.toLowerCase().replace(/\s+/g, '-')
                                                                }]
                                                            })
                                                            setTempDeptName("")
                                                        }
                                                    }
                                                }}
                                            />
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    if (tempDeptName.trim()) {
                                                        setNewOrg({
                                                            ...newOrg,
                                                            departments: [...newOrg.departments, {
                                                                name: tempDeptName,
                                                                slug: tempDeptName.toLowerCase().replace(/\s+/g, '-')
                                                            }]
                                                        })
                                                        setTempDeptName("")
                                                    }
                                                }}
                                                className="h-11 w-11 shrink-0 rounded-xl bg-slate-900 text-white dark:bg-slate-800"
                                            >
                                                <Plus className="h-5 w-5" />
                                            </Button>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {newOrg.departments.length === 0 && (
                                                <p className="text-xs text-slate-400 italic py-2 pl-1">Default structure (4 depts) will be applied if empty.</p>
                                            )}
                                            {newOrg.departments.map((dept, idx) => (
                                                <Badge key={idx} className="h-8 px-3 rounded-lg bg-blue-50 text-primary border border-blue-100 hover:bg-blue-100 flex items-center gap-2 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30">
                                                    {dept.name}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newDepts = [...newOrg.departments]
                                                            newDepts.splice(idx, 1)
                                                            setNewOrg({ ...newOrg, departments: newDepts })
                                                        }}
                                                        className="hover:text-red-500 transition-colors"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <Button type="submit" disabled={submitting} className="w-full bg-primary hover:bg-primary/95 text-white font-bold h-14 rounded-2xl shadow-xl shadow-blue-900/10 transition-all active:scale-[0.98] dark:bg-blue-600 dark:hover:bg-blue-500 dark:shadow-none">
                                        {submitting ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : "Authorize & Launch"}
                                    </Button>
                                </form>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 px-2">
                <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <Input
                        placeholder="Search Registry Artifacts..."
                        className="pl-14 h-16 border-slate-100 bg-white/50 backdrop-blur-xl rounded-[1.5rem] shadow-sm font-bold tracking-tight text-slate-900 focus:ring-0 focus:border-blue-500/30 transition-all dark:bg-slate-900/40 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="bg-slate-950 text-white rounded-[1.5rem] px-8 h-16 flex items-center justify-center gap-4 shadow-2xl border border-white/5">
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-black leading-none italic">{filteredOrgs.length}</span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Systems</span>
                    </div>
                    <div className="h-8 w-[1px] bg-white/10" />
                    <Building2 className="h-6 w-6 text-blue-500 opacity-50" />
                </div>
            </div>

            <div className="bg-white/40 backdrop-blur-2xl rounded-[3rem] border border-slate-100/50 shadow-2xl shadow-blue-900/5 overflow-hidden mx-2 dark:bg-slate-900/40 dark:border-slate-800/60 dark:shadow-none">
                <Table>
                    <TableHeader className="bg-slate-950/5 dark:bg-slate-950/20">
                        <TableRow className="border-slate-100 dark:border-slate-800 hover:bg-transparent">
                            <TableHead className="py-8 px-12 font-black text-slate-400 uppercase text-[9px] tracking-[0.4em] dark:text-slate-500">Entity Identity</TableHead>
                            <TableHead className="py-8 font-black text-slate-400 uppercase text-[9px] tracking-[0.4em] text-center dark:text-slate-500">Structure</TableHead>
                            <TableHead className="py-8 font-black text-slate-400 uppercase text-[9px] tracking-[0.4em] text-center dark:text-slate-500">Timeline</TableHead>
                            <TableHead className="py-8 font-black text-slate-400 uppercase text-[9px] tracking-[0.4em] text-center dark:text-slate-500">Metrics</TableHead>
                            <TableHead className="py-8 px-12 font-black text-slate-400 uppercase text-[9px] tracking-[0.4em] text-right dark:text-slate-500">Command</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredOrgs.map((org: any, idx: number) => (
                            <TableRow
                                key={org.id}
                                className="border-slate-50 hover:bg-slate-950/5 transition-all group animate-in fade-in slide-in-from-bottom-4 fill-mode-both dark:border-slate-800/50 dark:hover:bg-slate-800/40"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <TableCell className="py-10 px-12">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-4">
                                            <span className="font-black text-slate-900 text-xl group-hover:text-blue-600 transition-colors uppercase italic tracking-tighter dark:text-slate-100 dark:group-hover:text-blue-400">{org.name}</span>
                                            {org.isVerified && (
                                                <div className="h-6 w-6 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                                                </div>
                                            )}
                                            <Badge className={cn(
                                                "rounded-lg font-black text-[8px] uppercase tracking-[0.2em] px-3 py-1 italic",
                                                org.isActive ? "bg-emerald-500 text-white border-none shadow-lg shadow-emerald-500/20" : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-600"
                                            )}>
                                                {org.isActive ? "Online" : "Archived"}
                                            </Badge>
                                        </div>
                                        <span className="text-[11px] text-slate-400 font-bold line-clamp-1 italic max-w-sm dark:text-slate-500">{org.description || "No description provided"}</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest dark:text-slate-600">ID::{org.slug}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex flex-col items-center">
                                        <span className="text-3xl font-black text-slate-950 tracking-tighter italic dark:text-slate-100">{org._count.departments}</span>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Nodes</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex flex-col items-center">
                                        <span className="text-sm font-black text-slate-950 dark:text-slate-300 tabular-nums">{new Date(org.createdAt).toLocaleDateString()}</span>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Registry</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-6">
                                        <div className="text-center group/metric">
                                            <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-500/5 flex items-center justify-center mb-1 group-hover/metric:scale-110 transition-transform">
                                                <span className="text-sm font-black text-blue-600 dark:text-blue-400">{org._count.users}</span>
                                            </div>
                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Ops</span>
                                        </div>
                                        <div className="text-center group/metric">
                                            <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800/40 flex items-center justify-center mb-1 group-hover/metric:scale-110 transition-transform">
                                                <span className="text-sm font-black text-slate-900 dark:text-white">{org._count.complaints}</span>
                                            </div>
                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Logs</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-10 px-12">
                                    <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                                        <Button
                                            variant="ghost"
                                            className={cn(
                                                "h-10 rounded-xl font-black uppercase tracking-widest text-[9px] italic",
                                                org.isVerified ? "text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10" : "text-slate-300 hover:text-blue-500 hover:bg-blue-50"
                                            )}
                                            onClick={() => toggleVerification(org.id, org.isVerified)}
                                        >
                                            {org.isVerified ? "Verified" : "Verify Authority"}
                                        </Button>
                                        <Button
                                            className="h-10 w-10 rounded-xl bg-slate-950 text-white hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center p-0"
                                            onClick={() => {
                                                setSelectedOrg(org)
                                                setIsDeptOpen(true)
                                            }}
                                        >
                                            <Building className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            className="h-10 w-10 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/10 flex items-center justify-center p-0"
                                            onClick={() => {
                                                setSelectedOrgId(org.id)
                                                setIsAssignOpen(true)
                                            }}
                                        >
                                            <UserPlus className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                                            onClick={() => handleDeleteOrg(org.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {filteredOrgs.length === 0 && (
                    <div className="p-20 text-center space-y-3 opacity-30">
                        <Building2 className="h-12 w-12 mx-auto text-slate-400" strokeWidth={1.5} />
                        <p className="text-[11px] font-bold uppercase tracking-widest">No matching entities in database</p>
                    </div>
                )}
            </div>

            {/* Manage Departments Dialog */}
            <Dialog open={isDeptOpen} onOpenChange={setIsDeptOpen}>
                <DialogContent className="w-full h-full max-w-none rounded-none sm:rounded-[2rem] sm:max-w-5xl sm:h-[85vh] border-none shadow-2xl p-0 overflow-hidden flex flex-col bg-gradient-to-b from-white to-slate-50/80 dark:from-slate-950 dark:to-slate-900 dark:shadow-none" showCloseButton={false}>
                    {/* Header */}
                    <div className="bg-slate-950 p-6 sm:p-10 text-white relative overflow-hidden shrink-0 border-b border-white/5 group">
                        {/* Branding texture */}
                        <div
                            className="absolute inset-0 z-0 opacity-20 bg-cover bg-center mix-blend-overlay transition-transform duration-[20000ms] group-hover:scale-110"
                            style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                        />

                        {/* Analysis Radial Flows (Indigo & Blue) */}
                        <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-indigo-600/20 blur-[130px] rounded-full animate-pulse" />
                            <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[70%] bg-blue-500/10 blur-[100px] rounded-full animate-pulse delay-700" />
                        </div>

                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div className="flex items-center gap-4 sm:gap-6">
                                {viewingDeptId && (
                                    <Button variant="ghost" size="icon" className="h-10 w-10 sm:h-12 sm:w-12 text-indigo-400 hover:text-white hover:bg-white/10 rounded-xl sm:rounded-2xl border border-indigo-500/20 transition-all" onClick={() => setViewingDeptId(null)}>
                                        <ArrowLeft className="h-5 w-5" />
                                    </Button>
                                )}
                                <div className="space-y-1 sm:space-y-2">
                                    <div className="flex items-center gap-4">
                                        <div className="h-[1px] w-8 bg-indigo-500/50" />
                                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.6em] text-indigo-400">
                                            {viewingDeptId ? "Node Analytics Protocol" : "Structural Asset Management"}
                                        </span>
                                    </div>
                                    <DialogTitle className="text-xl sm:text-4xl font-black tracking-tighter leading-none text-white uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-white/70">
                                        {viewingDeptId && detailedDept ? detailedDept.name : "Internal Infrastructure"}
                                    </DialogTitle>
                                    <DialogDescription className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[8px] sm:text-[9px] mt-1">
                                        {viewingDeptId
                                            ? "Executing comprehensive departmental data synthesis"
                                            : <>Infrastructural audit for <span className="text-white">{selectedOrg?.name}</span></>
                                        }
                                    </DialogDescription>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex flex-col items-end gap-1.5 px-4 py-2 bg-white/5 backdrop-blur-3xl rounded-2xl border border-white/10">
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">System Live</span>
                                    </div>
                                    {!viewingDeptId && (
                                        <div className="text-[10px] font-black text-white italic tracking-tighter tabular-nums">
                                            {selectedOrg?.departments.length} ACTIVE NODES
                                        </div>
                                    )}
                                </div>
                                <Button variant="ghost" size="icon" className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl text-white/40 hover:text-white hover:bg-white/10 border border-white/5 transition-all" onClick={() => setIsDeptOpen(false)}>
                                    <XCircle className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
                        {viewingDeptId ? (
                            loadingDept || !detailedDept ? (
                                <div className="flex h-full items-center justify-center">
                                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                                </div>
                            ) : (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                                        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-xl shadow-blue-900/5 dark:bg-slate-900 dark:border-slate-800 dark:shadow-none">
                                            <div className="flex items-center gap-3 sm:gap-4 sm:mb-4">
                                                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-primary dark:bg-blue-900/20 dark:text-blue-400 shrink-0">
                                                    <Activity className="h-5 w-5 sm:h-6 sm:w-6" />
                                                </div>
                                                <div>
                                                    <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Total Volume</div>
                                                    <div className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">{detailedDept._count.complaints}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-xl shadow-blue-900/5 dark:bg-slate-900 dark:border-slate-800 dark:shadow-none">
                                            <div className="flex items-center gap-3 sm:gap-4 sm:mb-4">
                                                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-indigo-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 shrink-0">
                                                    <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                                                </div>
                                                <div>
                                                    <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Personnel</div>
                                                    <div className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">{detailedDept._count.users}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-xl shadow-blue-900/5 dark:bg-slate-900 dark:border-slate-800 dark:shadow-none">
                                            <div className="flex items-center gap-3 sm:gap-4 sm:mb-4">
                                                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-emerald-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 shrink-0">
                                                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                                                </div>
                                                <div>
                                                    <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Efficiency</div>
                                                    <div className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
                                                        {detailedDept._count.complaints > 0
                                                            ? Math.round((detailedDept.complaints.filter(c => c.status === 'RESOLVED').length / detailedDept._count.complaints) * 100)
                                                            : 100}%
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Complaints Table */}
                                    <div className="bg-white rounded-2xl sm:rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-xl shadow-blue-900/5 dark:bg-slate-900 dark:border-slate-800 dark:shadow-none">
                                        <div className="p-5 sm:p-8 border-b border-slate-100 dark:border-slate-800">
                                            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">Recent Activity Log</h3>
                                        </div>
                                        <Table>
                                            <TableHeader className="bg-slate-50/50 dark:bg-slate-800/10">
                                                <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                                                    <TableHead className="pl-8 h-14 font-bold text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">Status</TableHead>
                                                    <TableHead className="h-14 font-bold text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">Issue Details</TableHead>
                                                    <TableHead className="h-14 font-bold text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">Submitted By</TableHead>
                                                    <TableHead className="h-14 font-bold text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">Resolver</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {detailedDept.complaints.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="h-32 text-center text-slate-400 text-xs font-medium italic">No activity recorded</TableCell>
                                                    </TableRow>
                                                ) : (
                                                    detailedDept.complaints.map(complaint => (
                                                        <TableRow key={complaint.id} className="hover:bg-slate-50/50 border-slate-50 dark:border-slate-800/50 dark:hover:bg-slate-800/10">
                                                            <TableCell className="pl-8 py-5">
                                                                <Badge className={cn(
                                                                    "rounded-lg px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest border",
                                                                    complaint.status === 'RESOLVED' ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" :
                                                                        complaint.status === 'IN_PROGRESS' ? "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20" :
                                                                            "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                                                                )}>
                                                                    {complaint.status.replace('_', ' ')}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-bold text-sm text-slate-900 dark:text-white">{complaint.title}</span>
                                                                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono uppercase tracking-tight">
                                                                        <span>ID: {complaint.id.slice(0, 8)}</span>
                                                                        <span>•</span>
                                                                        <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-9 w-9 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 dark:bg-slate-800 dark:border-slate-700 shadow-sm">
                                                                        {complaint.user.image ? (
                                                                            <img src={complaint.user.image} className="h-full w-full object-cover" />
                                                                        ) : (
                                                                            <img
                                                                                src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(complaint.user.username || complaint.user.name || 'User')}&top=${complaint.user.gender === 'FEMALE' ? 'longButNotTooLong,straight01,straight02' : 'shortFlat,shortRound,theCaesar'}`}
                                                                                className="h-full w-full object-cover"
                                                                                alt={complaint.user.name}
                                                                            />
                                                                        )}
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{complaint.user.name}</span>
                                                                        <span className="text-[10px] text-slate-400 font-medium">{complaint.user.email}</span>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                {complaint.resolvedBy ? (
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="h-9 w-9 rounded-xl bg-indigo-50 overflow-hidden border border-indigo-100 dark:bg-indigo-900/10 dark:border-indigo-500/20 shadow-sm">
                                                                            {complaint.resolvedBy.image ? (
                                                                                <img src={complaint.resolvedBy.image} className="h-full w-full object-cover" />
                                                                            ) : (
                                                                                <img
                                                                                    src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(complaint.resolvedBy.username || complaint.resolvedBy.name || 'Admin')}&top=${complaint.resolvedBy.gender === 'FEMALE' ? 'longButNotTooLong,straight01,straight02' : 'shortFlat,shortRound,theCaesar'}`}
                                                                                    className="h-full w-full object-cover"
                                                                                    alt={complaint.resolvedBy.name}
                                                                                />
                                                                            )}
                                                                        </div>
                                                                        <div className="flex flex-col">
                                                                            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{complaint.resolvedBy.name}</span>
                                                                            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Resolver Agent</span>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Awaiting Response</span>
                                                                    </div>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            )
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {/* Add New Node Card */}
                                <div className={cn(
                                    "group p-8 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:border-primary/50 hover:bg-white transition-all flex flex-col items-center justify-center text-center gap-4 min-h-[220px] dark:border-slate-800 dark:bg-slate-900/30 dark:hover:border-blue-500/50 dark:hover:bg-slate-900/50",
                                    isAddingDept && "border-primary bg-white shadow-2xl shadow-blue-900/5 lg:col-span-1 dark:bg-slate-900 dark:border-blue-500 dark:shadow-none"
                                )}>
                                    {isAddingDept ? (
                                        <div className="w-full space-y-4 animate-in zoom-in-95 duration-200">
                                            <div className="space-y-1.5 text-left">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 dark:text-slate-500">Node Identity</label>
                                                <Input
                                                    className="h-12 rounded-xl border-slate-200 focus:border-primary/30 font-bold shadow-inner dark:bg-slate-950 dark:border-slate-800 dark:text-white dark:focus:border-blue-500/30"
                                                    placeholder="e.g. Finance"
                                                    value={newDeptName}
                                                    onChange={(e) => setNewDeptName(e.target.value)}
                                                    autoFocus
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <Button className="flex-1 bg-primary text-white font-bold rounded-xl h-11 dark:bg-blue-600 dark:hover:bg-blue-500" onClick={handleAddDept} disabled={submitting}>
                                                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Deploy"}
                                                </Button>
                                                <Button variant="ghost" className="h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 dark:text-white dark:hover:bg-slate-800" onClick={() => setIsAddingDept(false)}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button onClick={() => setIsAddingDept(true)} className="flex flex-col items-center gap-3">
                                            <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform dark:bg-slate-800 dark:shadow-none">
                                                <Plus className="h-7 w-7 text-primary dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-900 uppercase tracking-tighter dark:text-slate-200">Launch New Node</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest dark:text-slate-500">Global Expansion</p>
                                            </div>
                                        </button>
                                    )}
                                </div>

                                {selectedOrg?.departments.map(dept => {
                                    const isEditing = editDeptId === dept.id;
                                    return (
                                        <div key={dept.id} className="group p-8 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-primary/20 hover:shadow-2xl hover:shadow-blue-900/5 transition-all relative overflow-hidden flex flex-col justify-between gap-6 min-h-[220px] dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900/60 dark:hover:border-blue-500/30 dark:shadow-none">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-all dark:bg-blue-900/30 dark:group-hover:bg-blue-500" />

                                            <div className="space-y-4 flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-1 flex-1">
                                                        <span className="text-[9px] font-mono font-bold text-slate-300 uppercase tracking-tighter dark:text-slate-600">NODE_ID::{dept.id.slice(0, 8)}</span>
                                                        {isEditing ? (
                                                            <div className="flex gap-2 pt-2">
                                                                <Input
                                                                    className="rounded-xl border-slate-200 h-11 font-bold text-sm bg-white shadow-inner focus:border-primary/30 dark:bg-slate-950 dark:border-slate-800 dark:text-white dark:focus:border-blue-500/30"
                                                                    value={editDeptName}
                                                                    onChange={(e) => setEditDeptName(e.target.value)}
                                                                    autoFocus
                                                                />
                                                                <div className="flex gap-1">
                                                                    <Button className="bg-primary text-white h-11 w-11 shrink-0 p-0 rounded-xl dark:bg-blue-600 dark:hover:bg-blue-500" onClick={() => handleUpdateDept(dept.id)}>
                                                                        <CheckCircle2 className="h-5 w-5" />
                                                                    </Button>
                                                                    <Button variant="ghost" className="h-11 w-11 shrink-0 p-0 border border-slate-100 rounded-xl dark:border-slate-800 dark:hover:bg-slate-800" onClick={() => setEditDeptId(null)}>
                                                                        <XCircle className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <h4 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors leading-tight dark:text-slate-200 dark:group-hover:text-blue-400">{dept.name}</h4>
                                                        )}
                                                    </div>
                                                    {!isEditing && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 opacity-0 group-hover:opacity-100 bg-white/80 backdrop-blur rounded-lg border border-slate-100 transition-all hover:bg-primary hover:text-white dark:bg-slate-800/80 dark:border-slate-700 dark:text-white dark:hover:bg-blue-600"
                                                            onClick={() => {
                                                                setEditDeptId(dept.id)
                                                                setEditDeptName(dept.name)
                                                            }}
                                                        >
                                                            <Edit2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex justify-between items-end">
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] dark:text-slate-500">Live Traffic</span>
                                                        <span className="text-xl font-black text-slate-900 dark:text-white">{dept._count.complaints} <span className="text-[10px] text-slate-400 font-bold ml-1 tracking-widest uppercase dark:text-slate-500">Issues</span></span>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        className="h-9 w-9 p-0 rounded-xl bg-slate-100 text-slate-400 hover:bg-primary hover:text-white transition-all shadow-sm dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-blue-600 dark:hover:text-white"
                                                        onClick={() => fetchDepartmentDetails(dept.id)}
                                                    >
                                                        <LineChart className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden dark:bg-slate-800/50">
                                                    <div
                                                        className={cn("h-full transition-all duration-1000", dept._count.complaints > 5 ? "bg-amber-500" : "bg-primary dark:bg-blue-500")}
                                                        style={{ width: `${Math.max(10, Math.min(100, (dept._count.complaints * 10)))}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Assign Admin Dialog */}
            <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
                <DialogContent className="w-full h-full max-w-none rounded-none sm:rounded-[3.5rem] sm:max-w-md sm:h-auto border-none shadow-2xl p-0 overflow-hidden flex flex-col bg-white dark:bg-slate-950 dark:shadow-none">
                    <div className="bg-slate-950 p-6 sm:p-10 text-white relative overflow-hidden shrink-0 border-b border-white/5 group">
                        {/* Branding texture */}
                        <div
                            className="absolute inset-0 z-0 opacity-20 bg-cover bg-center mix-blend-overlay transition-transform duration-[20000ms] group-hover:scale-110"
                            style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                        />

                        {/* Authority Radial Flows (Blue & Indigo) */}
                        <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-blue-600/20 blur-[130px] rounded-full animate-pulse" />
                            <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[70%] bg-indigo-500/10 blur-[100px] rounded-full animate-pulse delay-700" />
                        </div>

                        <div className="relative z-10 space-y-1 sm:space-y-2">
                            <div className="flex items-center gap-4">
                                <div className="h-[1px] w-8 bg-blue-500/50" />
                                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.6em] text-blue-400">Security Clearance Mandate</span>
                            </div>
                            <DialogTitle className="text-xl sm:text-4xl font-black tracking-tighter leading-none text-white uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white/70">
                                Authority <span className="text-blue-500">Transfer</span>
                            </DialogTitle>
                            <DialogDescription className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[8px] sm:text-[9px] mt-1">Strategic selection of administrative lead node</DialogDescription>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-10">
                        <div className="space-y-4">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1 dark:text-slate-500">Personnel Lookup</label>
                            <Select onValueChange={setSelectedUserId} value={selectedUserId}>
                                <SelectTrigger className="rounded-2xl border-slate-200 focus:ring-primary/10 font-bold h-14 bg-slate-50/50 shadow-inner dark:bg-slate-950 dark:border-slate-800 dark:text-white dark:focus:border-blue-500/30">
                                    <SelectValue placeholder="SEARCH COMMAND IDENTITY..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-3xl border-slate-100 shadow-2xl p-2 dark:bg-slate-900 dark:border-slate-800">
                                    {users.map(user => (
                                        <SelectItem key={user.id} value={user.id} className="font-bold py-4 rounded-xl px-6 focus:bg-blue-50 focus:text-primary transition-all dark:focus:bg-slate-800 dark:focus:text-blue-400 dark:text-slate-200">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-sm">{user.name}</span>
                                                <span className="text-[9px] text-slate-400 font-mono tracking-tighter dark:text-slate-500">{user.email}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            className="w-full bg-primary hover:bg-primary/95 text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-xs h-16 shadow-2xl shadow-blue-900/20 transition-all active:scale-[0.98] flex gap-3 dark:bg-blue-600 dark:hover:bg-blue-500 dark:shadow-none"
                            onClick={handleAssignAdmin}
                            disabled={submitting || !selectedUserId}
                        >
                            {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : (
                                <>
                                    <CheckCircle2 className="h-5 w-5" />
                                    Authorize Mandate
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function ShieldAlert(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
        </svg>
    )
}
