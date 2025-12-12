package vn.edu.husc.researchhub.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import vn.edu.husc.researchhub.dto.request.YearSessionRequest;
import vn.edu.husc.researchhub.dto.response.YearSessionResponse;
import vn.edu.husc.researchhub.model.AcademicYear;
import vn.edu.husc.researchhub.model.Department;
import vn.edu.husc.researchhub.model.YearSession;
import vn.edu.husc.researchhub.model.enums.YearSessionStatus;
import vn.edu.husc.researchhub.repository.AcademicYearRepository;
import vn.edu.husc.researchhub.repository.DepartmentRepository;
import vn.edu.husc.researchhub.repository.YearSessionRepository;
import vn.edu.husc.researchhub.service.YearSessionService;

@Service
@RequiredArgsConstructor
public class YearSessionServiceImpl implements YearSessionService {

  private final YearSessionRepository yearSessionRepository;
  private final AcademicYearRepository academicYearRepository;
  private final DepartmentRepository departmentRepository;
  private final vn.edu.husc.researchhub.repository.ApprovedTopicRepository approvedTopicRepository;
  private final vn.edu.husc.researchhub.repository.TopicRepository topicRepository;

  @Override
  public Page<YearSessionResponse> getAll(
      String keyword, int page, int size, Integer departmentId, YearSessionStatus status) {
    Pageable pageable = PageRequest.of(page, size, Sort.by("year").descending());
    Page<YearSession> sessions =
        yearSessionRepository.search(keyword, departmentId, status, pageable);
    return sessions.map(this::mapToResponse);
  }

  @Override
  public YearSessionResponse create(YearSessionRequest request) {
    if (request.getAcademicYearId() == null) {
      throw new RuntimeException("Năm học không được để trống");
    }

    if (yearSessionRepository.existsByAcademicYearIdAndDepartmentId(
        request.getAcademicYearId(), request.getDepartmentId())) {
      throw new RuntimeException("Phiên năm học này đã tồn tại cho khoa của bạn");
    }

    AcademicYear academicYear =
        academicYearRepository
            .findById(request.getAcademicYearId())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy năm học"));

    Department department =
        departmentRepository
            .findById(request.getDepartmentId())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa"));

    YearSession session = new YearSession();
    session.setAcademicYear(academicYear);
    session.setDepartment(department);
    session.setYear(academicYear.getYear());
    session.setStatus(
        request.getStatus() != null ? request.getStatus() : YearSessionStatus.ON_REGISTRATION);

    return mapToResponse(yearSessionRepository.save(session));
  }

  @Override
  public YearSessionResponse update(Integer id, YearSessionRequest request) {
    YearSession session =
        yearSessionRepository
            .findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy phiên năm học"));

    if (session.getAcademicYear().getStatus() == vn.edu.husc.researchhub.model.enums.AcademicYearStatus.END) {
      throw new RuntimeException("Không thể cập nhật phiên năm học vì năm học này đã kết thúc.");
    }

    if (request.getStatus() != null) {
      // Validate if trying to COMPLETE session
      if (request.getStatus() == YearSessionStatus.COMPLETED) {
        // Check if all approved topics are Finalized (COMPLETED, CANCELED)
        // i.e., None are IN_PROGRESS or NOT_COMPLETED
        java.util.List<vn.edu.husc.researchhub.model.ApprovedTopic> approvedTopics =
            approvedTopicRepository.findByTopicDepartmentIdAndTopicAcademicYearId(
                session.getDepartment().getId(), session.getAcademicYear().getId());

        boolean hasInvalidStatus =
            approvedTopics.stream()
                .anyMatch(
                    at ->
                        at.getStatus()
                                == vn.edu.husc.researchhub.model.enums.ApprovedTopicStatus
                                    .IN_PROGRESS
                            || at.getStatus()
                                == vn.edu.husc.researchhub.model.enums.ApprovedTopicStatus
                                    .NOT_COMPLETED);

        if (hasInvalidStatus) {
          throw new RuntimeException(
              "Không thể hoàn thành phiên năm học vì còn đề tài chưa hoàn tất hoặc không hoàn"
                  + " thành.");
        }
      } else if (request.getStatus() == YearSessionStatus.IN_PROGRESS) {
        // Validate if trying to move to IN_PROGRESS
        // All topics must be APPROVED or REJECTED. (No PENDING, NEEDS_UPDATE)
        java.util.List<vn.edu.husc.researchhub.model.Topic> topics =
            topicRepository.findByDepartmentIdAndAcademicYearId(
                session.getDepartment().getId(), session.getAcademicYear().getId());

        boolean hasPending =
            topics.stream()
                .anyMatch(
                    t ->
                        t.getStatus() == vn.edu.husc.researchhub.model.enums.TopicStatus.PENDING
                            || t.getStatus()
                                == vn.edu.husc.researchhub.model.enums.TopicStatus.NEEDS_UPDATE);

        if (hasPending) {
          throw new RuntimeException(
              "Không thể chuyển sang trạng thái Đang thực hiện vì còn hồ sơ chưa được Duyệt hoặc Từ"
                  + " chối.");
        }
      }
      session.setStatus(request.getStatus());
    }

    // Note: We typically don't allow changing Academic Year or Department after creation
    // but if needed, logic can be added here. For now, only status update is requested.

    return mapToResponse(yearSessionRepository.save(session));
  }

  @Override
  public void delete(Integer id) {
    if (!yearSessionRepository.existsById(id)) {
      throw new RuntimeException("Không tìm thấy phiên năm học");
    }
    yearSessionRepository.deleteById(id);
  }

  private YearSessionResponse mapToResponse(YearSession session) {
    YearSessionResponse response = new YearSessionResponse();
    response.setId(session.getId());
    response.setYear(session.getYear());
    response.setDepartmentName(session.getDepartment().getName());
    response.setDepartmentId(session.getDepartment().getId());
    response.setStatus(session.getStatus());
    response.setAcademicYearId(session.getAcademicYear().getId());
    response.setAcademicYearStatus(session.getAcademicYear().getStatus());
    return response;
  }
}
