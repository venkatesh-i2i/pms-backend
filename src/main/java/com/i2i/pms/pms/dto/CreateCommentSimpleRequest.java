package com.i2i.pms.pms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateCommentSimpleRequest {
    @NotNull(message = "taskId is required")
    private Long taskId;

    @NotBlank(message = "content is required")
    @Size(max = 10000, message = "content cannot exceed 10000 characters")
    private String content;
}
