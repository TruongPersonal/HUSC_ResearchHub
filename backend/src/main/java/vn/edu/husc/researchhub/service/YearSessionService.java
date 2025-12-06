package vn.edu.husc.researchhub.service;

import org.springframework.data.domain.Page;
import vn.edu.husc.researchhub.dto.request.YearSessionRequest;
import vn.edu.husc.researchhub.dto.response.YearSessionResponse;

public interface YearSessionService {
    Page<YearSessionResponse> getAll(String keyword, int page, int size, Integer departmentId, vn.edu.husc.researchhub.model.enums.YearSessionStatus status);
    YearSessionResponse create(YearSessionRequest request);
    YearSessionResponse update(Integer id, YearSessionRequest request);
    void delete(Integer id);
}
