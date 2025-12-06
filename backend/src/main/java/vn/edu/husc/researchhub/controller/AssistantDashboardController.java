package vn.edu.husc.researchhub.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.edu.husc.researchhub.dto.response.AssistantDashboardStatsResponse;
import vn.edu.husc.researchhub.service.DashboardService;

@RestController
@RequestMapping("/api/assistant/dashboard")
@RequiredArgsConstructor
public class AssistantDashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<AssistantDashboardStatsResponse> getStats(
            @RequestParam Integer departmentId,
            @RequestParam Integer academicYearId) {
        return ResponseEntity.ok(dashboardService.getAssistantStats(departmentId, academicYearId));
    }
}
