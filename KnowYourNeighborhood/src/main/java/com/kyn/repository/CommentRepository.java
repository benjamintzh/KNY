package com.kyn.repository;

import com.kyn.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByForumIdOrderByCreatedAtAsc(Long forumId);
}