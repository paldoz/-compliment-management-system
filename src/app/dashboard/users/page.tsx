"use client"

import { useEffect, useState } from "react"
import {
    Users,
    Search,
    Loader2,
    Shield,
    User,
    Building,
    Building2,
    Mail,
    Check,
    Trash2,
    ShieldAlert
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function GlobalUsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [departments, setDepartments] = useState<any[]>([])
    const [organizations, setOrganizations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    // Edit Form State
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        role: "",
        departmentId: "NONE",
        organizationId: "NONE",
        password: ""
    })

    const fetchData = async () => {
        setLoading(true)
        try {
            const [usersRes, deptsRes, orgsRes] = await Promise.all([
                fetch("/api/superadmin/users"),
                fetch("/api/superadmin/departments"),
                fetch("/api/superadmin/organizations")
            ])
            const usersData = await usersRes.json()
            const deptsData = await deptsRes.json()
            const orgsData = await orgsRes.json()

            setUsers(Array.isArray(usersData) ? usersData : [])
            setDepartments(Array.isArray(deptsData) ? deptsData : [])
            setOrganizations(Array.isArray(orgsData) ? orgsData : [])
        } catch (err) {
            console.error(err)
            toast.error("Failed to load data")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleEditClick = (user: any) => {
        setSelectedUser(user)
        setFormData({
            username: user.username || "",
            email: user.email || "",
            role: user.role,
            departmentId: user.departmentId || "NONE",
            organizationId: user.organizationId || "NONE",
            password: ""
        })
        setIsEditOpen(true)
    }

    const handleUpdateUser = async () => {
        setSubmitting(true)
        try {
            const payload: any = {
                id: selectedUser.id,
                role: formData.role,
                departmentId: formData.departmentId === "NONE" ? null : formData.departmentId,
                organizationId: formData.organizationId === "NONE" ? null : formData.organizationId,
                username: formData.username,
                email: formData.email
            }

            if (formData.password) {
                payload.password = formData.password
            }

            const res = await fetch("/api/superadmin/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                toast.success("User updated successfully")
                setIsEditOpen(false)
                fetchData()
            } else {
                toast.error("Failed to update user")
            }
        } catch (err) {
            console.error(err)
            toast.error("Error saving changes")
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteUser = async (user: any) => {
        if (!confirm(`Are you sure you want to PERMANENTLY delete ${user.name}? This cannot be undone.`)) return

        try {
            const res = await fetch(`/api/superadmin/users?id=${user.id}`, {
                method: "DELETE"
            })

            if (res.ok) {
                toast.success("User deleted successfully")
                fetchData()
            } else {
                const data = await res.json()
                toast.error(data.error || "Failed to delete user")
            }
        } catch (error) {
            console.error(error)
            toast.error("An error occurred")
        }
    }

    const filtered = users.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.username?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-8 pb-24">
            {/* World-Class 'Identity Protocol' Mirror Glass Hero (Compact - Best Quality) */}
            <div className="relative overflow-hidden group rounded-2xl lg:rounded-[2.5rem] p-6 lg:p-10 bg-slate-950 border border-white/5 shadow-2xl transition-all duration-700 shadow-blue-900/10 mx-2">
                {/* Branding-Integrated Background Texture */}
                <div
                    className="absolute inset-0 z-0 opacity-20 bg-cover bg-center transition-transform duration-[20000ms] group-hover:scale-110 contrast-[1.2] brightness-[0.8]"
                    style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                />

                {/* Identity Radial Flows (Blue & Rose) */}
                <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-blue-600/20 blur-[130px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[70%] bg-rose-500/15 blur-[100px] rounded-full animate-pulse delay-700" />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10">
                    <div className="space-y-4 lg:space-y-6">
                        <div className="space-y-1 lg:space-y-2">
                            <div className="flex items-center gap-5">
                                <div className="h-[2px] w-12 bg-gradient-to-r from-blue-500 to-transparent rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.6em] text-blue-400">Identity Protocol</span>
                            </div>
                            <h1 className="text-3xl lg:text-6xl font-black tracking-tighter leading-none text-white uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white/70 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                Personnel <span className="text-blue-500">Registry</span>
                            </h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 backdrop-blur-2xl p-2.5 px-6 rounded-2xl">
                                <div className="h-8 w-8 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/30">
                                    <Users className="h-4 w-4 text-blue-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Administrative Node</span>
                                    <span className="text-sm font-black text-white italic">Asset Management</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-indigo-500/5 border border-indigo-500/20 backdrop-blur-2xl p-2.5 px-6 rounded-2xl">
                                <div className="text-right">
                                    <div className="text-xl lg:text-2xl font-black tracking-tighter text-blue-400 flex items-center gap-2 tabular-nums">
                                        {users.length}
                                    </div>
                                    <div className="text-[7px] font-bold text-blue-500/50 uppercase tracking-[0.3em]">Active Entities</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:flex flex-col items-end gap-1 text-right opacity-30 group-hover:opacity-60 transition-opacity">
                        <div className="text-[70px] font-black tracking-tighter text-white/5 leading-none">IDM</div>
                        <div className="text-[8px] font-black text-white/50 tracking-[1em] uppercase">Auth Layer v4.0</div>
                    </div>
                </div>
            </div>

            <div className="relative group max-w-2xl px-2">
                <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors dark:text-slate-600 dark:group-focus-within:text-blue-400" />
                <Input
                    placeholder="Search personnel by name, email or ID..."
                    className="pl-14 h-14 border-slate-200 bg-white rounded-2xl focus:border-primary/30 focus:ring-primary/10 font-medium transition-all shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-blue-500/30"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="flex h-60 items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary/30 dark:text-white/20" />
                </div>
            ) : (
                <Card className="rounded-[2.5rem] border-none bg-white shadow-xl shadow-blue-900/5 overflow-hidden dark:bg-slate-900 dark:shadow-none">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 border-slate-100 hover:bg-slate-50/50 dark:bg-slate-800/20 dark:border-slate-800 dark:hover:bg-slate-800/20">
                                <TableHead className="py-5 px-8 font-bold text-slate-400 uppercase text-[10px] tracking-widest dark:text-slate-500">Identity</TableHead>
                                <TableHead className="py-5 font-bold text-slate-400 uppercase text-[10px] tracking-widest dark:text-slate-500">System Role</TableHead>
                                <TableHead className="py-5 font-bold text-slate-400 uppercase text-[10px] tracking-widest dark:text-slate-500">Assignment</TableHead>
                                <TableHead className="py-5 px-8 font-bold text-slate-400 uppercase text-[10px] tracking-widest text-right dark:text-slate-500">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((user) => (
                                <TableRow key={user.id} className="border-slate-50 hover:bg-slate-50/30 transition-colors dark:border-slate-800/50 dark:hover:bg-slate-800/20">
                                    <TableCell className="py-6 px-8">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-12 w-12 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                                                <AvatarImage src={user.image || `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(user.username || user.name)}&top=${user.gender === 'FEMALE' ? 'longButNotTooLong,straight01,straight02' : 'shortFlat,shortRound,theCaesar'}`} />
                                                <AvatarFallback className="bg-primary/5 text-primary font-bold text-lg dark:bg-blue-500/10 dark:text-blue-400">
                                                    {user.name?.[0]?.toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-bold text-slate-900 text-base dark:text-slate-200">{user.name}</span>
                                                <span className="text-sm text-slate-400 font-medium dark:text-slate-500">{user.email}</span>
                                                <span className="text-[10px] text-slate-300 font-mono mt-1 dark:text-slate-600">ID: #{user.id.slice(0, 8)}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={cn(
                                            "rounded-lg font-bold uppercase text-[10px] tracking-widest px-3 py-1 shadow-sm border-none",
                                            user.role === "SUPER_ADMIN" && "bg-slate-900 text-white dark:bg-red-500/10 dark:text-red-400",
                                            user.role === "ORG_ADMIN" && "bg-indigo-500 text-white dark:bg-indigo-500/10 dark:text-indigo-400",
                                            user.role === "DEPT_ADMIN" && "bg-primary text-white dark:bg-blue-500/10 dark:text-blue-400",
                                            user.role === "USER" && "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                                        )}>
                                            {user.role.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {user.organization && (
                                            <div className="flex items-center gap-2.5 font-bold text-slate-700 text-xs mb-1 dark:text-slate-300">
                                                <Building2 className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                                                {user.organization.name}
                                            </div>
                                        )}
                                        {user.department && (
                                            <div className="flex items-center gap-2.5 font-bold text-slate-600 text-xs dark:text-slate-400">
                                                <div className="p-1.5 bg-blue-50 rounded-lg dark:bg-blue-500/10">
                                                    <Building className="h-3.5 w-3.5 text-primary dark:text-blue-400" />
                                                </div>
                                                {user.department.name}
                                            </div>
                                        )}
                                        {!user.organization && !user.department && (
                                            <span className="text-slate-300 text-xs font-medium italic opacity-60 px-1 dark:text-slate-600">Unassigned</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right px-8">
                                        <Dialog open={isEditOpen && selectedUser?.id === user.id} onOpenChange={(open) => !open && setIsEditOpen(false)}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="rounded-xl text-primary font-bold uppercase tracking-widest text-[10px] h-10 px-6 hover:bg-blue-50 transition-all dark:text-blue-400 dark:hover:bg-blue-500/10"
                                                    onClick={() => handleEditClick(user)}
                                                >
                                                    Manage Access
                                                </Button>
                                            </DialogTrigger>
                                            <Button
                                                variant="ghost"
                                                className="rounded-xl text-red-500 font-bold uppercase tracking-widest text-[10px] h-10 px-2 lg:px-4 hover:bg-red-50 hover:text-red-600 transition-all dark:text-red-400 dark:hover:bg-red-500/10"
                                                onClick={() => handleDeleteUser(user)}
                                            >
                                                <Trash2 className="h-4 w-4 lg:mr-2" />
                                                <span className="hidden lg:inline">Delete</span>
                                            </Button>
                                            <DialogContent className="w-full h-full max-w-none rounded-none sm:rounded-[2.5rem] sm:max-w-md sm:h-auto border-none shadow-2xl p-0 overflow-hidden flex flex-col bg-white dark:bg-slate-950 dark:shadow-none">
                                                <DialogHeader className="p-6 sm:p-8 pb-4 bg-slate-950 text-white relative overflow-hidden shrink-0 border-b border-white/5 group">
                                                    {/* Branding texture */}
                                                    <div
                                                        className="absolute inset-0 z-0 opacity-20 bg-cover bg-center mix-blend-overlay transition-transform duration-[20000ms] group-hover:scale-110"
                                                        style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                                                    />

                                                    {/* Identity Radial Flows (Blue & Rose) */}
                                                    <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                                                        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-blue-600/20 blur-[130px] rounded-full animate-pulse" />
                                                        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[70%] bg-rose-500/10 blur-[100px] rounded-full animate-pulse delay-700" />
                                                    </div>

                                                    <div className="relative z-10">
                                                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.6em] text-blue-400 block mb-1">Identity Access Protocol</span>
                                                        <DialogTitle className="text-xl sm:text-3xl font-black tracking-tighter leading-tight text-white uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white/70">
                                                            User <span className="text-blue-500">Configuration</span>
                                                        </DialogTitle>
                                                        <p className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-2">Managing Personnel Artifact::{selectedUser?.name}</p>
                                                    </div>
                                                </DialogHeader>
                                                <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
                                                    {/* Profile Section */}
                                                    <div className="space-y-4">
                                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 dark:text-slate-500">Identity Configuration</Label>
                                                        <div className="space-y-3">
                                                            <div className="relative">
                                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-600" />
                                                                <Input
                                                                    placeholder="Username"
                                                                    value={formData.username}
                                                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                                                    className="pl-12 h-12 rounded-xl bg-slate-50/50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-blue-500/30"
                                                                />
                                                            </div>
                                                            <div className="relative">
                                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-600" />
                                                                <Input
                                                                    placeholder="Email Address"
                                                                    value={formData.email}
                                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                                    className="pl-12 h-12 rounded-xl bg-slate-50/50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-blue-500/30"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Role Section */}
                                                    <div className="space-y-4">
                                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 dark:text-slate-500">System Role</Label>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {['USER', 'DEPT_ADMIN', 'ORG_ADMIN', 'SUPER_ADMIN'].map((r) => (
                                                                <button
                                                                    key={r}
                                                                    className={cn(
                                                                        "h-10 rounded-lg text-xs font-bold transition-all border",
                                                                        formData.role === r
                                                                            ? "bg-slate-900 text-white border-slate-900 dark:bg-blue-600 dark:border-blue-600"
                                                                            : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
                                                                    )}
                                                                    onClick={() => setFormData({ ...formData, role: r })}
                                                                >
                                                                    {r.replace('_', ' ')}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Assignment Section */}
                                                    {(formData.role === "ORG_ADMIN" || formData.role === "DEPT_ADMIN") && (
                                                        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Assignment Scope</Label>

                                                            {formData.role === "ORG_ADMIN" && (
                                                                <Select
                                                                    value={formData.organizationId}
                                                                    onValueChange={(val) => setFormData({ ...formData, organizationId: val })}
                                                                >
                                                                    <SelectTrigger className="h-12 rounded-xl bg-slate-50/50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-white dark:focus:border-blue-500/30">
                                                                        <SelectValue placeholder="Select Organization" />
                                                                    </SelectTrigger>
                                                                    <SelectContent className="dark:bg-slate-900 dark:border-slate-800">
                                                                        <SelectItem value="NONE" className="dark:text-slate-400">Unassigned</SelectItem>
                                                                        {organizations.map(o => (
                                                                            <SelectItem key={o.id} value={o.id} className="dark:text-slate-200">{o.name}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            )}

                                                            {formData.role === "DEPT_ADMIN" && (
                                                                <Select
                                                                    value={formData.departmentId}
                                                                    onValueChange={(val) => setFormData({ ...formData, departmentId: val })}
                                                                >
                                                                    <SelectTrigger className="h-12 rounded-xl bg-slate-50/50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-white dark:focus:border-blue-500/30">
                                                                        <SelectValue placeholder="Select Department" />
                                                                    </SelectTrigger>
                                                                    <SelectContent className="dark:bg-slate-900 dark:border-slate-800">
                                                                        <SelectItem value="NONE" className="dark:text-slate-400">Unassigned</SelectItem>
                                                                        {departments.map(d => (
                                                                            <SelectItem key={d.id} value={d.id} className="dark:text-slate-200">{d.name}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Security Section */}
                                                    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-red-500 ml-1 flex items-center gap-2 dark:text-red-400">
                                                            <Shield className="h-3 w-3" /> Security Reset
                                                        </Label>
                                                        <Input
                                                            type="password"
                                                            placeholder="Set New Password (Optional)"
                                                            value={formData.password}
                                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                            className="h-12 rounded-xl border-red-100 bg-red-50/10 focus:ring-red-100 focus:border-red-200 placeholder:text-red-300 text-red-700 dark:bg-red-500/5 dark:border-red-500/20 dark:text-red-400 dark:placeholder:text-red-500/50 dark:focus:border-red-500/30"
                                                        />
                                                    </div>

                                                    <Button
                                                        className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-lg shadow-blue-900/20 mt-4 dark:bg-blue-600 dark:hover:bg-blue-500 dark:shadow-none"
                                                        onClick={handleUpdateUser}
                                                        disabled={submitting}
                                                    >
                                                        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                                                    </Button>

                                                    <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                                                        <Button
                                                            variant="ghost"
                                                            className="w-full h-12 text-red-500 hover:text-red-700 hover:bg-red-50 font-bold rounded-xl flex gap-2 dark:text-red-400 dark:hover:bg-red-500/10"
                                                            onClick={() => {
                                                                setIsEditOpen(false);
                                                                handleDeleteUser(selectedUser);
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            Permanently Delete User
                                                        </Button>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}
        </div>
    )
}
