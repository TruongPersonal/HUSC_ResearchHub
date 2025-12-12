package vn.edu.husc.researchhub.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AnnouncementRequest {
  @NotBlank(message = "Tiêu đề không được để trống")
  private String title;

  @NotBlank(message = "Nội dung không được để trống")
  private String content;

  // Department is optional for Admin announcements
  private Integer departmentId;

  private Integer academicYearId;
}
