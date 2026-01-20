"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Loader2, MessageSquare, TrendingUp, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingUser {
    id: string
    name: string
    email: string
    image: string | null
    username: string | null
    gender: string | null
}

interface RatingDetail {
    id: string
    complaintTitle: string
    rating: number
    feedback: string | null
    ratedAt: string
    user: RatingUser
}

interface RatingsSummary {
    totalRatings: number
    averageRating: number
    distribution: {
        5: number
        4: number
        3: number
        2: number
        1: number
    }
}

interface AdminInfo {
    id: string
    name: string
    email: string
    image: string | null
    username: string | null
    gender: string | null
    organization: { name: string } | null
}

interface RatingDetailsModalProps {
    adminId: string | null
    adminName: string
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

export function RatingDetailsModal({ adminId, adminName, isOpen, onOpenChange }: RatingDetailsModalProps) {
    const [loading, setLoading] = useState(true)
    const [admin, setAdmin] = useState<AdminInfo | null>(null)
    const [ratings, setRatings] = useState<RatingDetail[]>([])
    const [summary, setSummary] = useState<RatingsSummary | null>(null)

    useEffect(() => {
        if (isOpen && adminId) {
            fetchRatingDetails()
        }
    }, [isOpen, adminId])

    const fetchRatingDetails = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/super-admin/ratings?adminId=${adminId}`)
            if (res.ok) {
                const data = await res.json()
                setAdmin(data.admin)
                setRatings(data.ratings)
                setSummary(data.summary)
            }
        } catch (error) {
            console.error("Failed to fetch rating details:", error)
        } finally {
            setLoading(false)
        }
    }

    const getStarColor = (rating: number) => {
        if (rating >= 4) return "text-emerald-500"
        if (rating >= 3) return "text-amber-500"
        return "text-red-500"
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="w-full h-full max-w-none rounded-none sm:rounded-[2.5rem] sm:max-w-xl sm:max-h-[90vh] border-none shadow-3xl p-0 overflow-hidden flex flex-col bg-white dark:bg-slate-950 transition-all duration-500">
                <DialogTitle className="sr-only">Rating Details for {adminName}</DialogTitle>

                {/* --- Immersive 'Hero Image UI' Header --- */}
                <div className="relative h-[200px] sm:h-[220px] shrink-0 overflow-hidden group">
                    {/* Professional Branding Background (The 'Image' in Image UI) */}
                    <div
                        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[20000ms] group-hover:scale-110"
                        style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                    />

                    {/* Dark Immersive Overlays */}
                    <div className="absolute inset-0 z-[1] bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    <div className="absolute inset-0 z-[1] bg-slate-950/20 backdrop-brightness-50" />

                    {/* Animated Spectral Glows */}
                    <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none opacity-60">
                        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-blue-600/30 blur-[120px] rounded-full animate-pulse" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-amber-500/20 blur-[100px] rounded-full animate-pulse delay-700" />
                    </div>

                    {/* Hero Content Area */}
                    <div className="absolute inset-0 z-[10] flex flex-col items-center justify-center p-6 text-center">
                        <DialogHeader className="w-full flex flex-col items-center">
                            {/* Centered Profile Avatar (Hero Focus) */}
                            <div className="relative mb-3">
                                <div className="absolute inset-0 bg-amber-500 rounded-[2rem] blur-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-1000" />
                                <div className="relative">
                                    <Avatar className="h-16 w-16 sm:h-20 sm:w-20 rounded-[2rem] border-[4px] border-white/10 relative z-10 p-0.5 bg-slate-950 shadow-4xl transition-all duration-700 group-hover:scale-105">
                                        <AvatarImage
                                            className="object-cover rounded-[1.8rem]"
                                            src={admin?.image || `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(admin?.username || adminName)}&top=shortFlat&clothes=graphicShirt&clothesColor=262e33`}
                                        />
                                        <AvatarFallback className="bg-slate-900 text-white font-black text-2xl italic">
                                            {adminName?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full border-[3px] border-slate-950 z-20 shadow-xl" />
                                </div>
                            </div>

                            {/* Identity Section */}
                            <div className="space-y-4 max-w-sm">
                                <div className="flex flex-col items-center gap-0.5">
                                    <div className="flex items-center gap-2">
                                        <div className="h-[1px] w-4 bg-amber-500/50 rounded-full" />
                                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-amber-500 drop-shadow-lg italic">Compliance Audit</span>
                                        <div className="h-[1px] w-4 bg-amber-500/50 rounded-full" />
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-black text-white italic tracking-tighter leading-tight uppercase drop-shadow-2xl">
                                        {adminName}
                                    </h2>
                                </div>

                                <div className="flex flex-wrap justify-center gap-2">
                                    <div className="px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-3xl border border-white/10 shadow-xl group/org">
                                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none drop-shadow-md">
                                            Role: {admin?.organization?.name || "GLOBAL"}
                                        </span>
                                    </div>
                                    <div className="px-4 py-1.5 rounded-full bg-amber-500/10 backdrop-blur-3xl border border-amber-500/20 shadow-xl">
                                        <div className="flex items-center gap-2">
                                            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest leading-none">
                                                {summary?.averageRating || "0.0"} Rating
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DialogHeader>
                    </div>
                </div>

                {/* Content Area (Optimized & Super-Compact) */}
                <div className="relative flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 space-y-6 bg-white dark:bg-slate-950 scrollbar-none">
                    {/* Subtle Internal Branding */}
                    <div
                        className="absolute inset-0 z-0 opacity-[0.01] dark:opacity-[0.03] bg-cover bg-center pointer-events-none"
                        style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                    />

                    <div className="relative z-10 space-y-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-48 gap-4">
                                <div className="h-10 w-10 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin" />
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic animate-pulse">Syncing Audit Records</span>
                            </div>
                        ) : (
                            <>
                                {/* Summary Metrics (Dense Trio) */}
                                {summary && (
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { label: 'Rating', val: summary.averageRating || '0.0', icon: TrendingUp, col: 'text-amber-500' },
                                            { label: 'Audits', val: summary.totalRatings, icon: Users, col: 'text-blue-500' },
                                            { label: 'Notes', val: ratings.filter(r => r.feedback).length, icon: MessageSquare, col: 'text-emerald-500' }
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/60 text-center">
                                                <stat.icon className={cn("h-3.5 w-3.5 mx-auto mb-1.5", stat.col)} />
                                                <div className="text-xl font-black italic tracking-tighter text-slate-950 dark:text-white leading-none mb-1">{stat.val}</div>
                                                <div className="text-[8px] font-black uppercase tracking-[0.1em] text-slate-400">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Dense Distribution Map */}
                                {summary && summary.totalRatings > 0 && (
                                    <div className="bg-slate-50 dark:bg-slate-900/30 rounded-3xl p-4 border border-slate-100 dark:border-slate-800/50">
                                        <div className="space-y-1.5">
                                            {[5, 4, 3, 2, 1].map((star) => {
                                                const count = summary.distribution[star as keyof typeof summary.distribution]
                                                const percentage = summary.totalRatings > 0 ? (count / summary.totalRatings) * 100 : 0
                                                return (
                                                    <div key={star} className="flex items-center gap-3">
                                                        <div className="flex items-center gap-1 w-8 shrink-0">
                                                            <span className="text-xs font-black text-slate-600 dark:text-slate-400 italic leading-none">{star}</span>
                                                            <Star className="h-2.5 w-2.5 text-amber-500 fill-amber-500" />
                                                        </div>
                                                        <div className="flex-1 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                            <div
                                                                className={cn(
                                                                    "h-full rounded-full transition-all duration-700",
                                                                    star >= 4 ? "bg-emerald-500" : star >= 3 ? "bg-amber-500" : "bg-red-500"
                                                                )}
                                                                style={{ width: `${percentage}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-[9px] font-black text-slate-400/60 w-5 text-right">{count}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Detailed Log Stream (Super-Dense) */}
                                <div className="space-y-3 pb-2">
                                    <div className="flex items-center gap-2 px-1">
                                        <div className="h-3 w-[2px] bg-amber-500/50 rounded-full" />
                                        <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400">Audit Insight Stream</h4>
                                    </div>
                                    {ratings.length === 0 ? (
                                        <div className="text-center py-10 bg-slate-50 dark:bg-slate-900/20 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-300">No Logs Found</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-2">
                                            {ratings.map((rating) => (
                                                <div
                                                    key={rating.id}
                                                    className="group/item rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-3 transition-all hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-amber-500/20"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-10 w-10 border border-slate-100 dark:border-slate-800 shrink-0 shadow-sm">
                                                            <AvatarImage
                                                                className="object-cover"
                                                                src={rating.user.image || `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(rating.user.username || rating.user.name)}&top=${rating.user.gender === 'FEMALE' ? 'longButNotTooLong' : 'shortFlat'}`}
                                                            />
                                                            <AvatarFallback className="bg-slate-50 dark:bg-slate-800 text-[10px] font-black">
                                                                {rating.user.name?.[0]}
                                                            </AvatarFallback>
                                                        </Avatar>

                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between gap-2 mb-0.5">
                                                                <div className="min-w-0">
                                                                    <span className="block font-black text-slate-900 dark:text-white truncate text-sm italic leading-tight">
                                                                        {rating.user.name}
                                                                    </span>
                                                                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest block opacity-60">
                                                                        ID: {rating.user.id.slice(0, 8)}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-800 shrink-0">
                                                                    <span className="text-[10px] font-black text-amber-500 italic">{rating.rating}.0</span>
                                                                    <Star className="h-2 w-2 text-amber-500 fill-current" />
                                                                </div>
                                                            </div>
                                                            {rating.feedback && (
                                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold italic line-clamp-1 opacity-80 group-hover/item:opacity-100 transition-opacity">
                                                                    "{rating.feedback}"
                                                                </p>
                                                            )}
                                                            <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-slate-50 dark:border-slate-800/40">
                                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter truncate max-w-[120px]">
                                                                    {rating.complaintTitle}
                                                                </span>
                                                                <span className="text-[7px] font-black text-slate-400 opacity-50">
                                                                    {new Date(rating.ratedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
