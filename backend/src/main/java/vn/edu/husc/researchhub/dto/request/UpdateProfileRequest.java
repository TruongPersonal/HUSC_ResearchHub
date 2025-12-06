package vn.edu.husc.researchhub.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    @NotBlank(message = "Họ và tên không được để trống")
    private String fullName;
    
    private String email;
    
    private String phoneNumber;
    
    private Boolean sex;
    
    private String bornDate; // ISO string yyyy-MM-dd
    
    private Integer course;
    
    private String className;
    
    private Boolean deleteAvatar;

    private String academicDegree;
}
