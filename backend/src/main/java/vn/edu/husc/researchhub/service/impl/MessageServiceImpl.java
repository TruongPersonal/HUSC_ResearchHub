package vn.edu.husc.researchhub.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.husc.researchhub.dto.request.SendMessageRequest;
import vn.edu.husc.researchhub.dto.request.UpdateMessageRequest;
import vn.edu.husc.researchhub.dto.response.ChatPartnerResponse;
import vn.edu.husc.researchhub.dto.response.MessageResponse;
import vn.edu.husc.researchhub.model.Message;
import vn.edu.husc.researchhub.model.User;
import vn.edu.husc.researchhub.repository.MessageRepository;
import vn.edu.husc.researchhub.repository.UserRepository;
import vn.edu.husc.researchhub.service.MessageService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    @Override
    public MessageResponse sendMessage(SendMessageRequest request, String username) {
        User sender = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(request.getContent());
        message.setCreatedAt(LocalDateTime.now());
        message.setIsRead(false);

        Message savedMessage = messageRepository.save(message);
        return mapToDTO(savedMessage);
    }

    @Override
    public List<MessageResponse> getInbox(String username) {
        User receiver = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return messageRepository.findByReceiverOrderByCreatedAtDesc(receiver)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<MessageResponse> getSent(String username) {
        User sender = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return messageRepository.findBySenderOrderByCreatedAtDesc(sender)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void markAsRead(Integer messageId, String username) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        
        // Only receiver can mark as read
        if (!message.getReceiver().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized");
        }

        message.setIsRead(true);
        messageRepository.save(message);
    }

    @Override
    public void deleteMessage(Integer messageId, String username) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        // Sender or Receiver can delete (hide) or physically delete.
        if (!message.getSender().getUsername().equals(username) && 
            !message.getReceiver().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized");
        }
        
        // Physical Delete as per user feedback removing soft delete columns
        messageRepository.delete(message);
    }

    @Override
    public void updateMessage(Integer messageId, UpdateMessageRequest request, String username) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        // Only sender can update
        if (!message.getSender().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized: Only sender can edit message");
        }

        message.setContent(request.getContent());
        messageRepository.save(message); // triggers UpdateTimestamp
    }

    private MessageResponse mapToDTO(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getFullName())
                .receiverId(message.getReceiver().getId())
                .receiverName(message.getReceiver().getFullName())
                .content(message.getContent())
                .createdAt(message.getCreatedAt())
                .isRead(message.getIsRead())
                .build();
    }
}
