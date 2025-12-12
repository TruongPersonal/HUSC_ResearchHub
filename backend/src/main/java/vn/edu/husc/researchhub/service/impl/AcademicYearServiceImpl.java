package vn.edu.husc.researchhub.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import vn.edu.husc.researchhub.dto.request.AcademicYearRequest;
import vn.edu.husc.researchhub.dto.response.AcademicYearResponse;
import vn.edu.husc.researchhub.model.AcademicYear;
import vn.edu.husc.researchhub.repository.AcademicYearRepository;
import vn.edu.husc.researchhub.service.AcademicYearService;

@Service
@RequiredArgsConstructor
public class AcademicYearServiceImpl implements AcademicYearService {

  private final AcademicYearRepository academicYearRepository;
  private final vn.edu.husc.researchhub.repository.TopicRepository topicRepository;
  private final vn.edu.husc.researchhub.repository.YearSessionRepository yearSessionRepository;

  @Override
  public Page<AcademicYearResponse> getAllAcademicYears(
      String keyword, Boolean isActive, int page, int size) {
    Pageable pageable = PageRequest.of(page, size, Sort.by("year").descending());
    Page<AcademicYear> academicYearPage =
        academicYearRepository.search(keyword, isActive, pageable);
    return academicYearPage.map(this::mapToResponse);
  }

  @Override
  public AcademicYearResponse createAcademicYear(AcademicYearRequest request) {
    if (academicYearRepository.existsByYear(request.getYear())) {
      throw new RuntimeException("Năm học đã tồn tại: " + request.getYear());
    }

    AcademicYear academicYear = new AcademicYear();
    academicYear.setYear(request.getYear());
    academicYear.setStatus(request.getStatus());
    academicYear.setIsActive(request.getIsActive());

    AcademicYear savedYear = academicYearRepository.save(academicYear);
    return mapToResponse(savedYear);
  }

  @Override
  public AcademicYearResponse updateAcademicYear(Integer id, AcademicYearRequest request) {
    AcademicYear academicYear =
        academicYearRepository
            .findById(id)
            .orElseThrow(() -> new RuntimeException("Academic year not found with id: " + id));

    // Check if year is being changed and if it conflicts
    if (!academicYear.getYear().equals(request.getYear())
        && academicYearRepository.existsByYear(request.getYear())) {
      throw new RuntimeException("Năm học đã tồn tại: " + request.getYear());
    }

    if (request.getStatus() != null
        && request.getStatus() == vn.edu.husc.researchhub.model.enums.AcademicYearStatus.END) {
      // Validate all Year Sessions are COMPLETED
      java.util.List<vn.edu.husc.researchhub.model.YearSession> sessions =
          yearSessionRepository.findByAcademicYearId(id);

      boolean hasNonCompleted =
          sessions.stream()
              .anyMatch(
                  s ->
                      s.getStatus()
                          != vn.edu.husc.researchhub.model.enums.YearSessionStatus.COMPLETED);

      if (hasNonCompleted) {
        throw new RuntimeException(
            "Không thể kết thúc năm học vì chưa hoàn thành tất cả các phiên làm việc của các khoa");
      }
    }

    academicYear.setYear(request.getYear());
    academicYear.setStatus(request.getStatus());
    academicYear.setIsActive(request.getIsActive());

    AcademicYear updatedYear = academicYearRepository.save(academicYear);
    return mapToResponse(updatedYear);
  }

  @Override
  public AcademicYearResponse getAcademicYearById(Integer id) {
    AcademicYear academicYear =
        academicYearRepository
            .findById(id)
            .orElseThrow(() -> new RuntimeException("Academic year not found with id: " + id));
    return mapToResponse(academicYear);
  }

  private AcademicYearResponse mapToResponse(AcademicYear academicYear) {
    AcademicYearResponse response = new AcademicYearResponse();
    response.setId(academicYear.getId());
    response.setYear(academicYear.getYear());
    response.setStatus(academicYear.getStatus());
    response.setIsActive(academicYear.getIsActive());
    response.setTopicCount(topicRepository.countByAcademicYearId(academicYear.getId()));
    return response;
  }
}
