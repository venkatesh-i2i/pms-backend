package com.i2i.pms.pms.service.impl;

import com.i2i.pms.pms.entity.Issue;
import com.i2i.pms.pms.entity.User;
import com.i2i.pms.pms.entity.WorkLog;
import com.i2i.pms.pms.exception.ResourceNotFoundException;
import com.i2i.pms.pms.repository.IssueRepository;
import com.i2i.pms.pms.repository.UserRepository;
import com.i2i.pms.pms.repository.WorkLogRepository;
import com.i2i.pms.pms.service.WorkLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class WorkLogServiceImpl implements WorkLogService {

    @Autowired
    private WorkLogRepository workLogRepository;

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<WorkLog> getWorkLogsByIssue(Long issueId) {
        return workLogRepository.findByIssueId(issueId);
    }

    @Override
    public Optional<WorkLog> getWorkLogById(Long id) {
        return workLogRepository.findById(id);
    }

    @Override
    public WorkLog createWorkLog(Long issueId, Long authorId, WorkLog workLog) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue", "id", issueId.toString()));

        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", authorId.toString()));

        workLog.setIssue(issue);
        workLog.setAuthor(author);

        // Update issue's actual time
        Integer currentActualTime = issue.getActualTime() != null ? issue.getActualTime() : 0;
        issue.setActualTime(currentActualTime + workLog.getTimeSpent());
        issueRepository.save(issue);

        return workLogRepository.save(workLog);
    }

    @Override
    public WorkLog updateWorkLog(Long id, WorkLog workLog) {
        WorkLog existingWorkLog = workLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("WorkLog", "id", id.toString()));

        // Update issue's actual time (subtract old time, add new time)
        Issue issue = existingWorkLog.getIssue();
        Integer currentActualTime = issue.getActualTime() != null ? issue.getActualTime() : 0;
        Integer oldTimeSpent = existingWorkLog.getTimeSpent() != null ? existingWorkLog.getTimeSpent() : 0;
        Integer newTimeSpent = workLog.getTimeSpent() != null ? workLog.getTimeSpent() : 0;
        
        issue.setActualTime(currentActualTime - oldTimeSpent + newTimeSpent);
        issueRepository.save(issue);

        existingWorkLog.setTimeSpent(workLog.getTimeSpent());
        existingWorkLog.setTimeSpentUnit(workLog.getTimeSpentUnit());
        existingWorkLog.setComment(workLog.getComment());
        existingWorkLog.setDate(workLog.getDate());
        existingWorkLog.setStartTime(workLog.getStartTime());
        existingWorkLog.setEndTime(workLog.getEndTime());

        return workLogRepository.save(existingWorkLog);
    }

    @Override
    public void deleteWorkLog(Long id) {
        WorkLog workLog = workLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("WorkLog", "id", id.toString()));

        // Update issue's actual time (subtract deleted time)
        Issue issue = workLog.getIssue();
        Integer currentActualTime = issue.getActualTime() != null ? issue.getActualTime() : 0;
        Integer timeSpent = workLog.getTimeSpent() != null ? workLog.getTimeSpent() : 0;
        issue.setActualTime(currentActualTime - timeSpent);
        issueRepository.save(issue);

        workLogRepository.deleteById(id);
    }

    @Override
    public List<WorkLog> getWorkLogsByAuthor(Long authorId) {
        return workLogRepository.findByAuthorId(authorId);
    }

    @Override
    public List<WorkLog> getWorkLogsByIssueAndAuthor(Long issueId, Long authorId) {
        return workLogRepository.findByIssueIdAndAuthorId(issueId, authorId);
    }

    @Override
    public List<WorkLog> getWorkLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return workLogRepository.findByDateBetween(startDate, endDate);
    }

    @Override
    public List<WorkLog> getWorkLogsByIssueAndDateRange(Long issueId, LocalDateTime startDate, LocalDateTime endDate) {
        return workLogRepository.findByIssueIdAndDateBetween(issueId, startDate, endDate);
    }

    @Override
    public List<WorkLog> getWorkLogsByAuthorAndDateRange(Long authorId, LocalDateTime startDate, LocalDateTime endDate) {
        return workLogRepository.findByAuthorIdAndDateBetween(authorId, startDate, endDate);
    }

    @Override
    public Integer getTotalTimeSpentByIssue(Long issueId) {
        Integer totalTime = workLogRepository.getTotalTimeSpentByIssue(issueId);
        return totalTime != null ? totalTime : 0;
    }

    @Override
    public Integer getTotalTimeSpentByAuthor(Long authorId) {
        Integer totalTime = workLogRepository.getTotalTimeSpentByAuthor(authorId);
        return totalTime != null ? totalTime : 0;
    }

    @Override
    public Integer getTotalTimeSpentByProject(Long projectId) {
        Integer totalTime = workLogRepository.getTotalTimeSpentByProject(projectId);
        return totalTime != null ? totalTime : 0;
    }

    @Override
    public Integer getTotalTimeSpentByIssueAndDateRange(Long issueId, LocalDateTime startDate, LocalDateTime endDate) {
        Integer totalTime = workLogRepository.getTotalTimeSpentByIssueAndDateRange(issueId, startDate, endDate);
        return totalTime != null ? totalTime : 0;
    }

    @Override
    public WorkLog createWorkLog(WorkLog workLog) {
        return workLogRepository.save(workLog);
    }

    @Override
    public List<WorkLog> getWorkLogsByUser(Long userId) {
        return getWorkLogsByAuthor(userId);
    }

    @Override
    public Double getTotalHoursByUser(Long userId) {
        Integer totalMinutes = getTotalTimeSpentByAuthor(userId);
        return totalMinutes != null ? totalMinutes / 60.0 : 0.0;
    }

    @Override
    public Double getTotalHoursByIssue(Long issueId) {
        Integer totalMinutes = getTotalTimeSpentByIssue(issueId);
        return totalMinutes != null ? totalMinutes / 60.0 : 0.0;
    }

    @Override
    public boolean isAuthor(Long workLogId, String userEmail) {
        Optional<WorkLog> workLog = workLogRepository.findById(workLogId);
        return workLog.isPresent() && 
               workLog.get().getAuthor() != null && 
               workLog.get().getAuthor().getEmail().equals(userEmail);
    }
} 