"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Building2, ShieldAlert, Loader2, ArrowLeft, Save, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

function ResetPasswordForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get("email")
    const [resetCode, setResetCode] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (!email) {
            router.push("/forgot-password")
        }
    }, [email])

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, resetCode, newPassword })
            })

            const data = await res.json()

            if (res.ok) {
                router.push("/login?reset=true")
            } else {
                setError(data.error || "Reset failed")
            }
        } catch (err) {
            setError("Something went wrong")
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
                            <Building2 className="w-12 h-12 text-blue-600" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-4xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-100 to-blue-200">CMS Platform</span>
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.5em] mt-[-4px]">Global Registry Architecture</span>
                        </div>
                    </div>

                    <div className="max-w-2xl space-y-16">
                        <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
                            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-blue-500/10 backdrop-blur-2xl rounded-full border border-blue-400/30">
                                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                                <span className="text-[11px] font-black text-cyan-100 uppercase tracking-[0.2em]">Institutional Transparency Protocol</span>
                            </div>

                            <h1 className="text-[80px] font-black tracking-tighter leading-[0.8] text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-white/90 animate-float">
                                FINAL<br />
                                CREDENTIAL<br />
                                OVERRIDE
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 opacity-40">
                        <div className="h-[1px] w-24 bg-gradient-to-r from-cyan-400/50 to-transparent" />
                        <div className="text-white text-[9px] font-black uppercase tracking-[0.5em] whitespace-nowrap">
                            EST. 2026 • GLOBAL REGISTRY CORE • ENCRYPTED
                        </div>
                    </div>
                </div>

                {/* Right Side - Final Override Panel */}
                <div className="w-full lg:w-[45%] min-h-screen relative flex flex-col justify-center">
                    <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-[40px] border-l border-white/10 hidden lg:block" />
                    <div className="relative z-10 w-full px-8 py-12 lg:px-20 lg:py-0 max-w-2xl mx-auto lg:max-w-none animate-in fade-in slide-in-from-right-12 duration-1000">

                        <div className="space-y-3 text-center lg:text-left">
                            <h2 className="text-4xl sm:text-[50px] font-black tracking-tighter text-white leading-none">Override</h2>
                            <p className="text-blue-200/50 font-bold text-[10px] sm:text-xs uppercase tracking-[0.4em] italic">Verifying reset sequence for {email}</p>
                        </div>

                        <form onSubmit={handleReset} className="space-y-8 mt-12">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-3xl flex items-start gap-4 backdrop-blur-xl animate-shake">
                                    <ShieldAlert className="h-6 w-6 text-red-400 flex-shrink-0" />
                                    <div className="space-y-1">
                                        <div className="font-black text-xs uppercase tracking-widest text-red-200">Override Rejected</div>
                                        <p className="text-xs text-red-300/60">{error}</p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-6">
                                <div className="space-y-3 group text-center lg:text-left">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2 lg:text-blue-200/50 lg:group-focus-within:text-primary transition-colors">
                                        Verification Token
                                    </Label>
                                    <div className="relative group/input">
                                        <Input
                                            placeholder="XXXXXX"
                                            maxLength={6}
                                            value={resetCode}
                                            onChange={(e) => setResetCode(e.target.value)}
                                            required
                                            className="h-20 bg-white/[0.03] border-white/10 focus:border-blue-500/50 focus:bg-white/[0.08] text-white placeholder:text-white/20 transition-all rounded-2xl lg:rounded-[1.2rem] text-3xl font-black text-center tracking-[0.4em] px-6 shadow-2xl group-hover/input:border-white/20"
                                        />
                                        <div className="absolute inset-0 bg-blue-500/5 blur-[15px] opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none rounded-2xl lg:rounded-[1.2rem]" />
                                    </div>
                                </div>

                                <div className="space-y-3 group">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2 lg:text-blue-200/50 lg:group-focus-within:text-primary transition-colors">
                                        New Access Sequence
                                    </Label>
                                    <div className="relative group/input">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••••••"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            className="h-16 bg-white/[0.03] border-white/10 focus:border-emerald-500/50 focus:bg-white/[0.08] text-white placeholder:text-white/20 transition-all rounded-2xl lg:rounded-[1.2rem] text-lg font-bold px-6 shadow-2xl group-hover/input:border-white/20"
                                        />
                                        <div className="absolute inset-0 bg-emerald-500/5 blur-[15px] opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none rounded-2xl lg:rounded-[1.2rem]" />
                                        <button
                                            type="button"
                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-18 bg-primary hover:bg-blue-500 text-white font-black uppercase tracking-[0.3em] text-[11px] transition-all rounded-[1.5rem] shadow-[0_15px_40_rgba(59,130,246,0.6)] active:scale-[0.97] group overflow-hidden relative"
                                disabled={loading || resetCode.length !== 6 || !newPassword}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Finalize Override</>}
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
                            <Link href="/forgot-password" title="Request new code" className="group flex items-center gap-4 text-[12px] font-black uppercase tracking-[0.4em] text-white hover:text-blue-400 transition-all">
                                <ArrowLeft className="w-5 h-5 text-blue-600 group-hover:-translate-x-1 transition-transform" />
                                Request New Code
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

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
            <Suspense fallback={
                <div className="flex flex-col items-center gap-4 text-white/40">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Temporal Shift...</span>
                </div>
            }>
                <ResetPasswordForm />
            </Suspense>
        </div>
    )
}
