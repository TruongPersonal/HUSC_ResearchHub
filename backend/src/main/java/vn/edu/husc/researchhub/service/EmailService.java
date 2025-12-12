package vn.edu.husc.researchhub.service;

/**
 * Service gửi Email.
 * Xử lý việc gửi email thông báo, cấp tài khoản, reset mật khẩu.
 */
public interface EmailService {
  /**
   * Gửi email đơn giản (text thuần).
   */
  void sendSimpleMessage(String to, String subject, String text);

  /**
   * Gửi thông tin tài khoản (username/password) cho người dùng mới.
   */
  void sendAccountInfo(String to, String username, String password);

  /**
   * Gửi thông tin reset mật khẩu.
   */
  void sendPasswordResetInfo(String to, String username, String password);
}
