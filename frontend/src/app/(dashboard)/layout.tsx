import { DashboardLayoutWrapper } from "@/components/dashboard/DashboardLayoutWrapper"
import { AcademicYearProvider } from "@/contexts/AcademicYearContext"
import { AuthProvider } from "@/features/auth/context/AuthContext"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AuthProvider>
            <AcademicYearProvider>
                <DashboardLayoutWrapper>
                    {children}
                </DashboardLayoutWrapper>
            </AcademicYearProvider>
        </AuthProvider>
    )
}
