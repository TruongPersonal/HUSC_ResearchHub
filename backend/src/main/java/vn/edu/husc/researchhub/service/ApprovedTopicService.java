package vn.edu.husc.researchhub.service;

import java.util.List;
import vn.edu.husc.researchhub.dto.request.UpdateApprovedTopicRequest;
import vn.edu.husc.researchhub.dto.response.ApprovedTopicDocumentResponse;
import vn.edu.husc.researchhub.dto.response.ApprovedTopicResponse;
import vn.edu.husc.researchhub.dto.response.PageResponse;

/**
 * Service quản lý Đề tài đã duyệt (Approved Topics).
 * Xử lý các nghiệp vụ sau khi đề tài đã được duyệt chính thức.
 */
public interface ApprovedTopicService {
  /**
   * Lấy danh sách đề tài đã duyệt có phân trang và lọc.
   */
  PageResponse<ApprovedTopicResponse> getAllApprovedTopics(
      Integer departmentId,
      Integer academicYearId,
      String keyword,
      vn.edu.husc.researchhub.model.enums.ApprovedTopicStatus status,
      int page,
      int size);

  /**
   * Cập nhật thông tin đề tài đã duyệt.
   */
  ApprovedTopicResponse updateApprovedTopic(Integer id, UpdateApprovedTopicRequest request);

  /**
   * Lấy danh sách tài liệu của đề tài.
   */
  List<ApprovedTopicDocumentResponse> getDocuments(Integer approvedTopicId);

  /**
   * Upload tài liệu đính kèm cho đề tài.
   */
  ApprovedTopicDocumentResponse uploadDocument(
      Integer topicId,
      org.springframework.web.multipart.MultipartFile file,
      vn.edu.husc.researchhub.model.enums.DocumentType type,
      String summary);

  /**
   * Xóa tài liệu.
   */
  void deleteDocument(Integer documentId);

  /**
   * Cập nhật mô tả tài liệu.
   */
  ApprovedTopicDocumentResponse updateDocumentSummary(Integer documentId, String summary);

  /**
   * Lấy tài liệu theo ID đề tài (Method phụ trợ).
   */
  List<ApprovedTopicDocumentResponse> getDocumentsByTopicId(Integer topicId);
}
