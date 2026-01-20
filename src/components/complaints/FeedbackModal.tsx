"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star, MessageSquare, CheckCircle2, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface FeedbackModalProps {
    complaintId: string
    complaintTitle?: string
    adminName?: string
    existingRating?: number | null
    existingFeedback?: string | null
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function FeedbackModal({
    complaintId,
    complaintTitle,
    adminName,
    existingRating,
    existingFeedback,
    isOpen,
    onOpenChange,
    onSuccess
}: FeedbackModalProps) {
    const [rating, setRating] = useState(existingRating || 0)
    const [feedback, setFeedback] = useState(existingFeedback || "")
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Please select a star rating")
            return
        }

        setSubmitting(true)
        try {
            const res = await fetch("/api/user/complaints/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ complaintId, rating, feedback })
            })

            if (res.ok) {
                toast.success("Feedback submitted successfully")
                onSuccess()
                onOpenChange(false)
            } else {
                const data = await res.json()
                if (data.error === "Resolution has already been rated") {
                    toast.error("You have already rated this resolution.", {
                        description: "Ratings are final and cannot be changed."
                    })
                } else {
                    toast.error(data.error || "Failed to submit feedback")
                }
            }
        } catch (error) {
            console.error(error)
            toast.error("An error occurred")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="w-full h-full max-w-none rounded-none sm:rounded-[2.5rem] sm:max-w-md sm:max-h-[90vh] border-none shadow-2xl p-0 overflow-hidden flex flex-col bg-white dark:bg-slate-950">
                {/* World-Class Mirror Glass Header */}
                <div className="bg-slate-900 p-6 sm:p-8 text-white relative overflow-hidden shrink-0 dark:bg-slate-950 border-b border-white/5">
                    {/* Branding texture */}
                    <div
                        className="absolute inset-0 z-0 opacity-20 bg-cover bg-center mix-blend-overlay"
                        style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.15),_transparent_50%)]" />

                    <DialogHeader className="relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                                <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-black tracking-tight text-white uppercase italic">Rate Resolution</DialogTitle>
                                <DialogDescription className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                    Quality Assurance Protocol
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                {/* Content Container (Scrollable) */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    {/* Context Information */}
                    <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 space-y-4">
                        <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">Incident Context</span>
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{complaintTitle || "Universal Feedback"}</h3>
                        </div>
                        {adminName && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/5 rounded-xl border border-blue-500/10 w-fit">
                                <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">{adminName}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-center gap-8 p-8 pt-10">
                        <div className="flex gap-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className="group focus:outline-none transition-all hover:scale-110 active:scale-90"
                                >
                                    <Star
                                        className={cn(
                                            "w-10 h-10 transition-all duration-300",
                                            star <= rating
                                                ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]"
                                                : "text-slate-200 dark:text-slate-800"
                                        )}
                                    />
                                </button>
                            ))}
                        </div>

                        <div className="w-full space-y-3">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600">Response Narrative</label>
                                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">Optional</span>
                            </div>
                            <Textarea
                                placeholder="Briefly describe your experience..."
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="bg-white border-slate-100 focus:border-blue-500/30 focus:bg-white resize-none h-28 rounded-[1.5rem] p-5 text-sm font-medium dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 shadow-inner"
                            />
                        </div>

                        <Button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="w-full h-14 rounded-[1.8rem] bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-blue-500/20 transition-all active:scale-[0.98] dark:bg-blue-600 dark:hover:bg-blue-500"
                        >
                            {submitting ? "Processing..." : (existingRating ? "Commit Update" : "Broadcast Feedback")}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
