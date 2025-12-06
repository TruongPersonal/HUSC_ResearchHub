"use client"

import { AcademicYearSelector } from "@/components/common/AcademicYearSelector"
import { UserMenu } from "@/components/dashboard/UserMenu"

export function Navbar() {
    return (
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
            <div className="flex items-center gap-4">
                <AcademicYearSelector />
            </div>
            <div className="flex items-center gap-4">
                <UserMenu />
            </div>
        </header>
    )
}
