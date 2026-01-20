"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, Loader2, ArrowLeft, Send, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ForgotPasswordPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            })

            const data = await res.json()

            if (res.ok) {
                setSuccess(true)
                setTimeout(() => {
                    router.push(`/reset-password?email=${email}`)
                }, 2000)
            } else {
                setError(data.error || "Request failed")
            }
        } catch (err) {
            setError("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <Card className="w-full max-w-md rounded-none border-8 border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader className="space-y-4 pt-10 px-10">
                    <div className="h-16 w-16 bg-black flex items-center justify-center mx-auto mb-4">
                        <Lock className="h-10 w-10 text-white" />
                    </div>
                    <div className="text-center space-y-2">
                        <CardTitle className="text-3xl font-black uppercase tracking-tighter">Credential Recovery</CardTitle>
                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Initiating secure password reset loop</p>
                    </div>
                </CardHeader>
                <CardContent className="p-10 pt-0 space-y-8">
                    {!success ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">System Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                    <Input
                                        type="email"
                                        placeholder="admin@cms.com"
                                        className="pl-12 h-16 rounded-none border-4 border-zinc-100 focus:border-black font-bold"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-zinc-50 border-l-4 border-black animate-in fade-in slide-in-from-left-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-black">{error}</p>
                                </div>
                            )}

                            <Button
                                className="w-full h-16 bg-black hover:bg-zinc-800 text-white font-black uppercase tracking-[0.3em] text-xs transition-all flex gap-3 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                Request reset code
                            </Button>
                        </form>
                    ) : (
                        <div className="p-10 bg-zinc-50/50 flex flex-col items-center justify-center gap-4 text-center">
                            <div className="h-12 w-12 bg-black flex items-center justify-center">
                                <Loader2 className="h-6 w-6 text-white animate-spin" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-black">Reset code generated. Redirecting to recovery portal...</p>
                        </div>
                    )}

                    <Button
                        variant="ghost"
                        className="w-full font-black uppercase tracking-widest text-[10px] gap-2 p-0 h-auto hover:bg-transparent"
                        onClick={() => router.push("/login")}
                    >
                        <ArrowLeft className="h-4 w-4" /> Return to Login
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
