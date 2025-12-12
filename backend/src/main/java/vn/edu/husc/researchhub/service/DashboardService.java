package vn.edu.husc.researchhub.service;

import vn.edu.husc.researchhub.dto.response.DashboardStatsResponse;

/**
 * Service quản lý Dashboard.
 * Cung cấp số liệu thống kê cho Admin, Trợ lý, Giảng viên.
 */
public interface DashboardService {
  /**
   * Lấy số liệu thống kê tổng quan (Admin/Assistant).
   */
  DashboardStatsResponse getStats(Integer academicYearId);

  /**
   * Lấy số liệu thống kê dành cho Trợ lý khoa.
   */
  vn.edu.husc.researchhub.dto.response.AssistantDashboardStatsResponse getAssistantStats(
      Integer departmentId, Integer academicYearId);
}
