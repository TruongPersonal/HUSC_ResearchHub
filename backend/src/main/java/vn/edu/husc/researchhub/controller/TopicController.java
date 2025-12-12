package vn.edu.husc.researchhub.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.husc.researchhub.dto.request.AssignUserRequest;
import vn.edu.husc.researchhub.dto.request.UpdateTopicStatusRequest;
import vn.edu.husc.researchhub.dto.response.PageResponse;
import vn.edu.husc.researchhub.dto.response.TopicResponse;
import vn.edu.husc.researchhub.model.enums.TopicStatus;
import vn.edu.husc.researchhub.service.TopicService;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
public class TopicController {

  private final TopicService topicService;

  /**
   * Lấy danh sách đề tài (đang đăng ký/xét duyệt).
   * Hỗ trợ lọc theo nhiều tiêu chí.
   */
  @GetMapping
  public ResponseEntity<PageResponse<TopicResponse>> getAllTopics(
      @RequestParam(required = false) String keyword,
      @RequestParam(required = false) TopicStatus status,
      @RequestParam(required = false) Integer departmentId,
      @RequestParam(required = false) Integer academicYearId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    return ResponseEntity.ok(
        topicService.getAllTopics(keyword, status, departmentId, academicYearId, page, size));
  }

  /**
   * Lấy danh sách đề tài của tôi (User hiện tại).
   */
  @GetMapping("/my-topics")
  public ResponseEntity<java.util.List<TopicResponse>> getMyTopics() {
    return ResponseEntity.ok(topicService.getMyTopics());
  }

  /**
   * Lấy chi tiết đề tài.
   */
  @GetMapping("/{id}")
  public ResponseEntity<TopicResponse> getTopicDetail(@PathVariable Integer id) {
    return ResponseEntity.ok(topicService.getTopicDetail(id));
  }

  /**
   * Cập nhật thông tin đề tài.
   */
  @PutMapping("/{id}")
  public ResponseEntity<Void> updateTopic(
      @PathVariable Integer id,
      @RequestBody vn.edu.husc.researchhub.dto.request.UpdateTopicRequest request) {
    topicService.updateTopic(id, request);
    return ResponseEntity.ok().build();
  }

  /**
   * Cập nhật trạng thái đề tài (Duyệt/Từ chối).
   */
  @PutMapping("/{id}/status")
  public ResponseEntity<Void> updateTopicStatus(
      @PathVariable Integer id, @RequestBody UpdateTopicStatusRequest request) {
    topicService.updateTopicStatus(id, request.getStatus(), request.getFeedback());
    return ResponseEntity.ok().build();
  }

  /**
   * Phân công Giảng viên hướng dẫn.
   */
  @PutMapping("/{id}/assign-advisor")
  public ResponseEntity<Void> assignAdvisor(
      @PathVariable Integer id, @RequestBody AssignUserRequest request) {
    topicService.assignAdvisor(id, request.getUserId());
    return ResponseEntity.ok().build();
  }

  /**
   * Phân công Sinh viên chủ nhiệm.
   */
  @PutMapping("/{id}/assign-leader")
  public ResponseEntity<Void> assignLeader(
      @PathVariable Integer id, @RequestBody AssignUserRequest request) {
    topicService.assignLeader(id, request.getUserId());
    return ResponseEntity.ok().build();
  }

  /**
   * Duyệt thành viên tham gia.
   */
  @PostMapping("/{id}/members/approve")
  public ResponseEntity<Void> approveMember(
      @PathVariable Integer id, @RequestBody AssignUserRequest request) {
    topicService.approveMember(id, request.getUserId());
    return ResponseEntity.ok().build();
  }

  /**
   * Từ chối thành viên.
   */
  @PostMapping("/{id}/members/reject")
  public ResponseEntity<Void> rejectMember(
      @PathVariable Integer id, @RequestBody AssignUserRequest request) {
    topicService.rejectMember(id, request.getUserId());
    return ResponseEntity.ok().build();
  }

  /**
   * Sinh viên đề xuất đề tài mới.
   */
  @PostMapping
  public ResponseEntity<Void> proposeTopic(
      @RequestBody vn.edu.husc.researchhub.dto.request.ProposeTopicRequest request) {
    topicService.proposeTopic(request);
    return ResponseEntity.ok().build();
  }

  /**
   * Sinh viên đăng ký tham gia đề tài.
   */
  @PostMapping("/{id}/register")
  public ResponseEntity<Void> registerTopic(@PathVariable Integer id) {
    topicService.registerTopic(id);
    return ResponseEntity.ok().build();
  }
}
