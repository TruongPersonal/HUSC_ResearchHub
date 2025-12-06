"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, BookOpen, Library } from "lucide-react"
import { UserMenu } from "@/components/dashboard/UserMenu"
import Image from "next/image"

const navItems = [
    {
        title: "Trang chủ",
        href: "/student",
        icon: Home,
    },
    {
        title: "Danh sách đề tài",
        href: "/student/topics",
        icon: Library,
    },
    {
        title: "Đề tài của tôi",
        href: "/student/my-topics",
        icon: BookOpen,
    },
]

export function StudentNavbar() {
    const pathname = usePathname()

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-7xl">
            <div className="bg-gradient-to-b from-white/60 to-white/30 backdrop-blur-3xl backdrop-saturate-150 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] rounded-full px-6 py-3 flex items-center justify-between border border-white/40 ring-1 ring-white/40">
                {/* Logo */}
                <Link href="/student" className="flex items-center hover:opacity-80 transition-opacity">
                    <Image
                        src="/images/icons/logo.png"
                        alt="ResearchHub Logo"
                        width={40}
                        height={40}
                        className="object-contain drop-shadow-md"
                    />
                </Link>

                {/* Navigation Links - Centered & Pill Shaped */}
                <nav className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300",
                                    isActive
                                        ? "bg-white/80 text-blue-600 shadow-lg shadow-blue-500/20 backdrop-blur-md"
                                        : "text-slate-600 hover:bg-white/40 hover:text-slate-900 hover:shadow-sm"
                                )}
                            >
                                <Icon className={cn("w-4 h-4", isActive ? "text-blue-600" : "text-slate-500")} />
                                {item.title}
                            </Link>
                        )
                    })}
                </nav>

                {/* User Menu */}
                <div className="flex items-center gap-4">
                    <UserMenu />
                </div>
            </div>
        </div>
    )
}
