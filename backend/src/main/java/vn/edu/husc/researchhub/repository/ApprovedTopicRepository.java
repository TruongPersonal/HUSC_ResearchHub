package vn.edu.husc.researchhub.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.edu.husc.researchhub.model.ApprovedTopic;

public interface ApprovedTopicRepository extends JpaRepository<ApprovedTopic, Integer> {
  boolean existsByTopicId(Integer topicId);

  java.util.Optional<ApprovedTopic> findByTopicId(Integer topicId);

  long countByTopicDepartmentIdAndTopicAcademicYearId(Integer departmentId, Integer academicYearId);

  java.util.List<ApprovedTopic> findByTopicDepartmentIdAndTopicAcademicYearId(
      Integer departmentId, Integer academicYearId);

  @Query(
      "SELECT at FROM ApprovedTopic at JOIN at.topic t WHERE (:departmentId IS NULL OR"
          + " t.department.id = :departmentId) AND (:academicYearId IS NULL OR t.academicYear.id ="
          + " :academicYearId) AND (:keyword IS NULL OR :keyword = '' OR t.name LIKE %:keyword% OR"
          + " at.code LIKE %:keyword%) AND (:status IS NULL OR at.status = :status)")
  Page<ApprovedTopic> search(
      @Param("departmentId") Integer departmentId,
      @Param("academicYearId") Integer academicYearId,
      @Param("keyword") String keyword,
      @Param("status") vn.edu.husc.researchhub.model.enums.ApprovedTopicStatus status,
      Pageable pageable);
}
