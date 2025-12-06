package vn.edu.husc.researchhub.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileService {
    String storeFile(MultipartFile file, String subDir);
}
