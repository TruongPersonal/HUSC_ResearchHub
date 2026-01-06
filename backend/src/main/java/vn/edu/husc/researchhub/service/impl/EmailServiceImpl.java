package vn.edu.husc.researchhub.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import vn.edu.husc.researchhub.service.EmailService;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

  @Value("${brevo.api.key}")
  private String apiKey;

  @Value("${brevo.sender.email}")
  private String senderEmail;

  @Value("${brevo.sender.name}")
  private String senderName;

  private final RestTemplate restTemplate = new RestTemplate();
  private static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

  @Override
  public void sendSimpleMessage(String to, String subject, String text) {
    try {
      HttpHeaders headers = new HttpHeaders();
      headers.setContentType(MediaType.APPLICATION_JSON);
      headers.set("api-key", apiKey);

      Map<String, Object> body = new HashMap<>();
      body.put("sender", Map.of("name", senderName, "email", senderEmail));
      body.put("to", Collections.singletonList(Map.of("email", to)));
      body.put("subject", subject);
      body.put("textContent", text); // Use textContent for plain text

      HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

      restTemplate.postForEntity(BREVO_API_URL, request, String.class);
      System.out.println("Email sent successfully to " + to);

    } catch (Exception e) {
      System.err.println("Failed to send email to " + to + ": " + e.getMessage());
      e.printStackTrace();
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
