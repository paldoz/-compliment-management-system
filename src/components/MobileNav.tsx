"use client"

import { useEffect, useState } from "react"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { SidebarContent } from "@/components/Sidebar"

export function MobileNav() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="text-slate-500 lg:hidden">
                <Menu className="h-6 w-6" />
            </Button>
        )
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-500">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 border-r-0 bg-white dark:bg-[#0B1120]">
                <div className="sr-only">
                    <SheetTitle>Navigation Menu</SheetTitle>
                    <SheetDescription>Access dashboard sections and settings.</SheetDescription>
                </div>
                <div className="flex h-20 items-center px-8 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white leading-none uppercase italic">Console<span className="text-primary italic">.</span></span>
                </div>
                <SidebarContent />
            </SheetContent>
        </Sheet>
    )
}
