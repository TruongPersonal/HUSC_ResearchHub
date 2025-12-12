package vn.edu.husc.researchhub.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import vn.edu.husc.researchhub.model.YearSession;

@Repository
public interface YearSessionRepository extends JpaRepository<YearSession, Integer> {

  @Query(
      "SELECT ys FROM YearSession ys WHERE (:departmentId IS NULL OR ys.department.id ="
          + " :departmentId) AND (:status IS NULL OR ys.status = :status) AND (:keyword IS NULL OR"
          + " :keyword = '' OR CAST(ys.year AS string) LIKE CONCAT('%', :keyword, '%'))")
  Page<YearSession> search(
      String keyword,
      Integer departmentId,
      vn.edu.husc.researchhub.model.enums.YearSessionStatus status,
      Pageable pageable);

  boolean existsByAcademicYearIdAndDepartmentId(Integer academicYearId, Integer departmentId);

  java.util.Optional<YearSession> findByAcademicYearIdAndDepartmentId(
      Integer academicYearId, Integer departmentId);

  java.util.List<YearSession> findByAcademicYearId(Integer academicYearId);
}
