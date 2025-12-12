package vn.edu.husc.researchhub.controller;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import vn.edu.husc.researchhub.dto.request.UpdateApprovedTopicRequest;
import vn.edu.husc.researchhub.dto.response.ApprovedTopicDocumentResponse;
import vn.edu.husc.researchhub.dto.response.ApprovedTopicResponse;
import vn.edu.husc.researchhub.dto.response.PageResponse;
import vn.edu.husc.researchhub.service.ApprovedTopicService;

@RestController
@RequestMapping("/api/approved-topics")
@RequiredArgsConstructor
public class ApprovedTopicController {

  private final ApprovedTopicService approvedTopicService;

  /**
   * Lấy danh sách đề tài đã duyệt
   * Hỗ trợ tìm kiếm và lọc theo nhiều tiêu chí
   */
  @GetMapping
  public ResponseEntity<PageResponse<ApprovedTopicResponse>> getAllApprovedTopics(
      @RequestParam(required = false) Integer departmentId,
      @RequestParam(required = false) Integer academicYearId,
      @RequestParam(required = false) String keyword,
      @RequestParam(required = false)
          vn.edu.husc.researchhub.model.enums.ApprovedTopicStatus status,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    return ResponseEntity.ok(
        approvedTopicService.getAllApprovedTopics(
            departmentId, academicYearId, keyword, status, page, size));
  }

  /**
   * Cập nhật thông tin đề tài đã duyệt
   */
  @PutMapping("/{id}")
  public ResponseEntity<ApprovedTopicResponse> updateApprovedTopic(
      @PathVariable Integer id, @RequestBody UpdateApprovedTopicRequest request) {
    return ResponseEntity.ok(approvedTopicService.updateApprovedTopic(id, request));
  }

  /**
   * Lấy danh sách tài liệu của một đề tài
   */
  @GetMapping("/{id}/documents")
  public ResponseEntity<List<ApprovedTopicDocumentResponse>> getDocuments(
      @PathVariable Integer id) {
    return ResponseEntity.ok(approvedTopicService.getDocuments(id));
  }

  /**
   * Upload tài liệu cho đề tài (báo cáo, minh chứng, ...)
   */
  @PostMapping("/upload")
  public ResponseEntity<ApprovedTopicDocumentResponse> uploadDocument(
      @RequestParam("topicId") Integer topicId,
      @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
      @RequestParam("type") vn.edu.husc.researchhub.model.enums.DocumentType type,
      @RequestParam(value = "summary", required = false) String summary) {
    return ResponseEntity.ok(approvedTopicService.uploadDocument(topicId, file, type, summary));
  }

  /**
   * Lấy tài liệu theo ID đề tài (API phụ trợ)
   */
  @GetMapping("/by-topic/{topicId}/documents")
  public ResponseEntity<List<ApprovedTopicDocumentResponse>> getDocumentsByTopicId(
      @PathVariable Integer topicId) {
    return ResponseEntity.ok(approvedTopicService.getDocumentsByTopicId(topicId));
  }

  /**
   * Xóa tài liệu
   */
  @DeleteMapping("/documents/{documentId}")
  public ResponseEntity<Void> deleteDocument(@PathVariable Integer documentId) {
    approvedTopicService.deleteDocument(documentId);
    return ResponseEntity.noContent().build();
  }

  /**
   * Cập nhật mô tả (summary) cho tài liệu
   */
  @PutMapping("/documents/{documentId}/summary")
  public ResponseEntity<ApprovedTopicDocumentResponse> updateDocumentSummary(
      @PathVariable Integer documentId, @RequestBody java.util.Map<String, String> body) {
    return ResponseEntity.ok(
        approvedTopicService.updateDocumentSummary(documentId, body.get("summary")));
  }
}
