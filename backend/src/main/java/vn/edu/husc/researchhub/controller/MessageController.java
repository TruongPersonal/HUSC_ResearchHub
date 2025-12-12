package vn.edu.husc.researchhub.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import vn.edu.husc.researchhub.dto.request.SendMessageRequest;
import vn.edu.husc.researchhub.dto.request.UpdateMessageRequest;
import vn.edu.husc.researchhub.dto.response.ChatPartnerResponse;
import vn.edu.husc.researchhub.dto.response.MessageResponse;
import vn.edu.husc.researchhub.service.MessageService;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final vn.edu.husc.researchhub.service.UserService userService;

    @GetMapping("/partners")
    public ResponseEntity<List<ChatPartnerResponse>> getChatPartners(@RequestParam(required = false) String query) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(userService.findChatPartners(username, query));
    }

    @PostMapping
    public ResponseEntity<MessageResponse> sendMessage(@RequestBody SendMessageRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(messageService.sendMessage(request, username));
    }

    @GetMapping("/inbox")
    public ResponseEntity<List<MessageResponse>> getInbox() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(messageService.getInbox(username));
    }

    @GetMapping("/sent")
    public ResponseEntity<List<MessageResponse>> getSent() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(messageService.getSent(username));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Integer id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        messageService.markAsRead(id, username);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Integer id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        messageService.deleteMessage(id, username);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateMessage(@PathVariable Integer id, @RequestBody UpdateMessageRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        messageService.updateMessage(id, request, username);
        return ResponseEntity.ok().build();
    }
}
