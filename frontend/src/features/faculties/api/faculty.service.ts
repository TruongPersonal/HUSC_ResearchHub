import api from "@/lib/api";
import { PageResponse } from "@/types/common";
import {
  CreateFacultyRequest,
  Faculty,
  UpdateFacultyRequest,
} from "@/features/faculties/types";

export const facultyService = {
  /**
   * Lấy danh sách Khoa/Bộ môn.
   */
  getAll: async (
    keyword: string = "",
    page: number = 0,
    size: number = 10,
  ): Promise<PageResponse<Faculty>> => {
    const response = await api.get<PageResponse<Faculty>>("/departments", {
      params: { keyword, page, size },
    });
    return response.data;
  },

  /**
   * Tạo Khoa/Bộ môn mới.
   */
  create: async (data: CreateFacultyRequest): Promise<Faculty> => {
    const response = await api.post<Faculty>("/departments", data);
    return response.data;
  },

  /**
   * Cập nhật thông tin Khoa/Bộ môn.
   */
  update: async (id: number, data: UpdateFacultyRequest): Promise<Faculty> => {
    const response = await api.put<Faculty>(`/departments/${id}`, data);
    return response.data;
  },
};
