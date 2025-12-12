package vn.edu.husc.researchhub.service;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;
import vn.edu.husc.researchhub.dto.request.UserRequest;
import vn.edu.husc.researchhub.dto.response.UserResponse;
import vn.edu.husc.researchhub.model.Role;

/**
 * Service quản lý Người dùng.
 */
public interface UserService {
  /**
   * Lấy danh sách người dùng có phân trang.
   */
  Page<UserResponse> getAll(String keyword, Role role, Integer departmentId, int page, int size);

  /**
   * Tạo người dùng mới.
   */
  UserResponse create(UserRequest request);

  /**
   * Cập nhật thông tin người dùng (Admin thực hiện).
   */
  UserResponse update(Integer id, UserRequest request);

  /**
   * Lấy chi tiết người dùng.
   */
  UserResponse getById(Integer id);

  /**
   * Reset mật khẩu người dùng (về mặc định).
   */
  UserResponse resetPassword(Integer id);

  /**
   * Import danh sách người dùng từ file Excel.
   */
  void importUsers(MultipartFile file);

  /**
   * Đổi mật khẩu cá nhân.
   */
  void changePassword(String username, String oldPassword, String newPassword);

  /**
   * Cập nhật hồ sơ cá nhân (Tên, Email, ...).
   */
  UserResponse updateProfile(
      String username,
      vn.edu.husc.researchhub.dto.request.UpdateProfileRequest request,
      MultipartFile avatar);

  /**
   * Cập nhật ảnh đại diện.
   */
  String updateAvatar(String username, MultipartFile file);

  /**
   * Lấy thông tin hồ sơ cá nhân.
   */
  UserResponse getProfile(String username);

  /**
   * Lấy danh sách giảng viên đủ điều kiện hướng dẫn.
   */
  java.util.List<UserResponse> getEligibleSupervisors(Integer departmentId);

  /**
   * Quên mật khẩu (Chỉ dành cho Sinh viên và Giảng viên).
   */
  void forgotPassword(String username);

  /**
   * Tìm kiếm người dùng để nhắn tin (theo quyền hạn).
   */
  java.util.List<vn.edu.husc.researchhub.dto.response.ChatPartnerResponse> findChatPartners(String username, String query);
}
