package com.i2i.pms.pms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateCommentRequest {

    @NotBlank(message = "Comment content is required")
    @Size(max = 10000, message = "Comment content cannot exceed 10000 characters")
    private String content;

    private Long parentCommentId;
    private Boolean isInternal = false;
} 