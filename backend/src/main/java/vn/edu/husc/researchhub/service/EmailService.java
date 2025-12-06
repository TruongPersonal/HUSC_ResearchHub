package vn.edu.husc.researchhub.service;

public interface EmailService {
    void sendSimpleMessage(String to, String subject, String text);
    void sendAccountInfo(String to, String username, String password);
    void sendPasswordResetInfo(String to, String username, String password);
}
