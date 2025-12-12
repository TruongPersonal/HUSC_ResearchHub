import { useState, useEffect } from "react";
import { dashboardService } from "@/features/dashboard/api/dashboard.service";
import { AdminStats } from "@/features/dashboard/types";
import { useAcademicYear } from "@/contexts/AcademicYearContext";

export function useAdminStats() {
  const { selectedYear } = useAcademicYear();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!selectedYear) return;

      try {
        const data = await dashboardService.getStats(selectedYear.id);
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [selectedYear]);

  return { stats, loading };
}
