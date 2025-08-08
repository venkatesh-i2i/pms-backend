package com.i2i.pms.pms.service;

import com.i2i.pms.pms.dto.DashboardDto;

public interface DashboardService {
    
    /**
     * Get overall dashboard statistics for all projects
     */
    DashboardDto getOverallDashboard();
    
    /**
     * Get dashboard statistics for a specific project manager
     */
    DashboardDto getManagerDashboard(Long managerId);
    
    /**
     * Get dashboard statistics for a specific project
     */
    DashboardDto getProjectDashboard(Long projectId);
    
    /**
     * Get dashboard statistics for projects led by a specific user
     */
    DashboardDto getProjectsAsLeadDashboard(Long leadUserId);
    
    /**
     * Get dashboard statistics for projects where user is a member
     */
    DashboardDto getProjectsAsMemberDashboard(Long memberUserId);
    
    /**
     * Get dashboard statistics for issues assigned to a specific user
     */
    DashboardDto getAssignedIssuesDashboard(Long assigneeId);
    
    /**
     * Get dashboard statistics for issues reported by a specific user
     */
    DashboardDto getReportedIssuesDashboard(Long reporterId);
    
    /**
     * Get dashboard statistics for a specific time period
     */
    DashboardDto getDashboardForPeriod(String startDate, String endDate);
    
    /**
     * Get real-time dashboard statistics (last 24 hours)
     */
    DashboardDto getRealTimeDashboard();
} 