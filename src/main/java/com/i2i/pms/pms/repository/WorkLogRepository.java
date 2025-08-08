package com.i2i.pms.pms.repository;

import com.i2i.pms.pms.entity.WorkLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WorkLogRepository extends JpaRepository<WorkLog, Long> {

    List<WorkLog> findByIssueId(Long issueId);
    
    List<WorkLog> findByAuthorId(Long authorId);
    
    List<WorkLog> findByIssueIdAndAuthorId(Long issueId, Long authorId);
    
    List<WorkLog> findByDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<WorkLog> findByIssueIdAndDateBetween(Long issueId, LocalDateTime startDate, LocalDateTime endDate);
    
    List<WorkLog> findByAuthorIdAndDateBetween(Long authorId, LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT SUM(w.timeSpent) FROM WorkLog w WHERE w.issue.id = :issueId")
    Integer getTotalTimeSpentByIssue(@Param("issueId") Long issueId);
    
    @Query("SELECT SUM(w.timeSpent) FROM WorkLog w WHERE w.author.id = :authorId")
    Integer getTotalTimeSpentByAuthor(@Param("authorId") Long authorId);
    
    @Query("SELECT SUM(w.timeSpent) FROM WorkLog w WHERE w.issue.project.id = :projectId")
    Integer getTotalTimeSpentByProject(@Param("projectId") Long projectId);
    
    @Query("SELECT SUM(w.timeSpent) FROM WorkLog w WHERE w.issue.id = :issueId AND w.date BETWEEN :startDate AND :endDate")
    Integer getTotalTimeSpentByIssueAndDateRange(@Param("issueId") Long issueId, 
                                                @Param("startDate") LocalDateTime startDate, 
                                                @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT w.author.name, SUM(w.timeSpent) FROM WorkLog w WHERE w.issue.project.id = :projectId GROUP BY w.author.name")
    List<Object[]> getTimeSpentByAuthorForProject(@Param("projectId") Long projectId);
    
    @Query("SELECT w.issue.id, SUM(w.timeSpent) FROM WorkLog w WHERE w.issue.project.id = :projectId GROUP BY w.issue.id")
    List<Object[]> getTimeSpentByIssueForProject(@Param("projectId") Long projectId);
} 