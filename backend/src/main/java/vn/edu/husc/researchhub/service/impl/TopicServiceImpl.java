package vn.edu.husc.researchhub.service.impl;

import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.husc.researchhub.dto.response.PageResponse;
import vn.edu.husc.researchhub.dto.response.TopicResponse;
import vn.edu.husc.researchhub.model.Role;
import vn.edu.husc.researchhub.model.Topic;
import vn.edu.husc.researchhub.model.TopicMember;
import vn.edu.husc.researchhub.model.User;
import vn.edu.husc.researchhub.model.enums.MemberStatus;
import vn.edu.husc.researchhub.model.enums.TopicMemberRole;
import vn.edu.husc.researchhub.model.enums.TopicStatus;
import vn.edu.husc.researchhub.repository.TopicMemberRepository;
import vn.edu.husc.researchhub.repository.TopicRepository;
import vn.edu.husc.researchhub.repository.UserRepository;
import vn.edu.husc.researchhub.service.TopicService;

@Service
@RequiredArgsConstructor
public class TopicServiceImpl implements TopicService {

  private final TopicRepository topicRepository;
  private final TopicMemberRepository topicMemberRepository;
  private final UserRepository userRepository;
  private final vn.edu.husc.researchhub.repository.ApprovedTopicRepository approvedTopicRepository;
  private final vn.edu.husc.researchhub.repository.YearSessionRepository yearSessionRepository;

  @Override
  public PageResponse<TopicResponse> getAllTopics(
      String keyword,
      TopicStatus status,
      Integer departmentId,
      Integer academicYearId,
      int page,
      int size) {
    Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

    Page<Topic> topicPage =
        topicRepository.search(departmentId, academicYearId, keyword, status, pageable);

    List<TopicResponse> content =
        topicPage.getContent().stream().map(this::mapToResponse).collect(Collectors.toList());

    return PageResponse.<TopicResponse>builder()
        .content(content)
        .page(topicPage.getNumber())
        .size(topicPage.getSize())
        .totalElements(topicPage.getTotalElements())
        .totalPages(topicPage.getTotalPages())
        .build();
  }

  @Override
  public TopicResponse getTopicDetail(Integer id) {
    Topic topic =
        topicRepository
            .findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đề tài"));
    return mapToResponse(topic);
  }

  @Override
  @Transactional
  public void updateTopicStatus(Integer id, TopicStatus status, String feedback) {
    Topic topic =
        topicRepository
            .findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đề tài"));
    topic.setStatus(status);

    if ((status == TopicStatus.NEEDS_UPDATE || status == TopicStatus.REJECTED)
        && feedback != null
        && !feedback.isEmpty()) {
      String currentNote = topic.getNote() != null ? topic.getNote() : "";
      String prefix =
          status == TopicStatus.NEEDS_UPDATE ? "[Yêu cầu bổ sung]: " : "[Lý do từ chối]: ";
      topic.setNote(currentNote + "\n" + prefix + feedback);
    }

    topicRepository.save(topic);

    // Create ApprovedTopic if status is APPROVED and it doesn't exist
    // Validation: When Approving a Topic
    if (status == TopicStatus.APPROVED) {
      List<TopicMember> allMembers = topicMemberRepository.findByTopicId(id);

      // 1. Check if all members are processed
      boolean hasPendingMembers =
          allMembers.stream().anyMatch(m -> m.getStatus() == MemberStatus.PENDING);
      if (hasPendingMembers) {
        throw new RuntimeException(
            "Không thể duyệt đề tài vì còn thành viên chưa được Duyệt hoặc Từ chối.");
      }

      // 2. Check for Leader
      boolean hasLeader =
          allMembers.stream()
              .anyMatch(
                  m ->
                      m.getRole() == TopicMemberRole.LEADER
                          && m.getStatus() == MemberStatus.APPROVED);
      if (!hasLeader) {
        throw new RuntimeException("Đề tài phải có Sinh viên chủ nhiệm.");
      }

      // 3. Check for Advisor
      boolean hasAdvisor =
          allMembers.stream()
              .anyMatch(
                  m ->
                      m.getRole() == TopicMemberRole.ADVISOR
                          && m.getStatus() == MemberStatus.APPROVED);
      if (!hasAdvisor) {
        throw new RuntimeException("Đề tài phải có Giảng viên hướng dẫn.");
      }

      if (!approvedTopicRepository.existsByTopicId(id)) {
        vn.edu.husc.researchhub.model.ApprovedTopic approvedTopic =
            new vn.edu.husc.researchhub.model.ApprovedTopic();
        approvedTopic.setTopic(topic);
        approvedTopic.setStatus(
            vn.edu.husc.researchhub.model.enums.ApprovedTopicStatus.IN_PROGRESS);
        approvedTopicRepository.save(approvedTopic);
      }
    }
  }

  @Override
  @Transactional
  public void updateTopic(
      Integer id, vn.edu.husc.researchhub.dto.request.UpdateTopicRequest request) {
    Topic topic =
        topicRepository
            .findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đề tài"));

    topic.setName(request.getName());
    topic.setDescription(request.getDescription());
    topic.setTarget(request.getTarget());
    topic.setMainContent(request.getMainContent());
    topic.setBudget(request.getBudget());
    topic.setNote(request.getNote());
    Topic saved = topicRepository.save(topic);

    // Sync with ApprovedTopic if exists
    java.util.Optional<vn.edu.husc.researchhub.model.ApprovedTopic> approvedTopicOpt =
        approvedTopicRepository.findByTopicId(id);
    if (approvedTopicOpt.isPresent()) {
      vn.edu.husc.researchhub.model.ApprovedTopic approvedTopic = approvedTopicOpt.get();
      approvedTopic.setFieldResearch(request.getResearchField());
      approvedTopic.setTypeResearch(request.getResearchType());
      approvedTopicRepository.save(approvedTopic);
    }
  }

  @Override
  @Transactional
  public void assignAdvisor(Integer topicId, Integer teacherId) {
    Topic topic =
        topicRepository
            .findById(topicId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đề tài"));

    if (teacherId != null) {
      // Validation removed: Advisor limit relaxed per user request

      User teacher =
          userRepository
              .findById(teacherId)
              .orElseThrow(() -> new RuntimeException("Không tìm thấy giảng viên"));

      // Remove existing advisor
      List<TopicMember> members = topicMemberRepository.findByTopicId(topicId);
      members.stream()
          .filter(m -> m.getRole() == TopicMemberRole.ADVISOR)
          .forEach(topicMemberRepository::delete);

      TopicMember newAdvisor = new TopicMember();
      newAdvisor.setTopic(topic);
      newAdvisor.setUser(teacher);
      newAdvisor.setRole(TopicMemberRole.ADVISOR);
      newAdvisor.setStatus(MemberStatus.APPROVED);
      topicMemberRepository.save(newAdvisor);
    } else {
      // Remove existing advisor if teacherId is null (unassign)
      List<TopicMember> members = topicMemberRepository.findByTopicId(topicId);
      members.stream()
          .filter(m -> m.getRole() == TopicMemberRole.ADVISOR)
          .forEach(topicMemberRepository::delete);
    }
  }

  @Override
  @Transactional
  public void assignLeader(Integer topicId, Integer studentId) {
    Topic topic =
        topicRepository
            .findById(topicId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đề tài"));

    if (studentId != null) {
      // Validation removed: Student leader limit relaxed per user request

      User student =
          userRepository
              .findById(studentId)
              .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));

      // 1. Demote current leader to MEMBER (if any)
      List<TopicMember> members = topicMemberRepository.findByTopicId(topicId);
      members.stream()
          .filter(m -> m.getRole() == TopicMemberRole.LEADER)
          .forEach(
              m -> {
                m.setRole(TopicMemberRole.MEMBER);
                topicMemberRepository.save(m);
              });

      // 2. Promote target student to LEADER
      TopicMember targetMember =
          topicMemberRepository
              .findByTopicIdAndUserId(topicId, studentId)
              .orElseThrow(
                  () -> new RuntimeException("Sinh viên này chưa là thành viên của đề tài"));

      targetMember.setRole(TopicMemberRole.LEADER);
      targetMember.setStatus(MemberStatus.APPROVED); // Ensure they are approved
      topicMemberRepository.save(targetMember);

    } else {
      // Unassign logic: Demote current leader to MEMBER
      List<TopicMember> members = topicMemberRepository.findByTopicId(topicId);
      members.stream()
          .filter(m -> m.getRole() == TopicMemberRole.LEADER)
          .forEach(
              m -> {
                m.setRole(TopicMemberRole.MEMBER);
                topicMemberRepository.save(m);
              });
    }
  }

  @Override
  @Transactional
  public void approveMember(Integer topicId, Integer studentId) {
    TopicMember member =
        topicMemberRepository
            .findByTopicIdAndUserId(topicId, studentId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu thành viên"));

    // Validation removed: Student participation limit relaxed per user request

    member.setStatus(MemberStatus.APPROVED);
    topicMemberRepository.save(member);
  }

  @Override
  @Transactional
  public void rejectMember(Integer topicId, Integer studentId) {
    TopicMember member =
        topicMemberRepository
            .findByTopicIdAndUserId(topicId, studentId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu thành viên"));
    member.setStatus(MemberStatus.REJECTED);
    topicMemberRepository.save(member);
  }

  @Override
  @Transactional
  public void proposeTopic(vn.edu.husc.researchhub.dto.request.ProposeTopicRequest request) {
    // 1. Get Current User
    User currentUser = getCurrentUser();

    // 2. Validate Role and Set Context
    Integer departmentId;
    if (currentUser.getRole() == Role.STUDENT) {
      departmentId = currentUser.getDepartment().getId();
    } else if (currentUser.getRole() == Role.TEACHER) {
      departmentId = currentUser.getDepartment().getId();
    } else {
      throw new RuntimeException("Chỉ sinh viên và giảng viên mới có thể đăng ký đề tài");
    }

    // 3. Validate Session
    Integer academicYearId = request.getAcademicYearId();
    if (academicYearId == null) {
      throw new RuntimeException("Vui lòng chọn năm học");
    }

    vn.edu.husc.researchhub.model.YearSession session =
        yearSessionRepository
            .findByAcademicYearIdAndDepartmentId(academicYearId, departmentId)
            .orElseThrow(
                () ->
                    new RuntimeException("Không tìm thấy phiên làm việc cho khoa và năm học này"));

    if (session.getStatus()
        != vn.edu.husc.researchhub.model.enums.YearSessionStatus.ON_REGISTRATION) {
      throw new RuntimeException("Phiên đăng ký đã đóng");
    }

    // 4. Create Topic
    Topic topic = new Topic();
    topic.setName(request.getTitle());
    topic.setDescription(request.getDescription());
    topic.setTarget(request.getObjective());
    topic.setMainContent(request.getContent());
    topic.setBudget(
        request.getBudget() != null
            ? java.math.BigDecimal.valueOf(request.getBudget())
            : java.math.BigDecimal.ZERO);
    topic.setNote(request.getNote());
    topic.setStatus(TopicStatus.PENDING); // Proposals start pending
    topic.setAcademicYear(session.getAcademicYear());
    topic.setDepartment(currentUser.getDepartment());

    // Save Topic first to get ID
    topic = topicRepository.save(topic);

    // 5. Assign Members based on Role
    if (currentUser.getRole() == Role.STUDENT) {
      // Assign Leader (Current Student)
      TopicMember leader = new TopicMember();
      leader.setTopic(topic);
      leader.setUser(currentUser);
      leader.setRole(TopicMemberRole.LEADER);
      leader.setStatus(MemberStatus.APPROVED);
      topicMemberRepository.save(leader);

      // Assign Advisor (if requested)
      if (request.getAdvisorId() != null) {
        User advisor =
            userRepository
                .findById(request.getAdvisorId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giảng viên hướng dẫn"));

        TopicMember advisorMember = new TopicMember();
        advisorMember.setTopic(topic);
        advisorMember.setUser(advisor);
        advisorMember.setRole(TopicMemberRole.ADVISOR);
        advisorMember.setStatus(MemberStatus.PENDING); // Advisor needs to accept
        topicMemberRepository.save(advisorMember);
      }
    } else if (currentUser.getRole() == Role.TEACHER) {
      // Assign Advisor (Current Teacher) - Auto Approved
      TopicMember advisorMember = new TopicMember();
      advisorMember.setTopic(topic);
      advisorMember.setUser(currentUser);
      advisorMember.setRole(TopicMemberRole.ADVISOR);
      advisorMember.setStatus(MemberStatus.APPROVED);
      topicMemberRepository.save(advisorMember);

      // No Student Leader assigned yet
    }
  }

  @Override
  @Transactional
  public void registerTopic(Integer topicId) {
    // 1. Get Current Student
    User student = getCurrentUser();
    if (student.getRole() != Role.STUDENT) {
      throw new RuntimeException("Chỉ sinh viên mới có thể đăng ký tham gia đề tài");
    }

    Topic topic =
        topicRepository
            .findById(topicId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đề tài"));

    // 2. Validate Session
    Integer departmentId = topic.getDepartment().getId(); // Topic belongs to a department
    Integer academicYearId = topic.getAcademicYear().getId();

    vn.edu.husc.researchhub.model.YearSession session =
        yearSessionRepository
            .findByAcademicYearIdAndDepartmentId(academicYearId, departmentId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy phiên làm việc phù hợp"));

    if (session.getStatus()
        != vn.edu.husc.researchhub.model.enums.YearSessionStatus.ON_REGISTRATION) {
      throw new RuntimeException("Phiên đăng ký đã đóng");
    }

    // 3. Check existing registration
    boolean isMember =
        topicMemberRepository.findByTopicIdAndUserId(topicId, student.getId()).isPresent();
    if (isMember) {
      throw new RuntimeException("Bạn đã đăng ký tham gia đề tài này");
    }

    // 4. Create Member Request
    TopicMember member = new TopicMember();
    member.setTopic(topic);
    member.setUser(student);
    member.setRole(TopicMemberRole.MEMBER);
    member.setStatus(MemberStatus.PENDING);
    topicMemberRepository.save(member);
    topicMemberRepository.save(member);
  }

  @Override
  public List<TopicResponse> getMyTopics() {
    User student = getCurrentUser();
    List<TopicMember> memberships = topicMemberRepository.findByUserId(student.getId());

    return memberships.stream()
        .map(TopicMember::getTopic)
        .distinct()
        .map(this::mapToResponse)
        .collect(Collectors.toList());
  }

  // Helper to get current user from SecurityContext
  private User getCurrentUser() {
    String username =
        org.springframework.security.core.context.SecurityContextHolder.getContext()
            .getAuthentication()
            .getName();
    return userRepository
        .findByUsername(username)
        .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
  }

  private TopicResponse mapToResponse(Topic topic) {
    List<TopicMember> members = topicMemberRepository.findByTopicId(topic.getId());

    TopicMember advisor =
        members.stream()
            .filter(m -> m.getRole() == TopicMemberRole.ADVISOR)
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

    List<TopicResponse.MemberResponse> rejectedMembers =
        members.stream()
            .filter(m -> m.getStatus() == MemberStatus.REJECTED)
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
        .code(
            approvedTopicRepository
                .findByTopicId(topic.getId())
                .map(vn.edu.husc.researchhub.model.ApprovedTopic::getCode)
                .orElse(null))
        .prize(
            approvedTopicRepository
                .findByTopicId(topic.getId())
                .map(vn.edu.husc.researchhub.model.ApprovedTopic::getPrize)
                .orElse(null))
        .title(topic.getName())
        .shortDescription(topic.getDescription()) // Assuming description is short description
        .objective(topic.getTarget()) // Assuming target is objective
        .content(topic.getMainContent())
        .budget(topic.getBudget())
        .note(topic.getNote())
        .researchField(
            approvedTopicRepository
                .findByTopicId(topic.getId())
                .map(vn.edu.husc.researchhub.model.ApprovedTopic::getFieldResearch)
                .orElse(null))
        .researchType(
            approvedTopicRepository
                .findByTopicId(topic.getId())
                .map(vn.edu.husc.researchhub.model.ApprovedTopic::getTypeResearch)
                .orElse(null))
        .status(topic.getStatus())
        .approvedStatus(
            approvedTopicRepository
                .findByTopicId(topic.getId())
                .map(vn.edu.husc.researchhub.model.ApprovedTopic::getStatus)
                .orElse(null))
        .createdAt(topic.getCreatedAt())
        .sessionStatus(
            yearSessionRepository
                .findByAcademicYearIdAndDepartmentId(
                    topic.getAcademicYear().getId(), topic.getDepartment().getId())
                .map(vn.edu.husc.researchhub.model.YearSession::getStatus)
                .orElse(null))
        .advisorId(advisor != null ? advisor.getUser().getId() : null)
        .advisorName(advisor != null ? getFullNameWithDegree(advisor.getUser()) : null)
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
        .rejectedMembers(rejectedMembers)
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
                            getFullNameWithDegree(m.getUser()),
                            m.getUser().getEmail(),
                            m.getUser().getUsername(),
                            m.getUser().getPhoneNumber(),
                            m.getUser().getAvatarUrl()))
                .collect(Collectors.toList()))
        .build();
  }

  private String getFullNameWithDegree(User user) {
    if (user == null) return null;
    String fullName = user.getFullName();
    if (user.getAcademicDegree() != null && !user.getAcademicDegree().isEmpty()) {
      return user.getAcademicDegree() + " " + fullName;
    }
    return fullName;
  }
}
