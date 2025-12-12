package vn.edu.husc.researchhub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.husc.researchhub.model.Message;
import vn.edu.husc.researchhub.model.User;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Integer> {
    List<Message> findByReceiverOrderByCreatedAtDesc(User receiver);
    List<Message> findBySenderOrderByCreatedAtDesc(User sender);
}
