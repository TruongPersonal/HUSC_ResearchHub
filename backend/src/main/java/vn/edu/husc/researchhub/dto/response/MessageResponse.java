package vn.edu.husc.researchhub.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    private Integer id;
    private Integer senderId;
    private String senderName;
    private Integer receiverId;
    private String receiverName;
    private String content;
    private LocalDateTime createdAt;
    private Boolean isRead;
}
