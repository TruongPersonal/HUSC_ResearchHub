package vn.edu.husc.researchhub.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import vn.edu.husc.researchhub.service.EmailService;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

  private final JavaMailSender emailSender;

  @Value("${spring.mail.username}")
  private String fromEmail;

  @Override
  public void sendSimpleMessage(String to, String subject, String text) {
    try {
      SimpleMailMessage message = new SimpleMailMessage();
      message.setFrom(fromEmail);
      message.setTo(to);
      message.setSubject(subject);
      message.setText(text);
      emailSender.send(message);
    } catch (Exception e) {
      System.err.println("Failed to send email to " + to + ": " + e.getMessage());
      // Don't throw exception to avoid breaking the main flow if email fails
    }
  }

  @Override
  public void sendAccountInfo(String to, String username, String password) {
    String subject = "Thông tin tài khoản HUSC ResearchHub";
    String text =
        String.format(
            """
            Xin chào,

            Tài khoản của bạn đã được tạo trên hệ thống HUSC ResearchHub.

            Thông tin đăng nhập là
            - Tên đăng nhập: %s
            - Mật khẩu: %s

            Vui lòng đăng nhập và đổi mật khẩu ngay sau khi truy cập.

            Trân trọng,
            Quản trị viên HUSC ResearchHub
            """,
            username, password);

    sendSimpleMessage(to, subject, text);
  }

  @Override
  public void sendPasswordResetInfo(String to, String username, String password) {
    String subject = "Thông báo đổi mật khẩu HUSC ResearchHub";
    String text =
        String.format(
            """
            Xin chào,

            Tài khoản của bạn đã được đổi mật khẩu trên hệ thống HUSC ResearchHub.

            Thông tin đăng nhập là
            - Tên đăng nhập: %s
            - Mật khẩu: %s

            Trân trọng,
            Quản trị viên HUSC ResearchHub
            """,
            username, password);

    sendSimpleMessage(to, subject, text);
  }
}
