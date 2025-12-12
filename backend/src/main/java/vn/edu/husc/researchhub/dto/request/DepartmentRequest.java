package vn.edu.husc.researchhub.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DepartmentRequest {
  @NotBlank(message = "Mã khoa không được để trống")
  private String code;

  @NotBlank(message = "Tên khoa không được để trống")
  private String name;

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }
}
