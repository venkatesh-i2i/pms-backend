package com.i2i.pms.pms.service.impl;

import com.i2i.pms.pms.entity.Comment;
import com.i2i.pms.pms.entity.Issue;
import com.i2i.pms.pms.entity.User;
import com.i2i.pms.pms.exception.ResourceNotFoundException;
import com.i2i.pms.pms.repository.CommentRepository;
import com.i2i.pms.pms.repository.IssueRepository;
import com.i2i.pms.pms.repository.UserRepository;
import com.i2i.pms.pms.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<Comment> getCommentsByIssue(Long issueId) {
        return commentRepository.findByIssueId(issueId);
    }

    @Override
    public Optional<Comment> getCommentById(Long id) {
        return commentRepository.findById(id);
    }

    @Override
    public Comment createComment(Long issueId, Long authorId, Comment comment) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue", "id", issueId.toString()));

        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", authorId.toString()));

        comment.setIssue(issue);
        comment.setAuthor(author);

        // Set parent comment if provided
        if (comment.getParentComment() != null && comment.getParentComment().getId() != null) {
            Comment parentComment = commentRepository.findById(comment.getParentComment().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", comment.getParentComment().getId().toString()));
            comment.setParentComment(parentComment);
        }

        return commentRepository.save(comment);
    }

    @Override
    public Comment updateComment(Long id, Comment comment) {
        Comment existingComment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", id.toString()));

        existingComment.setContent(comment.getContent());
        existingComment.setIsInternal(comment.getIsInternal());
        existingComment.setIsResolved(comment.getIsResolved());

        return commentRepository.save(existingComment);
    }

    @Override
    public void deleteComment(Long id) {
        if (!commentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Comment", "id", id.toString());
        }
        commentRepository.deleteById(id);
    }

    @Override
    public List<Comment> getCommentsByAuthor(Long authorId) {
        return commentRepository.findByAuthorId(authorId);
    }

    @Override
    public List<Comment> getCommentsByIssueAndAuthor(Long issueId, Long authorId) {
        return commentRepository.findByIssueIdAndAuthorId(issueId, authorId);
    }

    @Override
    public List<Comment> getRepliesByComment(Long commentId) {
        return commentRepository.findByParentCommentId(commentId);
    }

    @Override
    public List<Comment> getTopLevelCommentsByIssue(Long issueId) {
        return commentRepository.findByIssueIdAndParentCommentIdIsNull(issueId);
    }

    @Override
    public Long getCommentCountByIssue(Long issueId) {
        return commentRepository.countByIssueId(issueId);
    }

    @Override
    public Long getCommentCountByAuthor(Long authorId) {
        return commentRepository.countByAuthorId(authorId);
    }

    @Override
    public Long getReplyCountByComment(Long commentId) {
        return commentRepository.countByParentCommentId(commentId);
    }

    @Override
    public List<Comment> getRecentCommentsByIssue(Long issueId) {
        return commentRepository.findRecentCommentsByIssue(issueId);
    }

    @Override
    public List<Comment> getRecentCommentsByAuthor(Long authorId) {
        return commentRepository.findRecentCommentsByAuthor(authorId);
    }
} 