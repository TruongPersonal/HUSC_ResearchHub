package vn.edu.husc.researchhub.dto.response;

import lombok.Data;
import vn.edu.husc.researchhub.model.enums.YearSessionStatus;

@Data
public class YearSessionResponse {
    private Integer id;
    private Integer year;
    private String departmentName;
    private YearSessionStatus status;
    private Integer departmentId;
    private Integer academicYearId;
}
