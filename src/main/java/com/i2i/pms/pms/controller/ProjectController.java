package com.i2i.pms.pms.controller;

import com.i2i.pms.pms.dto.CreateProjectRequest;
import com.i2i.pms.pms.dto.IssueDto;
import com.i2i.pms.pms.dto.ProjectDto;
import com.i2i.pms.pms.entity.Issue;
import com.i2i.pms.pms.entity.Project;
import com.i2i.pms.pms.mapper.IssueMapper;
import com.i2i.pms.pms.mapper.ProjectMapper;
import com.i2i.pms.pms.service.IssueService;
import com.i2i.pms.pms.service.ProjectService;
import com.i2i.pms.pms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private UserService userService;

    @Autowired
    private IssueService issueService;

    @Autowired
    private ProjectMapper projectMapper;

    @Autowired
    private IssueMapper issueMapper;

    // Get all projects
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<List<ProjectDto>> getAllProjects() {
        List<Project> projects = projectService.getAllProjects();
        List<ProjectDto> projectDtos = projectMapper.toDtoList(projects);
        return ResponseEntity.ok(projectDtos);
    }

    // Get project by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<ProjectDto> getProjectById(@PathVariable Long id) {
        Optional<Project> project = projectService.getProjectById(id);
        return project.map(projectMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get project by key
    @GetMapping("/key/{projectKey}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<ProjectDto> getProjectByKey(@PathVariable String projectKey) {
        Optional<Project> project = projectService.getProjectByKey(projectKey);
        return project.map(projectMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create new project
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ProjectDto> createProject(@Valid @RequestBody CreateProjectRequest createProjectRequest) {
        Project project = projectMapper.toEntity(createProjectRequest);
        
        // Set project lead if provided
        if (createProjectRequest.getProjectLeadId() != null) {
            project.setProjectLead(userService.getUserById(createProjectRequest.getProjectLeadId())
                    .orElseThrow(() -> new RuntimeException("User not found")));
        }
        
        Project savedProject = projectService.createProject(project);
        ProjectDto projectDto = projectMapper.toDto(savedProject);
        return ResponseEntity.ok(projectDto);
    }

    // Update project
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ProjectDto> updateProject(@PathVariable Long id, @Valid @RequestBody CreateProjectRequest createProjectRequest) {
        Project project = projectService.getProjectById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        
        projectMapper.updateProjectFromRequest(project, createProjectRequest);
        
        // Set project lead if provided
        if (createProjectRequest.getProjectLeadId() != null) {
            project.setProjectLead(userService.getUserById(createProjectRequest.getProjectLeadId())
                    .orElseThrow(() -> new RuntimeException("User not found")));
        }
        
        Project updatedProject = projectService.updateProject(id, project);
        ProjectDto projectDto = projectMapper.toDto(updatedProject);
        return ResponseEntity.ok(projectDto);
    }

    // Delete project
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok().build();
    }

    // Get projects by type
    @GetMapping("/type/{projectType}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<List<ProjectDto>> getProjectsByType(@PathVariable Project.ProjectType projectType) {
        List<Project> projects = projectService.getProjectsByType(projectType);
        List<ProjectDto> projectDtos = projectMapper.toDtoList(projects);
        return ResponseEntity.ok(projectDtos);
    }

    // Get projects by category
    @GetMapping("/category/{projectCategory}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<List<ProjectDto>> getProjectsByCategory(@PathVariable Project.ProjectCategory projectCategory) {
        List<Project> projects = projectService.getProjectsByCategory(projectCategory);
        List<ProjectDto> projectDtos = projectMapper.toDtoList(projects);
        return ResponseEntity.ok(projectDtos);
    }

    // Get projects by lead
    @GetMapping("/lead/{leadUserId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<List<ProjectDto>> getProjectsByLead(@PathVariable Long leadUserId) {
        List<Project> projects = projectService.getProjectsByLead(leadUserId);
        List<ProjectDto> projectDtos = projectMapper.toDtoList(projects);
        return ResponseEntity.ok(projectDtos);
    }

    // Get projects by member
    @GetMapping("/member/{memberUserId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<List<ProjectDto>> getProjectsByMember(@PathVariable Long memberUserId) {
        List<Project> projects = projectService.getProjectsByMember(memberUserId);
        List<ProjectDto> projectDtos = projectMapper.toDtoList(projects);
        return ResponseEntity.ok(projectDtos);
    }

    // Search projects
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<List<ProjectDto>> searchProjects(@RequestParam String keyword) {
        List<Project> projects = projectService.searchProjects(keyword);
        List<ProjectDto> projectDtos = projectMapper.toDtoList(projects);
        return ResponseEntity.ok(projectDtos);
    }

    // Get issues by project - matches API /api/projects/{projectId}/issues
    @GetMapping("/{projectId}/issues")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<List<IssueDto>> getIssuesByProject(@PathVariable Long projectId) {
        List<Issue> issues = issueService.getIssuesByProject(projectId);
        List<IssueDto> issueDtos = issueMapper.toDtoList(issues);
        return ResponseEntity.ok(issueDtos);
    }

    // Add member to project
    @PostMapping("/{projectId}/members/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ProjectDto> addMemberToProject(@PathVariable Long projectId, @PathVariable Long userId) {
        Project project = projectService.addMemberToProject(projectId, userId);
        ProjectDto projectDto = projectMapper.toDto(project);
        return ResponseEntity.ok(projectDto);
    }

    // Remove member from project
    @DeleteMapping("/{projectId}/members/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ProjectDto> removeMemberFromProject(@PathVariable Long projectId, @PathVariable Long userId) {
        Project project = projectService.removeMemberFromProject(projectId, userId);
        ProjectDto projectDto = projectMapper.toDto(project);
        return ResponseEntity.ok(projectDto);
    }

    // Set project lead
    @PostMapping("/{projectId}/lead/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ProjectDto> setProjectLead(@PathVariable Long projectId, @PathVariable Long userId) {
        Project project = projectService.setProjectLead(projectId, userId);
        ProjectDto projectDto = projectMapper.toDto(project);
        return ResponseEntity.ok(projectDto);
    }

    // Get project timeline
    @GetMapping("/{id}/timeline")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<Object> getProjectTimeline(@PathVariable Long id) {
        // TODO: Implement project timeline functionality
        return ResponseEntity.ok().build();
    }

    // Get project settings
    @GetMapping("/{id}/settings")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Object> getProjectSettings(@PathVariable Long id) {
        // TODO: Implement project settings functionality
        return ResponseEntity.ok().build();
    }

    // Update project settings
    @PutMapping("/{id}/settings")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Object> updateProjectSettings(@PathVariable Long id, @RequestBody Object settings) {
        // TODO: Implement project settings update functionality
        return ResponseEntity.ok().build();
    }

    // Get project activity
    @GetMapping("/{id}/activity")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<Object> getProjectActivity(@PathVariable Long id) {
        // TODO: Implement project activity functionality
        return ResponseEntity.ok().build();
    }

    // Get recent project activity
    @GetMapping("/{id}/activity/recent")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<Object> getRecentProjectActivity(@PathVariable Long id) {
        // TODO: Implement recent project activity functionality
        return ResponseEntity.ok().build();
    }

    // Get project progress
    @GetMapping("/{id}/progress")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<Object> getProjectProgress(@PathVariable Long id) {
        // TODO: Implement project progress functionality
        return ResponseEntity.ok().build();
    }

    // Get project metrics
    @GetMapping("/{id}/metrics")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<Object> getProjectMetrics(@PathVariable Long id) {
        // TODO: Implement project metrics functionality
        return ResponseEntity.ok().build();
    }

    // Get project burndown chart data
    @GetMapping("/{id}/burndown")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<Object> getProjectBurndown(@PathVariable Long id) {
        // TODO: Implement project burndown chart functionality
        return ResponseEntity.ok().build();
    }

    // Get project velocity chart data
    @GetMapping("/{id}/velocity")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<Object> getProjectVelocity(@PathVariable Long id) {
        // TODO: Implement project velocity chart functionality
        return ResponseEntity.ok().build();
    }
} 