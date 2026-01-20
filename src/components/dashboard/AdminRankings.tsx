"use client"

import { Trophy, Medal, Crown, Star, CheckCircle2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Admin {
    id: string
    name: string
    image?: string
    username?: string
    gender?: string
    organization: string
    averageRating: number
    ratedCount?: number
    resolved: number
    averageResolutionTime: number
}

export function AdminRankings({ admins }: { admins: Admin[] }) {
    const top3 = admins.slice(0, 3)
    if (top3.length === 0) return null

    return (
        <div className="relative mb-20 mt-10">
            {/* Background Decorations */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl opacity-30 rounded-full pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-end justify-center max-w-5xl mx-auto px-4">

                {/* 2nd Place */}
                {top3[1] && (
                    <div className="flex flex-col items-center order-2 md:order-1 relative group w-full">
                        <div className="relative mb-4 transition-transform duration-300 group-hover:-translate-y-1">
                            <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                            <Avatar className="w-20 h-20 border-4 border-slate-200 dark:border-slate-600 shadow-xl">
                                <AvatarImage className="object-cover" src={top3[1].image || `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(top3[1].username || top3[1].name)}&top=${top3[1].gender === 'FEMALE' ? 'longButNotTooLong,straight01,straight02' : 'shortFlat,shortRound,theCaesar'}`} />
                                <AvatarFallback className="bg-slate-100 text-slate-600 text-lg font-bold">{top3[1].name[0]}</AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-700/50 p-4 rounded-xl w-full text-center shadow-lg hover:bg-white/60 dark:hover:bg-slate-900/60 transition-all relative overflow-hidden group/card">
                            {/* Branding Texture Overlay */}
                            <div
                                className="absolute inset-0 z-0 opacity-[0.03] bg-cover bg-center transition-transform duration-[10000ms] group-hover/card:scale-110 pointer-events-none"
                                style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                            />
                            <div className="relative z-10">
                                <h3 className="font-bold text-base text-slate-800 dark:text-white truncate">{top3[1].name}</h3>
                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-3">{top3[1].organization}</p>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs bg-white/50 dark:bg-slate-800/50 p-1.5 rounded-lg">
                                    <span className="text-slate-500">Rating</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {top3[1].averageRating || 'N/A'}
                                        {top3[1].ratedCount ? <span className="text-[9px] text-slate-400 ml-0.5">({top3[1].ratedCount})</span> : null}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs bg-white/50 dark:bg-slate-800/50 p-1.5 rounded-lg">
                                    <span className="text-slate-500">Resolved</span>
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> {top3[1].resolved}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 1st Place */}
                {top3[0] && (
                    <div className="flex flex-col items-center order-1 md:order-2 relative z-20 mb-6 md:mb-8 w-full group">
                        <div className="relative mb-6 transition-transform duration-300 group-hover:-translate-y-1">
                            {/* Rank 1 Badge */}
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
                                <span className="text-2xl font-black text-yellow-500 drop-shadow-sm filter">1<span className="text-sm align-top">st</span></span>
                                <Crown className="w-8 h-8 text-yellow-500 fill-yellow-500 drop-shadow-sm -mt-1" />
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-200 to-amber-100 dark:from-yellow-900/40 dark:to-amber-900/40 rounded-full blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />
                            <Avatar className="w-28 h-28 border-[5px] border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.3)]">
                                <AvatarImage className="object-cover" src={top3[0].image || `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(top3[0].username || top3[0].name)}&top=${top3[0].gender === 'FEMALE' ? 'longButNotTooLong,straight01,straight02' : 'shortFlat,shortRound,theCaesar'}`} />
                                <AvatarFallback className="bg-yellow-50 text-yellow-700 text-2xl font-bold">{top3[0].name[0]}</AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="bg-gradient-to-b from-white/60 to-white/40 dark:from-slate-900/60 dark:to-slate-900/40 backdrop-blur-xl border border-yellow-500/30 p-6 rounded-2xl w-full text-center shadow-xl shadow-yellow-500/10 hover:border-yellow-500/50 transition-all transform hover:scale-105 duration-300 relative overflow-hidden group/card">
                            {/* Branding Texture Overlay */}
                            <div
                                className="absolute inset-0 z-0 opacity-[0.05] bg-cover bg-center transition-transform duration-[10000ms] group-hover/card:scale-110 pointer-events-none"
                                style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                            />
                            <div className="relative z-10">
                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white truncate">{top3[0].name}</h3>
                                <p className="text-xs text-yellow-600/80 dark:text-yellow-400 font-bold uppercase tracking-widest mb-4">{top3[0].organization}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col items-center justify-center p-3 bg-yellow-400/10 rounded-xl border border-yellow-400/20">
                                    <span className="text-[10px] text-yellow-700/70 dark:text-yellow-400/70 font-semibold uppercase mb-0.5">Rating</span>
                                    <span className="text-lg font-black text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                                        {top3[0].averageRating || 'N/A'} <Star className="w-4 h-4 fill-current" />
                                    </span>
                                    {top3[0].ratedCount ? <span className="text-[9px] text-yellow-600/70">({top3[0].ratedCount} ratings)</span> : null}
                                </div>
                                <div className="flex flex-col items-center justify-center p-3 bg-emerald-400/10 rounded-xl border border-emerald-400/20">
                                    <span className="text-[10px] text-emerald-700/70 dark:text-emerald-400/70 font-semibold uppercase mb-0.5">Resolved</span>
                                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                        {top3[0].resolved} <CheckCircle2 className="w-4 h-4" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3rd Place */}
                {top3[2] && (
                    <div className="flex flex-col items-center order-3 relative group w-full">
                        <div className="relative mb-4 transition-transform duration-300 group-hover:-translate-y-1">
                            <div className="absolute inset-0 bg-gradient-to-tr from-orange-200 to-rose-100 dark:from-orange-900/30 dark:to-rose-900/30 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                            <Avatar className="w-20 h-20 border-4 border-orange-700/50 dark:border-orange-600/50 shadow-xl">
                                <AvatarImage className="object-cover" src={top3[2].image || `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(top3[2].username || top3[2].name)}&top=${top3[2].gender === 'FEMALE' ? 'longButNotTooLong,straight01,straight02' : 'shortFlat,shortRound,theCaesar'}`} />
                                <AvatarFallback className="bg-orange-50 text-orange-700 text-lg font-bold">{top3[2].name[0]}</AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-700/50 p-4 rounded-xl w-full text-center shadow-lg hover:bg-white/60 dark:hover:bg-slate-900/60 transition-all relative overflow-hidden group/card">
                            {/* Branding Texture Overlay */}
                            <div
                                className="absolute inset-0 z-0 opacity-[0.03] bg-cover bg-center transition-transform duration-[10000ms] group-hover/card:scale-110 pointer-events-none"
                                style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                            />
                            <div className="relative z-10">
                                <h3 className="font-bold text-base text-slate-800 dark:text-white truncate">{top3[2].name}</h3>
                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-3">{top3[2].organization}</p>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs bg-white/50 dark:bg-slate-800/50 p-1.5 rounded-lg">
                                    <span className="text-slate-500">Rating</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {top3[2].averageRating || 'N/A'}
                                        {top3[2].ratedCount ? <span className="text-[9px] text-slate-400 ml-0.5">({top3[2].ratedCount})</span> : null}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs bg-white/50 dark:bg-slate-800/50 p-1.5 rounded-lg">
                                    <span className="text-slate-500">Resolved</span>
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> {top3[2].resolved}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
