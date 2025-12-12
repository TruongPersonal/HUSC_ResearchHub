import apiClient from "@/lib/api";
import { PageResponse } from "@/types/common";
import {
  Announcement,
  CreateAnnouncementRequest,
} from "@/features/announcements/types";

export const announcementService = {
  /**
   * Lấy danh sách Thông báo.
   * Hỗ trợ nhiều bộ lọc: từ khóa, năm học, khoa, loại thông báo.
   */
  getAll: async (
    keyword?: string,
    page = 0,
    size = 10,
    academicYearId?: number,
    departmentId?: number,
    isSystem?: boolean,
  ): Promise<PageResponse<Announcement>> => {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (academicYearId)
      params.append("academicYearId", academicYearId.toString());
    if (departmentId) params.append("departmentId", departmentId.toString());
    if (isSystem !== undefined) params.append("isSystem", isSystem.toString());
    params.append("page", page.toString());
    params.append("size", size.toString());

    const response = await apiClient.get<PageResponse<Announcement>>(
      `/announcements?${params.toString()}`,
    );
    return response.data;
  },

  /**
   * Tạo Thông báo mới.
   */
  create: async (data: CreateAnnouncementRequest): Promise<Announcement> => {
    const response = await apiClient.post<Announcement>("/announcements", data);
    return response.data;
  },

  /**
   * Cập nhật Thông báo.
   */
  update: async (
    id: number,
    data: CreateAnnouncementRequest,
  ): Promise<Announcement> => {
    const response = await apiClient.put<Announcement>(
      `/announcements/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * Xóa Thông báo.
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/announcements/${id}`);
  },
};
