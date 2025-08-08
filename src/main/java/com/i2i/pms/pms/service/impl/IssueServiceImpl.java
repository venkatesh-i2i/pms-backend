package com.i2i.pms.pms.service.impl;

import com.i2i.pms.pms.entity.Issue;
import com.i2i.pms.pms.entity.Project;
import com.i2i.pms.pms.entity.User;
import com.i2i.pms.pms.exception.DuplicateResourceException;
import com.i2i.pms.pms.exception.ResourceNotFoundException;
import com.i2i.pms.pms.repository.IssueRepository;
import com.i2i.pms.pms.repository.ProjectRepository;
import com.i2i.pms.pms.repository.UserRepository;
import com.i2i.pms.pms.service.IssueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class IssueServiceImpl implements IssueService {

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<Issue> getAllIssues() {
        return issueRepository.findAll();
    }

    @Override
    public Optional<Issue> getIssueById(Long id) {
        return issueRepository.findById(id);
    }

    @Override
    public Optional<Issue> getIssueByKey(String issueKey) {
        return issueRepository.findByIssueKey(issueKey);
    }

    @Override
    public Issue createIssue(Issue issue) {
        // Generate issue key if not provided
        if (issue.getIssueKey() == null || issue.getIssueKey().isEmpty()) {
            String issueKey = generateIssueKey(issue.getProject().getId());
            issue.setIssueKey(issueKey);
        }

        // Check if issue key already exists
        if (issueRepository.existsByIssueKey(issue.getIssueKey())) {
            throw new DuplicateResourceException("Issue with key '" + issue.getIssueKey() + "' already exists");
        }

        // Set reporter if not provided
        if (issue.getReporter() == null) {
            throw new IllegalArgumentException("Reporter is required");
        }

        // Validate project exists
        Project project = projectRepository.findById(issue.getProject().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", issue.getProject().getId().toString()));
        issue.setProject(project);

        // Validate reporter exists
        User reporter = userRepository.findById(issue.getReporter().getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", issue.getReporter().getId().toString()));
        issue.setReporter(reporter);

        // Validate assignee if provided
        if (issue.getAssignee() != null) {
            User assignee = userRepository.findById(issue.getAssignee().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", issue.getAssignee().getId().toString()));
            issue.setAssignee(assignee);
        }

        return issueRepository.save(issue);
    }

    @Override
    public Issue updateIssue(Long id, Issue issue) {
        Issue existingIssue = issueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue", "id", id.toString()));

        // Check if issue key is being changed and if it already exists
        if (!existingIssue.getIssueKey().equals(issue.getIssueKey()) && 
            issueRepository.existsByIssueKey(issue.getIssueKey())) {
            throw new DuplicateResourceException("Issue with key '" + issue.getIssueKey() + "' already exists");
        }

        existingIssue.setIssueKey(issue.getIssueKey());
        existingIssue.setSummary(issue.getSummary());
        existingIssue.setDescription(issue.getDescription());
        existingIssue.setIssueType(issue.getIssueType());
        existingIssue.setPriority(issue.getPriority());
        existingIssue.setStatus(issue.getStatus());
        existingIssue.setResolution(issue.getResolution());
        existingIssue.setDueDate(issue.getDueDate());
        existingIssue.setEstimatedTime(issue.getEstimatedTime());
        existingIssue.setActualTime(issue.getActualTime());

        // Update assignee if provided
        if (issue.getAssignee() != null) {
            User assignee = userRepository.findById(issue.getAssignee().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", issue.getAssignee().getId().toString()));
            existingIssue.setAssignee(assignee);
        } else {
            existingIssue.setAssignee(null);
        }

        return issueRepository.save(existingIssue);
    }

    @Override
    public void deleteIssue(Long id) {
        if (!issueRepository.existsById(id)) {
            throw new ResourceNotFoundException("Issue", "id", id.toString());
        }
        issueRepository.deleteById(id);
    }

    @Override
    public List<Issue> getIssuesByProject(Long projectId) {
        return issueRepository.findByProjectId(projectId);
    }

    @Override
    public List<Issue> getIssuesByProjectKey(String projectKey) {
        return issueRepository.findByProjectProjectKey(projectKey);
    }

    @Override
    public List<Issue> getIssuesByReporter(Long reporterId) {
        return issueRepository.findByReporterId(reporterId);
    }

    @Override
    public List<Issue> getIssuesByAssignee(Long assigneeId) {
        return issueRepository.findByAssigneeId(assigneeId);
    }

    @Override
    public List<Issue> getIssuesByType(Issue.IssueType issueType) {
        return issueRepository.findByIssueType(issueType);
    }

    @Override
    public List<Issue> getIssuesByPriority(Issue.Priority priority) {
        return issueRepository.findByPriority(priority);
    }

    @Override
    public List<Issue> getIssuesByStatus(Issue.Status status) {
        return issueRepository.findByStatus(status);
    }

    @Override
    public List<Issue> getIssuesByResolution(Issue.Resolution resolution) {
        return issueRepository.findByResolution(resolution);
    }

    @Override
    public List<Issue> getIssuesByProjectAndStatus(Long projectId, Issue.Status status) {
        return issueRepository.findByProjectIdAndStatus(projectId, status);
    }

    @Override
    public List<Issue> getIssuesByProjectAndAssignee(Long projectId, Long assigneeId) {
        return issueRepository.findByProjectIdAndAssigneeId(projectId, assigneeId);
    }

    @Override
    public List<Issue> getOverdueIssues() {
        return issueRepository.findByDueDateBefore(LocalDateTime.now());
    }

    @Override
    public List<Issue> getIssuesDueBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return issueRepository.findByDueDateBetween(startDate, endDate);
    }

    @Override
    public List<Issue> getIssuesByWatcher(Long watcherId) {
        return issueRepository.findByWatcherId(watcherId);
    }

    @Override
    public List<Issue> searchIssues(String keyword) {
        return issueRepository.findByKeyword(keyword);
    }

    @Override
    public List<Issue> searchIssuesByProject(Long projectId, String keyword) {
        return issueRepository.findByProjectIdAndKeyword(projectId, keyword);
    }

    @Override
    public Issue assignIssue(Long issueId, Long assigneeId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue", "id", issueId.toString()));

        User assignee = userRepository.findById(assigneeId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", assigneeId.toString()));

        issue.setAssignee(assignee);
        return issueRepository.save(issue);
    }

    @Override
    public Issue unassignIssue(Long issueId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue", "id", issueId.toString()));

        issue.setAssignee(null);
        return issueRepository.save(issue);
    }

    @Override
    public Issue updateIssueStatus(Long issueId, Issue.Status status) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue", "id", issueId.toString()));

        issue.setStatus(status);
        return issueRepository.save(issue);
    }

    @Override
    public Issue updateIssuePriority(Long issueId, Issue.Priority priority) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue", "id", issueId.toString()));

        issue.setPriority(priority);
        return issueRepository.save(issue);
    }

    @Override
    public Issue resolveIssue(Long issueId, Issue.Resolution resolution) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue", "id", issueId.toString()));

        issue.setResolution(resolution);
        issue.setStatus(Issue.Status.DONE);
        return issueRepository.save(issue);
    }

    @Override
    public Issue addWatcher(Long issueId, Long userId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue", "id", issueId.toString()));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId.toString()));

        issue.addWatcher(user);
        return issueRepository.save(issue);
    }

    @Override
    public Issue removeWatcher(Long issueId, Long userId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue", "id", issueId.toString()));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId.toString()));

        issue.removeWatcher(user);
        return issueRepository.save(issue);
    }

    @Override
    public Long getIssueCountByProject(Long projectId) {
        return issueRepository.countByProjectId(projectId);
    }

    @Override
    public Long getIssueCountByProjectAndStatus(Long projectId, Issue.Status status) {
        return issueRepository.countByProjectIdAndStatus(projectId, status);
    }

    @Override
    public String generateIssueKey(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId.toString()));
        
        Long issueCount = getIssueCountByProject(projectId);
        return project.getProjectKey() + "-" + (issueCount + 1);
    }
} 