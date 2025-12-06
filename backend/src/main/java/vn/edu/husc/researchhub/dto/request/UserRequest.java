package vn.edu.husc.researchhub.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import vn.edu.husc.researchhub.model.Role;

@Data
public class UserRequest {
    @NotBlank(message = "Mã người dùng không được để trống")
    private String username;

    @NotBlank(message = "Họ tên không được để trống")
    private String fullName;

    private Role role;

    private Integer departmentId;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Integer getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Integer departmentId) {
        this.departmentId = departmentId;
    }
}
