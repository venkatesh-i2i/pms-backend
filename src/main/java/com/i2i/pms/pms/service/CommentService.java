package com.i2i.pms.pms.service;

import com.i2i.pms.pms.entity.Comment;

import java.util.List;
import java.util.Optional;

public interface CommentService {

    List<Comment> getCommentsByIssue(Long issueId);
    
    Optional<Comment> getCommentById(Long id);
    
    Comment createComment(Long issueId, Long authorId, Comment comment);
    
    Comment updateComment(Long id, Comment comment);
    
    void deleteComment(Long id);
    
    List<Comment> getCommentsByAuthor(Long authorId);
    
    List<Comment> getCommentsByIssueAndAuthor(Long issueId, Long authorId);
    
    List<Comment> getRepliesByComment(Long commentId);
    
    List<Comment> getTopLevelCommentsByIssue(Long issueId);
    
    Long getCommentCountByIssue(Long issueId);
    
    Long getCommentCountByAuthor(Long authorId);
    
    Long getReplyCountByComment(Long commentId);
    
    List<Comment> getRecentCommentsByIssue(Long issueId);
    
    List<Comment> getRecentCommentsByAuthor(Long authorId);
} 