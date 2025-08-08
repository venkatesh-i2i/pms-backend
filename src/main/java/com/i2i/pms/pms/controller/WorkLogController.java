package com.i2i.pms.pms.controller;

import com.i2i.pms.pms.dto.CreateWorkLogRequest;
import com.i2i.pms.pms.dto.WorkLogDto;
import com.i2i.pms.pms.entity.Issue;
import com.i2i.pms.pms.entity.User;
import com.i2i.pms.pms.entity.WorkLog;
import com.i2i.pms.pms.exception.ResourceNotFoundException;
import com.i2i.pms.pms.mapper.WorkLogMapper;
import com.i2i.pms.pms.repository.IssueRepository;
import com.i2i.pms.pms.repository.UserRepository;
import com.i2i.pms.pms.service.WorkLogService;
import com.i2i.pms.pms.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
// import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/worklogs")
public class WorkLogController {

    @Autowired
    private WorkLogService workLogService;

    @Autowired
    private WorkLogMapper workLogMapper;

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    // Get work logs by issue - matches API /api/issues/{issueId}/worklogs
    @GetMapping("/issue/{issueId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<List<WorkLogDto>> getWorkLogsByIssue(@PathVariable Long issueId) {
        List<WorkLog> workLogs = workLogService.getWorkLogsByIssue(issueId);
        List<WorkLogDto> workLogDtos = workLogMapper.toDtoList(workLogs);
        return ResponseEntity.ok(workLogDtos);
    }

    // Alias to match frontend path: /api/issues/{issueId}/worklogs
    @GetMapping("/../issues/{issueId}/worklogs")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<List<WorkLogDto>> getWorkLogsByIssueAlias(@PathVariable Long issueId) {
        List<WorkLog> workLogs = workLogService.getWorkLogsByIssue(issueId);
        List<WorkLogDto> workLogDtos = workLogMapper.toDtoList(workLogs);
        return ResponseEntity.ok(workLogDtos);
    }

    // Get work logs by user - matches API /api/users/{userId}/worklogs
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or #userId == authentication.principal.id")
    public ResponseEntity<List<WorkLogDto>> getWorkLogsByUser(@PathVariable Long userId) {
        List<WorkLog> workLogs = workLogService.getWorkLogsByUser(userId);
        List<WorkLogDto> workLogDtos = workLogMapper.toDtoList(workLogs);
        return ResponseEntity.ok(workLogDtos);
    }

    // Create work log - matches API /api/worklogs
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<WorkLogDto> createWorkLog(
            @Valid @RequestBody CreateWorkLogRequest request,
            @RequestHeader("Authorization") String authorization) {

        // Resolve current user from JWT
        String token = authorization;
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        Long userId = authService.getUserIdFromToken(token);
        if (userId == null) {
            throw new RuntimeException("Invalid token");
        }
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId.toString()));

        // Get the issue
        Issue issue = issueRepository.findById(request.getTaskId())
                .orElseThrow(() -> new ResourceNotFoundException("Issue", "id", request.getTaskId().toString()));

        // Create work log
        WorkLog workLog = new WorkLog();
        workLog.setTimeSpent(request.getHoursWorked() * 60); // Convert hours to minutes
        workLog.setComment(request.getDescription());
        workLog.setIssue(issue);
        workLog.setAuthor(currentUser);
        
        if (request.getWorkDate() != null) {
            workLog.setDate(request.getWorkDate().atStartOfDay());
        }

        WorkLog savedWorkLog = workLogService.createWorkLog(workLog);
        WorkLogDto workLogDto = workLogMapper.toDto(savedWorkLog);
        return ResponseEntity.ok(workLogDto);
    }

    // Get work log by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<WorkLogDto> getWorkLogById(@PathVariable Long id) {
        WorkLog workLog = workLogService.getWorkLogById(id)
                .orElseThrow(() -> new ResourceNotFoundException("WorkLog", "id", id.toString()));
        WorkLogDto workLogDto = workLogMapper.toDto(workLog);
        return ResponseEntity.ok(workLogDto);
    }

    // Update work log
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or @workLogService.isAuthor(#id, authentication.name)")
    public ResponseEntity<WorkLogDto> updateWorkLog(
            @PathVariable Long id,
            @Valid @RequestBody CreateWorkLogRequest request) {
        
        WorkLog existingWorkLog = workLogService.getWorkLogById(id)
                .orElseThrow(() -> new ResourceNotFoundException("WorkLog", "id", id.toString()));

        existingWorkLog.setTimeSpent(request.getHoursWorked() * 60); // Convert hours to minutes
        existingWorkLog.setComment(request.getDescription());
        
        if (request.getWorkDate() != null) {
            existingWorkLog.setDate(request.getWorkDate().atStartOfDay());
        }

        WorkLog updatedWorkLog = workLogService.updateWorkLog(id, existingWorkLog);
        WorkLogDto workLogDto = workLogMapper.toDto(updatedWorkLog);
        return ResponseEntity.ok(workLogDto);
    }

    // Delete work log
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or @workLogService.isAuthor(#id, authentication.name)")
    public ResponseEntity<Void> deleteWorkLog(@PathVariable Long id) {
        workLogService.deleteWorkLog(id);
        return ResponseEntity.ok().build();
    }

    // Get total hours logged by user
    @GetMapping("/user/{userId}/total-hours")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or #userId == authentication.principal.id")
    public ResponseEntity<Double> getTotalHoursByUser(@PathVariable Long userId) {
        Double totalHours = workLogService.getTotalHoursByUser(userId);
        return ResponseEntity.ok(totalHours);
    }

    // Get total hours logged for an issue
    @GetMapping("/issue/{issueId}/total-hours")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<Double> getTotalHoursByIssue(@PathVariable Long issueId) {
        Double totalHours = workLogService.getTotalHoursByIssue(issueId);
        return ResponseEntity.ok(totalHours);
    }

    // Alias to match frontend path: /api/issues/{issueId}/total-hours
    @GetMapping("/../issues/{issueId}/total-hours")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<Double> getTotalHoursByIssueAlias(@PathVariable Long issueId) {
        Double totalHours = workLogService.getTotalHoursByIssue(issueId);
        return ResponseEntity.ok(totalHours);
    }
}