package vn.edu.husc.researchhub.dto.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.husc.researchhub.model.enums.ApprovedTopicStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApprovedTopicResponse {
  private Integer id;
  private TopicResponse topic;
  private String code;
  private String prize;
  private String fieldResearch;
  private String typeResearch;
  private ApprovedTopicStatus status;
  private LocalDateTime createdAt;
}
