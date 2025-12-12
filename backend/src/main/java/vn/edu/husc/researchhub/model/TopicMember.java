package vn.edu.husc.researchhub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.husc.researchhub.model.enums.MemberStatus;
import vn.edu.husc.researchhub.model.enums.TopicMemberRole;

@Entity
@Table(
    name = "topic_member",
    uniqueConstraints = {@UniqueConstraint(columnNames = {"topic_id", "user_id"})})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopicMember {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @ManyToOne
  @JoinColumn(name = "topic_id", nullable = false)
  private Topic topic;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private TopicMemberRole role;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private MemberStatus status = MemberStatus.PENDING;
}
