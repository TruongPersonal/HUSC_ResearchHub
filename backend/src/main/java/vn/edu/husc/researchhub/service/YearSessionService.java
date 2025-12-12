package vn.edu.husc.researchhub.service;

import org.springframework.data.domain.Page;
import vn.edu.husc.researchhub.dto.request.YearSessionRequest;
import vn.edu.husc.researchhub.dto.response.YearSessionResponse;

/**
 * Service quản lý Đợt đăng ký đề tài.
 */
public interface YearSessionService {
  /**
   * Lấy danh sách đợt đăng ký có phân trang.
   */
  Page<YearSessionResponse> getAll(
      String keyword,
      int page,
      int size,
      Integer departmentId,
      vn.edu.husc.researchhub.model.enums.YearSessionStatus status);

  /**
   * Tạo đợt đăng ký mới.
   */
  YearSessionResponse create(YearSessionRequest request);

  /**
   * Cập nhật đợt đăng ký.
   */
  YearSessionResponse update(Integer id, YearSessionRequest request);

  /**
   * Xóa đợt đăng ký.
   */
  void delete(Integer id);
}
