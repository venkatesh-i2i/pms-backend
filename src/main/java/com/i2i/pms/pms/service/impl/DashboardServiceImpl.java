package com.i2i.pms.pms.service.impl;

import com.i2i.pms.pms.dto.DashboardDto;
import com.i2i.pms.pms.dto.RecentIssueDto;
import com.i2i.pms.pms.dto.RecentProjectDto;
import com.i2i.pms.pms.entity.Issue;
import com.i2i.pms.pms.entity.Project;
import com.i2i.pms.pms.mapper.ProjectMapper;
import com.i2i.pms.pms.mapper.UserMapper;
import com.i2i.pms.pms.repository.IssueRepository;
import com.i2i.pms.pms.repository.ProjectRepository;
import com.i2i.pms.pms.repository.UserRepository;
import com.i2i.pms.pms.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectMapper projectMapper;

    // @Autowired
    // private IssueMapper issueMapper; // Not used in current dashboard conversions

    @Autowired
    private UserMapper userMapper;

    @Override
    public DashboardDto getOverallDashboard() {
        DashboardDto dashboard = new DashboardDto();
        
        // Overall statistics
        dashboard.setTotalProjects(projectRepository.countAllProjects());
        dashboard.setTotalIssues(issueRepository.countAllIssues());
        dashboard.setTotalUsers(userRepository.count());
        
        // Project statistics
        dashboard.setActiveProjects(projectRepository.countActiveProjects());
        dashboard.setCompletedProjects(projectRepository.countCompletedProjects());
        dashboard.setOverdueProjects(0L); // TODO: Implement overdue project logic
        
        // Issue statistics by status
        dashboard.setTodoIssues(issueRepository.countByStatus(Issue.Status.TODO));
        dashboard.setInProgressIssues(issueRepository.countByStatus(Issue.Status.IN_PROGRESS));
        dashboard.setInReviewIssues(issueRepository.countByStatus(Issue.Status.IN_REVIEW));
        dashboard.setDoneIssues(issueRepository.countByStatus(Issue.Status.DONE));
        dashboard.setBlockedIssues(issueRepository.countByStatus(Issue.Status.BLOCKED));
        
        // Issue statistics by priority
        dashboard.setCriticalIssues(issueRepository.countByPriority(Issue.Priority.CRITICAL));
        dashboard.setHighPriorityIssues(issueRepository.countByPriority(Issue.Priority.HIGH));
        dashboard.setMediumPriorityIssues(issueRepository.countByPriority(Issue.Priority.MEDIUM));
        dashboard.setLowPriorityIssues(issueRepository.countByPriority(Issue.Priority.LOW));
        
        // Issue statistics by type
        dashboard.setBugIssues(issueRepository.countByIssueType(Issue.IssueType.BUG));
        dashboard.setStoryIssues(issueRepository.countByIssueType(Issue.IssueType.STORY));
        dashboard.setTaskIssues(issueRepository.countByIssueType(Issue.IssueType.TASK));
        dashboard.setEpicIssues(issueRepository.countByIssueType(Issue.IssueType.EPIC));
        
        // Time-based statistics
        LocalDateTime now = LocalDateTime.now();
        dashboard.setOverdueIssues(issueRepository.countOverdueIssues(now));
        
        LocalDateTime weekStart = now.toLocalDate().atStartOfDay();
        LocalDateTime weekEnd = weekStart.plusWeeks(1);
        dashboard.setDueThisWeekIssues(issueRepository.countIssuesDueBetween(weekStart, weekEnd));
        
        LocalDateTime nextWeekStart = weekStart.plusWeeks(1);
        LocalDateTime nextWeekEnd = nextWeekStart.plusWeeks(1);
        dashboard.setDueNextWeekIssues(issueRepository.countIssuesDueBetween(nextWeekStart, nextWeekEnd));
        
        // Performance metrics
        dashboard.setAverageIssueResolutionTime(issueRepository.getAverageResolutionTime());
        dashboard.setIssueCompletionRate(calculateCompletionRate(issueRepository.countCompletedIssues(), dashboard.getTotalIssues()));
        
        // Charts data
        dashboard.setIssuesByStatus(convertToMap(issueRepository.countIssuesByStatus()));
        dashboard.setIssuesByPriority(convertToMap(issueRepository.countIssuesByPriority()));
        dashboard.setIssuesByType(convertToMap(issueRepository.countIssuesByType()));
        dashboard.setProjectsByType(convertToMap(projectRepository.countProjectsByType()));
        dashboard.setProjectsByCategory(convertToMap(projectRepository.countProjectsByCategory()));
        
        // Recent activity
        List<Project> recentProjects = projectRepository.findRecentProjects().stream()
                .limit(5)
                .collect(Collectors.toList());
        dashboard.setRecentProjects(convertToRecentProjectDtos(recentProjects));
        
        List<Issue> recentIssues = issueRepository.findRecentIssues().stream()
                .limit(10)
                .collect(Collectors.toList());
        dashboard.setRecentIssues(convertToRecentIssueDtos(recentIssues));
        
        // Custom metrics
        dashboard.setEstimatedHours(issueRepository.getTotalEstimatedTime());
        dashboard.setActualHours(issueRepository.getTotalActualTime());
        dashboard.setTimeAccuracy(calculateTimeAccuracy(dashboard.getEstimatedHours(), dashboard.getActualHours()));
        
        return dashboard;
    }

    @Override
    public DashboardDto getManagerDashboard(Long managerId) {
        DashboardDto dashboard = new DashboardDto();
        
        // Project lead specific statistics
        dashboard.setProjectsAsLead(projectRepository.countProjectsByLead(managerId));
        dashboard.setIssuesInLeadProjects(calculateIssuesInLeadProjects(managerId));
        dashboard.setCompletedIssuesInLeadProjects(calculateCompletedIssuesInLeadProjects(managerId));
        
        // Recent projects as lead
        List<Project> recentProjectsAsLead = projectRepository.findRecentProjectsByLead(managerId).stream()
                .limit(5)
                .collect(Collectors.toList());
        dashboard.setRecentProjects(convertToRecentProjectDtos(recentProjectsAsLead));
        
        // Recent issues in lead projects
        List<Issue> recentIssuesInLeadProjects = getRecentIssuesInLeadProjects(managerId).stream()
                .limit(10)
                .collect(Collectors.toList());
        dashboard.setRecentIssues(convertToRecentIssueDtos(recentIssuesInLeadProjects));
        
        return dashboard;
    }

    @Override
    public DashboardDto getProjectDashboard(Long projectId) {
        DashboardDto dashboard = new DashboardDto();
        
        // Project-specific statistics
        dashboard.setTotalIssues(issueRepository.countByProjectId(projectId));
        dashboard.setTodoIssues(issueRepository.countByProjectIdAndStatus(projectId, Issue.Status.TODO));
        dashboard.setInProgressIssues(issueRepository.countByProjectIdAndStatus(projectId, Issue.Status.IN_PROGRESS));
        dashboard.setInReviewIssues(issueRepository.countByProjectIdAndStatus(projectId, Issue.Status.IN_REVIEW));
        dashboard.setDoneIssues(issueRepository.countByProjectIdAndStatus(projectId, Issue.Status.DONE));
        dashboard.setBlockedIssues(issueRepository.countByProjectIdAndStatus(projectId, Issue.Status.BLOCKED));
        
        // Recent issues in project
        List<Issue> recentIssuesInProject = issueRepository.findRecentIssuesByProject(projectId).stream()
                .limit(10)
                .collect(Collectors.toList());
        dashboard.setRecentIssues(convertToRecentIssueDtos(recentIssuesInProject));
        
        // Performance metrics
        dashboard.setCompletedIssuesInLeadProjects(issueRepository.countCompletedIssuesByProject(projectId));
        dashboard.setIssueCompletionRate(calculateCompletionRate(
                issueRepository.countCompletedIssuesByProject(projectId),
                issueRepository.countByProjectId(projectId)
        ));
        
        return dashboard;
    }

    @Override
    public DashboardDto getProjectsAsLeadDashboard(Long leadUserId) {
        return getManagerDashboard(leadUserId);
    }

    @Override
    public DashboardDto getProjectsAsMemberDashboard(Long memberUserId) {
        DashboardDto dashboard = new DashboardDto();
        
        // Member-specific statistics
        dashboard.setProjectsAsLead(projectRepository.countProjectsByMember(memberUserId));
        
        // Recent projects as member
        List<Project> recentProjectsAsMember = projectRepository.findRecentProjectsByMember(memberUserId).stream()
                .limit(5)
                .collect(Collectors.toList());
        dashboard.setRecentProjects(convertToRecentProjectDtos(recentProjectsAsMember));
        
        return dashboard;
    }

    @Override
    public DashboardDto getAssignedIssuesDashboard(Long assigneeId) {
        DashboardDto dashboard = new DashboardDto();
        
        // Assignee-specific statistics
        dashboard.setTotalIssues(issueRepository.countByAssigneeId(assigneeId));
        dashboard.setTodoIssues(issueRepository.countByAssigneeIdAndStatus(assigneeId, Issue.Status.TODO));
        dashboard.setInProgressIssues(issueRepository.countByAssigneeIdAndStatus(assigneeId, Issue.Status.IN_PROGRESS));
        dashboard.setDoneIssues(issueRepository.countByAssigneeIdAndStatus(assigneeId, Issue.Status.DONE));
        
        // Recent assigned issues
        List<Issue> recentAssignedIssues = issueRepository.findRecentIssuesByAssignee(assigneeId).stream()
                .limit(10)
                .collect(Collectors.toList());
        dashboard.setRecentIssues(convertToRecentIssueDtos(recentAssignedIssues));
        
        return dashboard;
    }

    @Override
    public DashboardDto getReportedIssuesDashboard(Long reporterId) {
        DashboardDto dashboard = new DashboardDto();
        
        // Reporter-specific statistics
        dashboard.setTotalIssues(issueRepository.countByReporterId(reporterId));
        
        // Recent reported issues
        List<Issue> recentReportedIssues = issueRepository.findRecentIssuesByReporter(reporterId).stream()
                .limit(10)
                .collect(Collectors.toList());
        dashboard.setRecentIssues(convertToRecentIssueDtos(recentReportedIssues));
        
        return dashboard;
    }

    @Override
    public DashboardDto getDashboardForPeriod(String startDate, String endDate) {
        // TODO: Implement period-based dashboard
        return getOverallDashboard();
    }

    @Override
    public DashboardDto getRealTimeDashboard() {
        // TODO: Implement real-time dashboard (last 24 hours)
        return getOverallDashboard();
    }

    // Helper methods
    private Double calculateCompletionRate(Long completed, Long total) {
        if (total == null || total == 0) return 0.0;
        return (double) completed / total * 100;
    }

    private Double calculateTimeAccuracy(Long estimated, Long actual) {
        if (estimated == null || estimated == 0) return 0.0;
        if (actual == null || actual == 0) return 0.0;
        return (double) actual / estimated * 100;
    }

    private Map<String, Long> convertToMap(List<Object[]> data) {
        Map<String, Long> result = new HashMap<>();
        for (Object[] row : data) {
            if (row.length >= 2 && row[0] != null && row[1] != null) {
                result.put(row[0].toString(), ((Number) row[1]).longValue());
            }
        }
        return result;
    }

    private List<RecentProjectDto> convertToRecentProjectDtos(List<Project> projects) {
        return projects.stream()
                .map(this::convertToRecentProjectDto)
                .collect(Collectors.toList());
    }

    private RecentProjectDto convertToRecentProjectDto(Project project) {
        RecentProjectDto dto = new RecentProjectDto();
        dto.setId(project.getId());
        dto.setProjectKey(project.getProjectKey());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setProjectType(project.getProjectType().toString());
        dto.setProjectCategory(project.getProjectCategory().toString());
        dto.setCreatedAt(project.getCreatedAt());
        dto.setUpdatedAt(project.getUpdatedAt());
        dto.setIsActive(project.getIsActive());
        dto.setProjectLead(userMapper.toDto(project.getProjectLead()));
        dto.setMemberCount(project.getMembers().size());
        dto.setIssueCount(project.getIssues().size());
        
        long completedIssues = project.getIssues().stream()
                .filter(issue -> issue.getStatus() == Issue.Status.DONE)
                .count();
        dto.setCompletedIssueCount((int) completedIssues);
        dto.setCompletionPercentage(calculateCompletionRate((long) completedIssues, (long) project.getIssues().size()));
        
        return dto;
    }

    private List<RecentIssueDto> convertToRecentIssueDtos(List<Issue> issues) {
        return issues.stream()
                .map(this::convertToRecentIssueDto)
                .collect(Collectors.toList());
    }

    private RecentIssueDto convertToRecentIssueDto(Issue issue) {
        RecentIssueDto dto = new RecentIssueDto();
        dto.setId(issue.getId());
        dto.setIssueKey(issue.getIssueKey());
        dto.setSummary(issue.getSummary());
        dto.setDescription(issue.getDescription());
        dto.setIssueType(issue.getIssueType().toString());
        dto.setPriority(issue.getPriority().toString());
        dto.setStatus(issue.getStatus().toString());
        dto.setResolution(issue.getResolution() != null ? issue.getResolution().toString() : null);
        dto.setCreatedAt(issue.getCreatedAt());
        dto.setUpdatedAt(issue.getUpdatedAt());
        dto.setDueDate(issue.getDueDate());
        dto.setEstimatedTime(issue.getEstimatedTime() != null ? issue.getEstimatedTime().longValue() : 0L);
        dto.setActualTime(issue.getActualTime() != null ? issue.getActualTime().longValue() : 0L);
        dto.setProject(projectMapper.toDto(issue.getProject()));
        dto.setReporter(userMapper.toDto(issue.getReporter()));
        dto.setAssignee(issue.getAssignee() != null ? userMapper.toDto(issue.getAssignee()) : null);
        dto.setCommentCount(issue.getComments().size());
        dto.setWatcherCount(issue.getWatchers().size());
        
        // Calculate overdue status
        if (issue.getDueDate() != null && issue.getStatus() != Issue.Status.DONE) {
            dto.setIsOverdue(issue.getDueDate().isBefore(LocalDateTime.now()));
            if (dto.getIsOverdue()) {
                dto.setDaysOverdue(java.time.Duration.between(issue.getDueDate(), LocalDateTime.now()).toDays());
            }
        }
        
        return dto;
    }

    private Long calculateIssuesInLeadProjects(Long managerId) {
        return issueRepository.countIssuesInLeadProjects(managerId);
    }

    private Long calculateCompletedIssuesInLeadProjects(Long managerId) {
        return issueRepository.countCompletedIssuesInLeadProjects(managerId);
    }

    private List<Issue> getRecentIssuesInLeadProjects(Long managerId) {
        return issueRepository.findIssuesInLeadProjects(managerId);
    }
} 