package vn.edu.husc.researchhub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import vn.edu.husc.researchhub.model.enums.ApprovedTopicStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "approved_topic")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApprovedTopic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "topic_id", nullable = false, unique = true)
    private Topic topic;

    @Column(length = 50)
    private String code;

    private String prize;

    @Column(name = "field_research")
    private String fieldResearch;

    @Column(name = "type_research")
    private String typeResearch;

    @Enumerated(EnumType.STRING)
    private ApprovedTopicStatus status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
