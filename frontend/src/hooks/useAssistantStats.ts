import { useState, useEffect } from "react";
import { dashboardService } from "@/features/dashboard/api/dashboard.service";
import { AssistantStats } from "@/features/dashboard/types";
import { useAcademicYear } from "@/contexts/AcademicYearContext";
import { authService } from "@/features/auth/api/auth.service";

export function useAssistantStats() {
  const { selectedYear } = useAcademicYear();
  const [stats, setStats] = useState<AssistantStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [departmentId, setDepartmentId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await authService.getProfile();
        if (user?.departmentId) {
          setDepartmentId(user.departmentId);
        }
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      if (!selectedYear || !departmentId) return;

      try {
        const data = await dashboardService.getAssistantStats(
          departmentId,
          selectedYear.id,
        );
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch assistant stats", error);
      } finally {
        setLoading(false);
      }
    };

    if (departmentId && selectedYear) {
      fetchStats();
    }
  }, [selectedYear, departmentId]);

  return { stats, loading };
}
