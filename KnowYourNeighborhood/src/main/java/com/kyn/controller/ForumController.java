package com.kyn.controller;

import com.kyn.model.Forum;
import com.kyn.repository.ForumRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class ForumController {

    private static final Logger logger = LoggerFactory.getLogger(ForumController.class);

    @Autowired
    private ForumRepository forumRepository;

    @GetMapping("/forums")
    public ResponseEntity<List<Forum>> getAllForums() {
        logger.debug("Fetching all forums");
        List<Forum> forums = forumRepository.findAll();
        return ResponseEntity.ok(forums);
    }

    @GetMapping("/forums/{id}")
    public ResponseEntity<Forum> getForumById(@PathVariable Long id) {
        logger.debug("Fetching forum with ID: {}", id);
        Optional<Forum> forumOptional = forumRepository.findById(id);
        if (forumOptional.isPresent()) {
            return ResponseEntity.ok(forumOptional.get());
        } else {
            logger.warn("Forum not found with ID: {}", id);
            throw new ResourceNotFoundException("Forum not found with ID: " + id);
        }
    }

    @PostMapping("/forums")
    public ResponseEntity<?> createForum(@RequestBody Forum forum) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        logger.debug("POST /api/forums - Authentication: {}, Principal: {}, Authorities: {}", 
            auth != null ? auth.getName() : "none", 
            auth != null && auth.getPrincipal() != null ? auth.getPrincipal() : "none",
            auth != null ? auth.getAuthorities() : "none");
        if (auth == null || auth.getPrincipal() == null || "anonymousUser".equals(auth.getPrincipal())) {
            logger.warn("Unauthorized attempt to create forum");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }
        forum.setCreatedBy(auth.getName());
        Forum savedForum = forumRepository.save(forum);
        logger.debug("Forum created: {}", savedForum.getTitle());
        return ResponseEntity.ok(savedForum);
    }

    @GetMapping("/community/feed")
    public ResponseEntity<List<Forum>> getCommunityFeed() {
        logger.debug("Fetching community feed");
        List<Forum> recentForums = forumRepository.findTop5ByOrderByIdDesc();
        return ResponseEntity.ok(recentForums);
    }
}