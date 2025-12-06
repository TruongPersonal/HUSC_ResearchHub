package vn.edu.husc.researchhub.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AnnouncementResponse {
    private Integer id;
    private String title;
    private String content;
    private LocalDateTime publishDatetime;
    private String departmentName;
}
