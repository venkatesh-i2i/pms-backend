package com.i2i.pms.pms.dto;

import com.i2i.pms.pms.entity.Issue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateIssueRequest {

    @NotBlank(message = "Summary is required")
    @Size(min = 2, max = 255, message = "Summary must be between 2 and 255 characters")
    private String summary;

    @Size(max = 10000, message = "Description cannot exceed 10000 characters")
    private String description;

    private Issue.IssueType issueType = Issue.IssueType.TASK;
    private Issue.Priority priority = Issue.Priority.MEDIUM;
    private LocalDateTime dueDate;
    private Integer estimatedTime; // in minutes
    private Long assigneeId;
    private Long projectId;
} 