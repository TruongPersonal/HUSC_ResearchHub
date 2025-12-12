package vn.edu.husc.researchhub.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import vn.edu.husc.researchhub.dto.request.ChangePasswordRequest;
import vn.edu.husc.researchhub.dto.request.LoginRequest;
import vn.edu.husc.researchhub.dto.response.JwtAuthenticationResponse;
import vn.edu.husc.researchhub.security.JwtTokenProvider;
import vn.edu.husc.researchhub.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  @Autowired AuthenticationManager authenticationManager;

  @Autowired JwtTokenProvider tokenProvider;

  @Autowired UserService userService;

  /**
   * Đăng nhập hệ thống.
   * Trả về JWT token nếu thông tin hợp lệ.
   */
  @PostMapping("/login")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

    Authentication authentication =
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);

    String jwt = tokenProvider.generateToken(authentication);
    return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));
  }

  /**
   * Quên mật khẩu.
   */
  @PostMapping("/forgot-password")
  public ResponseEntity<?> forgotPassword(@RequestBody java.util.Map<String, String> request) {
    String username = request.get("username");
    userService.forgotPassword(username);
    return ResponseEntity.ok("Mật khẩu mới đã được gửi đến email của bạn");
  }

  /**
   * Đổi mật khẩu người dùng.
   */
  @PostMapping("/change-password")
  public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String username = authentication.getName();

    userService.changePassword(username, request.getOldPassword(), request.getNewPassword());

    return ResponseEntity.ok("Đổi mật khẩu thành công");
  }

  /**
   * Cập nhật hồ sơ cá nhân (Thông tin cơ bản + Avatar).
   */
  @PostMapping(
      value = "/update-profile",
      consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<vn.edu.husc.researchhub.dto.response.UserResponse> updateProfile(
      @ModelAttribute vn.edu.husc.researchhub.dto.request.UpdateProfileRequest request,
      @RequestParam(value = "avatar", required = false)
          org.springframework.web.multipart.MultipartFile avatar) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String username = authentication.getName();

    vn.edu.husc.researchhub.dto.response.UserResponse response =
        userService.updateProfile(username, request, avatar);
    return ResponseEntity.ok(response);
  }

  /**
   * Cập nhật Avatar riêng lẻ.
   */
  @PostMapping(
      value = "/update-avatar",
      consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<?> updateAvatar(
      @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String username = authentication.getName();

    String fileUrl = userService.updateAvatar(username, file);

    return ResponseEntity.ok(
        new java.util.HashMap<String, String>() {
          {
            put("avatarUrl", fileUrl);
          }
        });
  }

  /**
   * Lấy thông tin người dùng hiện tại (dựa trên token).
   */
  @GetMapping("/me")
  public ResponseEntity<?> getProfile() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String username = authentication.getName();
    return ResponseEntity.ok(userService.getProfile(username));
  }
}
