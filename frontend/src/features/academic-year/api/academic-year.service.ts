import api from "@/lib/api";
import {
  AcademicYear,
  CreateAcademicYearRequest,
  UpdateAcademicYearRequest,
} from "@/features/academic-year/types";
import { PageResponse } from "@/types/common";

export const academicYearService = {
  /**
   * Lấy danh sách Năm học.
   * Hỗ trợ tìm kiếm theo tên và lọc trạng thái hoạt động.
   */
  getAll: async (
    keyword: string = "",
    page: number = 0,
    size: number = 10,
    isActive?: boolean,
  ): Promise<PageResponse<AcademicYear>> => {
    const params: any = { keyword, page, size };
    if (isActive !== undefined) {
      params.isActive = isActive;
    }
    const response = await api.get(`/academic-years`, { params });
    return response.data;
  },

  /**
   * Tạo Năm học mới.
   */
  create: async (data: CreateAcademicYearRequest): Promise<AcademicYear> => {
    const response = await api.post("/academic-years", data);
    return response.data;
  },

  /**
   * Cập nhật thông tin Năm học.
   */
  update: async (
    id: number,
    data: UpdateAcademicYearRequest,
  ): Promise<AcademicYear> => {
    const response = await api.put(`/academic-years/${id}`, data);
    return response.data;
  },
};
