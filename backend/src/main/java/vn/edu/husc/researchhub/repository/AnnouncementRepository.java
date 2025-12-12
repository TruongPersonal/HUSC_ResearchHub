package vn.edu.husc.researchhub.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import vn.edu.husc.researchhub.model.Announcement;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Integer> {

  @Query(
      "SELECT a FROM Announcement a WHERE (:keyword IS NULL OR :keyword = '' OR a.title LIKE"
          + " %:keyword% OR a.content LIKE %:keyword%) AND (:academicYearId IS NULL OR"
          + " a.academicYear.id = :academicYearId) AND (:departmentId IS NULL OR a.department.id ="
          + " :departmentId) AND (:isSystem IS NULL OR (:isSystem = true AND a.department IS"
          + " NULL))")
  Page<Announcement> search(
      String keyword,
      Integer academicYearId,
      Integer departmentId,
      Boolean isSystem,
      Pageable pageable);
}
