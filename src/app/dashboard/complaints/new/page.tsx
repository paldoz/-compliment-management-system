"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
    PlusCircle,
    Loader2,
    ArrowLeft,
    Send,
    AlertCircle,
    Building2,
    FileText,
    Paperclip,
    X,
    CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function NewComplaintPage() {
    const { data: session } = useSession()
    const router = useRouter()
    const [organizations, setOrganizations] = useState<any[]>([])
    const [allDepartments, setAllDepartments] = useState<any[]>([])
    const [filteredDepartments, setFilteredDepartments] = useState<any[]>([])
    const [loadingData, setLoadingData] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        organizationId: "",
        departmentId: "",
        attachments: [] as any[]
    })
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [orgsRes, deptsRes] = await Promise.all([
                    fetch("/api/user/organizations"),
                    fetch("/api/user/departments")
                ])
                const orgs = await orgsRes.json()
                const depts = await deptsRes.json()
                setOrganizations(orgs)
                setAllDepartments(depts)
            } catch (err) {
                console.error("Error fetching data:", err)
            } finally {
                setLoadingData(false)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (formData.organizationId) {
            setFilteredDepartments(allDepartments.filter(d => d.organizationId === formData.organizationId))
            // Only reset department if it doesn't belong to the new organization
            setFormData(prev => {
                const currentDept = allDepartments.find(d => d.id === prev.departmentId)
                if (currentDept && currentDept.organizationId === formData.organizationId) {
                    return prev
                }
                return { ...prev, departmentId: "" }
            })
        } else {
            setFilteredDepartments([])
        }
    }, [formData.organizationId, allDepartments])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        Array.from(files).forEach(file => {
            const reader = new FileReader()
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    attachments: [...prev.attachments, {
                        name: file.name,
                        type: file.type,
                        url: reader.result as string
                    }]
                }))
            }
            reader.readAsDataURL(file)
        })
    }

    const removeAttachment = (index: number) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.title || !formData.description || !formData.organizationId || !formData.departmentId) return

        setSubmitting(true)
        try {
            const res = await fetch("/api/user/complaints", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                setSuccess(true)
                setTimeout(() => {
                    router.push("/dashboard/complaints")
                }, 2000)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setSubmitting(false)
        }
    }

    if (success) {
        return (
            <div className="flex h-[70vh] items-center justify-center p-6">
                <div className="flex flex-col items-center gap-6 text-center max-w-md w-full p-12 rounded-[3.5rem] bg-white shadow-2xl shadow-blue-900/10 border border-slate-50 relative overflow-hidden dark:bg-slate-900 dark:border-slate-800 dark:shadow-none">
                    <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-primary/5 to-transparent dark:from-blue-500/10" />
                    <div className="h-24 w-24 bg-primary/10 rounded-[2rem] flex items-center justify-center relative z-10 shadow-inner dark:bg-blue-500/20">
                        <CheckCircle2 className="h-12 w-12 text-primary dark:text-blue-400" />
                    </div>
                    <div className="space-y-3 relative z-10">
                        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-tight dark:text-white">Compliment Recorded</h2>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] dark:text-slate-500">Awaiting Organizational Acknowlegment</p>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full mt-8 overflow-hidden relative z-10 dark:bg-slate-800">
                        <div className="h-full bg-primary animate-[progress_2s_ease-in-out] rounded-full dark:bg-blue-500"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-24 px-4">
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    className="hover:bg-white text-slate-400 hover:text-primary font-bold uppercase tracking-widest text-[9px] gap-2 px-0 h-10 rounded-xl transition-all dark:text-slate-600 dark:hover:bg-slate-900 dark:hover:text-blue-400"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4" /> Return to Dashboard
                </Button>
            </div>

            {/* World-Class 'Broadcast Terminal' Mirror Glass Hero (Compact) */}
            <div className="relative overflow-hidden group rounded-2xl lg:rounded-[2.5rem] p-6 lg:p-10 bg-slate-950 border border-white/5 shadow-2xl transition-all duration-700 shadow-blue-900/10">
                {/* Branding-Integrated Background Texture */}
                <div
                    className="absolute inset-0 z-0 opacity-20 bg-cover bg-center transition-transform duration-[20000ms] group-hover:scale-110 contrast-[1.1]"
                    style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                />

                {/* Broadcast Radial Flows (Prussian Blue & Amber) */}
                <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[70%] bg-amber-500/10 blur-[100px] rounded-full animate-pulse delay-700" />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10">
                    <div className="space-y-4 lg:space-y-6">
                        <div className="space-y-1 lg:space-y-2">
                            <div className="flex items-center gap-5">
                                <div className="h-[2px] w-12 bg-gradient-to-r from-blue-500 to-transparent rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.6em] text-blue-400">Feedback Transmission</span>
                            </div>
                            <h1 className="text-3xl lg:text-5xl font-black tracking-tighter leading-none text-white uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white/70 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                New <span className="text-blue-500">Compliment</span>
                            </h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 backdrop-blur-2xl p-2.5 px-6 rounded-2xl">
                                <div className="h-8 w-8 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/30">
                                    <Send className="h-4 w-4 text-blue-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Active Uplink</span>
                                    <span className="text-sm font-black text-white italic">Broadcast Ready</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:flex flex-col items-end gap-1 text-right opacity-30 group-hover:opacity-60 transition-opacity">
                        <div className="text-[60px] font-black tracking-tighter text-white/5 leading-none">TX</div>
                        <div className="text-[8px] font-black text-white/50 tracking-[1em] uppercase">Comms Layer v1.2</div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
                <Card className="rounded-[3.5rem] border border-white/40 bg-white shadow-2xl shadow-blue-900/5 overflow-hidden dark:bg-slate-900 dark:border-slate-800 dark:shadow-none">
                    <CardContent className="p-16 space-y-16">
                        {/* Section 1: Classification */}
                        <div className="space-y-10">
                            <div className="flex items-center gap-4">
                                <div className="h-1 w-10 bg-primary/20 rounded-full dark:bg-blue-500/30"></div>
                                <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Target Selection</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1 dark:text-slate-600">Receiving Organization</Label>
                                    <Select
                                        value={formData.organizationId}
                                        onValueChange={(val) => setFormData({ ...formData, organizationId: val })}
                                    >
                                        <SelectTrigger className="h-16 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:border-primary/20 focus:ring-primary/5 font-bold text-slate-700 text-sm transition-all shadow-inner px-6 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 dark:focus:bg-slate-950 dark:focus:border-blue-500/30">
                                            <SelectValue placeholder="Identify Organization" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-slate-100 shadow-2xl dark:bg-slate-900 dark:border-slate-800">
                                            {loadingData ? (
                                                <div className="p-4 flex justify-center"><Loader2 className="h-4 w-4 animate-spin text-primary dark:text-white/20" /></div>
                                            ) : (
                                                organizations.map((org: any) => (
                                                    <SelectItem key={org.id} value={org.id} className="font-semibold text-sm py-4 rounded-xl dark:text-slate-200">
                                                        <div className="flex items-center gap-2">
                                                            {org.name}
                                                            {org.isVerified && (
                                                                <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 fill-blue-500/10" />
                                                            )}
                                                        </div>
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1 dark:text-slate-600">Internal Department</Label>
                                    <Select
                                        value={formData.departmentId}
                                        onValueChange={(val) => setFormData({ ...formData, departmentId: val })}
                                        disabled={!formData.organizationId}
                                    >
                                        <SelectTrigger className="h-16 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:border-primary/20 focus:ring-primary/5 font-bold text-slate-700 text-sm transition-all shadow-inner px-6 disabled:opacity-30 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 dark:focus:bg-slate-950 dark:focus:border-blue-500/30">
                                            <SelectValue placeholder={formData.organizationId ? "Select Functional Unit" : "Awaiting Organization Selection"} />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-slate-100 shadow-2xl dark:bg-slate-900 dark:border-slate-800">
                                            {filteredDepartments.map((dept: any) => (
                                                <SelectItem key={dept.id} value={dept.id} className="font-semibold text-sm py-4 rounded-xl dark:text-slate-200">
                                                    {dept.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Narrative */}
                        <div className="space-y-10">
                            <div className="flex items-center gap-4">
                                <div className="h-1 w-10 bg-primary/20 rounded-full dark:bg-blue-500/30"></div>
                                <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Feedback Narrative</h3>
                            </div>
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1 dark:text-slate-600">Compliment Headline</Label>
                                    <Input
                                        placeholder="Summarize your positive experience..."
                                        className="h-16 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:border-primary/20 font-bold text-xl px-8 placeholder:font-medium placeholder:text-slate-200 transition-all shadow-inner dark:bg-slate-950 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-700 dark:focus:bg-slate-950 dark:focus:border-blue-500/30"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1 dark:text-slate-600">Detailed Description</Label>
                                    <Textarea
                                        placeholder="Provide full context for your compliment..."
                                        className="min-h-[200px] rounded-[2rem] border-slate-100 bg-slate-50/50 focus:bg-white focus:border-primary/20 font-medium p-8 placeholder:text-slate-200 leading-relaxed resize-none transition-all shadow-inner text-lg dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 dark:placeholder:text-slate-700 dark:focus:bg-slate-950 dark:focus:border-blue-500/30"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Evidence */}
                        <div className="space-y-10">
                            <div className="flex items-center gap-4">
                                <div className="h-1 w-10 bg-primary/20 rounded-full dark:bg-blue-500/30"></div>
                                <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Supporting Documentation</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <label className="border-2 border-dashed border-slate-100 rounded-3xl p-10 flex flex-col items-center justify-center gap-5 hover:border-primary/20 hover:bg-slate-50/50 transition-all group cursor-pointer shadow-sm relative overflow-hidden dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-500/30 dark:hover:bg-slate-900">
                                    <div className="p-4 bg-slate-50 group-hover:bg-primary/10 group-hover:text-primary transition-all rounded-2xl dark:bg-slate-900 dark:group-hover:bg-blue-500/10">
                                        <PlusCircle className="h-8 w-8 text-slate-300 group-hover:text-primary transition-colors dark:text-slate-700 dark:group-hover:text-blue-400" />
                                    </div>
                                    <div className="text-center">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] block text-slate-600 dark:text-slate-400">Append Evidence</span>
                                        <span className="text-[10px] font-bold text-slate-300 uppercase block tracking-widest mt-1 dark:text-slate-700">Images / PDF Payload</span>
                                    </div>
                                    <Input
                                        type="file"
                                        className="hidden"
                                        multiple
                                        accept="image/*,.pdf"
                                        onChange={handleFileChange}
                                    />
                                </label>
                                <div className="space-y-4">
                                    {formData.attachments.length > 0 ? (
                                        <div className="space-y-3 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                                            {formData.attachments.map((file, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group animate-in slide-in-from-right-2 dark:bg-slate-950 dark:border-slate-800">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center border border-slate-200 shrink-0 dark:bg-slate-900 dark:border-slate-800">
                                                            <Paperclip className="h-4 w-4 text-slate-400 dark:text-slate-600" />
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-700 truncate dark:text-slate-200">{file.name}</span>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 rounded-lg hover:bg-red-50 hover:text-red-500 text-slate-300 dark:hover:bg-red-950/30 dark:text-slate-700 dark:hover:text-red-400"
                                                        onClick={() => removeAttachment(idx)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center p-10 bg-slate-50/30 rounded-3xl border border-slate-50/50 h-full dark:bg-slate-950 dark:border-slate-800">
                                            <div className="text-center space-y-3 opacity-30">
                                                <AlertCircle className="h-7 w-7 text-slate-400 mx-auto dark:text-slate-600" strokeWidth={1.5} />
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 max-w-[220px] leading-relaxed dark:text-slate-700">Verification metadata may be requested post-submission</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-end gap-6 pr-4">
                    <Button
                        type="button"
                        variant="ghost"
                        className="h-16 px-10 rounded-2xl font-bold uppercase tracking-widest text-[11px] text-slate-400 hover:text-slate-600 hover:bg-white transition-all dark:text-slate-600 dark:hover:text-slate-400 dark:hover:bg-slate-900"
                        onClick={() => router.back()}
                    >
                        Abort
                    </Button>
                    <Button
                        type="submit"
                        className="h-16 px-16 rounded-[2rem] bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-[0.3em] text-[11px] transition-all flex gap-4 shadow-2xl shadow-blue-900/10 active:scale-[0.98] disabled:opacity-40 dark:bg-blue-600 dark:hover:bg-blue-500 dark:shadow-none"
                        disabled={submitting || !formData.title || !formData.description || !formData.organizationId || !formData.departmentId}
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Authenticating...
                            </>
                        ) : (
                            <>
                                <Send className="h-5 w-5" />
                                Broadcast Compliment
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
