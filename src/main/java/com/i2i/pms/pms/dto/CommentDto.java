package com.i2i.pms.pms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDto {

    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserDto author;
    private Long issueId;
    private Long parentCommentId;
    private List<CommentDto> replies;
    private Boolean isInternal;
    private Boolean isResolved;
    private Integer replyCount;
} 