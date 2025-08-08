package com.i2i.pms.pms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecentProjectDto {
    
    private Long id;
    private String projectKey;
    private String name;
    private String description;
    private String projectType;
    private String projectCategory;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isActive;
    private UserDto projectLead;
    private Integer memberCount;
    private Integer issueCount;
    private Integer completedIssueCount;
    private Double completionPercentage;
} 