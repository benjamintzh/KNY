package com.kyn.repository;

import com.kyn.model.Forum;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ForumRepository extends JpaRepository<Forum, Long> {
    List<Forum> findTop5ByOrderByIdDesc();
    
    List<Forum> findAllByOrderByCreatedAtDesc();
}