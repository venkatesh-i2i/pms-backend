package com.i2i.pms.pms.repository;

import com.i2i.pms.pms.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByIssueId(Long issueId);
    
    List<Comment> findByAuthorId(Long authorId);
    
    List<Comment> findByIssueIdAndAuthorId(Long issueId, Long authorId);
    
    List<Comment> findByParentCommentId(Long parentCommentId);
    
    List<Comment> findByParentCommentIdIsNull();
    
    List<Comment> findByIssueIdAndParentCommentIdIsNull(Long issueId);
    
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.issue.id = :issueId")
    Long countByIssueId(@Param("issueId") Long issueId);
    
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.author.id = :authorId")
    Long countByAuthorId(@Param("authorId") Long authorId);
    
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.parentComment.id = :parentCommentId")
    Long countByParentCommentId(@Param("parentCommentId") Long parentCommentId);
    
    @Query("SELECT c FROM Comment c WHERE c.issue.id = :issueId ORDER BY c.createdAt DESC")
    List<Comment> findRecentCommentsByIssue(@Param("issueId") Long issueId);
    
    @Query("SELECT c FROM Comment c WHERE c.author.id = :authorId ORDER BY c.createdAt DESC")
    List<Comment> findRecentCommentsByAuthor(@Param("authorId") Long authorId);
} 