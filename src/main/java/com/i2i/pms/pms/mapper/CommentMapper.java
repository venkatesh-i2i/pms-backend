package com.i2i.pms.pms.mapper;

import com.i2i.pms.pms.dto.CommentDto;
import com.i2i.pms.pms.dto.CreateCommentRequest;
import com.i2i.pms.pms.entity.Comment;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CommentMapper {

    public CommentDto toDto(Comment comment) {
        if (comment == null) {
            return null;
        }

        CommentDto dto = new CommentDto();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        dto.setIsInternal(comment.getIsInternal());
        dto.setIsResolved(comment.getIsResolved());
        
        // Set issue ID
        if (comment.getIssue() != null) {
            dto.setIssueId(comment.getIssue().getId());
        }
        
        // Set parent comment ID
        if (comment.getParentComment() != null) {
            dto.setParentCommentId(comment.getParentComment().getId());
        }
        
        // Note: author, replies, and replyCount are ignored as per original mapping
        return dto;
    }

    public List<CommentDto> toDtoList(List<Comment> comments) {
        if (comments == null) {
            return null;
        }
        return comments.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public Comment toEntity(CreateCommentRequest request) {
        if (request == null) {
            return null;
        }

        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setIsInternal(request.getIsInternal());
        
        // Note: id, issue, author, parentComment, replies, createdAt, updatedAt are ignored
        // These will be set by the service layer
        return comment;
    }

    public void updateCommentFromRequest(Comment comment, CreateCommentRequest request) {
        if (comment == null || request == null) {
            return;
        }

        comment.setContent(request.getContent());
        comment.setIsInternal(request.getIsInternal());
        
        // Note: Other fields are ignored as per original mapping
    }
} 