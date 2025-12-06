import api from "@/lib/api"
import { PageResponse } from "@/types/common"
import { CreateFacultyRequest, Faculty, UpdateFacultyRequest } from "@/features/faculties/types"

export const facultyService = {
    getAll: async (keyword: string = "", page: number = 0, size: number = 10): Promise<PageResponse<Faculty>> => {
        const response = await api.get<PageResponse<Faculty>>("/departments", {
            params: { keyword, page, size },
        })
        return response.data
    },

    create: async (data: CreateFacultyRequest): Promise<Faculty> => {
        const response = await api.post<Faculty>("/departments", data)
        return response.data
    },

    update: async (id: number, data: UpdateFacultyRequest): Promise<Faculty> => {
        const response = await api.put<Faculty>(`/departments/${id}`, data)
        return response.data
    }


}
