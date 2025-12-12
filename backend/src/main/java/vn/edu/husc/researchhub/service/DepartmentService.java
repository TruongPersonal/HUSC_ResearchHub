package vn.edu.husc.researchhub.service;

import org.springframework.data.domain.Page;
import vn.edu.husc.researchhub.dto.request.DepartmentRequest;
import vn.edu.husc.researchhub.dto.response.DepartmentResponse;

/**
 * Service quản lý Khoa/Bộ môn.
 */
public interface DepartmentService {
  /**
   * Lấy danh sách khoa có phân trang.
   */
  Page<DepartmentResponse> getAll(String keyword, int page, int size);

  /**
   * Tạo mới khoa/bộ môn.
   */
  DepartmentResponse create(DepartmentRequest request);

  /**
   * Cập nhật thông tin khoa.
   */
  DepartmentResponse update(Integer id, DepartmentRequest request);

  /**
   * Lấy chi tiết khoa theo ID.
   */
  DepartmentResponse getById(Integer id);
}
