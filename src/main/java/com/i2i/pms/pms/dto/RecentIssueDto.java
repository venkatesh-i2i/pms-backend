package com.i2i.pms.pms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecentIssueDto {
    
    private Long id;
    private String issueKey;
    private String summary;
    private String description;
    private String issueType;
    private String priority;
    private String status;
    private String resolution;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime dueDate;
    private Long estimatedTime;
    private Long actualTime;
    private ProjectDto project;
    private UserDto reporter;
    private UserDto assignee;
    private Integer commentCount;
    private Integer watcherCount;
    private Boolean isOverdue;
    private Long daysOverdue;
} 