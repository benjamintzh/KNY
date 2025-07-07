package com.kyn.controller;

import com.kyn.model.Comment;
import com.kyn.model.Forum;
import com.kyn.model.User;
import com.kyn.repository.CommentRepository;
import com.kyn.repository.ForumRepository;
import com.kyn.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class ApiTests {

    private MockMvc mockMvc;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ForumRepository forumRepository;

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserController userController;

    @InjectMocks
    private ForumController forumController;

    @InjectMocks
    private CommentController commentController;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();
        mockMvc = MockMvcBuilders
                .standaloneSetup(userController, forumController, commentController)
                .setValidator(validator)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        // Setup mock SecurityContext
        Authentication auth = new UsernamePasswordAuthenticationToken("test@example.com", null);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(securityContext);

        // Mock PasswordEncoder behavior
        when(passwordEncoder.encode(any(CharSequence.class))).thenReturn("$2a$10$exampleHash");
    }

    @Test
    public void testUserRegistrationSuccess() throws Exception {
        User user = new User("new@example.com", "New User", "$2a$10$exampleHash");
        when(userRepository.findById("new@example.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(user);

        MvcResult result = mockMvc.perform(post("/api/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"new@example.com\",\"name\":\"New User\",\"password\":\"password\"}"))
                .andExpect(status().isOk())
                .andReturn();

        System.out.println("Response: " + result.getResponse().getContentAsString());
        mockMvc.perform(post("/api/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"new@example.com\",\"name\":\"New User\",\"password\":\"password\"}"))
                .andExpect(jsonPath("$.email").value("new@example.com"))
                .andExpect(jsonPath("$.name").value("New User"));
    }

    @Test
    public void testUserRegistrationDuplicateEmail() throws Exception {
        User user = new User("test@example.com", "Test User", "$2a$10$exampleHash");
        when(userRepository.findById("test@example.com")).thenReturn(Optional.of(user));

        mockMvc.perform(post("/api/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"test@example.com\",\"name\":\"Test User\",\"password\":\"password\"}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$").value("User already exists"));
    }

    @Test
    public void testUserLoginSuccess() throws Exception {
        User user = new User("test@example.com", "Test User", "$2a$10$exampleHash");
        when(userRepository.findById("test@example.com")).thenReturn(Optional.of(user));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(new UsernamePasswordAuthenticationToken("test@example.com", null));

        mockMvc.perform(post("/api/user/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"test@example.com\",\"password\":\"password\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.name").value("Test User"));
    }

    @Test
    public void testUserLoginFailure() throws Exception {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new org.springframework.security.core.AuthenticationException("Invalid credentials") {});

        mockMvc.perform(post("/api/user/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"test@example.com\",\"password\":\"wrong\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$").value("Invalid email or password"));
    }

    @Test
    public void testGetAllForums() throws Exception {
        Forum forum = new Forum();
        forum.setId(1L);
        forum.setTitle("Test Forum");
        forum.setDescription("Description");
        forum.setCreatedBy("test@example.com");
        forum.setCreatedAt(LocalDateTime.now());

        when(forumRepository.findAll()).thenReturn(Arrays.asList(forum));

        mockMvc.perform(get("/api/forums")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Test Forum"));
    }

    @Test
    public void testGetForumByIdNotFound() throws Exception {
        when(forumRepository.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/forums/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Forum not found with ID: 1"));
    }

    @Test
    public void testCreateCommentSuccess() throws Exception {
        Forum forum = new Forum();
        forum.setId(1L);
        Comment comment = new Comment();
        comment.setId(1L);
        comment.setContent("Test comment");
        comment.setForum(forum);
        comment.setCreatedBy("test@example.com");
        comment.setCreatedAt(LocalDateTime.now());
        comment.setCreatedByName("Test User");

        when(forumRepository.findById(1L)).thenReturn(Optional.of(forum));
        when(commentRepository.save(any(Comment.class))).thenReturn(comment);
        when(userRepository.findById("test@example.com")).thenReturn(Optional.of(new User("test@example.com", "Test User", null)));

        mockMvc.perform(post("/api/comments/forum/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"content\":\"Test comment\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").value("Test comment"))
                .andExpect(jsonPath("$.createdByName").value("Test User"));
    }

    @Test
    public void testCreateCommentUnauthorized() throws Exception {
        Authentication anonymousAuth = new UsernamePasswordAuthenticationToken("anonymousUser", null);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(anonymousAuth);
        SecurityContextHolder.setContext(securityContext);

        mockMvc.perform(post("/api/comments/forum/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"content\":\"Test comment\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Not authenticated"));
    }
}