"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { User, MessageSquare, Bell, FilePlus } from "lucide-react"

const sidebarItems = [
    {
        title: "Thông tin cá nhân",
        href: "/teacher/profile",
        icon: User,
    },
    {
        title: "Tin nhắn",
        href: "/teacher/messages",
        icon: MessageSquare,
    },
    {
        title: "Thông báo",
        href: "/teacher/announcements",
        icon: Bell,
    },
    {
        title: "Đăng ký đề tài",
        href: "/teacher/topic-registration",
        icon: FilePlus,
    },
]

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useAcademicYear } from "@/contexts/AcademicYearContext"

// ... (imports)

export function TeacherSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const { years, selectedYear, setSelectedYear } = useAcademicYear()

    const handleLogout = () => {
        localStorage.removeItem("token")
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        router.push("/login")
        toast.success("Đã đăng xuất thành công")
    }

    return (
        <div className="w-64 flex flex-col h-full py-6 pl-4">
            {/* Year Selector */}
            <div className="mb-8 pr-4">
                <Select
                    value={selectedYear?.id.toString()}
                    onValueChange={(value) => {
                        const year = years.find(y => y.id.toString() === value)
                        if (year) setSelectedYear(year)
                    }}
                >
                    <SelectTrigger className="w-full bg-gradient-to-b from-white/60 to-white/30 backdrop-blur-3xl backdrop-saturate-150 rounded-xl px-4 py-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] border-white/40 ring-1 ring-white/40 text-sm font-semibold text-gray-700 hover:bg-white/40 transition-colors border-0 focus:ring-white/60">
                        <SelectValue placeholder="Chọn năm học" />
                    </SelectTrigger>
                    <SelectContent>
                        {years.map((year) => (
                            <SelectItem key={year.id} value={year.id.toString()}>
                                {year.year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Menu Container with Glass Effect */}
            <div className="flex-1 bg-gradient-to-b from-white/60 to-white/30 backdrop-blur-3xl backdrop-saturate-150 border border-white/40 ring-1 ring-white/40 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] flex flex-col overflow-hidden">
                {/* Menu Items */}
                <div className="flex-1 py-6 flex flex-col gap-2">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-all duration-200 relative mx-2 rounded-xl",
                                    isActive
                                        ? "bg-blue-50/80 text-blue-600 shadow-sm"
                                        : "text-gray-600 hover:bg-white/50 hover:text-gray-900"
                                )}
                            >
                                <Icon className={cn("w-5 h-5", isActive ? "text-blue-600" : "text-gray-400")} />
                                {item.title}
                            </Link>
                        )
                    })}
                </div>

                {/* Logout Button - Integrated at bottom of glass panel */}
                <div className="p-4 border-t border-gray-100/50">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors group"
                    >
                        <LogOut className="w-5 h-5 text-rose-500 group-hover:text-rose-600" />
                        Đăng xuất
                    </button>
                </div>
            </div>
        </div>
    )
}
