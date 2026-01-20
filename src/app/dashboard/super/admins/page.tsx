"use client"

import { useEffect, useState } from "react"
import {
    Users,
    Search,
    Shield,
    MoreHorizontal,
    Building2,
    Lock,
    User,
    Mail,
    Loader2,
    Save
} from "lucide-react"
import { Card } from "@/components/ui/card"
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
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function AdminRegistryPage() {
    const [admins, setAdmins] = useState<any[]>([])
    const [organizations, setOrganizations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedAdmin, setSelectedAdmin] = useState<any>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [saving, setSaving] = useState(false)

    // Form Stats
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        organizationId: ""
    })

    const fetchData = async () => {
        setLoading(true)
        try {
            const [adminRes, orgRes] = await Promise.all([
                fetch("/api/superadmin/admins"),
                fetch("/api/superadmin/organizations")
            ])
            const [adminData, orgData] = await Promise.all([
                adminRes.json(),
                orgRes.json()
            ])

            if (Array.isArray(adminData)) setAdmins(adminData)
            if (Array.isArray(orgData)) setOrganizations(orgData)
        } catch (err) {
            console.error(err)
            toast.error("Failed to load registry data")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleEditClick = (admin: any) => {
        setSelectedAdmin(admin)
        setFormData({
            username: admin.username || "",
            email: admin.email || "",
            password: "", // Always blank initially
            organizationId: admin.organizationId || "none"
        })
        setIsDialogOpen(true)
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const payload: any = {
                id: selectedAdmin.id,
                username: formData.username,
                email: formData.email,
                organizationId: formData.organizationId === "none" ? null : formData.organizationId
            }
            if (formData.password) {
                payload.password = formData.password
            }

            const res = await fetch("/api/superadmin/admins", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            if (!res.ok) throw new Error("Failed to update")

            toast.success("Admin profile updated successfully")
            setIsDialogOpen(false)
            fetchData() // Refresh list
        } catch (err) {
            console.error(err)
            toast.error("Failed to save changes")
        } finally {
            setSaving(false)
        }
    }

    const filteredAdmins = admins.filter(a =>
        a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.organization?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-8 pb-24">
            <div className="flex items-center gap-6 px-2">
                <div className="h-16 w-16 bg-blue-900/10 rounded-2xl flex items-center justify-center dark:bg-blue-500/10">
                    <Shield className="h-8 w-8 text-blue-900 dark:text-blue-400" />
                </div>
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Admin Registry</h1>
                    <p className="text-slate-400 font-medium text-sm dark:text-slate-500">Global administrative personnel and access control</p>
                </div>
            </div>

            <div className="flex items-center gap-4 px-2">
                <div className="relative flex-1">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-600" />
                    <Input
                        placeholder="Search admins by name, email, or organization..."
                        className="pl-14 h-14 rounded-2xl border-slate-200 bg-white font-medium shadow-sm focus:border-blue-500/30 dark:bg-slate-900 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-blue-500/30"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex h-60 items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-slate-300 dark:text-white/20" />
                </div>
            ) : (
                <Card className="rounded-[2.5rem] border-none bg-white shadow-xl shadow-slate-200/50 overflow-hidden dark:bg-slate-900 dark:shadow-none">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 border-slate-100 dark:bg-slate-800/20 dark:border-slate-800">
                                <TableHead className="py-6 px-8 font-bold uppercase text-[10px] tracking-widest text-slate-400 dark:text-slate-500">Admin Profile</TableHead>
                                <TableHead className="py-6 font-bold uppercase text-[10px] tracking-widest text-slate-400 dark:text-slate-500">Assignment</TableHead>
                                <TableHead className="py-6 font-bold uppercase text-[10px] tracking-widest text-slate-400 text-center dark:text-slate-500">Role</TableHead>
                                <TableHead className="py-6 px-8 text-right font-bold uppercase text-[10px] tracking-widest text-slate-400 dark:text-slate-500">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAdmins.map((admin) => (
                                <TableRow key={admin.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors dark:border-slate-800/50 dark:hover:bg-slate-800/20">
                                    <TableCell className="py-6 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center dark:bg-slate-800">
                                                <User className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 text-sm dark:text-slate-200">{admin.name || admin.username || "Unknown"}</span>
                                                <span className="text-xs text-slate-400 font-medium dark:text-slate-500">{admin.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {admin.organization ? (
                                            <div className="flex items-center gap-2">
                                                <Building2 className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                                <span className="font-bold text-slate-700 text-sm dark:text-slate-300">{admin.organization.name}</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest dark:text-slate-600">Unassigned</span>
                                        )}
                                        {admin.department && (
                                            <div className="mt-1 ml-6">
                                                <Badge variant="outline" className="text-[9px] font-bold text-slate-400 py-0 h-5 border-slate-200 dark:text-slate-500 dark:border-slate-800">
                                                    {admin.department.name}
                                                </Badge>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge className={`
                                            font-bold uppercase text-[9px] tracking-widest border-none
                                            ${admin.role === 'ORG_ADMIN' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}
                                        `}>
                                            {admin.role.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-8 text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-900 dark:hover:bg-slate-800 dark:text-slate-600 dark:hover:text-slate-300"
                                            onClick={() => handleEditClick(admin)}
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="w-full h-full max-w-none rounded-none sm:rounded-[2rem] sm:max-w-md sm:h-auto border-none shadow-2xl p-0 overflow-hidden flex flex-col bg-white dark:bg-slate-950 dark:shadow-none">
                    <DialogHeader className="p-6 sm:p-8 pb-4 bg-slate-50/50 border-b border-slate-100 dark:bg-slate-900/50 dark:border-slate-800 shrink-0">
                        <DialogTitle className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Edit Administrator</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">

                        <div className="space-y-6 mt-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Username</Label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-600" />
                                    <Input
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="pl-12 h-12 rounded-xl border-slate-200 bg-slate-50/50 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-600" />
                                    <Input
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="pl-12 h-12 rounded-xl border-slate-200 bg-slate-50/50 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Organization Assignment</Label>
                                <Select
                                    value={formData.organizationId}
                                    onValueChange={(val) => setFormData({ ...formData, organizationId: val })}
                                >
                                    <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/50 dark:bg-slate-900 dark:border-slate-800 dark:text-white">
                                        <SelectValue placeholder="Select Organization" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-slate-100 shadow-xl max-h-60 dark:bg-slate-900 dark:border-slate-800">
                                        <SelectItem value="none" className="text-slate-400 font-medium dark:text-slate-500">Unassigned</SelectItem>
                                        {organizations.map(org => (
                                            <SelectItem key={org.id} value={org.id} className="font-bold text-slate-700 dark:text-slate-200">
                                                {org.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <Label className="text-xs font-bold uppercase tracking-widest text-red-400 dark:text-red-500">Reset Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-600" />
                                    <Input
                                        type="password"
                                        placeholder="Enter new password to reset..."
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="pl-12 h-12 rounded-xl border-red-100 bg-red-50/30 focus:border-red-200 focus:ring-red-100 transition-all placeholder:text-slate-400 dark:bg-red-500/5 dark:border-red-500/20 dark:text-red-400 dark:placeholder:text-red-500/50"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 font-medium pl-1 dark:text-slate-600">Leave blank to keep existing password</p>
                            </div>

                            <Button
                                className="w-full h-14 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold tracking-wide shadow-lg shadow-slate-900/10 mt-2 dark:bg-blue-600 dark:hover:bg-blue-500 dark:shadow-none"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Changes"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div >
    )
}
