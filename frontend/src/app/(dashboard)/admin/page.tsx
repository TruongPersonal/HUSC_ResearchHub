"use client";

import { useAdminStats } from "@/hooks/useAdminStats";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { DashboardAnnouncements } from "@/components/dashboard/DashboardAnnouncements";

/**
 * Trang Tổng quan Admin.
 * Hiển thị các block thống kê (StatsGrid): Số lượng user, đề tài, thông báo...
 */
export default function AdminOverviewPage() {
  const { stats, loading } = useAdminStats();

  return (
    <div className="h-full flex-1 flex-col space-y-8 md:flex animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bảng điều khiển</h2>
          <p className="text-muted-foreground">Tổng quan nhanh về hệ thống.</p>
        </div>
      </div>

      {/* Cards Grid */}
      <StatsGrid stats={stats} loading={loading} />

      {/* Announcements Section */}
      <DashboardAnnouncements />
    </div>
  );
}
