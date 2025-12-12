package vn.edu.husc.researchhub.dto.request;

import lombok.Data;
import vn.edu.husc.researchhub.model.enums.AcademicYearStatus;

@Data
public class AcademicYearRequest {
  private Integer year;
  private AcademicYearStatus status;
  private Boolean isActive;

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
