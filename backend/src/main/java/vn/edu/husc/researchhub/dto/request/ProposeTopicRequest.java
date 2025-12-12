package vn.edu.husc.researchhub.dto.request;

import lombok.Data;

@Data
public class ProposeTopicRequest {
  private String title;
  private String description;
  private String objective;
  private String content;
  private Double budget; // Use object wrapper to allow null
  private String note;
  private Integer advisorId; // Optional
  private Integer academicYearId; // Optional, can be empty if system determines current year
}
