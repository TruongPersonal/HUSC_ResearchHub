package vn.edu.husc.researchhub.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.husc.researchhub.model.enums.ApprovedTopicStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateApprovedTopicRequest {
    private String code;
    private String prize;
    private String fieldResearch;
    private String typeResearch;
    private ApprovedTopicStatus status;
}
