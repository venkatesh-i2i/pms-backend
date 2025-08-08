package com.i2i.pms.pms.repository;

import com.i2i.pms.pms.entity.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {

    Optional<Issue> findByIssueKey(String issueKey);
    
    List<Issue> findByProjectId(Long projectId);
    
    List<Issue> findByProjectProjectKey(String projectKey);
    
    List<Issue> findByReporterId(Long reporterId);
    
    List<Issue> findByAssigneeId(Long assigneeId);
    
    List<Issue> findByIssueType(Issue.IssueType issueType);
    
    List<Issue> findByPriority(Issue.Priority priority);
    
    List<Issue> findByStatus(Issue.Status status);
    
    List<Issue> findByResolution(Issue.Resolution resolution);
    
    List<Issue> findByProjectIdAndStatus(Long projectId, Issue.Status status);
    
    List<Issue> findByProjectIdAndAssigneeId(Long projectId, Long assigneeId);
    
    List<Issue> findByDueDateBefore(LocalDateTime dueDate);
    
    List<Issue> findByDueDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT i FROM Issue i JOIN i.watchers w WHERE w.id = :userId")
    List<Issue> findByWatcherId(@Param("userId") Long userId);
    
    @Query("SELECT i FROM Issue i WHERE i.summary LIKE %:keyword% OR i.description LIKE %:keyword%")
    List<Issue> findByKeyword(@Param("keyword") String keyword);
    
    @Query("SELECT i FROM Issue i WHERE i.project.id = :projectId AND (i.summary LIKE %:keyword% OR i.description LIKE %:keyword%)")
    List<Issue> findByProjectIdAndKeyword(@Param("projectId") Long projectId, @Param("keyword") String keyword);
    
    boolean existsByIssueKey(String issueKey);
    
    @Query("SELECT COUNT(i) FROM Issue i WHERE i.project.id = :projectId")
    Long countByProjectId(@Param("projectId") Long projectId);
    
    @Query("SELECT COUNT(i) FROM Issue i WHERE i.project.id = :projectId AND i.status = :status")
    Long countByProjectIdAndStatus(@Param("projectId") Long projectId, @Param("status") Issue.Status status);
    
    // Dashboard queries
    @Query("SELECT COUNT(i) FROM Issue i")
    Long countAllIssues();
    
    @Query("SELECT COUNT(i) FROM Issue i WHERE i.status = :status")
    Long countByStatus(@Param("status") Issue.Status status);
    
    @Query("SELECT COUNT(i) FROM Issue i WHERE i.priority = :priority")
    Long countByPriority(@Param("priority") Issue.Priority priority);
    
    @Query("SELECT COUNT(i) FROM Issue i WHERE i.issueType = :issueType")
    Long countByIssueType(@Param("issueType") Issue.IssueType issueType);
    
    @Query("SELECT COUNT(i) FROM Issue i WHERE i.assignee.id = :assigneeId")
    Long countByAssigneeId(@Param("assigneeId") Long assigneeId);
    
    @Query("SELECT COUNT(i) FROM Issue i WHERE i.reporter.id = :reporterId")
    Long countByReporterId(@Param("reporterId") Long reporterId);
    
    @Query("SELECT COUNT(i) FROM Issue i WHERE i.dueDate < :currentDate AND i.status != 'DONE'")
    Long countOverdueIssues(@Param("currentDate") LocalDateTime currentDate);
    
    @Query("SELECT COUNT(i) FROM Issue i WHERE i.dueDate BETWEEN :startDate AND :endDate")
    Long countIssuesDueBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT i.status, COUNT(i) FROM Issue i GROUP BY i.status")
    List<Object[]> countIssuesByStatus();
    
    @Query("SELECT i.priority, COUNT(i) FROM Issue i GROUP BY i.priority")
    List<Object[]> countIssuesByPriority();
    
    @Query("SELECT i.issueType, COUNT(i) FROM Issue i GROUP BY i.issueType")
    List<Object[]> countIssuesByType();
    
    @Query("SELECT i.assignee.name, COUNT(i) FROM Issue i WHERE i.assignee IS NOT NULL GROUP BY i.assignee.name")
    List<Object[]> countIssuesByAssignee();
    
    @Query("SELECT i FROM Issue i ORDER BY i.updatedAt DESC")
    List<Issue> findRecentIssues();
    
    @Query("SELECT i FROM Issue i WHERE i.assignee.id = :assigneeId ORDER BY i.updatedAt DESC")
    List<Issue> findRecentIssuesByAssignee(@Param("assigneeId") Long assigneeId);
    
    @Query("SELECT i FROM Issue i WHERE i.reporter.id = :reporterId ORDER BY i.updatedAt DESC")
    List<Issue> findRecentIssuesByReporter(@Param("reporterId") Long reporterId);
    
    @Query("SELECT i FROM Issue i WHERE i.project.id = :projectId ORDER BY i.updatedAt DESC")
    List<Issue> findRecentIssuesByProject(@Param("projectId") Long projectId);
    
    @Query("SELECT AVG(TIMESTAMPDIFF(HOUR, i.createdAt, i.updatedAt)) FROM Issue i WHERE i.status = 'DONE' AND i.updatedAt IS NOT NULL AND i.createdAt IS NOT NULL")
    Double getAverageResolutionTime();
    
    @Query("SELECT COUNT(i) FROM Issue i WHERE i.status = 'DONE'")
    Long countCompletedIssues();
    
    @Query("SELECT COUNT(i) FROM Issue i WHERE i.status = 'DONE' AND i.project.id = :projectId")
    Long countCompletedIssuesByProject(@Param("projectId") Long projectId);
    
    @Query("SELECT SUM(i.estimatedTime) FROM Issue i WHERE i.estimatedTime IS NOT NULL")
    Long getTotalEstimatedTime();
    
    @Query("SELECT SUM(i.actualTime) FROM Issue i WHERE i.actualTime IS NOT NULL")
    Long getTotalActualTime();
    
    // Additional dashboard queries
    @Query("SELECT COUNT(i) FROM Issue i WHERE i.assignee.id = :assigneeId AND i.status = :status")
    Long countByAssigneeIdAndStatus(@Param("assigneeId") Long assigneeId, @Param("status") Issue.Status status);
    
    @Query("SELECT COUNT(i) FROM Issue i WHERE i.project.projectLead.id = :leadUserId")
    Long countIssuesInLeadProjects(@Param("leadUserId") Long leadUserId);
    
    @Query("SELECT COUNT(i) FROM Issue i WHERE i.project.projectLead.id = :leadUserId AND i.status = 'DONE'")
    Long countCompletedIssuesInLeadProjects(@Param("leadUserId") Long leadUserId);
    
    @Query("SELECT i FROM Issue i WHERE i.project.projectLead.id = :leadUserId ORDER BY i.updatedAt DESC")
    List<Issue> findIssuesInLeadProjects(@Param("leadUserId") Long leadUserId);
} 