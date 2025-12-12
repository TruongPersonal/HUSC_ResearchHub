package vn.edu.husc.researchhub.service;

import org.springframework.web.multipart.MultipartFile;

/**
 * Service xử lý File.
 * Quản lý việc lưu trữ file upload.
 */
public interface FileService {
  /**
   * Lưu file vào thư mục chỉ định.
   * @return Tên file sau khi lưu.
   */
  String storeFile(MultipartFile file, String subDir);
}
