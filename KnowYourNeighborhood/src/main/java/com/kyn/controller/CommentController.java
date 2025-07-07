package com.kyn.controller;

import com.kyn.model.Comment;
import com.kyn.model.Forum;
import com.kyn.repository.CommentRepository;
import com.kyn.repository.ForumRepository;
import com.kyn.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private static final Logger logger = LoggerFactory.getLogger(CommentController.class);

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private ForumRepository forumRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/forum/{forumId}")
    public ResponseEntity<List<Comment>> getCommentsByForumId(@PathVariable Long forumId) {
        logger.debug("Fetching comments for forum ID: {}", forumId);
        List<Comment> comments = commentRepository.findByForumIdOrderByCreatedAtAsc(forumId);
        comments = comments.stream().map(comment -> {
            userRepository.findById(comment.getCreatedBy()).ifPresent(user -> 
                comment.setCreatedByName(user.getName()));
            return comment;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/forum/{forumId}")
    public ResponseEntity<Comment> createComment(@PathVariable Long forumId, @Valid @RequestBody CommentRequest commentRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        logger.debug("POST /api/comments/forum/{} - Authentication: {}, Principal: {}, Request: {}", 
            forumId, auth != null ? auth.getName() : "none", 
            auth != null && auth.getPrincipal() != null ? auth.getPrincipal() : "none",
            commentRequest.getContent());
        if (auth == null || auth.getPrincipal() == null || "anonymousUser".equals(auth.getPrincipal())) {
            logger.warn("Unauthorized attempt to create comment for forum ID: {}", forumId);
            throw new SecurityException("Not authenticated");
        }

        Optional<Forum> forumOptional = forumRepository.findById(forumId);
        if (forumOptional.isPresent()) {
            Comment comment = new Comment();
            comment.setContent(commentRequest.getContent());
            comment.setForum(forumOptional.get());
            comment.setCreatedBy(auth.getName());
            comment.setCreatedAt(java.time.LocalDateTime.now());
            Comment savedComment = commentRepository.save(comment);
            userRepository.findById(auth.getName()).ifPresent(user -> 
                savedComment.setCreatedByName(user.getName()));
            logger.debug("Comment created for forum ID: {}, by user: {}", forumId, auth.getName());
            return ResponseEntity.ok(savedComment);
        } else {
            logger.warn("Forum not found with ID: {}", forumId);
            throw new ResourceNotFoundException("Forum not found with ID: " + forumId);
        }
    }

    // DTO for comment request
    public static class CommentRequest {
        @NotBlank(message = "Comment content cannot be empty")
        private String content;

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }
    }
}