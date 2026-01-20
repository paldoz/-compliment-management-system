"use client"

import { useEffect, useState } from "react"
import { Bell, Loader2, CheckCircle2 } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function NotificationBell() {
    const [notifications, setNotifications] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)

    const [mounted, setMounted] = useState(false)

    const fetchNotifications = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/notifications")
            const data = await res.json()

            if (Array.isArray(data)) {
                setNotifications(data)
                setUnreadCount(data.filter((n: any) => !n.isRead).length)
            } else {
                console.warn("Notifications API returned non-array:", data)
                setNotifications([])
                setUnreadCount(0)
            }
        } catch (err) {
            console.error("Failed to fetch notifications:", err)
            setNotifications([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setMounted(true)
        fetchNotifications()
        // Poll every 1 minute
        const interval = setInterval(fetchNotifications, 60000)
        return () => clearInterval(interval)
    }, [])

    const markAsRead = async (id: string) => {
        try {
            await fetch("/api/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            })
            fetchNotifications()
        } catch (err) {
            console.error(err)
        }
    }

    if (!mounted) {
        return (
            <Button variant="outline" size="icon" className="relative border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 opacity-0">
                <Bell className="h-5 w-5" />
            </Button>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[320px] bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-800 p-0 shadow-2xl overflow-hidden">
                <div className="p-4 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between font-bold uppercase tracking-widest text-[10px]">
                    <span className="text-slate-400">Notifications</span>
                    {unreadCount > 0 && <span className="text-red-500">{unreadCount} New Status</span>}
                </div>
                <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                    {loading && notifications.length === 0 ? (
                        <div className="p-8 text-center">
                            <Loader2 className="h-5 w-5 animate-spin mx-auto text-primary/30" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-10 text-center text-slate-400 text-[11px] italic font-medium">
                            No incoming transmissions detected.
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <DropdownMenuItem
                                key={n.id}
                                className={cn(
                                    "flex flex-col items-start gap-1 p-4 cursor-pointer rounded-none border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:bg-slate-50 dark:focus:bg-slate-800",
                                    !n.isRead && "bg-blue-50/30 dark:bg-blue-900/10"
                                )}
                                onClick={() => markAsRead(n.id)}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span className="font-bold text-xs uppercase tracking-tight text-slate-900 dark:text-white">{n.title}</span>
                                    {n.isRead ? (
                                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                    ) : (
                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight font-medium">{n.message}</p>
                                <span className="text-[9px] font-bold text-slate-300 dark:text-slate-600 mt-1 uppercase tracking-tighter italic">
                                    {new Date(n.createdAt).toLocaleString()}
                                </span>
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
