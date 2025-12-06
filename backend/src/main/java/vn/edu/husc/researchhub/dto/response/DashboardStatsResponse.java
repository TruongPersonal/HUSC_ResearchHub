package vn.edu.husc.researchhub.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsResponse {
    private long users;
    private long years;
    private long faculties;
    private String currentYear;
}
