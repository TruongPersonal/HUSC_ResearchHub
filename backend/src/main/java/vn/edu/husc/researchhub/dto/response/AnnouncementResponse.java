package vn.edu.husc.researchhub.dto.response;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class AnnouncementResponse {
  private Integer id;
  private String title;
  private String content;
  private LocalDateTime publishDatetime;
  private String departmentName;
}
