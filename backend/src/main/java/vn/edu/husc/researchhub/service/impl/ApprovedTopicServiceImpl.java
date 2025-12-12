package vn.edu.husc.researchhub.service.impl;

import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import vn.edu.husc.researchhub.dto.response.ApprovedTopicDocumentResponse;
import vn.edu.husc.researchhub.dto.response.ApprovedTopicResponse;
import vn.edu.husc.researchhub.dto.response.PageResponse;
import vn.edu.husc.researchhub.dto.response.TopicResponse;
import vn.edu.husc.researchhub.exception.ResourceNotFoundException;
import vn.edu.husc.researchhub.model.ApprovedTopic;
import vn.edu.husc.researchhub.model.ApprovedTopicDocument;
import vn.edu.husc.researchhub.model.Role;
import vn.edu.husc.researchhub.model.Topic;
import vn.edu.husc.researchhub.model.TopicMember;
import vn.edu.husc.researchhub.model.enums.MemberStatus;
import vn.edu.husc.researchhub.model.enums.TopicMemberRole;
import vn.edu.husc.researchhub.repository.ApprovedTopicDocumentRepository;
import vn.edu.husc.researchhub.repository.ApprovedTopicRepository;
import vn.edu.husc.researchhub.repository.TopicMemberRepository;
import vn.edu.husc.researchhub.repository.TopicRepository;
import vn.edu.husc.researchhub.service.ApprovedTopicService;

@Service
@RequiredArgsConstructor
public class ApprovedTopicServiceImpl implements ApprovedTopicService {

  private final ApprovedTopicRepository approvedTopicRepository;
  private final TopicRepository topicRepository;
  private final ApprovedTopicDocumentRepository approvedTopicDocumentRepository;
  private final TopicMemberRepository topicMemberRepository;
  private final vn.edu.husc.researchhub.repository.YearSessionRepository yearSessionRepository;

  @Override
  public PageResponse<ApprovedTopicResponse> getAllApprovedTopics(
      Integer departmentId,
      Integer academicYearId,
      String keyword,
      vn.edu.husc.researchhub.model.enums.ApprovedTopicStatus status,
      int page,
      int size) {
    Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
    Page<ApprovedTopic> approvedTopicPage =
        approvedTopicRepository.search(departmentId, academicYearId, keyword, status, pageable);

    List<ApprovedTopicResponse> content =
        approvedTopicPage.getContent().stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());

    return PageResponse.<ApprovedTopicResponse>builder()
        .content(content)
        .page(approvedTopicPage.getNumber())
        .size(approvedTopicPage.getSize())
        .totalElements(approvedTopicPage.getTotalElements())
        .totalPages(approvedTopicPage.getTotalPages())
        .build();
  }

  @Override
  @org.springframework.transaction.annotation.Transactional
  public ApprovedTopicResponse updateApprovedTopic(
      Integer id, vn.edu.husc.researchhub.dto.request.UpdateApprovedTopicRequest request) {
    ApprovedTopic approvedTopic =
        approvedTopicRepository
            .findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đề tài đã duyệt"));

    if (request.getCode() != null) approvedTopic.setCode(request.getCode());
    if (request.getPrize() != null) approvedTopic.setPrize(request.getPrize());
    if (request.getFieldResearch() != null)
      approvedTopic.setFieldResearch(request.getFieldResearch());
    if (request.getTypeResearch() != null) approvedTopic.setTypeResearch(request.getTypeResearch());
    if (request.getStatus() != null) approvedTopic.setStatus(request.getStatus());

    ApprovedTopic savedTopic = approvedTopicRepository.save(approvedTopic);
    return mapToResponse(savedTopic);
  }

  @Override
  public List<ApprovedTopicDocumentResponse> getDocumentsByTopicId(Integer topicId) {
    ApprovedTopic approvedTopic =
        approvedTopicRepository
            .findByTopicId(topicId)
            .orElseThrow(
                () -> new ResourceNotFoundException("Đề tài chưa được duyệt hoặc không tồn tại"));
    return getDocuments(approvedTopic.getId());
  }

  @Override
  public List<ApprovedTopicDocumentResponse> getDocuments(Integer approvedTopicId) {
    return approvedTopicDocumentRepository.findByApprovedTopicId(approvedTopicId).stream()
        .map(this::mapToDocumentResponse)
        .collect(Collectors.toList());
  }

  private ApprovedTopicDocumentResponse mapToDocumentResponse(ApprovedTopicDocument document) {
    return ApprovedTopicDocumentResponse.builder()
        .id(document.getId())
        .documentType(document.getDocumentType())
        .fileUrl(document.getFileUrl())
        .scientificArticleSummary(document.getScientificArticleSummary())
        .uploadedAt(document.getUploadedAt())
        .build();
  }

  @Override
  @org.springframework.transaction.annotation.Transactional
  public ApprovedTopicDocumentResponse uploadDocument(
      Integer topicId,
      org.springframework.web.multipart.MultipartFile file,
      vn.edu.husc.researchhub.model.enums.DocumentType type,
      String summary) {
    // 1. Find Approved Topic by Topic ID
    ApprovedTopic approvedTopic =
        approvedTopicRepository
            .findByTopicId(topicId)
            .orElseThrow(
                () -> new ResourceNotFoundException("Đề tài chưa được duyệt hoặc không tồn tại"));

    // 2. Check if document exists
    ApprovedTopicDocument document =
        approvedTopicDocumentRepository.findByApprovedTopicId(approvedTopic.getId()).stream()
            .filter(d -> d.getDocumentType() == type)
            .findFirst()
            .orElse(new ApprovedTopicDocument());

    // If exists, delete old file
    if (document.getId() != null) {
      try {
        // Extract file path from URL (remove leading slash)
        // Assuming URL is /uploads/documents/...
        if (document.getFileUrl() != null && document.getFileUrl().startsWith("/")) {
          String oldPath = document.getFileUrl().substring(1);
          java.nio.file.Files.deleteIfExists(java.nio.file.Paths.get(oldPath));
        }
      } catch (java.io.IOException e) {
        // Log warning but continue?
        e.printStackTrace();
      }
    }

    // 3. Save New File
    String fileName = file.getOriginalFilename();

    // Use ID for folder name
    String folderName = String.valueOf(approvedTopic.getId());
    // Sanitize - though ID is integer so it's safe.
    // folderName = folderName.replaceAll("[^a-zA-Z0-9.-]", "_");

    String uploadDir = "uploads/documents/" + folderName + "/";
    java.io.File directory = new java.io.File(uploadDir);
    if (!directory.exists()) {
      directory.mkdirs();
    }

    String filePath = uploadDir + fileName;
    try {
      file.transferTo(new java.io.File(directory.getAbsolutePath() + "/" + fileName));
    } catch (java.io.IOException e) {
      throw new RuntimeException("Không thể lưu tệp tin", e);
    }

    // 4. Update/Create Entity
    document.setApprovedTopic(approvedTopic);
    document.setDocumentType(type);
    document.setFileUrl("/" + filePath);
    // Only update summary if provided (or if new)?
    // User logic: "Nộp được 1 loại 1 lần". If uploading, likely want to set summary too.
    // If summary is null in request, should we clear it?
    // Let's set it to whatever is passed, as upload dialog sends it.
    document.setScientificArticleSummary(summary);

    document = approvedTopicDocumentRepository.save(document);

    return mapToDocumentResponse(document);
  }

  public void deleteDocument(Integer documentId) {
    ApprovedTopicDocument document =
        approvedTopicDocumentRepository
            .findById(documentId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài liệu"));

    // Delete file
    try {
      if (document.getFileUrl() != null && document.getFileUrl().startsWith("/")) {
        String filePath = document.getFileUrl().substring(1);
        java.nio.file.Files.deleteIfExists(java.nio.file.Paths.get(filePath));
      }
    } catch (java.io.IOException e) {
      e.printStackTrace();
    }

    approvedTopicDocumentRepository.delete(document);
  }

  public ApprovedTopicDocumentResponse updateDocumentSummary(Integer documentId, String summary) {
    ApprovedTopicDocument document =
        approvedTopicDocumentRepository
            .findById(documentId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài liệu"));

    document.setScientificArticleSummary(summary);
    document = approvedTopicDocumentRepository.save(document);
    return mapToDocumentResponse(document);
  }

  private ApprovedTopicResponse mapToResponse(ApprovedTopic approvedTopic) {
    return ApprovedTopicResponse.builder()
        .id(approvedTopic.getId())
        .topic(mapTopicToResponse(approvedTopic.getTopic()))
        .code(approvedTopic.getCode())
        .code(approvedTopic.getCode())
        .prize(approvedTopic.getPrize())
        .fieldResearch(approvedTopic.getFieldResearch())
        .fieldResearch(approvedTopic.getFieldResearch())
        .typeResearch(approvedTopic.getTypeResearch())
        .status(approvedTopic.getStatus())
        .createdAt(approvedTopic.getCreatedAt())
        .build();
  }

  // Duplicated from TopicServiceImpl - ideally should be in a shared mapper or TopicService
  private TopicResponse mapTopicToResponse(Topic topic) {
    List<TopicMember> members = topicMemberRepository.findByTopicId(topic.getId());

    TopicMember advisor =
        members.stream()
            .filter(
                m ->
                    m.getRole() == TopicMemberRole.ADVISOR
                        && m.getStatus() == MemberStatus.APPROVED)
            .findFirst()
            .orElse(null);

    TopicMember leader =
        members.stream()
            .filter(
                m ->
                    m.getRole() == TopicMemberRole.LEADER && m.getStatus() == MemberStatus.APPROVED)
            .findFirst()
            .orElse(null);

    List<TopicResponse.MemberResponse> pendingMembers =
        members.stream()
            .filter(m -> m.getStatus() == MemberStatus.PENDING)
            .map(
                m ->
                    new TopicResponse.MemberResponse(
                        m.getUser().getId(),
                        m.getUser().getFullName(),
                        m.getUser().getEmail(),
                        m.getUser().getUsername(),
                        m.getUser().getPhoneNumber(),
                        m.getUser().getAvatarUrl()))
            .collect(Collectors.toList());

    List<TopicResponse.MemberResponse> approvedMembers =
        members.stream()
            .filter(
                m ->
                    m.getStatus() == MemberStatus.APPROVED && m.getUser().getRole() == Role.STUDENT)
            .map(
                m ->
                    new TopicResponse.MemberResponse(
                        m.getUser().getId(),
                        m.getUser().getFullName(),
                        m.getUser().getEmail(),
                        m.getUser().getUsername(),
                        m.getUser().getPhoneNumber(),
                        m.getUser().getAvatarUrl()))
            .collect(Collectors.toList());

    return TopicResponse.builder()
        .id(topic.getId())
        .title(topic.getName())
        .shortDescription(topic.getDescription())
        .objective(topic.getTarget())
        .content(topic.getMainContent())
        .budget(topic.getBudget())
        .note(topic.getNote())
        .status(topic.getStatus())
        .approvedStatus(
            approvedTopicRepository
                .findByTopicId(topic.getId())
                .map(vn.edu.husc.researchhub.model.ApprovedTopic::getStatus)
                .orElse(null))
        .sessionStatus(
            yearSessionRepository
                .findByAcademicYearIdAndDepartmentId(
                    topic.getAcademicYear().getId(), topic.getDepartment().getId())
                .map(vn.edu.husc.researchhub.model.YearSession::getStatus)
                .orElse(null))
        .createdAt(topic.getCreatedAt())
        .advisorId(advisor != null ? advisor.getUser().getId() : null)
        .advisorName(advisor != null ? advisor.getUser().getFullName() : null)
        .advisorUsername(advisor != null ? advisor.getUser().getUsername() : null)
        .advisorEmail(advisor != null ? advisor.getUser().getEmail() : null)
        .advisorPhone(advisor != null ? advisor.getUser().getPhoneNumber() : null)
        .advisorAvatar(advisor != null ? advisor.getUser().getAvatarUrl() : null)
        .studentLeaderId(leader != null ? leader.getUser().getId() : null)
        .studentLeaderName(leader != null ? leader.getUser().getFullName() : null)
        .studentLeaderEmail(leader != null ? leader.getUser().getEmail() : null)
        .studentLeaderPhone(leader != null ? leader.getUser().getPhoneNumber() : null)
        .studentLeaderAvatar(leader != null ? leader.getUser().getAvatarUrl() : null)
        .pendingMembers(pendingMembers)
        .approvedMembers(approvedMembers)
        .advisors(
            members.stream()
                .filter(
                    m ->
                        m.getRole() == TopicMemberRole.ADVISOR
                            && m.getStatus() == MemberStatus.APPROVED)
                .map(
                    m ->
                        new TopicResponse.MemberResponse(
                            m.getUser().getId(),
                            m.getUser().getFullName(),
                            m.getUser().getEmail(),
                            m.getUser().getUsername(),
                            m.getUser().getPhoneNumber(),
                            m.getUser().getAvatarUrl()))
                .collect(Collectors.toList()))
        .build();
  }
}
