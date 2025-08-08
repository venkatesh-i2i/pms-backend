package com.i2i.pms.pms.controller;

import com.i2i.pms.pms.dto.CreateIssueRequest;
import com.i2i.pms.pms.dto.IssueDto;
import com.i2i.pms.pms.dto.UpdateIssueStatusRequest;
import com.i2i.pms.pms.entity.Issue;
import com.i2i.pms.pms.entity.Project;
import com.i2i.pms.pms.entity.User;
import com.i2i.pms.pms.exception.ResourceNotFoundException;
import com.i2i.pms.pms.mapper.IssueMapper;
import com.i2i.pms.pms.repository.ProjectRepository;
import com.i2i.pms.pms.repository.UserRepository;
import com.i2i.pms.pms.service.AuthService;
import com.i2i.pms.pms.service.IssueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/issues")
public class IssueController {

    @Autowired
    private IssueService issueService;

    @Autowired
    private IssueMapper issueMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private AuthService authService;

    // Get all issues
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<List<IssueDto>> getAllIssues() {
        List<Issue> issues = issueService.getAllIssues();
        List<IssueDto> issueDtos = issueMapper.toDtoList(issues);
        return ResponseEntity.ok(issueDtos);
    }

    // Get issue by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<IssueDto> getIssueById(@PathVariable Long id) {
        Optional<Issue> issue = issueService.getIssueById(id);
        return issue.map(issueMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get issue by key
    @GetMapping("/key/{issueKey}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<IssueDto> getIssueByKey(@PathVariable String issueKey) {
        Optional<Issue> issue = issueService.getIssueByKey(issueKey);
        return issue.map(issueMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create new issue
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<IssueDto> createIssue(
            @Valid @RequestBody CreateIssueRequest createIssueRequest,
            @RequestHeader("Authorization") String authorization) {
        
        // Extract token from Authorization header
        String token = authorization;
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        // Get user ID from token
        Long userId = authService.getUserIdFromToken(token);
        if (userId == null) {
            throw new RuntimeException("Invalid token");
        }

        // Get current user as reporter
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId.toString()));
        
        // Map request to entity
        Issue issue = issueMapper.toEntity(createIssueRequest);
        
        // Set project
        if (createIssueRequest.getProjectId() != null) {
            Project project = projectRepository.findById(createIssueRequest.getProjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project", "id", createIssueRequest.getProjectId().toString()));
            issue.setProject(project);
        }
        
        // Set reporter to current user
        issue.setReporter(currentUser);
        
        // Set assignee if provided
        if (createIssueRequest.getAssigneeId() != null) {
            User assignee = userRepository.findById(createIssueRequest.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", createIssueRequest.getAssigneeId().toString()));
            issue.setAssignee(assignee);
        }
        
        // Set default status if not provided
        if (issue.getStatus() == null) {
            issue.setStatus(Issue.Status.TODO);
        }
        
        Issue savedIssue = issueService.createIssue(issue);
        IssueDto issueDto = issueMapper.toDto(savedIssue);
        return ResponseEntity.ok(issueDto);
    }

    // Update issue
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<IssueDto> updateIssue(
            @PathVariable Long id, 
            @Valid @RequestBody CreateIssueRequest updateIssueRequest) {
        
        Issue existingIssue = issueService.getIssueById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue", "id", id.toString()));
        
        // Update basic fields
        issueMapper.updateIssueFromRequest(existingIssue, updateIssueRequest);
        
        // Handle project update if provided
        if (updateIssueRequest.getProjectId() != null && 
            !updateIssueRequest.getProjectId().equals(existingIssue.getProject().getId())) {
            Project project = projectRepository.findById(updateIssueRequest.getProjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project", "id", updateIssueRequest.getProjectId().toString()));
            existingIssue.setProject(project);
        }
        
        // Handle assignee update
        if (updateIssueRequest.getAssigneeId() != null) {
            User assignee = userRepository.findById(updateIssueRequest.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", updateIssueRequest.getAssigneeId().toString()));
            existingIssue.setAssignee(assignee);
        } else {
            existingIssue.setAssignee(null);
        }
        
        Issue updatedIssue = issueService.updateIssue(id, existingIssue);
        IssueDto issueDto = issueMapper.toDto(updatedIssue);
        return ResponseEntity.ok(issueDto);
    }

    // Delete issue
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Void> deleteIssue(@PathVariable Long id) {
        issueService.deleteIssue(id);
        return ResponseEntity.ok().build();
    }

    // Get issues by project
    @GetMapping("/project/{projectId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<List<IssueDto>> getIssuesByProject(@PathVariable Long projectId) {
        List<Issue> issues = issueService.getIssuesByProject(projectId);
        List<IssueDto> issueDtos = issueMapper.toDtoList(issues);
        return ResponseEntity.ok(issueDtos);
    }

    // Get issues by project key
    @GetMapping("/project/key/{projectKey}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<List<IssueDto>> getIssuesByProjectKey(@PathVariable String projectKey) {
        List<Issue> issues = issueService.getIssuesByProjectKey(projectKey);
        List<IssueDto> issueDtos = issueMapper.toDtoList(issues);
        return ResponseEntity.ok(issueDtos);
    }

    // Get issues by reporter
    @GetMapping("/reporter/{reporterId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<List<IssueDto>> getIssuesByReporter(@PathVariable Long reporterId) {
        List<Issue> issues = issueService.getIssuesByReporter(reporterId);
        List<IssueDto> issueDtos = issueMapper.toDtoList(issues);
        return ResponseEntity.ok(issueDtos);
    }

    // Get issues by assignee
    @GetMapping("/assignee/{assigneeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<List<IssueDto>> getIssuesByAssignee(@PathVariable Long assigneeId) {
        List<Issue> issues = issueService.getIssuesByAssignee(assigneeId);
        List<IssueDto> issueDtos = issueMapper.toDtoList(issues);
        return ResponseEntity.ok(issueDtos);
    }

    // Update issue status via path variable (existing)
    @PatchMapping("/{id}/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<IssueDto> updateIssueStatus(@PathVariable Long id, @PathVariable Issue.Status status) {
        Issue issue = issueService.updateIssueStatus(id, status);
        IssueDto issueDto = issueMapper.toDto(issue);
        return ResponseEntity.ok(issueDto);
    }

    // Update issue status via request body (new for Kanban)
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<?> updateIssueStatusBody(
            @PathVariable Long id,
            @Valid @RequestBody UpdateIssueStatusRequest request) {
        try {
            Issue.Status status = Issue.Status.valueOf(request.getStatus().toUpperCase(Locale.ROOT));
            Issue issue = issueService.updateIssueStatus(id, status);
            return ResponseEntity.ok(issueMapper.toDto(issue));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Invalid status. Allowed: TODO, IN_PROGRESS, IN_REVIEW, TESTING, DONE, BLOCKED"));
        }
    }

    // Update issue priority
    @PatchMapping("/{id}/priority/{priority}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<IssueDto> updateIssuePriority(@PathVariable Long id, @PathVariable Issue.Priority priority) {
        Issue issue = issueService.updateIssuePriority(id, priority);
        IssueDto issueDto = issueMapper.toDto(issue);
        return ResponseEntity.ok(issueDto);
    }

    // Assign issue to user
    @PatchMapping("/{id}/assign/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<IssueDto> assignIssue(@PathVariable("id") Long issueId, @PathVariable("userId") Long userId) {
        Issue issue = issueService.assignIssue(issueId, userId);
        return ResponseEntity.ok(issueMapper.toDto(issue));
    }

    // Unassign issue
    @PatchMapping("/{id}/unassign")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<IssueDto> unassignIssue(@PathVariable("id") Long issueId) {
        Issue issue = issueService.unassignIssue(issueId);
        return ResponseEntity.ok(issueMapper.toDto(issue));
    }

    // Resolve issue
    @PatchMapping("/{id}/resolve/{resolution}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<IssueDto> resolveIssue(@PathVariable Long id, @PathVariable Issue.Resolution resolution) {
        Issue issue = issueService.resolveIssue(id, resolution);
        IssueDto issueDto = issueMapper.toDto(issue);
        return ResponseEntity.ok(issueDto);
    }

    // Add watcher to issue
    @PostMapping("/{id}/watchers/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<IssueDto> addWatcher(@PathVariable Long id, @PathVariable Long userId) {
        Issue issue = issueService.addWatcher(id, userId);
        IssueDto issueDto = issueMapper.toDto(issue);
        return ResponseEntity.ok(issueDto);
    }

    // Remove watcher from issue
    @DeleteMapping("/{id}/watchers/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<IssueDto> removeWatcher(@PathVariable Long id, @PathVariable Long userId) {
        Issue issue = issueService.removeWatcher(id, userId);
        IssueDto issueDto = issueMapper.toDto(issue);
        return ResponseEntity.ok(issueDto);
    }

    // Get issue count by project
    @GetMapping("/project/{projectId}/count")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<Long> getIssueCountByProject(@PathVariable Long projectId) {
        Long count = issueService.getIssueCountByProject(projectId);
        return ResponseEntity.ok(count);
    }

    // Get issue count by project and status
    @GetMapping("/project/{projectId}/status/{status}/count")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<Long> getIssueCountByProjectAndStatus(
            @PathVariable Long projectId, 
            @PathVariable Issue.Status status) {
        Long count = issueService.getIssueCountByProjectAndStatus(projectId, status);
        return ResponseEntity.ok(count);
    }
} 