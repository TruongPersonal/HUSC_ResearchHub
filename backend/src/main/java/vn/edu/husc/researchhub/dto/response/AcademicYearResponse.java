package vn.edu.husc.researchhub.dto.response;

import lombok.Data;
import vn.edu.husc.researchhub.model.enums.AcademicYearStatus;

@Data
public class AcademicYearResponse {
  private Integer id;
  private Integer year;
  private AcademicYearStatus status;
  private Boolean isActive;
  private Long topicCount;

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public Integer getYear() {
    return year;
  }

  public void setYear(Integer year) {
    this.year = year;
  }

  public AcademicYearStatus getStatus() {
    return status;
  }

  public void setStatus(AcademicYearStatus status) {
    this.status = status;
  }

  public Boolean getIsActive() {
    return isActive;
  }

  public void setIsActive(Boolean isActive) {
    this.isActive = isActive;
  }
}
