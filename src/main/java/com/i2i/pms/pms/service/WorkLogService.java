package com.i2i.pms.pms.service;

import com.i2i.pms.pms.entity.WorkLog;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface WorkLogService {

    List<WorkLog> getWorkLogsByIssue(Long issueId);
    
    Optional<WorkLog> getWorkLogById(Long id);
    
    WorkLog createWorkLog(Long issueId, Long authorId, WorkLog workLog);
    
    WorkLog createWorkLog(WorkLog workLog);
    
    WorkLog updateWorkLog(Long id, WorkLog workLog);
    
    void deleteWorkLog(Long id);
    
    List<WorkLog> getWorkLogsByAuthor(Long authorId);
    
    List<WorkLog> getWorkLogsByIssueAndAuthor(Long issueId, Long authorId);
    
    List<WorkLog> getWorkLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    List<WorkLog> getWorkLogsByIssueAndDateRange(Long issueId, LocalDateTime startDate, LocalDateTime endDate);
    
    List<WorkLog> getWorkLogsByAuthorAndDateRange(Long authorId, LocalDateTime startDate, LocalDateTime endDate);
    
    Integer getTotalTimeSpentByIssue(Long issueId);
    
    Integer getTotalTimeSpentByAuthor(Long authorId);
    
    Integer getTotalTimeSpentByProject(Long projectId);
    
    Integer getTotalTimeSpentByIssueAndDateRange(Long issueId, LocalDateTime startDate, LocalDateTime endDate);
    
    List<WorkLog> getWorkLogsByUser(Long userId);
    
    Double getTotalHoursByUser(Long userId);
    
    Double getTotalHoursByIssue(Long issueId);
    
    boolean isAuthor(Long workLogId, String userEmail);
} 