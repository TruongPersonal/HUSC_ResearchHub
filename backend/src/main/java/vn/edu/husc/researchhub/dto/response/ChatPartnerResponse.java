package vn.edu.husc.researchhub.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatPartnerResponse {
    private Integer id;
    private String username;
    private String fullName; // To match frontend expectations
    private String avatarUrl;
    private String role;
}
