package vn.edu.husc.researchhub.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.husc.researchhub.model.enums.DocumentType;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApprovedTopicDocumentResponse {
    private Integer id;
    private DocumentType documentType;
    private String fileUrl;
    private String scientificArticleSummary;
    private LocalDateTime uploadedAt;
}
