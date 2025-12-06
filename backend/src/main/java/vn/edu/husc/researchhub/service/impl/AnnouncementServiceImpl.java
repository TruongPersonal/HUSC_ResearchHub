package vn.edu.husc.researchhub.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import vn.edu.husc.researchhub.dto.request.AnnouncementRequest;
import vn.edu.husc.researchhub.dto.response.AnnouncementResponse;
import vn.edu.husc.researchhub.model.Announcement;
import vn.edu.husc.researchhub.model.Department;
import vn.edu.husc.researchhub.model.AcademicYear;
import vn.edu.husc.researchhub.repository.AcademicYearRepository;
import vn.edu.husc.researchhub.repository.AnnouncementRepository;
import vn.edu.husc.researchhub.repository.DepartmentRepository;
import vn.edu.husc.researchhub.service.AnnouncementService;

@Service
@RequiredArgsConstructor
public class AnnouncementServiceImpl implements AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final DepartmentRepository departmentRepository;
    private final AcademicYearRepository academicYearRepository;

    @Override
    public Page<AnnouncementResponse> getAll(String keyword, int page, int size, Integer academicYearId, Integer departmentId, Boolean isSystem) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("publishDatetime").descending());
        Page<Announcement> announcements = announcementRepository.search(keyword, academicYearId, departmentId, isSystem, pageable);
        return announcements.map(this::mapToResponse);
    }

    @Override
    public AnnouncementResponse create(AnnouncementRequest request) {
        Announcement announcement = new Announcement();
        announcement.setTitle(request.getTitle());
        announcement.setContent(request.getContent());
        
        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa với ID: " + request.getDepartmentId()));
            announcement.setDepartment(department);
        }

        if (request.getAcademicYearId() != null) {
            AcademicYear academicYear = academicYearRepository.findById(request.getAcademicYearId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy năm học với ID: " + request.getAcademicYearId()));
            announcement.setAcademicYear(academicYear);
        }

        Announcement savedAnnouncement = announcementRepository.save(announcement);
        return mapToResponse(savedAnnouncement);
    }

    @Override
    public AnnouncementResponse update(Integer id, AnnouncementRequest request) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông báo với ID: " + id));

        announcement.setTitle(request.getTitle());
        announcement.setContent(request.getContent());
        
        if (request.getDepartmentId() != null) {
             Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa với ID: " + request.getDepartmentId()));
            announcement.setDepartment(department);
        } else {
            announcement.setDepartment(null);
        }

        if (request.getAcademicYearId() != null) {
            AcademicYear academicYear = academicYearRepository.findById(request.getAcademicYearId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy năm học với ID: " + request.getAcademicYearId()));
            announcement.setAcademicYear(academicYear);
        } else {
            announcement.setAcademicYear(null);
        }

        Announcement updatedAnnouncement = announcementRepository.save(announcement);
        return mapToResponse(updatedAnnouncement);
    }

    @Override
    public void delete(Integer id) {
        if (!announcementRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy thông báo với ID: " + id);
        }
        announcementRepository.deleteById(id);
    }

    private AnnouncementResponse mapToResponse(Announcement announcement) {
        AnnouncementResponse response = new AnnouncementResponse();
        response.setId(announcement.getId());
        response.setTitle(announcement.getTitle());
        response.setContent(announcement.getContent());
        response.setPublishDatetime(announcement.getPublishDatetime());
        if (announcement.getDepartment() != null) {
            response.setDepartmentName(announcement.getDepartment().getName());
        }
        return response;
    }
}
