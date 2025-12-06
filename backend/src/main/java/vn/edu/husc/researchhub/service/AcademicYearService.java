package vn.edu.husc.researchhub.service;

import org.springframework.data.domain.Page;
import vn.edu.husc.researchhub.dto.request.AcademicYearRequest;
import vn.edu.husc.researchhub.dto.response.AcademicYearResponse;

public interface AcademicYearService {
    Page<AcademicYearResponse> getAllAcademicYears(String keyword, Boolean isActive, int page, int size);
    AcademicYearResponse createAcademicYear(AcademicYearRequest request);
    AcademicYearResponse updateAcademicYear(Integer id, AcademicYearRequest request);
    AcademicYearResponse getAcademicYearById(Integer id);
}
