"use client"

import { AlertCircle, AlertTriangle } from "lucide-react"

interface Admin {
    id: string
    name: string
    organization: string
    averageRating: number
    resolved: number
    averageResolutionTime: number
    unresolvedCount: number
    ignoredCount: number
}

interface Alert {
    type: 'RATING' | 'UNRESOLVED' | 'IGNORED'
    admin: Admin
    message: string
}

export function AdminAlerts({ admins }: { admins: Admin[] }) {
    const alerts: Alert[] = []

    admins.forEach(admin => {
        // 1. Low Rating Alert
        if (admin.averageRating > 0 && admin.averageRating < 3.0) {
            alerts.push({
                type: 'RATING',
                admin,
                message: `Average user rating is critically low (${admin.averageRating} stars).`
            })
        }

        // 2. High Unresolved Alert (e.g., > 10)
        if (admin.unresolvedCount > 10) {
            alerts.push({
                type: 'UNRESOLVED',
                admin,
                message: `High volume of unresolved complaints (${admin.unresolvedCount}).`
            })
        }

        // 3. Ignored Complaints Alert (> 7 days)
        if (admin.ignoredCount > 0) {
            alerts.push({
                type: 'IGNORED',
                admin,
                message: `${admin.ignoredCount} complaints have been ignored for more than 7 days.`
            })
        }
    })

    if (alerts.length === 0) return null

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {alerts.map((alert, index) => (
                <div key={`${alert.admin.id}-${index}`} className="relative overflow-hidden group/alert bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 flex items-start gap-4 transition-all duration-500 hover:shadow-xl hover:shadow-red-500/5">
                    {/* Alert Branding Overlay */}
                    <div
                        className="absolute inset-0 z-0 opacity-[0.02] dark:opacity-[0.04] bg-cover bg-center transition-transform duration-[10000ms] group-hover/alert:scale-110 pointer-events-none"
                        style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
                    />

                    <div className="relative z-10 p-2.5 bg-red-100/50 rounded-xl text-red-600 dark:bg-red-500/10 dark:text-red-400 shrink-0 group-hover/alert:scale-110 transition-transform">
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="relative z-10">
                        <h4 className="font-extrabold text-red-950 dark:text-red-100 text-sm tracking-tight uppercase leading-tight italic">
                            {alert.type === 'RATING' ? 'Performance Malfunction' :
                                alert.type === 'UNRESOLVED' ? 'Backlog Critical' : 'Negligence Detection'}: <span className="text-red-600">{alert.admin.name}</span>
                        </h4>
                        <p className="text-[11px] text-red-700/70 mt-1 dark:text-red-400/60 font-medium leading-relaxed">
                            {alert.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="h-[1px] w-4 bg-red-500/20" />
                            <p className="text-[9px] text-red-500/50 uppercase font-black tracking-widest italic">
                                {alert.admin.organization}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
