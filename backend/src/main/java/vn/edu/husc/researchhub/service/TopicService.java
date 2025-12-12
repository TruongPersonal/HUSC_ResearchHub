package vn.edu.husc.researchhub.service;

import vn.edu.husc.researchhub.dto.response.PageResponse;
import vn.edu.husc.researchhub.dto.response.TopicResponse;
import vn.edu.husc.researchhub.model.enums.TopicStatus;

/**
 * Service quản lý quy trình đăng ký Đề tài.
 * Xử lý luồng đăng ký, duyệt, phân công giảng viên, sinh viên.
 */
public interface TopicService {
  /**
   * Lấy danh sách đề tài (đang đăng ký/chờ duyệt) có phân trang.
   */
  PageResponse<TopicResponse> getAllTopics(
      String keyword,
      TopicStatus status,
      Integer departmentId,
      Integer academicYearId,
      int page,
      int size);

  /**
   * Lấy chi tiết đề tài.
   */
  TopicResponse getTopicDetail(Integer id);

  /**
   * Cập nhật trạng thái đề tài (Duyệt, Từ chối, Yêu cầu chỉnh sửa).
   */
  void updateTopicStatus(Integer id, TopicStatus status, String feedback);

  /**
   * Cập nhật thông tin đề tài.
   */
  void updateTopic(Integer id, vn.edu.husc.researchhub.dto.request.UpdateTopicRequest request);

  /**
   * Phân công Giảng viên hướng dẫn.
   */
  void assignAdvisor(Integer topicId, Integer teacherId);

  /**
   * Phân công Sinh viên chủ nhiệm (Leader).
   */
  void assignLeader(Integer topicId, Integer studentId);

  /**
   * Duyệt thành viên tham gia đề tài.
   */
  void approveMember(Integer topicId, Integer studentId);

  /**
   * Từ chối/Xóa thành viên khỏi đề tài.
   */
  void rejectMember(Integer topicId, Integer studentId);

  // Student Actions
  /**
   * Sinh viên đề xuất đề tài mới.
   */
  void proposeTopic(vn.edu.husc.researchhub.dto.request.ProposeTopicRequest request);

  /**
   * Sinh viên đăng ký tham gia đề tài.
   */
  void registerTopic(Integer topicId);

  /**
   * Lấy danh sách đề tài của tôi (sinh viên/giảng viên hiện tại).
   */
  java.util.List<TopicResponse> getMyTopics();
}
