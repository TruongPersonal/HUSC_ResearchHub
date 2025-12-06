package vn.edu.husc.researchhub.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.edu.husc.researchhub.dto.request.UpdateApprovedTopicRequest;
import vn.edu.husc.researchhub.dto.response.ApprovedTopicDocumentResponse;
import vn.edu.husc.researchhub.dto.response.ApprovedTopicResponse;
import vn.edu.husc.researchhub.dto.response.PageResponse;
import vn.edu.husc.researchhub.service.ApprovedTopicService;

import java.util.List;

@RestController
@RequestMapping("/api/approved-topics")
@RequiredArgsConstructor
public class ApprovedTopicController {

    private final ApprovedTopicService approvedTopicService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT', 'TEACHER')")
    public ResponseEntity<PageResponse<ApprovedTopicResponse>> getAllApprovedTopics(
            @RequestParam(required = false) Integer departmentId,
            @RequestParam(required = false) Integer academicYearId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) vn.edu.husc.researchhub.model.enums.ApprovedTopicStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(approvedTopicService.getAllApprovedTopics(departmentId, academicYearId, keyword, status, page, size));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT')")
    public ResponseEntity<ApprovedTopicResponse> updateApprovedTopic(
            @PathVariable Integer id,
            @RequestBody UpdateApprovedTopicRequest request) {
        return ResponseEntity.ok(approvedTopicService.updateApprovedTopic(id, request));
    }

    @GetMapping("/{id}/documents")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT', 'TEACHER', 'STUDENT')")
    public ResponseEntity<List<ApprovedTopicDocumentResponse>> getDocuments(@PathVariable Integer id) {
        return ResponseEntity.ok(approvedTopicService.getDocuments(id));
    }

    @PostMapping("/upload")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT', 'STUDENT', 'TEACHER')")
    public ResponseEntity<ApprovedTopicDocumentResponse> uploadDocument(
            @RequestParam("topicId") Integer topicId,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            @RequestParam("type") vn.edu.husc.researchhub.model.enums.DocumentType type,
            @RequestParam(value = "summary", required = false) String summary) {
        return ResponseEntity.ok(approvedTopicService.uploadDocument(topicId, file, type, summary));
    }

    @GetMapping("/by-topic/{topicId}/documents")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT', 'TEACHER', 'STUDENT')")
    public ResponseEntity<List<ApprovedTopicDocumentResponse>> getDocumentsByTopicId(@PathVariable Integer topicId) {
        return ResponseEntity.ok(approvedTopicService.getDocumentsByTopicId(topicId));
    }

    @DeleteMapping("/documents/{documentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT', 'STUDENT', 'TEACHER')")
    public ResponseEntity<Void> deleteDocument(@PathVariable Integer documentId) {
        approvedTopicService.deleteDocument(documentId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/documents/{documentId}/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT', 'STUDENT', 'TEACHER')")
    public ResponseEntity<ApprovedTopicDocumentResponse> updateDocumentSummary(
            @PathVariable Integer documentId,
            @RequestBody java.util.Map<String, String> body) {
        return ResponseEntity.ok(approvedTopicService.updateDocumentSummary(documentId, body.get("summary")));
    }
}
