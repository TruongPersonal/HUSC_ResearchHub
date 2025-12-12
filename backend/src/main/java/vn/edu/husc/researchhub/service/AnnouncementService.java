package vn.edu.husc.researchhub.service;

import org.springframework.data.domain.Page;
import vn.edu.husc.researchhub.dto.request.AnnouncementRequest;
import vn.edu.husc.researchhub.dto.response.AnnouncementResponse;

/**
 * Service quản lý Thông báo.
 */
public interface AnnouncementService {
  /**
   * Lấy danh sách thông báo có phân trang.
   * Hỗ trợ lọc theo nhiều tiêu chí: từ khóa, năm học, khoa, loại thông báo.
   */
  Page<AnnouncementResponse> getAll(
      String keyword,
      int page,
      int size,
      Integer academicYearId,
      Integer departmentId,
      Boolean isSystem);

  /**
   * Tạo thông báo mới.
   */
  AnnouncementResponse create(AnnouncementRequest request);

  /**
   * Cập nhật thông báo.
   */
  AnnouncementResponse update(Integer id, AnnouncementRequest request);

  /**
   * Xóa thông báo.
   */
  void delete(Integer id);
}
