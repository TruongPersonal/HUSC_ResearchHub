package vn.edu.husc.researchhub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.husc.researchhub.model.Topic;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Integer> {
    boolean existsByAcademicYearId(Integer academicYearId);
    long countByAcademicYearId(Integer academicYearId);
    long countByDepartmentIdAndAcademicYearId(Integer departmentId, Integer academicYearId);
    java.util.List<Topic> findByDepartmentIdAndAcademicYearId(Integer departmentId, Integer academicYearId);
    
    @org.springframework.data.jpa.repository.Query("SELECT t FROM Topic t WHERE " +
            "(:departmentId IS NULL OR t.department.id = :departmentId) AND " +
            "(:academicYearId IS NULL OR t.academicYear.id = :academicYearId) AND " +
            "(:keyword IS NULL OR :keyword = '' OR t.name LIKE %:keyword%) AND " +
            "(:status IS NULL OR t.status = :status)")
    org.springframework.data.domain.Page<Topic> search(
            @org.springframework.data.repository.query.Param("departmentId") Integer departmentId,
            @org.springframework.data.repository.query.Param("academicYearId") Integer academicYearId,
            @org.springframework.data.repository.query.Param("keyword") String keyword,
            @org.springframework.data.repository.query.Param("status") vn.edu.husc.researchhub.model.enums.TopicStatus status,
            org.springframework.data.domain.Pageable pageable
    );
}
