package vn.edu.husc.researchhub.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.husc.researchhub.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
  Optional<User> findByUsername(String username);

  Boolean existsByUsername(String username);

  @org.springframework.data.jpa.repository.Query(
      "SELECT u FROM User u WHERE (:keyword IS NULL OR :keyword = '' OR LOWER(u.username) LIKE"
          + " LOWER(CONCAT('%', :keyword, '%')) OR LOWER(u.fullName) LIKE LOWER(CONCAT('%',"
          + " :keyword, '%'))) AND (:role IS NULL OR u.role = :role) AND (:departmentId IS NULL OR"
          + " u.department.id = :departmentId)")
  org.springframework.data.domain.Page<User> search(
      String keyword,
      vn.edu.husc.researchhub.model.Role role,
      Integer departmentId,
      org.springframework.data.domain.Pageable pageable);

  boolean existsByUsernameAndIdNot(String username, Integer id);

  boolean existsByDepartmentId(Integer departmentId);

  long countByDepartmentId(Integer departmentId);

  @org.springframework.data.jpa.repository.Query(
      "SELECT u FROM User u WHERE u.role = 'TEACHER' AND u.department.id = :departmentId")
  java.util.List<User> findEligibleSupervisors(
      @org.springframework.data.repository.query.Param("departmentId") Integer departmentId);

  // Search partners in the SAME department
  @org.springframework.data.jpa.repository.Query("SELECT u FROM User u WHERE u.department.id = :departmentId AND u.role IN :roles AND u.id <> :excludeId AND (LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :query, '%')))")
  java.util.List<User> searchChatPartners(
      @org.springframework.data.repository.query.Param("departmentId") Integer departmentId,
      @org.springframework.data.repository.query.Param("roles") java.util.List<vn.edu.husc.researchhub.model.Role> roles,
      @org.springframework.data.repository.query.Param("query") String query,
      @org.springframework.data.repository.query.Param("excludeId") Integer excludeId
  );

  // Search partners GLOBALLY (regardless of department)
  @org.springframework.data.jpa.repository.Query("SELECT u FROM User u WHERE u.role IN :roles AND u.id <> :excludeId AND (LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :query, '%')))")
  java.util.List<User> searchGlobalChatPartners(
      @org.springframework.data.repository.query.Param("roles") java.util.List<vn.edu.husc.researchhub.model.Role> roles,
      @org.springframework.data.repository.query.Param("query") String query,
      @org.springframework.data.repository.query.Param("excludeId") Integer excludeId
  );
}
