package vn.edu.husc.researchhub.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.husc.researchhub.dto.request.AcademicYearRequest;
import vn.edu.husc.researchhub.dto.response.AcademicYearResponse;
import vn.edu.husc.researchhub.service.AcademicYearService;

@RestController
@RequestMapping("/api/academic-years")
@RequiredArgsConstructor
public class AcademicYearController {

  private final AcademicYearService academicYearService;

  /**
   * Lấy danh sách năm học.
   * Hỗ trợ lọc theo từ khóa và trạng thái hoạt động.
   */
  @GetMapping
  public ResponseEntity<Page<AcademicYearResponse>> getAllAcademicYears(
      @RequestParam(required = false) String keyword,
      @RequestParam(required = false) Boolean isActive,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    return ResponseEntity.ok(
        academicYearService.getAllAcademicYears(keyword, isActive, page, size));
  }

  /**
   * Lấy chi tiết năm học theo ID.
   */
  @GetMapping("/{id}")
  public ResponseEntity<AcademicYearResponse> getAcademicYearById(@PathVariable Integer id) {
    return ResponseEntity.ok(academicYearService.getAcademicYearById(id));
  }

  /**
   * Tạo năm học mới.
   */
  @PostMapping
  public ResponseEntity<AcademicYearResponse> createAcademicYear(
      @RequestBody AcademicYearRequest request) {
    return ResponseEntity.ok(academicYearService.createAcademicYear(request));
  }

  /**
   * Cập nhật thông tin năm học.
   */
  @PutMapping("/{id}")
  public ResponseEntity<AcademicYearResponse> updateAcademicYear(
      @PathVariable Integer id, @RequestBody AcademicYearRequest request) {
    return ResponseEntity.ok(academicYearService.updateAcademicYear(id, request));
  }
}
