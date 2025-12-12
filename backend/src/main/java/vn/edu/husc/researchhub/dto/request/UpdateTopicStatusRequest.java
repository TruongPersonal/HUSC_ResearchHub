package vn.edu.husc.researchhub.dto.request;

import lombok.Data;
import vn.edu.husc.researchhub.model.enums.TopicStatus;

@Data
public class UpdateTopicStatusRequest {
  private TopicStatus status;
  private String feedback;
}
