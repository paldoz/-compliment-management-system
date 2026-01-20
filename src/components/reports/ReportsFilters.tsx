"use client"

import { useState } from "react"
import { Search, Filter, X, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface FilterOptions {
    organizations: { id: string; name: string }[]
    departments: { id: string; name: string; organization: string; organizationId?: string }[]
    admins: { id: string; name: string; organization?: string; organizationId?: string }[]
}

interface Filters {
    organizationId: string
    departmentId: string
    adminId: string
    status: string
    startDate: string
    endDate: string
    search: string
}

interface ReportsFiltersProps {
    filterOptions: FilterOptions
    filters: Filters
    onFiltersChange: (filters: Filters) => void
    onApply: () => void
}

export function ReportsFilters({ filterOptions, filters, onFiltersChange, onApply }: ReportsFiltersProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    const activeFiltersCount = [
        filters.organizationId,
        filters.departmentId,
        filters.adminId,
        filters.status,
        filters.startDate,
        filters.endDate,
        filters.search
    ].filter(Boolean).length

    const clearFilters = () => {
        onFiltersChange({
            organizationId: "",
            departmentId: "",
            adminId: "",
            status: "",
            startDate: "",
            endDate: "",
            search: ""
        })
        // Force an immediate refresh with empty filters
        setTimeout(() => onApply(), 0)
    }

    return (
        <div className="relative overflow-hidden group rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
            {/* Branding Background */}
            <div
                className="absolute inset-0 z-0 opacity-[0.02] dark:opacity-[0.04] bg-cover bg-center pointer-events-none"
                style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
            />

            <div className="relative z-10 p-4 lg:p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
                            <Filter className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Filters & Search</h3>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Refine report data</p>
                        </div>
                        {activeFiltersCount > 0 && (
                            <Badge className="bg-blue-500 text-white text-[10px]">
                                {activeFiltersCount} active
                            </Badge>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-xs"
                    >
                        {isExpanded ? "Collapse" : "Expand"}
                    </Button>
                </div>

                {/* Search Bar - Always Visible */}
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search by Complaint ID or Title..."
                        value={filters.search}
                        onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                        className="pl-10 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                    />
                </div>

                {/* Expanded Filters */}
                {isExpanded && (
                    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Organization */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Organization</label>
                                <Select
                                    value={filters.organizationId}
                                    onValueChange={(value) => {
                                        // Reset department and admin when organization changes
                                        onFiltersChange({
                                            ...filters,
                                            organizationId: value,
                                            departmentId: "",
                                            adminId: ""
                                        })
                                    }}
                                >
                                    <SelectTrigger className="bg-slate-50 dark:bg-slate-800/50">
                                        <SelectValue placeholder="All Organizations" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Organizations</SelectItem>
                                        {filterOptions.organizations.map(org => (
                                            <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Department */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Department</label>
                                <Select
                                    value={filters.departmentId}
                                    onValueChange={(value) => onFiltersChange({ ...filters, departmentId: value })}
                                    disabled={filters.organizationId === "" || filters.organizationId === "all"}
                                >
                                    <SelectTrigger className="bg-slate-50 dark:bg-slate-800/50">
                                        <SelectValue placeholder={filters.organizationId && filters.organizationId !== "all" ? "All Departments" : "Select Organization First"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Departments</SelectItem>
                                        {filterOptions.departments
                                            .filter(dept => !filters.organizationId || filters.organizationId === "all" || dept.organizationId === filters.organizationId)
                                            .map(dept => (
                                                <SelectItem key={dept.id} value={dept.id}>
                                                    {dept.name}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Admin */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Admin</label>
                                <Select
                                    value={filters.adminId}
                                    onValueChange={(value) => onFiltersChange({ ...filters, adminId: value })}
                                    disabled={filters.organizationId === "" || filters.organizationId === "all"}
                                >
                                    <SelectTrigger className="bg-slate-50 dark:bg-slate-800/50">
                                        <SelectValue placeholder={filters.organizationId && filters.organizationId !== "all" ? "All Admins" : "Select Organization First"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Admins</SelectItem>
                                        {filterOptions.admins
                                            .filter(admin => !filters.organizationId || filters.organizationId === "all" || admin.organizationId === filters.organizationId)
                                            .map(admin => (
                                                <SelectItem key={admin.id} value={admin.id}>
                                                    {admin.name}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Status */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</label>
                                <Select
                                    value={filters.status}
                                    onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
                                >
                                    <SelectTrigger className="bg-slate-50 dark:bg-slate-800/50">
                                        <SelectValue placeholder="All Statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="PENDING">Pending</SelectItem>
                                        <SelectItem value="APPROVED">Approved</SelectItem>
                                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                                        <SelectItem value="CLOSED">Closed</SelectItem>
                                        <SelectItem value="REJECTED">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Start Date */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Start Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        type="date"
                                        value={filters.startDate}
                                        onChange={(e) => onFiltersChange({ ...filters, startDate: e.target.value })}
                                        className="pl-10 bg-slate-50 dark:bg-slate-800/50"
                                    />
                                </div>
                            </div>

                            {/* End Date */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">End Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        type="date"
                                        value={filters.endDate}
                                        onChange={(e) => onFiltersChange({ ...filters, endDate: e.target.value })}
                                        className="pl-10 bg-slate-50 dark:bg-slate-800/50"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-4">
                            <Button onClick={onApply} className="bg-blue-600 hover:bg-blue-700 text-white">
                                Apply Filters
                            </Button>
                            {activeFiltersCount > 0 && (
                                <Button variant="outline" onClick={clearFilters} className="gap-2">
                                    <X className="h-3 w-3" />
                                    Clear All
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
