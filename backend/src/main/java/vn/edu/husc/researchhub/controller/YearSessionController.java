package vn.edu.husc.researchhub.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.edu.husc.researchhub.dto.request.YearSessionRequest;
import vn.edu.husc.researchhub.dto.response.AnnouncementResponse;
import vn.edu.husc.researchhub.dto.response.PageResponse;
import vn.edu.husc.researchhub.dto.response.YearSessionResponse;
import vn.edu.husc.researchhub.model.AcademicYear;
import vn.edu.husc.researchhub.model.enums.AcademicYearStatus;
import vn.edu.husc.researchhub.repository.AcademicYearRepository;
import vn.edu.husc.researchhub.service.YearSessionService;

import java.util.List;

@RestController
@RequestMapping("/api/year-sessions")
@RequiredArgsConstructor
public class YearSessionController {

    private final YearSessionService yearSessionService;
    private final AcademicYearRepository academicYearRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT', 'STUDENT', 'TEACHER')")
    public ResponseEntity<PageResponse<YearSessionResponse>> getAll(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer departmentId,
            @RequestParam(required = false) vn.edu.husc.researchhub.model.enums.YearSessionStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<YearSessionResponse> result = yearSessionService.getAll(keyword, page, size, departmentId, status);
        return ResponseEntity.ok(PageResponse.of(result));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT')")
    public ResponseEntity<YearSessionResponse> create(@Valid @RequestBody YearSessionRequest request) {
        return ResponseEntity.ok(yearSessionService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT')")
    public ResponseEntity<YearSessionResponse> update(@PathVariable Integer id, @Valid @RequestBody YearSessionRequest request) {
        return ResponseEntity.ok(yearSessionService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        yearSessionService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/available-years")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT')")
    public ResponseEntity<List<AcademicYear>> getAvailableYears() {
        return ResponseEntity.ok(academicYearRepository.findByIsActiveTrueAndStatus(AcademicYearStatus.START));
    }
}
