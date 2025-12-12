package vn.edu.husc.researchhub.service;

import vn.edu.husc.researchhub.dto.request.SendMessageRequest;
import vn.edu.husc.researchhub.dto.request.UpdateMessageRequest;
import vn.edu.husc.researchhub.dto.response.MessageResponse;
import java.util.List;

public interface MessageService {
    MessageResponse sendMessage(SendMessageRequest request, String username);
    List<MessageResponse> getInbox(String username);
    List<MessageResponse> getSent(String username);
    void markAsRead(Integer messageId, String username);
    void deleteMessage(Integer messageId, String username);
    void updateMessage(Integer messageId, UpdateMessageRequest request, String username);
}
