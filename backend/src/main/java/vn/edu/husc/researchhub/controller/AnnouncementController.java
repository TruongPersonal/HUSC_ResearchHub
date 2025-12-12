package vn.edu.husc.researchhub.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import vn.edu.husc.researchhub.dto.request.AnnouncementRequest;
import vn.edu.husc.researchhub.dto.response.AnnouncementResponse;
import vn.edu.husc.researchhub.dto.response.PageResponse;
import vn.edu.husc.researchhub.service.AnnouncementService;

@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

  private final AnnouncementService announcementService;

  /**
   * Lấy danh sách thông báo có phân trang
   * Hỗ trợ lọc theo từ khóa, năm học, khoa và loại thông báo (hệ thống)
   */
  @GetMapping
  public ResponseEntity<PageResponse<AnnouncementResponse>> getAll(
      @RequestParam(required = false) String keyword,
      @RequestParam(required = false) Integer academicYearId,
      @RequestParam(required = false) Integer departmentId,
      @RequestParam(required = false) Boolean isSystem,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    Page<AnnouncementResponse> result =
        announcementService.getAll(keyword, page, size, academicYearId, departmentId, isSystem);
    return ResponseEntity.ok(PageResponse.of(result));
  }

  /**
   * Tạo thông báo mới
   */
  @PostMapping
  public ResponseEntity<AnnouncementResponse> create(
      @Valid @RequestBody AnnouncementRequest request) {
    return ResponseEntity.ok(announcementService.create(request));
  }

  /**
   * Cập nhật thông báo theo ID
   */
  @PutMapping("/{id}")
  public ResponseEntity<AnnouncementResponse> update(
      @PathVariable Integer id, @Valid @RequestBody AnnouncementRequest request) {
    return ResponseEntity.ok(announcementService.update(id, request));
  }

  /**
   * Xóa thông báo theo ID
   */
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Integer id) {
    announcementService.delete(id);
    return ResponseEntity.noContent().build();
  }
}
