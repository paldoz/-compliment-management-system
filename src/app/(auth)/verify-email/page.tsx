"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ShieldCheck, Loader2, ArrowLeft, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function VerifyEmailForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get("email")
    const [otpCode, setOtpCode] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (!email) {
            router.push("/signup")
        }
    }, [email])

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/auth/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otpCode })
            })

            const data = await res.json()

            if (res.ok) {
                router.push("/login?verified=true")
            } else {
                setError(data.error || "Verification failed")
            }
        } catch (err) {
            setError("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative z-10 w-full min-h-screen flex flex-col lg:flex-row">
            {/* Left Side - Visual Branding (Desktop Only) */}
            <div className="hidden lg:flex lg:w-3/5 flex-col justify-between p-24 text-white">
                <div className="flex items-center gap-5 group cursor-default">
                    <div className="bg-white/5 backdrop-blur-3xl p-4 rounded-[2rem] border border-white/10 shadow-2xl transition-all duration-500 group-hover:bg-white/10 group-hover:scale-110">
                        <ShieldCheck className="w-12 h-12 text-blue-400 group-hover:text-blue-300 transition-colors" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-4xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">CMS Platform</span>
                        <span className="text-[10px] font-bold text-blue-400/80 uppercase tracking-[0.5em] mt-[-4px]">Security Operations Terminal</span>
                    </div>
                </div>

                <div className="max-w-2xl space-y-16">
                    <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-blue-500/10 backdrop-blur-2xl rounded-full border border-blue-500/20 shadow-inner">
                            <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
                            <span className="text-[11px] font-black text-blue-100 uppercase tracking-[0.2em]">Multi-Factor Protocol Active</span>
                        </div>

                        <h1 className="text-[100px] font-black tracking-tighter leading-[0.8] text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-white bg-[length:200%_auto] select-none animate-in fade-in zoom-in-95 slide-in-from-left-12 duration-1000 delay-200 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:drop-shadow-[0_0_50px_rgba(59,130,246,0.5)] transition-all cursor-default animate-text-shimmer animate-float">
                            IDENTITY<br />
                            VALIDATION<br />
                            SEQUENCE
                        </h1>

                        <p className="text-blue-100/60 text-2xl font-light leading-relaxed max-w-xl">
                            Access to the global registry requires cryptographic validation.
                            Please enter the priority access token transmitted to your secure node.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-16 pt-16 border-t border-white/5">
                        <div className="space-y-3 group">
                            <div className="text-6xl font-black tracking-tighter text-white group-hover:text-blue-400 transition-colors">100%</div>
                            <div className="flex items-center gap-3">
                                <div className="h-1.5 w-12 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                <div className="text-[11px] font-black text-blue-200/40 uppercase tracking-[0.3em]">Encrypted Channel</div>
                            </div>
                        </div>
                        <div className="space-y-3 group">
                            <div className="text-6xl font-black tracking-tighter text-white group-hover:text-emerald-400 transition-colors">6-DIGIT</div>
                            <div className="flex items-center gap-3">
                                <div className="h-1.5 w-12 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                <div className="text-[11px] font-black text-blue-200/40 uppercase tracking-[0.3em]">Temporal Token</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 opacity-40 hover:opacity-100 transition-opacity">
                    <div className="h-[1px] w-24 bg-gradient-to-r from-blue-500/50 to-transparent" />
                    <div className="text-white text-[9px] font-black uppercase tracking-[0.5em] whitespace-nowrap">
                        EST. 2026 • SECURITY NODE • VALIDATED
                    </div>
                </div>
            </div>

            {/* Right Side - Verify Form (Refined Desktop Fit) */}
            <div className="w-full lg:w-[45%] flex flex-col justify-center p-6 lg:p-20 min-h-screen lg:min-h-0 lg:bg-white lg:dark:bg-slate-900">
                {/* The "Perfect Fit" Container */}
                <div className="w-full bg-white dark:bg-slate-900 px-6 py-10 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl lg:max-w-[500px] lg:mx-auto lg:rounded-none lg:bg-transparent lg:p-0 lg:border-none lg:shadow-none animate-in zoom-in-95 duration-1000">

                    <div className="space-y-2 text-center lg:text-left">
                        <h2 className="text-3xl sm:text-[40px] font-black tracking-tighter text-slate-900 dark:text-white leading-none">Verify Email</h2>
                        <p className="text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest lg:text-slate-500 lg:dark:text-slate-400 italic">
                            Access Token sent to <span className="text-primary font-black lowercase not-italic">{email}</span>
                        </p>
                    </div>

                    <form onSubmit={handleVerify} className="space-y-8 mt-12">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-3xl flex items-start gap-4 backdrop-blur-xl animate-shake">
                                <div className="space-y-1 w-full text-center">
                                    <div className="font-black text-xs uppercase tracking-widest text-red-200">Validation Failure</div>
                                    <p className="text-xs text-red-300/60 leading-tight">{error}</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="space-y-4 group text-center">
                                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 lg:text-blue-200/50">Access Code</Label>
                                <Input
                                    placeholder="000 000"
                                    maxLength={6}
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value)}
                                    className="h-20 sm:h-28 border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:border-primary/50 text-slate-900 dark:text-white transition-all rounded-3xl lg:rounded-[2rem] lg:bg-white/5 lg:border-white/5 lg:text-white lg:dark:bg-slate-950/50 lg:dark:border-slate-800 lg:dark:text-white text-4xl sm:text-[64px] font-black tracking-[0.2em] text-center px-6 placeholder:text-slate-200 dark:placeholder:text-slate-800"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 sm:h-18 bg-primary hover:bg-blue-500 text-white font-black uppercase tracking-[0.3em] text-[10px] sm:text-[11px] transition-all rounded-[1.5rem] shadow-[0_15px_40px_-10px_rgba(59,130,246,0.6)] active:scale-[0.97] border-none group overflow-hidden relative"
                            disabled={loading}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Authorize Access <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                        </Button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-6 lg:border-white/5 lg:mt-12 lg:pt-10">
                        <div className="flex items-center gap-4 w-full">
                            <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800 lg:bg-white/5" />
                            <span className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.4em] lg:text-blue-200/30">Protocol Misfeed?</span>
                            <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800 lg:bg-white/5" />
                        </div>
                        <Link href="/signup" className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white hover:text-primary transition-all lg:text-white">
                            <ArrowLeft className="w-5 h-5 lg:w-4 lg:h-4 text-primary" /> Start Over
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function VerifyEmailPage() {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#020617]">
            {/* Unified Dynamic Background Layer */}
            <div
                className="hidden lg:block absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20000ms] scale-110 motion-safe:animate-slow-zoom"
                style={{ backgroundImage: "url('/auth-login.png')", backgroundAttachment: 'fixed' }}
            />
            <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 lg:bg-slate-950/40 lg:backdrop-blur-[2px] transition-all duration-700 lg:backdrop-blur-none" />
            <div className="hidden lg:block absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-slate-950/20 lg:bg-gradient-to-br lg:from-slate-950/90 lg:via-slate-950/40 lg:to-transparent" />

            <Suspense fallback={
                <div className="relative z-10 w-full min-h-screen flex items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-white opacity-20" />
                </div>
            }>
                <VerifyEmailForm />
            </Suspense>

            <style jsx global>{`
                @keyframes slow-zoom {
                    0% { transform: scale(1.1); }
                    50% { transform: scale(1.2); }
                    100% { transform: scale(1.1); }
                }
                .motion-safe\:animate-slow-zoom {
                    animation: slow-zoom 20s linear infinite;
                }
                @keyframes text-shimmer {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 200% 50%; }
                }
                .animate-text-shimmer {
                    background-size: 200% auto;
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
