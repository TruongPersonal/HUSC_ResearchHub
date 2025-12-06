package vn.edu.husc.researchhub.service;

import org.springframework.data.domain.Page;
import vn.edu.husc.researchhub.dto.request.AnnouncementRequest;
import vn.edu.husc.researchhub.dto.response.AnnouncementResponse;

public interface AnnouncementService {
    Page<AnnouncementResponse> getAll(String keyword, int page, int size, Integer academicYearId, Integer departmentId, Boolean isSystem);
    AnnouncementResponse create(AnnouncementRequest request);
    AnnouncementResponse update(Integer id, AnnouncementRequest request);
    void delete(Integer id);
}
