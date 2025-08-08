package com.i2i.pms.pms.service;

import com.i2i.pms.pms.entity.Issue;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface IssueService {

    List<Issue> getAllIssues();
    
    Optional<Issue> getIssueById(Long id);
    
    Optional<Issue> getIssueByKey(String issueKey);
    
    Issue createIssue(Issue issue);
    
    Issue updateIssue(Long id, Issue issue);
    
    void deleteIssue(Long id);
    
    List<Issue> getIssuesByProject(Long projectId);
    
    List<Issue> getIssuesByProjectKey(String projectKey);
    
    List<Issue> getIssuesByReporter(Long reporterId);
    
    List<Issue> getIssuesByAssignee(Long assigneeId);
    
    List<Issue> getIssuesByType(Issue.IssueType issueType);
    
    List<Issue> getIssuesByPriority(Issue.Priority priority);
    
    List<Issue> getIssuesByStatus(Issue.Status status);
    
    List<Issue> getIssuesByResolution(Issue.Resolution resolution);
    
    List<Issue> getIssuesByProjectAndStatus(Long projectId, Issue.Status status);
    
    List<Issue> getIssuesByProjectAndAssignee(Long projectId, Long assigneeId);
    
    List<Issue> getOverdueIssues();
    
    List<Issue> getIssuesDueBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Issue> getIssuesByWatcher(Long watcherId);
    
    List<Issue> searchIssues(String keyword);
    
    List<Issue> searchIssuesByProject(Long projectId, String keyword);
    
    Issue assignIssue(Long issueId, Long assigneeId);
    
    Issue unassignIssue(Long issueId);
    
    Issue updateIssueStatus(Long issueId, Issue.Status status);
    
    Issue updateIssuePriority(Long issueId, Issue.Priority priority);
    
    Issue resolveIssue(Long issueId, Issue.Resolution resolution);
    
    Issue addWatcher(Long issueId, Long userId);
    
    Issue removeWatcher(Long issueId, Long userId);
    
    Long getIssueCountByProject(Long projectId);
    
    Long getIssueCountByProjectAndStatus(Long projectId, Issue.Status status);
    
    String generateIssueKey(Long projectId);
} 