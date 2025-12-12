package vn.edu.husc.researchhub.service;

import org.springframework.data.domain.Page;
import vn.edu.husc.researchhub.dto.request.AcademicYearRequest;
import vn.edu.husc.researchhub.dto.response.AcademicYearResponse;

/**
 * Interface Service quản lý Năm học.
 * Cung cấp các thao tác CRUD và lấy dữ liệu năm học.
 */
public interface AcademicYearService {
  /**
   * Lấy danh sách năm học có phân trang và lọc theo từ khóa, trạng thái.
   */
  Page<AcademicYearResponse> getAllAcademicYears(
      String keyword, Boolean isActive, int page, int size);

  /**
   * Tạo mới một năm học.
   */
  AcademicYearResponse createAcademicYear(AcademicYearRequest request);

  /**
   * Cập nhật thông tin năm học.
   */
  AcademicYearResponse updateAcademicYear(Integer id, AcademicYearRequest request);

  /**
   * Lấy chi tiết năm học theo ID.
   */
  AcademicYearResponse getAcademicYearById(Integer id);
}
