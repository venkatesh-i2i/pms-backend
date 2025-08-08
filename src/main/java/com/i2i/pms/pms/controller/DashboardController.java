package com.i2i.pms.pms.controller;

import com.i2i.pms.pms.dto.DashboardDto;
import com.i2i.pms.pms.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    // Get admin dashboard - matches API /api/dashboard/admin
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardDto> getAdminDashboard() {
        DashboardDto dashboard = dashboardService.getOverallDashboard();
        return ResponseEntity.ok(dashboard);
    }

    // Get project manager dashboard - matches API /api/dashboard/project-manager
    @GetMapping("/project-manager")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<DashboardDto> getProjectManagerDashboard() {
        DashboardDto dashboard = dashboardService.getOverallDashboard();
        return ResponseEntity.ok(dashboard);
    }

    // Get dashboard for a specific project manager - matches API /api/dashboard/project-manager/{managerId}
    @GetMapping("/project-manager/{managerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<DashboardDto> getSpecificManagerDashboard(@PathVariable Long managerId) {
        DashboardDto dashboard = dashboardService.getManagerDashboard(managerId);
        return ResponseEntity.ok(dashboard);
    }

    // Get developer dashboard - matches API /api/dashboard/developer
    @GetMapping("/developer")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<DashboardDto> getDeveloperDashboard() {
        DashboardDto dashboard = dashboardService.getOverallDashboard();
        return ResponseEntity.ok(dashboard);
    }

    // Get developer dashboard by user - matches API /api/dashboard/developer/{developerId}
    @GetMapping("/developer/{developerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<DashboardDto> getDeveloperDashboardById(@PathVariable Long developerId) {
        DashboardDto dashboard = dashboardService.getAssignedIssuesDashboard(developerId);
        return ResponseEntity.ok(dashboard);
    }

    // Get dashboard for a specific project manager (legacy endpoint)
    @GetMapping("/manager/{managerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<DashboardDto> getManagerDashboard(@PathVariable Long managerId) {
        DashboardDto dashboard = dashboardService.getManagerDashboard(managerId);
        return ResponseEntity.ok(dashboard);
    }

    // Get dashboard for a specific project
    @GetMapping("/project/{projectId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<DashboardDto> getProjectDashboard(@PathVariable Long projectId) {
        DashboardDto dashboard = dashboardService.getProjectDashboard(projectId);
        return ResponseEntity.ok(dashboard);
    }

    // Get dashboard for projects where user is lead
    @GetMapping("/projects-as-lead/{leadUserId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<DashboardDto> getProjectsAsLeadDashboard(@PathVariable Long leadUserId) {
        DashboardDto dashboard = dashboardService.getProjectsAsLeadDashboard(leadUserId);
        return ResponseEntity.ok(dashboard);
    }

    // Get dashboard for projects where user is member
    @GetMapping("/projects-as-member/{memberUserId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<DashboardDto> getProjectsAsMemberDashboard(@PathVariable Long memberUserId) {
        DashboardDto dashboard = dashboardService.getProjectsAsMemberDashboard(memberUserId);
        return ResponseEntity.ok(dashboard);
    }

    // Get dashboard for issues assigned to a user
    @GetMapping("/assigned-issues/{assigneeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<DashboardDto> getAssignedIssuesDashboard(@PathVariable Long assigneeId) {
        DashboardDto dashboard = dashboardService.getAssignedIssuesDashboard(assigneeId);
        return ResponseEntity.ok(dashboard);
    }

    // Get dashboard for issues reported by a user
    @GetMapping("/reported-issues/{reporterId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<DashboardDto> getReportedIssuesDashboard(@PathVariable Long reporterId) {
        DashboardDto dashboard = dashboardService.getReportedIssuesDashboard(reporterId);
        return ResponseEntity.ok(dashboard);
    }

    // Get dashboard for a specific time period
    @GetMapping("/period")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<DashboardDto> getDashboardForPeriod(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        DashboardDto dashboard = dashboardService.getDashboardForPeriod(startDate, endDate);
        return ResponseEntity.ok(dashboard);
    }

    // Get real-time dashboard (last 24 hours)
    @GetMapping("/realtime")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<DashboardDto> getRealTimeDashboard() {
        DashboardDto dashboard = dashboardService.getRealTimeDashboard();
        return ResponseEntity.ok(dashboard);
    }

    // Get current user's dashboard (combines multiple perspectives)
    @GetMapping("/my-dashboard")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<DashboardDto> getMyDashboard(@RequestParam(required = false) Long userId) {
        // This endpoint combines multiple dashboard perspectives for the current user
        // For now, return overall dashboard, but this could be enhanced to combine
        // manager, member, assignee, and reporter dashboards
        DashboardDto dashboard = dashboardService.getOverallDashboard();
        return ResponseEntity.ok(dashboard);
    }
} 