import api from "@/lib/api";
import {
  ApprovedTopicResponse,
  ApprovedTopicDocumentResponse,
} from "@/features/topics/types";
import { PageResponse } from "@/types/common";

export const approvedTopicService = {
  /**
   * Lấy danh sách đề tài đã duyệt.
   * Hỗ trợ phân trang và lọc (từ khóa, trạng thái, khoa, năm học).
   */
  getAll: async (
    page: number,
    size: number,
    departmentId: number,
    academicYearId: number,
    keyword?: string,
    status?: string,
  ): Promise<PageResponse<ApprovedTopicResponse>> => {
    const params: any = { page, size, departmentId, academicYearId };
    if (keyword) params.keyword = keyword;
    if (status && status !== "ALL") params.status = status;

    const response = await api.get<PageResponse<ApprovedTopicResponse>>(
      "/approved-topics",
      { params },
    );
    return response.data;
  },

  /**
   * Cập nhật thông tin đề tài đã duyệt.
   */
  async update(id: number, data: any): Promise<ApprovedTopicResponse> {
    const response = await api.put<ApprovedTopicResponse>(
      `/approved-topics/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * Lấy danh sách tài liệu của đề tài.
   */
  async getDocuments(id: number): Promise<ApprovedTopicDocumentResponse[]> {
    const response = await api.get<ApprovedTopicDocumentResponse[]>(
      `/approved-topics/${id}/documents`,
    );
    return response.data;
  },

  /**
   * Upload tài liệu đính kèm (báo cáo, minh chứng).
   */
  uploadDocument: async (
    topicId: number,
    file: File,
    type: string,
    summary?: string,
  ): Promise<ApprovedTopicDocumentResponse> => {
    const formData = new FormData();
    formData.append("topicId", topicId.toString());
    formData.append("file", file);
    formData.append("type", type);
    if (summary) {
      formData.append("summary", summary);
    }

    const response = await api.post("/approved-topics/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Lấy tài liệu theo ID đề tài (API phụ trợ).
   */
  getDocumentsByTopicId: async (
    topicId: number,
  ): Promise<ApprovedTopicDocumentResponse[]> => {
    const response = await api.get<ApprovedTopicDocumentResponse[]>(
      `/approved-topics/by-topic/${topicId}/documents`,
    );
    return response.data;
  },

  /**
   * Xóa tài liệu.
   */
  deleteDocument: async (documentId: number): Promise<void> => {
    await api.delete(`/approved-topics/documents/${documentId}`);
  },

  /**
   * Cập nhật mô tả (summary) cho tài liệu.
   */
  updateDocumentSummary: async (
    documentId: number,
    summary: string,
  ): Promise<ApprovedTopicDocumentResponse> => {
    const response = await api.put<ApprovedTopicDocumentResponse>(
      `/approved-topics/documents/${documentId}/summary`,
      { summary },
    );
    return response.data;
  },
};
