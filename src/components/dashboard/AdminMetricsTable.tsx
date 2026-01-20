"use client"

import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RatingDetailsModal } from "./RatingDetailsModal"

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

export function AdminMetricsTable({ admins }: { admins: Admin[] }) {
    const [selectedAdmin, setSelectedAdmin] = useState<{ id: string, name: string } | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleRatingClick = (admin: Admin) => {
        if (admin.ratedCount && admin.ratedCount > 0) {
            setSelectedAdmin({ id: admin.id, name: admin.name })
            setIsModalOpen(true)
        }
    }

    return (
        <>
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50/50 dark:bg-slate-800/20">
                        <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                            <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-400 h-12 px-6">Admin Profile</TableHead>
                            <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-400 h-12 px-6">Organization</TableHead>
                            <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-400 h-12 px-6 text-center">Avg Rating</TableHead>
                            <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-400 h-12 px-6 text-center">Resolved</TableHead>
                            <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-400 h-12 px-6 text-right">Avg Time (Hrs)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {admins.map((admin) => (
                            <TableRow key={admin.id} className="border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/80 dark:hover:bg-slate-800/20">
                                <TableCell className="px-6 py-4 font-bold text-slate-700 dark:text-slate-200">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-10 h-10 border border-slate-200 dark:border-slate-700">
                                            <AvatarImage className="object-cover" src={admin.image || `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(admin.username || admin.name)}&top=${admin.gender === 'FEMALE' ? 'longButNotTooLong,straight01,straight02' : 'shortFlat,shortRound,theCaesar'}`} />
                                            <AvatarFallback className="text-xs bg-slate-100 dark:bg-slate-800">{admin.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <span>{admin.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-6">
                                    <Badge variant="outline" className="border-slate-200 text-slate-500 text-[10px] uppercase font-bold dark:border-slate-700 dark:text-slate-400">
                                        {admin.organization}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-6 text-center">
                                    {admin.ratedCount && admin.ratedCount > 0 ? (
                                        <button
                                            onClick={() => handleRatingClick(admin)}
                                            className="flex flex-col items-center gap-0.5 cursor-pointer hover:scale-105 transition-transform group mx-auto"
                                        >
                                            <span className={`font-bold ${admin.averageRating >= 4.5 ? 'text-emerald-500' :
                                                admin.averageRating >= 3.0 ? 'text-amber-500' :
                                                    'text-red-500'
                                                } group-hover:underline`}>
                                                ⭐ {admin.averageRating}
                                            </span>
                                            <span className="text-[10px] text-slate-400 group-hover:text-primary dark:group-hover:text-blue-400">
                                                ({admin.ratedCount} {admin.ratedCount === 1 ? 'rating' : 'ratings'}) →
                                            </span>
                                        </button>
                                    ) : (
                                        <span className="text-slate-400 text-sm">N/A</span>
                                    )}
                                </TableCell>
                                <TableCell className="px-6 text-center font-bold text-slate-600 dark:text-slate-300">
                                    {admin.resolved}
                                </TableCell>
                                <TableCell className="px-6 text-right font-mono text-xs text-slate-500">
                                    {admin.averageResolutionTime > 0 ? admin.averageResolutionTime + 'hr' : '--'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <RatingDetailsModal
                adminId={selectedAdmin?.id || null}
                adminName={selectedAdmin?.name || ""}
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
            />
        </>
    )
}

