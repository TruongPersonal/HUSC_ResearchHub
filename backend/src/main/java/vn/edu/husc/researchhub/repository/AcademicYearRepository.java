package vn.edu.husc.researchhub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.husc.researchhub.model.AcademicYear;

@Repository
public interface AcademicYearRepository extends JpaRepository<AcademicYear, Integer> {
  boolean existsByYear(Integer year);

  @org.springframework.data.jpa.repository.Query(
      "SELECT a FROM AcademicYear a WHERE (:keyword IS NULL OR :keyword = '' OR CAST(a.year AS"
          + " string) LIKE CONCAT('%', :keyword, '%')) AND (:isActive IS NULL OR a.isActive ="
          + " :isActive)")
  org.springframework.data.domain.Page<AcademicYear> search(
      @org.springframework.data.repository.query.Param("keyword") String keyword,
      @org.springframework.data.repository.query.Param("isActive") Boolean isActive,
      org.springframework.data.domain.Pageable pageable);

  java.util.Optional<AcademicYear> findByIsActiveTrue();

  java.util.Optional<AcademicYear> findTopByOrderByYearDesc();

  java.util.List<AcademicYear> findByIsActiveTrueAndStatus(
      vn.edu.husc.researchhub.model.enums.AcademicYearStatus status);
}
