package com.i2i.pms.pms.controller;

import com.i2i.pms.pms.dto.CommentDto;
import com.i2i.pms.pms.dto.CreateCommentRequest;
import com.i2i.pms.pms.dto.CreateCommentSimpleRequest;
import com.i2i.pms.pms.entity.Comment;
import com.i2i.pms.pms.entity.Issue;
import com.i2i.pms.pms.entity.User;
import com.i2i.pms.pms.exception.ResourceNotFoundException;
import com.i2i.pms.pms.mapper.CommentMapper;
import com.i2i.pms.pms.repository.IssueRepository;
import com.i2i.pms.pms.repository.UserRepository;
import com.i2i.pms.pms.service.AuthService;
import com.i2i.pms.pms.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private CommentMapper commentMapper;

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IssueRepository issueRepository;

    // Create comment - POST /api/comments with { taskId, content }
    @PostMapping("/api/comments")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<CommentDto> createCommentSimple(
            @RequestHeader("Authorization") String authorization,
            @Valid @RequestBody CreateCommentSimpleRequest request) {
        // Extract token
        String token = authorization;
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        Long userId = authService.getUserIdFromToken(token);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        User author = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId.toString()));

        Issue issue = issueRepository.findById(request.getTaskId())
                .orElseThrow(() -> new ResourceNotFoundException("Issue", "id", request.getTaskId().toString()));

        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setAuthor(author);
        comment.setIssue(issue);

        Comment saved = commentService.createComment(issue.getId(), author.getId(), comment);
        CommentDto dto = commentMapper.toDto(saved);
        return ResponseEntity.created(URI.create("/api/comments/" + saved.getId())).body(dto);
    }

    // Get comments by issue - matches API /api/issues/{issueId}/comments
    @GetMapping("/api/issues/{issueId}/comments")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<List<CommentDto>> getCommentsByIssue(@PathVariable Long issueId) {
        List<Comment> comments = commentService.getCommentsByIssue(issueId);
        List<CommentDto> commentDtos = commentMapper.toDtoList(comments);
        return ResponseEntity.ok(commentDtos);
    }

    // Get top-level comments by issue
    @GetMapping("/issue/{issueId}/top-level")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<List<CommentDto>> getTopLevelCommentsByIssue(@PathVariable Long issueId) {
        List<Comment> comments = commentService.getTopLevelCommentsByIssue(issueId);
        List<CommentDto> commentDtos = commentMapper.toDtoList(comments);
        return ResponseEntity.ok(commentDtos);
    }

    // Get comment by ID
    @GetMapping("/api/comments/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<CommentDto> getCommentById(@PathVariable Long id) {
        Optional<Comment> comment = commentService.getCommentById(id);
        return comment.map(commentMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create comment via issue resource
    @PostMapping("/api/issues/{issueId}/comments")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<CommentDto> createComment(
            @PathVariable Long issueId,
            @RequestParam Long authorId,
            @Valid @RequestBody CreateCommentRequest createCommentRequest) {
        Comment comment = new Comment();
        comment.setContent(createCommentRequest.getContent());
        comment.setIsInternal(createCommentRequest.getIsInternal());
        
        if (createCommentRequest.getParentCommentId() != null) {
            Comment parentComment = new Comment();
            parentComment.setId(createCommentRequest.getParentCommentId());
            comment.setParentComment(parentComment);
        }
        
        Comment savedComment = commentService.createComment(issueId, authorId, comment);
        CommentDto commentDto = commentMapper.toDto(savedComment);
        return ResponseEntity.ok(commentDto);
    }

    // Update comment
    @PutMapping("/api/comments/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<CommentDto> updateComment(
            @PathVariable Long id,
            @Valid @RequestBody CreateCommentRequest updateCommentRequest) {
        Comment comment = commentService.getCommentById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", id.toString()));
        
        comment.setContent(updateCommentRequest.getContent());
        comment.setIsInternal(updateCommentRequest.getIsInternal());
        
        Comment updatedComment = commentService.updateComment(id, comment);
        CommentDto commentDto = commentMapper.toDto(updatedComment);
        return ResponseEntity.ok(commentDto);
    }

    // Delete comment
    @DeleteMapping("/api/comments/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.ok().build();
    }

    // Get comments by author
    @GetMapping("/api/comments/author/{authorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<List<CommentDto>> getCommentsByAuthor(@PathVariable Long authorId) {
        List<Comment> comments = commentService.getCommentsByAuthor(authorId);
        List<CommentDto> commentDtos = commentMapper.toDtoList(comments);
        return ResponseEntity.ok(commentDtos);
    }

    // Get comments by issue and author
    @GetMapping("/api/comments/issue/{issueId}/author/{authorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<List<CommentDto>> getCommentsByIssueAndAuthor(
            @PathVariable Long issueId, 
            @PathVariable Long authorId) {
        List<Comment> comments = commentService.getCommentsByIssueAndAuthor(issueId, authorId);
        List<CommentDto> commentDtos = commentMapper.toDtoList(comments);
        return ResponseEntity.ok(commentDtos);
    }

    // Get replies by comment
    @GetMapping("/api/comments/{commentId}/replies")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<List<CommentDto>> getRepliesByComment(@PathVariable Long commentId) {
        List<Comment> replies = commentService.getRepliesByComment(commentId);
        List<CommentDto> replyDtos = commentMapper.toDtoList(replies);
        return ResponseEntity.ok(replyDtos);
    }

    // Get comment count by issue
    @GetMapping("/api/comments/issue/{issueId}/count")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<Long> getCommentCountByIssue(@PathVariable Long issueId) {
        Long count = commentService.getCommentCountByIssue(issueId);
        return ResponseEntity.ok(count);
    }

    // Get comment count by author
    @GetMapping("/api/comments/author/{authorId}/count")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<Long> getCommentCountByAuthor(@PathVariable Long authorId) {
        Long count = commentService.getCommentCountByAuthor(authorId);
        return ResponseEntity.ok(count);
    }

    // Get reply count by comment
    @GetMapping("/api/comments/{commentId}/reply-count")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<Long> getReplyCountByComment(@PathVariable Long commentId) {
        Long count = commentService.getReplyCountByComment(commentId);
        return ResponseEntity.ok(count);
    }

    // Get recent comments by issue
    @GetMapping("/api/comments/issue/{issueId}/recent")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<List<CommentDto>> getRecentCommentsByIssue(@PathVariable Long issueId) {
        List<Comment> comments = commentService.getRecentCommentsByIssue(issueId);
        List<CommentDto> commentDtos = commentMapper.toDtoList(comments);
        return ResponseEntity.ok(commentDtos);
    }

    // Get recent comments by author
    @GetMapping("/api/comments/author/{authorId}/recent")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<List<CommentDto>> getRecentCommentsByAuthor(@PathVariable Long authorId) {
        List<Comment> comments = commentService.getRecentCommentsByAuthor(authorId);
        List<CommentDto> commentDtos = commentMapper.toDtoList(comments);
        return ResponseEntity.ok(commentDtos);
    }
} 