"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, UserPlus2, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
    })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.message || data.error || "Enrollment failed")
            } else {
                router.push(`/verify-email?email=${formData.email}`)
            }
        } catch (err) {
            setError("Atmospheric interference detected. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#020617]">
            {/* Branding-Integrated Mirror-Glass Background */}
            <div
                className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20000ms] scale-110 motion-safe:animate-slow-zoom"
                style={{ backgroundImage: "url('/auth-branding-bg.png')", backgroundAttachment: 'fixed' }}
            />
            {/* Deep Dark & Intense Branding Color Overlays */}
            <div className="fixed inset-0 z-[1] bg-slate-950/60 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[65%] h-[65%] bg-blue-900/40 blur-[130px] rounded-full animate-pulse duration-[8000ms]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] bg-emerald-600/30 blur-[150px] rounded-full animate-pulse duration-[10000ms]" />
                <div className="absolute top-[20%] right-[20%] w-[50%] h-[50%] bg-cyan-400/20 blur-[100px] rounded-full animate-pulse duration-[12000ms]" />
                <div className="absolute top-[35%] left-[25%] w-[45%] h-[45%] bg-lime-500/20 blur-[120px] rounded-full animate-pulse duration-[15000ms]" />
            </div>
            {/* Mirror Transparency Layer */}
            <div className="fixed inset-0 z-[2] bg-slate-950/20 backdrop-blur-[1.5px]" />
            <div className="hidden lg:block fixed inset-0 z-[3] bg-gradient-to-br from-blue-950/50 via-emerald-950/10 to-slate-950/60" />

            {/* Content Container */}
            <div className="relative z-[10] w-full min-h-screen flex flex-col lg:flex-row">
                {/* Left Side - Visual Branding (Desktop Only) */}
                <div className="hidden lg:flex lg:w-[55%] flex-col justify-between p-24 text-white">
                    <div className="flex items-center gap-5 group cursor-default">
                        <div className="bg-blue-600/10 backdrop-blur-3xl p-4 rounded-[2rem] border border-blue-200/50 shadow-2xl transition-all duration-500 group-hover:bg-blue-600/20 group-hover:scale-110">
                            <UserPlus2 className="w-12 h-12 text-blue-600 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-4xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-100 to-blue-200 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">CMS Platform</span>
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.5em] mt-[-4px]">Global Enrollment Node</span>
                        </div>
                    </div>

                    <div className="max-w-2xl space-y-16">
                        <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
                            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-blue-500/10 backdrop-blur-2xl rounded-full border border-blue-400/30 shadow-sm">
                                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                                <span className="text-[11px] font-black text-cyan-100 uppercase tracking-[0.2em]">Priority Access Transmission</span>
                            </div>

                            <h1 className="text-[100px] font-black tracking-tighter leading-[0.8] text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-white/90 bg-[length:200%_auto] select-none animate-in fade-in zoom-in-95 slide-in-from-left-12 duration-1000 delay-200 [text-shadow:0_15px_40px_rgba(0,0,0,0.6),0_0_80px_rgba(255,255,255,0.2)] hover:drop-shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-all cursor-default animate-text-shimmer animate-float">
                                CREATE<br />
                                YOUR<br />
                                ACCOUNT
                            </h1>

                            <p className="text-white/90 text-2xl font-bold leading-relaxed max-w-xl animate-in fade-in slide-in-from-left-12 duration-1000 delay-500 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                                Start reporting issues and tracking resolutions
                                in a transparent and organized way.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-16 pt-16 border-t border-white/10">
                            <div className="space-y-3 group">
                                <div className="text-6xl font-black tracking-tighter text-white group-hover:text-cyan-400 transition-colors drop-shadow-[0_5px_15px_rgba(255,255,255,0.2)]">AES-256</div>
                                <div className="flex items-center gap-3">
                                    <div className="h-1.5 w-12 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                                    <div className="text-[11px] font-black text-white/50 uppercase tracking-[0.3em]">End-to-End Encryption</div>
                                </div>
                            </div>
                            <div className="space-y-3 group">
                                <div className="text-6xl font-black tracking-tighter text-white group-hover:text-emerald-400 transition-colors drop-shadow-[0_5px_15px_rgba(255,255,255,0.2)]">INSTANT</div>
                                <div className="flex items-center gap-3">
                                    <div className="h-1.5 w-12 bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                    <div className="text-[11px] font-black text-white/50 uppercase tracking-[0.3em]">Global Propagation</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 opacity-40 hover:opacity-100 transition-opacity">
                        <div className="h-[1px] w-24 bg-gradient-to-r from-amber-400/50 to-transparent" />
                        <div className="text-white text-[9px] font-black uppercase tracking-[0.5em] whitespace-nowrap">
                            EST. 2026 • REGISTRY NODE ENROLMENT • SECURED
                        </div>
                    </div>
                </div>

                {/* Right Side - Enrollment Panel */}
                <div className="w-full lg:w-[45%] min-h-screen relative flex flex-col justify-center">
                    <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-[40px] border-l border-white/10 hidden lg:block" />
                    <div className="relative z-10 w-full px-8 py-12 lg:px-20 lg:py-0 max-w-2xl mx-auto lg:max-w-none animate-in fade-in slide-in-from-right-12 duration-1000">

                        <div className="space-y-3 text-center lg:text-left">
                            <h2 className="text-4xl sm:text-[50px] font-black tracking-tighter text-white leading-none">Enrollment</h2>
                            <p className="text-blue-200/50 font-bold text-[10px] sm:text-xs uppercase tracking-[0.4em] italic">Global Identity Creation Node</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8 mt-12">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-3xl flex items-start gap-4 backdrop-blur-xl animate-shake">
                                    <AlertCircle className="h-6 w-6 text-red-400 flex-shrink-0" />
                                    <div className="space-y-1">
                                        <div className="font-black text-xs uppercase tracking-widest text-red-200">Provisioning Error</div>
                                        <p className="text-xs text-red-300/60 leading-tight">{error}</p>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-3 group">
                                    <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2 lg:text-blue-200/50">Full Name</Label>
                                    <div className="relative group/input">
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="Legal Name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            className="h-16 bg-white/[0.03] border-white/10 focus:border-blue-500/50 focus:bg-white/[0.08] text-white placeholder:text-white/20 transition-all rounded-2xl lg:rounded-[1.2rem] text-lg font-bold px-6 shadow-2xl group-hover/input:border-white/20"
                                        />
                                        <div className="absolute inset-0 bg-blue-500/5 blur-[15px] opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none rounded-2xl lg:rounded-[1.2rem]" />
                                    </div>
                                </div>

                                <div className="space-y-3 group">
                                    <Label htmlFor="username" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2 lg:text-blue-200/50">Username</Label>
                                    <div className="relative group/input">
                                        <Input
                                            id="username"
                                            type="text"
                                            placeholder="system_handle"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            required
                                            className="h-16 bg-white/[0.03] border-white/10 focus:border-blue-500/50 focus:bg-white/[0.08] text-white placeholder:text-white/20 transition-all rounded-2xl lg:rounded-[1.2rem] text-lg font-bold px-6 shadow-2xl group-hover/input:border-white/20"
                                        />
                                        <div className="absolute inset-0 bg-emerald-500/5 blur-[15px] opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none rounded-2xl lg:rounded-[1.2rem]" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3 group">
                                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2 lg:text-blue-200/50">Email Identity</Label>
                                    <div className="relative group/input">
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@system.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            className="h-16 bg-white/[0.03] border-white/10 focus:border-blue-500/50 focus:bg-white/[0.08] text-white placeholder:text-white/20 transition-all rounded-2xl lg:rounded-[1.2rem] text-lg font-bold px-6 shadow-2xl group-hover/input:border-white/20"
                                        />
                                        <div className="absolute inset-0 bg-cyan-500/5 blur-[15px] opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none rounded-2xl lg:rounded-[1.2rem]" />
                                    </div>
                                </div>

                                <div className="space-y-3 group">
                                    <Label htmlFor="password" title="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2 lg:text-blue-200/50">Access Key</Label>
                                    <div className="relative group/input">
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••••••"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                            className="h-16 bg-white/[0.03] border-white/10 focus:border-blue-500/50 focus:bg-white/[0.08] text-white placeholder:text-white/20 transition-all rounded-2xl lg:rounded-[1.2rem] text-lg font-bold px-6 shadow-2xl group-hover/input:border-white/20"
                                        />
                                        <div className="absolute inset-0 bg-rose-500/5 blur-[15px] opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none rounded-2xl lg:rounded-[1.2rem]" />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-18 bg-primary hover:bg-blue-500 text-white font-black uppercase tracking-[0.3em] text-[11px] transition-all rounded-[1.5rem] shadow-[0_15px_40px_-10px_rgba(59,130,246,0.6)] active:scale-[0.97] border-none group overflow-hidden relative"
                                disabled={loading}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Initiate Provisioning <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            </Button>
                        </form>

                        <div className="mt-12 pt-12 border-t border-white/5 flex flex-col items-center gap-8">
                            <div className="flex items-center gap-4 w-full">
                                <div className="h-[1px] flex-1 bg-white/5" />
                                <span className="text-[9px] font-black text-blue-200/20 uppercase tracking-[0.5em]">Identity Check</span>
                                <div className="h-[1px] flex-1 bg-white/5" />
                            </div>
                            <Link href="/login" className="group flex items-center gap-4 text-[12px] font-black uppercase tracking-[0.4em] text-white hover:text-blue-400 transition-all">
                                <ArrowLeft className="w-5 h-5 text-blue-600 group-hover:-translate-x-1 transition-transform" />
                                Back to Access Portal
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes slow-zoom {
                    0% { transform: scale(1.1); }
                    100% { transform: scale(1.25); }
                }
                .animate-slow-zoom {
                    animation: slow-zoom 40s linear infinite alternate;
                }
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 1.5s infinite;
                }
                .animate-shake {
                    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                }
                @keyframes shake {
                    10%, 90% { transform: translate3d(-1px, 0, 0); }
                    20%, 80% { transform: translate3d(2px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                    40%, 60% { transform: translate3d(4px, 0, 0); }
                }
                @keyframes text-shimmer {
                    0% { background-position: 0% center; }
                    100% { background-position: -200% center; }
                }
                .animate-text-shimmer {
                    animation: text-shimmer 3s linear infinite;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .h-18 { height: 4.5rem; }
            `}</style>
        </div>
    )
}
