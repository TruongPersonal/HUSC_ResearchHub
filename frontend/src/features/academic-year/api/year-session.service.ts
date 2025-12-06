import apiClient from "@/lib/api"
import { PageResponse } from "@/types/common"
import { YearSession, CreateYearSessionRequest, UpdateYearSessionRequest, AcademicYear } from "@/features/academic-year/types"

export const yearSessionService = {
    getAll: async (keyword?: string, page = 0, size = 10, departmentId?: number, status?: string): Promise<PageResponse<YearSession>> => {
        const params = new URLSearchParams()
        if (keyword) params.append("keyword", keyword)
        if (departmentId) params.append("departmentId", departmentId.toString())
        if (status && status !== "ALL") params.append("status", status)
        params.append("page", page.toString())
        params.append("size", size.toString())

        const response = await apiClient.get<PageResponse<YearSession>>(`/year-sessions?${params.toString()}`)
        return response.data
    },

    create: async (data: CreateYearSessionRequest): Promise<YearSession> => {
        const response = await apiClient.post<YearSession>("/year-sessions", data)
        return response.data
    },

    update: async (id: number, data: UpdateYearSessionRequest): Promise<YearSession> => {
        const response = await apiClient.put<YearSession>(`/year-sessions/${id}`, data)
        return response.data
    },

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/year-sessions/${id}`)
    },

    getAvailableYears: async (): Promise<AcademicYear[]> => {
        const response = await apiClient.get<AcademicYear[]>("/year-sessions/available-years")
        return response.data
    }
}
