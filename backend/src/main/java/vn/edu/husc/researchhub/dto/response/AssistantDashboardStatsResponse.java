package vn.edu.husc.researchhub.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssistantDashboardStatsResponse {
    private long registrationCount;
    private long approvedTopicCount;
    private String currentYear;
    private String academicYearStatus;
}
