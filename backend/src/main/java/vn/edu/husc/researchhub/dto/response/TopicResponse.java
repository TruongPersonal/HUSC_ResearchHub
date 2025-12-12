package vn.edu.husc.researchhub.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.husc.researchhub.model.enums.TopicStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopicResponse {
  private Integer id;
  private String code;
  private String prize;
  private String title;
  private String shortDescription;
  private String objective;
  private String content;
  private BigDecimal budget;
  private String note;
  private String researchField;
  private String researchType;
  private TopicStatus status;
  private vn.edu.husc.researchhub.model.enums.ApprovedTopicStatus approvedStatus;
  private vn.edu.husc.researchhub.model.enums.YearSessionStatus sessionStatus;
  private LocalDateTime createdAt;

  private Integer advisorId;
  private String advisorName;
  private String advisorUsername;
  private String advisorEmail;
  private String advisorPhone;
  private String advisorAvatar;

  private Integer studentLeaderId;
  private String studentLeaderName;
  private String studentLeaderEmail;
  private String studentLeaderPhone;
  private String studentLeaderAvatar;

  private List<MemberResponse> pendingMembers;
  private List<MemberResponse> approvedMembers;
  private List<MemberResponse> rejectedMembers;
  private List<MemberResponse> advisors;

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class MemberResponse {
    private Integer id;
    private String name;
    private String email;
    private String username;
    private String phone;
    private String avatar;
  }
}
