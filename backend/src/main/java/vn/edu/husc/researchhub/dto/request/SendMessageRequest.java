package vn.edu.husc.researchhub.dto.request;

import lombok.Data;

@Data
public class SendMessageRequest {
    private Integer receiverId;
    private String content;
}
