package vn.edu.husc.researchhub.service;

import java.util.List;
import vn.edu.husc.researchhub.dto.request.UpdateApprovedTopicRequest;
import vn.edu.husc.researchhub.dto.response.ApprovedTopicDocumentResponse;
import vn.edu.husc.researchhub.dto.response.ApprovedTopicResponse;
import vn.edu.husc.researchhub.dto.response.PageResponse;

public interface ApprovedTopicService {
    PageResponse<ApprovedTopicResponse> getAllApprovedTopics(Integer departmentId, Integer academicYearId, String keyword, vn.edu.husc.researchhub.model.enums.ApprovedTopicStatus status, int page, int size);
    ApprovedTopicResponse updateApprovedTopic(Integer id, UpdateApprovedTopicRequest request);
    List<ApprovedTopicDocumentResponse> getDocuments(Integer approvedTopicId);
    ApprovedTopicDocumentResponse uploadDocument(Integer topicId, org.springframework.web.multipart.MultipartFile file, vn.edu.husc.researchhub.model.enums.DocumentType type, String summary);
    void deleteDocument(Integer documentId);
    ApprovedTopicDocumentResponse updateDocumentSummary(Integer documentId, String summary);
    List<ApprovedTopicDocumentResponse> getDocumentsByTopicId(Integer topicId);
}
