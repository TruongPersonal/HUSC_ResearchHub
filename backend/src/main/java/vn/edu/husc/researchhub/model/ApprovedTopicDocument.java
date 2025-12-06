package vn.edu.husc.researchhub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import vn.edu.husc.researchhub.model.enums.DocumentType;

import java.time.LocalDateTime;

@Entity
@Table(name = "approved_topic_document")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApprovedTopicDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "approved_topic_id", nullable = false)
    private ApprovedTopic approvedTopic;

    @Enumerated(EnumType.STRING)
    @Column(name = "document_type", nullable = false)
    private DocumentType documentType;

    @Column(name = "file_url", nullable = false, length = 500)
    private String fileUrl;

    @Column(name = "scientific_article_summary", columnDefinition = "TEXT")
    private String scientificArticleSummary;

    @CreationTimestamp
    @Column(name = "uploaded_at", updatable = false)
    private LocalDateTime uploadedAt;
}
