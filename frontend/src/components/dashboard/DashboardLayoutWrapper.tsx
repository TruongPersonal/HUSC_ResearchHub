"use client"

import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { Navbar } from "@/components/dashboard/Navbar"
import { StudentNavbar } from "@/components/student/layout/StudentNavbar"
import { StudentSidebar } from "@/components/student/layout/StudentSidebar"
import { TeacherNavbar } from "@/components/teacher/layout/TeacherNavbar"
import { TeacherSidebar } from "@/components/teacher/layout/TeacherSidebar"
import { Footer } from "@/components/dashboard/Footer"

export function DashboardLayoutWrapper({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const isStudentPage = pathname?.startsWith("/student")
    const isTeacherPage = pathname?.startsWith("/teacher")

    if (isStudentPage) {
        return (
            <div className="flex flex-col bg-[#F8FAFC]">
                {/* Student Navbar - Fixed Top */}
                <StudentNavbar />

                {/* Main Layout: Sidebar (Left Edge) + Content */}
                {/* min-h-screen ensures this section takes full viewport height, pushing footer below fold */}
                <div className="flex flex-1 pt-28 min-h-screen">
                    {/* Sidebar - Fixed Left Edge */}
                    <aside className="hidden lg:block w-64 shrink-0 sticky top-28 h-[calc(100vh-7rem)]">
                        <StudentSidebar />
                    </aside>

                    {/* Page Content */}
                    <main className="flex-1 min-w-0 pb-12 pt-8 px-6 container mx-auto">
                        {children}
                    </main>
                </div>

                {/* Footer - Full Width & Below Fold */}
                <Footer />
            </div>
        )
    }

    if (isTeacherPage) {
        return (
            <div className="flex flex-col bg-[#F8FAFC]">
                {/* Teacher Navbar - Fixed Top */}
                <TeacherNavbar />

                {/* Main Layout: Sidebar (Left Edge) + Content */}
                <div className="flex flex-1 pt-28 min-h-screen">
                    {/* Sidebar - Fixed Left Edge */}
                    <aside className="hidden lg:block w-64 shrink-0 sticky top-28 h-[calc(100vh-7rem)]">
                        <TeacherSidebar />
                    </aside>

                    {/* Page Content */}
                    <main className="flex-1 min-w-0 pb-12 pt-8 px-6 container mx-auto">
                        {children}
                    </main>
                </div>

                {/* Footer - Full Width & Below Fold */}
                <Footer />
            </div>
        )
    }

    // Default Layout for Admin/Assistant/Teacher
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
