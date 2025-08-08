package com.i2i.pms.pms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDto {
    
    // Overall statistics
    private Long totalProjects;
    private Long totalIssues;
    private Long totalUsers;
    
    // Project statistics
    private Long activeProjects;
    private Long completedProjects;
    private Long overdueProjects;
    
    // Issue statistics by status
    private Long todoIssues;
    private Long inProgressIssues;
    private Long inReviewIssues;
    private Long doneIssues;
    private Long blockedIssues;
    
    // Issue statistics by priority
    private Long criticalIssues;
    private Long highPriorityIssues;
    private Long mediumPriorityIssues;
    private Long lowPriorityIssues;
    
    // Issue statistics by type
    private Long bugIssues;
    private Long storyIssues;
    private Long taskIssues;
    private Long epicIssues;
    
    // Time-based statistics
    private Long overdueIssues;
    private Long dueThisWeekIssues;
    private Long dueNextWeekIssues;
    
    // Project lead specific statistics
    private Long projectsAsLead;
    private Long issuesInLeadProjects;
    private Long completedIssuesInLeadProjects;
    
    // Recent activity
    private List<RecentProjectDto> recentProjects;
    private List<RecentIssueDto> recentIssues;
    
    // Performance metrics
    private Double averageIssueResolutionTime; // in hours
    private Double projectCompletionRate; // percentage
    private Double issueCompletionRate; // percentage
    
    // Charts data
    private Map<String, Long> issuesByStatus;
    private Map<String, Long> issuesByPriority;
    private Map<String, Long> issuesByType;
    private Map<String, Long> projectsByType;
    private Map<String, Long> projectsByCategory;
    
    // Team statistics
    private Long totalTeamMembers;
    private Long activeTeamMembers;
    private Map<String, Long> issuesByAssignee;
    
    // Custom metrics
    private Long totalComments;
    private Long totalWatchers;
    private Long estimatedHours;
    private Long actualHours;
    private Double timeAccuracy; // percentage
} 