"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ShieldAlert, Loader2, ArrowLeft, Save, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
        <Card className="w-full max-w-md rounded-none border-8 border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="space-y-4 pt-10 px-10">
                <div className="h-16 w-16 bg-black flex items-center justify-center mx-auto mb-4">
                    <ShieldAlert className="h-10 w-10 text-white" />
                </div>
                <div className="text-center space-y-2">
                    <CardTitle className="text-3xl font-black uppercase tracking-tighter">Final Override</CardTitle>
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Verify reset code for {email}</p>
                </div>
            </CardHeader>
            <CardContent className="p-10 pt-0 space-y-8">
                <form onSubmit={handleReset} className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">reset code</Label>
                        <Input
                            placeholder="E.G. 123456"
                            className="h-16 rounded-none border-4 border-zinc-100 focus:border-black text-center text-2xl font-black tracking-[0.2em]"
                            maxLength={6}
                            value={resetCode}
                            onChange={(e) => setResetCode(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">new password</Label>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="h-16 rounded-none border-4 border-zinc-100 focus:border-black font-bold"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-zinc-50 border-l-4 border-black animate-in fade-in slide-in-from-left-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-black">{error}</p>
                        </div>
                    )}

                    <Button
                        className="w-full h-16 bg-black hover:bg-zinc-800 text-white font-black uppercase tracking-[0.3em] text-xs transition-all flex gap-3 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
                        disabled={loading || resetCode.length !== 6 || !newPassword}
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Update Credentials
                    </Button>
                </form>

                <Button
                    variant="ghost"
                    className="w-full font-black uppercase tracking-widest text-[10px] gap-2 p-0 h-auto hover:bg-transparent"
                    onClick={() => router.push("/forgot-password")}
                >
                    <ArrowLeft className="h-4 w-4" /> Request New Code
                </Button>
            </CardContent>
        </Card>
    )
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <Suspense fallback={
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-black opacity-20" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Temporal Shift...</span>
                </div>
            }>
                <ResetPasswordForm />
            </Suspense>
        </div>
    )
}
