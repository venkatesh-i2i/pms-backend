package com.i2i.pms.pms.dto;

import com.i2i.pms.pms.entity.Issue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IssueDto {

    private Long id;

    @NotBlank(message = "Task key is required")
    @Size(min = 2, max = 20, message = "Task key must be between 2 and 20 characters")
    private String taskKey;

    @NotBlank(message = "Title is required")
    @Size(min = 2, max = 255, message = "Title must be between 2 and 255 characters")
    private String title;

    @Size(max = 10000, message = "Description cannot exceed 10000 characters")
    private String description;

    private Issue.IssueType issueType = Issue.IssueType.TASK;
    private Issue.Priority priority = Issue.Priority.MEDIUM;
    private Issue.Status status = Issue.Status.TODO;
    private Issue.Resolution resolution;
    private Long projectId;
    private UserDto assignee;
    private UserDto reporter;
    private Integer estimatedHours; // converted from minutes to hours
    private Integer actualHours; // converted from minutes to hours
    private LocalDate dueDate; // Changed to LocalDate to match API
    private Integer progress; // Progress percentage
    private Set<String> tags = new HashSet<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 