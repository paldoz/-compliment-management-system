"use client"

import { useEffect, useState } from "react"
import { Loader2, Users, Mail, Calendar, Trash2, ShieldAlert } from "lucide-react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdminUsersPage() {
    const { data: session } = useSession()
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/admin/users")
                const data = await res.json()
                setUsers(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchUsers()
    }, [])

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to PERMANENTLY delete this user? This action cannot be undone.")) return

        try {
            const res = await fetch(`/api/admin/users?id=${userId}`, {
                method: "DELETE"
            })

            if (res.ok) {
                setUsers(users.filter(u => u.id !== userId))
                alert("User deleted successfully")
            } else {
                const data = await res.json()
                alert(data.error || "Failed to delete user")
            }
        } catch (err) {
            console.error(err)
            alert("An error occurred")
        }
    }

    return (
        <div className="space-y-10 pb-24">
            {/* World-Class 'Asset Management' Mirror Glass Hero (Compact) */}
            <div className="relative overflow-hidden group rounded-2xl lg:rounded-[2.5rem] p-6 lg:p-10 bg-slate-950 border border-white/5 shadow-2xl transition-all duration-700 shadow-blue-900/10 mx-2">
                {/* Branding-Integrated Background Texture */}
                <div
                    className="absolute inset-0 z-0 opacity-20 bg-cover bg-center transition-transform duration-[20000ms] group-hover:scale-110"
                    style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                />

                {/* Identity Radial Flows (Indigo & Blue) */}
                <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-indigo-600/20 blur-[130px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[70%] bg-blue-500/15 blur-[110px] rounded-full animate-pulse delay-700" />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10">
                    <div className="space-y-4 lg:space-y-6">
                        <div className="space-y-1 lg:space-y-2">
                            <div className="flex items-center gap-5">
                                <div className="h-[2px] w-12 bg-gradient-to-r from-blue-500 to-transparent rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.6em] text-blue-400">Personnel Registry</span>
                            </div>
                            <h1 className="text-3xl lg:text-5xl font-black tracking-tighter leading-none text-white uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white/70 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                Stakeholder <span className="text-blue-500">Registry</span>
                            </h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 backdrop-blur-2xl p-2.5 px-6 rounded-2xl">
                                <div className="h-8 w-8 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/30">
                                    <Users className="h-4 w-4 text-blue-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Administrative Node</span>
                                    <span className="text-sm font-black text-white italic">Access Management</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:flex flex-col items-end gap-1 text-right opacity-30 group-hover:opacity-60 transition-opacity">
                        <div className="text-[60px] font-black tracking-tighter text-white/5 leading-none">USR</div>
                        <div className="text-[8px] font-black text-white/50 tracking-[1em] uppercase">Auth Layer v2.1</div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex h-[400px] items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary/30" />
                </div>
            ) : (
                <Card className="rounded-[2.5rem] border-none bg-white shadow-xl shadow-blue-900/5 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 border-slate-100 hover:bg-slate-50/50">
                                <TableHead className="py-5 px-8 font-bold text-slate-400 uppercase text-[10px] tracking-widest">User Profile</TableHead>
                                <TableHead className="py-5 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Role</TableHead>
                                <TableHead className="py-5 px-8 font-bold text-slate-400 uppercase text-[10px] tracking-widest text-right">Registered</TableHead>
                                {session?.user?.role === "SUPER_ADMIN" && (
                                    <TableHead className="py-5 px-8 font-bold text-slate-400 uppercase text-[10px] tracking-widest text-right">Actions</TableHead>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} className="border-slate-50 hover:bg-slate-50/30 transition-colors group">
                                    <TableCell className="py-6 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center font-bold text-primary shadow-sm group-hover:scale-105 transition-transform">
                                                {user.name?.[0].toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 text-base">{user.name}</span>
                                                <span className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">{user.id}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-3 text-slate-600 font-medium bg-slate-50/50 px-4 py-2 rounded-xl border border-slate-50 w-fit">
                                                <Mail className="h-4 w-4 text-primary/40" />
                                                <span className="text-sm">{user.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <ShieldAlert className="h-3 w-3 text-slate-400" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{user.role || 'USER'}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right text-slate-400 font-bold px-8">
                                        <div className="flex items-center justify-end gap-2.5">
                                            <Calendar className="h-3.5 w-3.5 text-slate-200" />
                                            <span className="text-xs tabular-nums">{new Date(user.createdAt).toLocaleDateString(undefined, {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}</span>
                                        </div>
                                    </TableCell>
                                    {session?.user?.role === "SUPER_ADMIN" && (
                                        <TableCell className="text-right px-8">
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
                                                title="Delete User"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                            {users.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-24">
                                        <div className="flex flex-col items-center gap-4">
                                            <Users className="h-12 w-12 text-slate-100" />
                                            <span className="text-slate-300 font-bold uppercase tracking-widest text-xs">No users found for this department.</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>
            )}
        </div>
    )
}
