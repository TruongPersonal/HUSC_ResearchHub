package vn.edu.husc.researchhub.service;

import org.springframework.data.domain.Page;
import vn.edu.husc.researchhub.dto.request.UserRequest;
import vn.edu.husc.researchhub.dto.response.UserResponse;
import vn.edu.husc.researchhub.model.Role;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
    Page<UserResponse> getAll(String keyword, Role role, Integer departmentId, int page, int size);
    UserResponse create(UserRequest request);
    UserResponse update(Integer id, UserRequest request);
    UserResponse getById(Integer id);
    UserResponse resetPassword(Integer id);
    void importUsers(MultipartFile file);
    void changePassword(String username, String oldPassword, String newPassword);
    UserResponse updateProfile(String username, vn.edu.husc.researchhub.dto.request.UpdateProfileRequest request, MultipartFile avatar);
    String updateAvatar(String username, MultipartFile file);
    UserResponse getProfile(String username);
    java.util.List<UserResponse> getEligibleSupervisors(Integer departmentId);
}
