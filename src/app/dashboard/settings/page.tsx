"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import {
    Settings,
    User,
    Shield,
    Lock,
    Camera,
    Loader2,
    Save,
    Eye,
    EyeOff,
    Mail,
    UserCircle,
    Fingerprint,
    Moon,
    Sun,
    Monitor,
    AtSign,
    Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function SettingsPage() {
    const { data: session, update } = useSession()
    const { theme, setTheme } = useTheme()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [mounted, setMounted] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        gender: "MALE" as "MALE" | "FEMALE"
    })

    useEffect(() => {
        setMounted(true)
        if (session?.user) {
            setFormData(prev => ({
                ...prev,
                name: session.user.name || "",
                username: (session.user as any).username || "",
                email: session.user.email || "",
                gender: (session.user as any).gender || "MALE"
            }))
        }
    }, [session])

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()

        if (isChangingPassword) {
            if (!formData.password) {
                toast.error("Please enter a new password")
                return
            }
            if (formData.password !== formData.confirmPassword) {
                toast.error("Passwords do not match")
                return
            }
        }

        setLoading(true)
        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    username: formData.username,
                    email: formData.email,
                    gender: formData.gender,
                    ...(isChangingPassword && formData.password ? { password: formData.password } : {})
                })
            })

            const data = await res.json()

            if (res.ok) {
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        name: data.name,
                        email: data.email,
                        username: data.username,
                        gender: data.gender
                    }
                })
                toast.success("Identity synchronized successfully")
                setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }))
                setIsChangingPassword(false)
            } else {
                toast.error(data.error || "Update failed")
            }
        } catch (err) {
            console.error(err)
            toast.error("Internal synchronization error")
        } finally {
            setLoading(false)
        }
    }

    if (!mounted) return null

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20">
            {/* World-Class 'Security Protocol' Mirror Glass Hero (Compact) */}
            <div className="relative overflow-hidden group rounded-2xl lg:rounded-[2.5rem] p-5 lg:p-10 bg-slate-950 border border-white/5 shadow-2xl transition-all duration-700 shadow-blue-900/10 mx-1 lg:mx-0">
                {/* Branding-Integrated Background Texture */}
                <div
                    className="absolute inset-0 z-0 opacity-20 bg-cover bg-center transition-transform duration-[20000ms] group-hover:scale-110"
                    style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                />

                {/* Security Radial Flows (Blue & Indigo) */}
                <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[70%] bg-indigo-500/15 blur-[100px] rounded-full animate-pulse delay-700" />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10">
                    <div className="space-y-4 lg:space-y-6">
                        <div className="space-y-1 lg:space-y-2">
                            <div className="flex items-center gap-5">
                                <div className="h-[2px] w-12 bg-gradient-to-r from-blue-500 to-transparent rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.6em] text-blue-400">Master Identity Hub</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black tracking-tighter leading-none text-white uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-white/70 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                Security <span className="text-blue-500">Protocol</span>
                            </h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 backdrop-blur-2xl p-2 md:p-2.5 px-4 md:px-6 rounded-2xl">
                                <div className="h-7 w-7 md:h-8 md:w-8 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/30">
                                    <Fingerprint className="h-3.5 w-3.5 md:h-4 md:w-4 text-blue-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[7px] md:text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Administrative Node</span>
                                    <span className="text-xs md:text-sm font-black text-white italic">{session?.user?.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:flex flex-col items-end gap-1 text-right opacity-30 group-hover:opacity-60 transition-opacity">
                        <div className="text-[60px] font-black tracking-tighter text-white/5 leading-none">ROOT</div>
                        <div className="text-[8px] font-black text-white/50 tracking-[1em] uppercase">Access Layer v9.4</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Panel: Profile Visuals */}
                <div className="lg:col-span-4 space-y-4 lg:space-y-8 px-1 lg:px-0">
                    {/* Glass Avatar Card - Ultra-compact on mobile */}
                    <div className="group relative bg-white dark:bg-slate-900 rounded-3xl lg:rounded-[3rem] p-6 lg:p-10 border border-slate-100 dark:border-slate-800 shadow-lg flex flex-col items-center gap-4 lg:gap-8 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="relative group/avatar">
                            <div className="absolute -inset-4 bg-primary/10 rounded-[2.5rem] blur-xl opacity-0 group-hover/avatar:opacity-100 transition-all duration-300" />
                            <Avatar className="h-24 w-24 lg:h-44 lg:w-44 rounded-2xl lg:rounded-[2.5rem] border-4 lg:border-8 border-white dark:border-slate-800 shadow-xl transition-all duration-300 group-hover/avatar:scale-[1.02] relative z-10">
                                <AvatarImage
                                    key={formData.gender + formData.username}
                                    src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(formData.username || 'User')}&top=${formData.gender === 'FEMALE' ? 'longButNotTooLong,straight01,straight02' : 'shortFlat,shortRound,theCaesar'}`}
                                    className="object-cover"
                                />
                                <AvatarFallback className="rounded-2xl lg:rounded-[2.5rem] bg-slate-50 dark:bg-slate-800 text-primary font-black text-3xl lg:text-6xl">
                                    {(formData.name || session?.user?.name)?.slice(0, 1).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="text-center space-y-2 lg:space-y-4 relative z-10">
                            <div className="space-y-0.5 lg:space-y-1">
                                <h2 className="text-lg lg:text-2xl font-black tracking-tight text-slate-900 dark:text-white truncate max-w-[200px]">
                                    {formData.name || "Member Node"}
                                </h2>
                                <div className="flex items-center justify-center gap-2">
                                    <AtSign className="h-2.5 w-2.5 text-primary" />
                                    <span className="text-[8px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formData.username || "unset_node"}</span>
                                </div>
                            </div>
                            <Badge className="bg-primary/5 text-primary border-primary/10 px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest shadow-sm">
                                {session?.user?.role || "USER"}
                            </Badge>
                        </div>
                    </div>

                    {/* Gender Selection Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl lg:rounded-[2.5rem] p-5 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4 lg:space-y-6">
                        <div className="flex items-center gap-2 lg:gap-3 px-1 lg:px-2">
                            <UserCircle className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-primary" />
                            <h3 className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Gender</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100/50 dark:bg-slate-800/50 rounded-3xl">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, gender: "MALE" })}
                                className={cn(
                                    "flex items-center justify-center gap-2.5 py-3 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all",
                                    formData.gender === "MALE"
                                        ? "bg-white dark:bg-slate-800 text-primary shadow-lg border border-slate-200 dark:border-slate-700"
                                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                )}
                            >
                                <User className="h-4 w-4" />
                                Male
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, gender: "FEMALE" })}
                                className={cn(
                                    "flex items-center justify-center gap-2.5 py-3 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all",
                                    formData.gender === "FEMALE"
                                        ? "bg-white dark:bg-slate-800 text-pink-500 shadow-lg border border-slate-200 dark:border-slate-700"
                                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                )}
                            >
                                <User className="h-4 w-4" />
                                Female
                            </button>
                        </div>
                    </div>

                    {/* Environment Config */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl lg:rounded-[2.5rem] p-5 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4 lg:space-y-6">
                        <div className="flex items-center gap-2 lg:gap-3 px-1 lg:px-2">
                            <Monitor className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-primary" />
                            <h3 className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Node Theme</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100/50 dark:bg-slate-800/50 rounded-3xl">
                            <button
                                onClick={() => setTheme("light")}
                                className={cn(
                                    "flex items-center justify-center gap-2.5 py-3 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all",
                                    theme === "light"
                                        ? "bg-white text-primary shadow-lg shadow-blue-500/10 border border-slate-200"
                                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                )}
                            >
                                <Sun className="h-4 w-4" />
                                Day
                            </button>
                            <button
                                onClick={() => setTheme("dark")}
                                className={cn(
                                    "flex items-center justify-center gap-2.5 py-3 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all",
                                    theme === "dark"
                                        ? "bg-slate-800 text-blue-400 shadow-lg shadow-black/20 border border-slate-700"
                                        : "text-slate-400 hover:text-slate-500"
                                )}
                            >
                                <Moon className="h-4 w-4" />
                                Night
                            </button>
                        </div>
                    </div>


                </div>

                {/* Right Panel: Functional Forms */}
                <div className="lg:col-span-8 px-1 lg:px-0">
                    <form onSubmit={handleUpdate} className="space-y-4 lg:space-y-8">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl lg:rounded-[3rem] p-6 md:p-12 border border-slate-100 dark:border-slate-800 shadow-lg space-y-8 md:space-y-12">
                            {/* Identity Section */}
                            <section className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="h-1.5 w-12 bg-primary rounded-full" />
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">Identity Matrix</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-1.5 lg:space-y-2.5">
                                        <Label className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1 lg:ml-2 text-primary/60">Name</Label>
                                        <div className="relative group">
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/10 to-transparent rounded-xl lg:rounded-[1.25rem] blur opacity-0 group-focus-within:opacity-100 transition duration-200" />
                                            <Input
                                                className="h-11 lg:h-14 rounded-xl lg:rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 font-bold text-sm lg:text-base px-5 lg:px-6 relative z-10 transition-all focus:ring-2 focus:ring-primary/20"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2.5">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-2">Username Alias</Label>
                                        <div className="relative group">
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/10 to-transparent rounded-[1.25rem] blur opacity-0 group-focus-within:opacity-100 transition duration-200" />
                                            <div className="relative z-10">
                                                <Input
                                                    className="h-14 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 font-bold text-base px-6 pl-12 transition-all focus:ring-2 focus:ring-primary/20"
                                                    value={formData.username}
                                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                />
                                                <AtSign className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2.5 md:col-span-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-2">Communication Email</Label>
                                        <div className="relative group">
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/10 to-transparent rounded-[1.25rem] blur opacity-0 group-focus-within:opacity-100 transition duration-200" />
                                            <div className="relative z-10">
                                                <Input
                                                    className="h-14 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 font-bold text-base px-6 pl-12 transition-all focus:ring-2 focus:ring-primary/20"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                />
                                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="h-px bg-slate-100 dark:bg-slate-800 w-full" />

                            {/* Change Password Section */}
                            <section className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-1.5 w-12 bg-emerald-500 rounded-full" />
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">Change Password</h3>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsChangingPassword(!isChangingPassword)}
                                        className={cn(
                                            "h-10 px-6 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border-2",
                                            isChangingPassword
                                                ? "border-emerald-500/20 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                                                : "border-slate-100 text-slate-500 hover:border-slate-200 dark:border-slate-800 dark:text-slate-400"
                                        )}
                                    >
                                        {isChangingPassword ? "Cancel Change" : "Update Password"}
                                    </Button>
                                </div>

                                {isChangingPassword && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-4 duration-300">
                                        <div className="space-y-2.5">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-2">New Password</Label>
                                            <div className="relative group">
                                                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/10 to-transparent rounded-[1.25rem] blur opacity-0 group-focus-within:opacity-100 transition duration-200" />
                                                <div className="relative z-10">
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        autoComplete="new-password"
                                                        className="h-14 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 font-bold text-base px-6 pr-12 transition-all focus:ring-2 focus:ring-emerald-500/20"
                                                        placeholder="••••••••••••"
                                                        value={formData.password}
                                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-colors focus:outline-none"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2.5">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-2">Confirm Password</Label>
                                            <div className="relative group">
                                                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/10 to-transparent rounded-[1.25rem] blur opacity-0 group-focus-within:opacity-100 transition duration-200" />
                                                <Input
                                                    type="password"
                                                    autoComplete="new-password"
                                                    className="h-14 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 font-bold text-base px-6 relative z-10 transition-all focus:ring-2 focus:ring-emerald-500/20"
                                                    placeholder="••••••••••••"
                                                    value={formData.confirmPassword}
                                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </section>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button
                                type="submit"
                                className="h-14 px-10 rounded-[1.25rem] bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:scale-[1.02] active:scale-95 shadow-lg disabled:opacity-50 flex gap-3 border-none"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div >
            </div >
        </div >
    )
}
