package vn.edu.husc.researchhub.service;

import vn.edu.husc.researchhub.dto.response.DashboardStatsResponse;

public interface DashboardService {
    DashboardStatsResponse getStats(Integer academicYearId);
    vn.edu.husc.researchhub.dto.response.AssistantDashboardStatsResponse getAssistantStats(Integer departmentId, Integer academicYearId);
}
