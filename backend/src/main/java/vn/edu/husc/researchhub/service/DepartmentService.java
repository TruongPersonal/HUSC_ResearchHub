package vn.edu.husc.researchhub.service;

import org.springframework.data.domain.Page;
import vn.edu.husc.researchhub.dto.request.DepartmentRequest;
import vn.edu.husc.researchhub.dto.response.DepartmentResponse;

public interface DepartmentService {
    Page<DepartmentResponse> getAll(String keyword, int page, int size);
    DepartmentResponse create(DepartmentRequest request);
    DepartmentResponse update(Integer id, DepartmentRequest request);
    DepartmentResponse getById(Integer id);
}
