package vn.edu.husc.researchhub.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import vn.edu.husc.researchhub.model.Department;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Integer> {
    boolean existsByCode(String code);
    boolean existsByCodeAndIdNot(String code, Integer id);
    java.util.Optional<Department> findByName(String name);
    java.util.Optional<Department> findByCode(String code);

    @Query("SELECT d FROM Department d WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(d.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(d.code) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Department> search(String keyword, Pageable pageable);
}
