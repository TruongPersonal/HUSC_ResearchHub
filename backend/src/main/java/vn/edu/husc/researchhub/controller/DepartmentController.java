package vn.edu.husc.researchhub.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.husc.researchhub.dto.request.DepartmentRequest;
import vn.edu.husc.researchhub.dto.response.DepartmentResponse;
import vn.edu.husc.researchhub.service.DepartmentService;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

  private final DepartmentService departmentService;

  /**
   * Lấy danh sách Khoa/Bộ môn.
   * Hỗ trợ tìm kiếm theo tên.
   */
  @GetMapping
  public ResponseEntity<Page<DepartmentResponse>> getAll(
      @RequestParam(required = false) String keyword,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    return ResponseEntity.ok(departmentService.getAll(keyword, page, size));
  }

  /**
   * Lấy chi tiết Khoa theo ID.
   */
  @GetMapping("/{id}")
  public ResponseEntity<DepartmentResponse> getById(@PathVariable Integer id) {
    return ResponseEntity.ok(departmentService.getById(id));
  }

  /**
   * Tạo Khoa mới.
   */
  @PostMapping
  public ResponseEntity<DepartmentResponse> create(@Valid @RequestBody DepartmentRequest request) {
    return ResponseEntity.ok(departmentService.create(request));
  }

  /**
   * Cập nhật thông tin Khoa.
   */
  @PutMapping("/{id}")
  public ResponseEntity<DepartmentResponse> update(
      @PathVariable Integer id, @Valid @RequestBody DepartmentRequest request) {
    return ResponseEntity.ok(departmentService.update(id, request));
  }
}
