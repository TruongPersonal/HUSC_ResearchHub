package vn.edu.husc.researchhub.service;

import vn.edu.husc.researchhub.dto.response.PageResponse;
import vn.edu.husc.researchhub.dto.response.TopicResponse;
import vn.edu.husc.researchhub.model.enums.TopicStatus;

public interface TopicService {
    PageResponse<TopicResponse> getAllTopics(String keyword, TopicStatus status, Integer departmentId, Integer academicYearId, int page, int size);
    TopicResponse getTopicDetail(Integer id);
    void updateTopicStatus(Integer id, TopicStatus status, String feedback);
    void updateTopic(Integer id, vn.edu.husc.researchhub.dto.request.UpdateTopicRequest request);
    void assignAdvisor(Integer topicId, Integer teacherId);
    void assignLeader(Integer topicId, Integer studentId);
    void approveMember(Integer topicId, Integer studentId);
    void rejectMember(Integer topicId, Integer studentId);
    
    // Student Actions
    void proposeTopic(vn.edu.husc.researchhub.dto.request.ProposeTopicRequest request);
    void registerTopic(Integer topicId);
    java.util.List<TopicResponse> getMyTopics();
}
