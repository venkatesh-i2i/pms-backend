package com.i2i.pms.pms.dto;

import com.i2i.pms.pms.entity.Project;
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
public class ProjectDto {

    private Long id;

    @NotBlank(message = "Project key is required")
    @Size(min = 2, max = 10, message = "Project key must be between 2 and 10 characters")
    private String projectKey;

    @NotBlank(message = "Project name is required")
    @Size(min = 2, max = 100, message = "Project name must be between 2 and 100 characters")
    private String name;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    private Project.ProjectType projectType = Project.ProjectType.SOFTWARE;
    private Project.ProjectCategory projectCategory = Project.ProjectCategory.BUSINESS;
    private UserDto projectLead;
    private Boolean isActive = true;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer progress;
    private String status; // PLANNING, IN_PROGRESS, ON_HOLD, COMPLETED, CANCELLED
    private Set<UserDto> members = new HashSet<>();
    private Set<MilestoneDto> milestones = new HashSet<>();
    private Integer issueCount;
    private Integer completedIssueCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 