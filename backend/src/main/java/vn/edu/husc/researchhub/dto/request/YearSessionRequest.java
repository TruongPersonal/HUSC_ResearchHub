package vn.edu.husc.researchhub.dto.request;

import lombok.Data;

@Data
public class YearSessionRequest {
    private Integer academicYearId;

    private Integer departmentId; // Optional, can be inferred from current user

    private vn.edu.husc.researchhub.model.enums.YearSessionStatus status;
}
