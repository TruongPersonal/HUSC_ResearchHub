import api from "@/lib/api"
import { AdminStats, AssistantStats } from "@/features/dashboard/types"

export const dashboardService = {
    getStats: async (academicYearId?: number): Promise<AdminStats> => {
        const params = new URLSearchParams()
        if (academicYearId) params.append("academicYearId", academicYearId.toString())
        const response = await api.get(`/admin/dashboard/stats?${params.toString()}`)
        return response.data
    },

    getAssistantStats: async (departmentId: number, academicYearId: number): Promise<AssistantStats> => {
        const params = new URLSearchParams()
        params.append("departmentId", departmentId.toString())
        params.append("academicYearId", academicYearId.toString())
        const response = await api.get(`/assistant/dashboard/stats?${params.toString()}`)
        return response.data
    },
}
