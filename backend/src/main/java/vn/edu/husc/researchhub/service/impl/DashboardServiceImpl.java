package vn.edu.husc.researchhub.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.edu.husc.researchhub.dto.response.DashboardStatsResponse;
import vn.edu.husc.researchhub.repository.AcademicYearRepository;
import vn.edu.husc.researchhub.repository.DepartmentRepository;
import vn.edu.husc.researchhub.repository.UserRepository;
import vn.edu.husc.researchhub.service.DashboardService;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

  private final UserRepository userRepository;
  private final AcademicYearRepository academicYearRepository;
  private final DepartmentRepository departmentRepository;
  private final vn.edu.husc.researchhub.repository.AnnouncementRepository announcementRepository;
  private final vn.edu.husc.researchhub.repository.TopicRepository topicRepository;
  private final vn.edu.husc.researchhub.repository.ApprovedTopicRepository approvedTopicRepository;

  @Override
  public DashboardStatsResponse getStats(Integer academicYearId) {
    long users = userRepository.count();
    long years = academicYearRepository.count();
    long faculties = departmentRepository.count();

    String currentYear = "Tất cả";
    if (academicYearId != null) {
      currentYear =
          academicYearRepository
              .findById(academicYearId)
              .map(ay -> ay.getYear().toString())
              .orElse("Không xác định");
    } else {
      // If no year selected, maybe show "All" or keep existing behavior?
      // The user said "based on the year admin selected".
      // If admin selects nothing (all years?), usually we might show "Tất cả" or similar.
      // But let's stick to what I did for Assistant: if id is present, show it.
      // If not present, maybe show "Tất cả" or the latest?
      // Let's assume if academicYearId is null, it means "All years" context, but usually the
      // frontend sends a year.
      // Let's look at the frontend hook `useAdminStats`. It sends `selectedYear.id`.
      // So if selectedYear is null, it might return.
    }

    // Actually, let's just use the same logic as getAssistantStats for consistency if ID is
    // provided.
    if (academicYearId != null) {
      currentYear =
          academicYearRepository
              .findById(academicYearId)
              .map(ay -> ay.getYear().toString())
              .orElse("Không xác định");
    }

    return new DashboardStatsResponse(users, years, faculties, currentYear);
  }

  @Override
  public vn.edu.husc.researchhub.dto.response.AssistantDashboardStatsResponse getAssistantStats(
      Integer departmentId, Integer academicYearId) {
    if (departmentId == null || academicYearId == null) {
      return new vn.edu.husc.researchhub.dto.response.AssistantDashboardStatsResponse(
          0, 0, "Chưa chọn năm học", "Không xác định");
    }

    long registrationCount =
        topicRepository.countByDepartmentIdAndAcademicYearId(departmentId, academicYearId);
    long approvedTopicCount =
        approvedTopicRepository.countByTopicDepartmentIdAndTopicAcademicYearId(
            departmentId, academicYearId);

    var academicYear = academicYearRepository.findById(academicYearId).orElse(null);
    String currentYear =
        academicYear != null ? academicYear.getYear().toString() : "Không xác định";

    String status = "Không xác định";
    if (academicYear != null && academicYear.getStatus() != null) {
      status =
          switch (academicYear.getStatus()) {
            case START -> "Đang diễn ra";
            case END -> "Đã kết thúc";
          };
    }

    return new vn.edu.husc.researchhub.dto.response.AssistantDashboardStatsResponse(
        registrationCount, approvedTopicCount, currentYear, status);
  }
}
