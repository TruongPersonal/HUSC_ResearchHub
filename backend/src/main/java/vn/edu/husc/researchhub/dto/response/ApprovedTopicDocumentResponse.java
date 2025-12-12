package vn.edu.husc.researchhub.dto.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.husc.researchhub.model.enums.DocumentType;

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
