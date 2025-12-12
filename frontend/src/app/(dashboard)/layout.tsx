import { DashboardLayoutWrapper } from "@/components/dashboard/DashboardLayoutWrapper";
import { AcademicYearProvider } from "@/contexts/AcademicYearContext";
import { AuthProvider } from "@/features/auth/context/AuthContext";

/**
 * Layout chính cho các trang Dashboard (Admin, Teacher, Student...).
 * Bao bọc bởi AuthProvider và AcademicYearProvider để quản lý xác thực và năm học.
 * Sử dụng DashboardLayoutWrapper để xử lý giao diện chung.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AcademicYearProvider>
        <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>
      </AcademicYearProvider>
    </AuthProvider>
  );
}
