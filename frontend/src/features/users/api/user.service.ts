import api from "@/lib/api"
import { PageResponse } from "@/types/common"
import { CreateUserRequest, UpdateUserRequest, User, UserRole } from "@/features/users/types"

export const userService = {
    getAll: async (keyword?: string, role?: UserRole, departmentId?: number, page = 0, size = 10): Promise<PageResponse<User>> => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params: Record<string, any> = { keyword, page, size }
        if (role) params.role = role
        if (departmentId) params.departmentId = departmentId

        const response = await api.get<PageResponse<User>>("/admin/users", {
            params,
        })
        return response.data
    },

    create: async (data: CreateUserRequest): Promise<User> => {
        const response = await api.post<User>("/admin/users", data)
        return response.data
    },

    update: async (id: number, data: UpdateUserRequest): Promise<User> => {
        const response = await api.put<User>(`/admin/users/${id}`, data)
        return response.data
    },

    resetPassword: async (id: number): Promise<User> => {
        const response = await api.post<User>(`/admin/users/${id}/reset-password`)
        return response.data
    },

    importUsers: async (file: File): Promise<void> => {
        const formData = new FormData()
        formData.append("file", file)
        await api.post("/admin/users/import", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
    },

    getEligibleSupervisors: async (departmentId: number, academicYearId: number): Promise<User[]> => {
        const response = await api.get<User[]>("/admin/users/eligible-supervisors", {
            params: { departmentId, academicYearId }
        })
        return response.data
    }
}
