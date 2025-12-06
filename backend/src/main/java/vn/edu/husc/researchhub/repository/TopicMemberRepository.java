package vn.edu.husc.researchhub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.edu.husc.researchhub.model.TopicMember;
import vn.edu.husc.researchhub.model.enums.MemberStatus;
import vn.edu.husc.researchhub.model.enums.TopicMemberRole;

import java.util.List;
import java.util.Optional;

@Repository
public interface TopicMemberRepository extends JpaRepository<TopicMember, Integer> {
    List<TopicMember> findByTopicId(Integer topicId);
    List<TopicMember> findByTopicIdAndStatus(Integer topicId, MemberStatus status);
    Optional<TopicMember> findByTopicIdAndUserId(Integer topicId, Integer userId);
    List<TopicMember> findByUserId(Integer userId);

    // Queries for checking user participation
    @Query("SELECT COUNT(tm) FROM TopicMember tm JOIN tm.topic t " +
           "WHERE tm.user.id = :userId " +
           "AND tm.role = :role " +
           "AND tm.status = 'APPROVED' " +
           "AND t.academicYear.id = :academicYearId")
    long countByUserIdAndRoleAndAcademicYear(@Param("userId") Integer userId,
                                            @Param("role") TopicMemberRole role,
                                            @Param("academicYearId") Integer academicYearId);

    @Query("SELECT COUNT(tm) FROM TopicMember tm JOIN tm.topic t " +
           "WHERE tm.user.id = :userId " +
           "AND tm.status = 'APPROVED' " +
           "AND t.academicYear.id = :academicYearId")
    long countByUserIdAndAcademicYear(@Param("userId") Integer userId,
                                     @Param("academicYearId") Integer academicYearId);
}
