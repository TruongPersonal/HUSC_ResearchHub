package vn.edu.husc.researchhub.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateTopicRequest {
    private String name;
    private String description;
    private String target;
    private String mainContent;
    private BigDecimal budget;
    private String note;
    private String researchField;
    private String researchType;
}
