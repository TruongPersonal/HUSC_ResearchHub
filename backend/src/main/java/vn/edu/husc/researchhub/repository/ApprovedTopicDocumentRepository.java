package vn.edu.husc.researchhub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.husc.researchhub.model.ApprovedTopicDocument;

import java.util.List;

@Repository
public interface ApprovedTopicDocumentRepository extends JpaRepository<ApprovedTopicDocument, Integer> {
    List<ApprovedTopicDocument> findByApprovedTopicId(Integer approvedTopicId);
}
