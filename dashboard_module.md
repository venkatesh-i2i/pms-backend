# Dashboard Module API Documentation

## Base URL
```
http://localhost:8082
```

## Overview
The Dashboard Module provides comprehensive aggregated statistics and metrics for project managers to monitor project health, team performance, and issue tracking. These APIs deliver pre-aggregated data optimized for dashboard displays and real-time monitoring.

## Dashboard Endpoints

### 1. Get Overall Dashboard
**Endpoint:** `GET /api/dashboard/overall`  
**Description:** Retrieve comprehensive statistics for all projects and issues across the system  
**Authorization:** ADMIN, MANAGER

**Curl Command:**
```bash
curl -X GET http://localhost:8082/api/dashboard/overall \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "totalProjects": 15,
  "totalIssues": 245,
  "totalUsers": 25,
  "activeProjects": 12,
  "completedProjects": 3,
  "overdueProjects": 0,
  "todoIssues": 45,
  "inProgressIssues": 78,
  "inReviewIssues": 23,
  "doneIssues": 89,
  "blockedIssues": 10,
  "criticalIssues": 15,
  "highPriorityIssues": 45,
  "mediumPriorityIssues": 120,
  "lowPriorityIssues": 65,
  "bugIssues": 80,
  "storyIssues": 95,
  "taskIssues": 50,
  "epicIssues": 20,
  "overdueIssues": 12,
  "dueThisWeekIssues": 25,
  "dueNextWeekIssues": 18,
  "projectsAsLead": 5,
  "issuesInLeadProjects": 85,
  "completedIssuesInLeadProjects": 45,
  "recentProjects": [
    {
      "id": 1,
      "projectKey": "PMS",
      "name": "Project Management System",
      "description": "A comprehensive project management tool",
      "projectType": "SOFTWARE",
      "projectCategory": "SOFTWARE_DEVELOPMENT",
      "createdAt": "2024-01-01T10:00:00",
      "updatedAt": "2024-01-15T14:30:00",
      "isActive": true,
      "projectLead": {
        "id": 1,
        "name": "John Doe",
        "username": "johndoe",
        "email": "john@example.com",
        "isActive": true,
        "createdAt": "2024-01-01T10:00:00",
        "updatedAt": "2024-01-01T10:00:00",
        "roles": [
          {
            "id": 1,
            "name": "ADMIN",
            "description": "Administrator role"
          }
        ]
      },
      "memberCount": 8,
      "issueCount": 45,
      "completedIssueCount": 23,
      "completionPercentage": 51.11
    }
  ],
  "recentIssues": [
    {
      "id": 1,
      "issueKey": "PMS-123",
      "summary": "Implement user authentication",
      "description": "Add JWT-based authentication system",
      "issueType": "STORY",
      "priority": "HIGH",
      "status": "IN_PROGRESS",
      "resolution": null,
      "createdAt": "2024-01-10T09:00:00",
      "updatedAt": "2024-01-15T16:45:00",
      "dueDate": "2024-01-20T17:00:00",
      "estimatedTime": 16,
      "actualTime": 12,
      "project": {
        "id": 1,
        "projectKey": "PMS",
        "name": "Project Management System",
        "description": "A comprehensive project management tool",
        "projectType": "SOFTWARE",
        "projectCategory": "SOFTWARE_DEVELOPMENT",
        "isActive": true,
        "createdAt": "2024-01-01T10:00:00",
        "updatedAt": "2024-01-01T10:00:00",
        "projectLead": {
          "id": 1,
          "name": "John Doe",
          "username": "johndoe",
          "email": "john@example.com",
          "isActive": true,
          "createdAt": "2024-01-01T10:00:00",
          "updatedAt": "2024-01-01T10:00:00",
          "roles": [
            {
              "id": 1,
              "name": "ADMIN",
              "description": "Administrator role"
            }
          ]
        },
        "members": [],
        "issueCount": 45
      },
      "reporter": {
        "id": 1,
        "name": "John Doe",
        "username": "johndoe",
        "email": "john@example.com",
        "isActive": true,
        "createdAt": "2024-01-01T10:00:00",
        "updatedAt": "2024-01-01T10:00:00",
        "roles": [
          {
            "id": 1,
            "name": "ADMIN",
            "description": "Administrator role"
          }
        ]
      },
      "assignee": {
        "id": 2,
        "name": "Jane Smith",
        "username": "janesmith",
        "email": "jane@example.com",
        "isActive": true,
        "createdAt": "2024-01-01T11:00:00",
        "updatedAt": "2024-01-01T11:00:00",
        "roles": [
          {
            "id": 2,
            "name": "MANAGER",
            "description": "Manager role"
          }
        ]
      },
      "commentCount": 5,
      "watcherCount": 3,
      "isOverdue": false,
      "daysOverdue": null
    }
  ],
  "averageIssueResolutionTime": 48.5,
  "projectCompletionRate": 20.0,
  "issueCompletionRate": 36.33,
  "issuesByStatus": {
    "TODO": 45,
    "IN_PROGRESS": 78,
    "IN_REVIEW": 23,
    "DONE": 89,
    "BLOCKED": 10
  },
  "issuesByPriority": {
    "CRITICAL": 15,
    "HIGH": 45,
    "MEDIUM": 120,
    "LOW": 65
  },
  "issuesByType": {
    "BUG": 80,
    "STORY": 95,
    "TASK": 50,
    "EPIC": 20
  },
  "projectsByType": {
    "SOFTWARE": 10,
    "HARDWARE": 3,
    "SERVICE": 2
  },
  "projectsByCategory": {
    "SOFTWARE_DEVELOPMENT": 8,
    "BUSINESS": 4,
    "RESEARCH": 3
  },
  "totalTeamMembers": 25,
  "activeTeamMembers": 22,
  "issuesByAssignee": {
    "John Doe": 15,
    "Jane Smith": 23,
    "Bob Wilson": 18
  },
  "totalComments": 456,
  "totalWatchers": 89,
  "estimatedHours": 1200,
  "actualHours": 980,
  "timeAccuracy": 81.67
}
```

### 2. Get Manager Dashboard
**Endpoint:** `GET /api/dashboard/manager/{managerId}`  
**Description:** Retrieve dashboard statistics for a specific project manager  
**Authorization:** ADMIN, MANAGER

**Curl Command:**
```bash
curl -X GET http://localhost:8082/api/dashboard/manager/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:** Similar to overall dashboard but focused on projects where the user is the lead

### 3. Get Project Dashboard
**Endpoint:** `GET /api/dashboard/project/{projectId}`  
**Description:** Retrieve dashboard statistics for a specific project  
**Authorization:** ADMIN, MANAGER, DEVELOPER, TESTER

**Curl Command:**
```bash
curl -X GET http://localhost:8082/api/dashboard/project/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "totalIssues": 45,
  "todoIssues": 12,
  "inProgressIssues": 18,
  "inReviewIssues": 8,
  "doneIssues": 5,
  "blockedIssues": 2,
  "recentIssues": [...],
  "completedIssuesInLeadProjects": 5,
  "issueCompletionRate": 11.11
}
```

### 4. Get Projects as Lead Dashboard
**Endpoint:** `GET /api/dashboard/projects-as-lead/{leadUserId}`  
**Description:** Retrieve dashboard statistics for projects where user is the lead  
**Authorization:** ADMIN, MANAGER

**Curl Command:**
```bash
curl -X GET http://localhost:8082/api/dashboard/projects-as-lead/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Get Projects as Member Dashboard
**Endpoint:** `GET /api/dashboard/projects-as-member/{memberUserId}`  
**Description:** Retrieve dashboard statistics for projects where user is a member  
**Authorization:** ADMIN, MANAGER, DEVELOPER, TESTER

**Curl Command:**
```bash
curl -X GET http://localhost:8082/api/dashboard/projects-as-member/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 6. Get Assigned Issues Dashboard
**Endpoint:** `GET /api/dashboard/assigned-issues/{assigneeId}`  
**Description:** Retrieve dashboard statistics for issues assigned to a specific user  
**Authorization:** ADMIN, MANAGER, DEVELOPER, TESTER

**Curl Command:**
```bash
curl -X GET http://localhost:8082/api/dashboard/assigned-issues/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 7. Get Reported Issues Dashboard
**Endpoint:** `GET /api/dashboard/reported-issues/{reporterId}`  
**Description:** Retrieve dashboard statistics for issues reported by a specific user  
**Authorization:** ADMIN, MANAGER, DEVELOPER, TESTER

**Curl Command:**
```bash
curl -X GET http://localhost:8082/api/dashboard/reported-issues/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 8. Get Dashboard for Period
**Endpoint:** `GET /api/dashboard/period`  
**Description:** Retrieve dashboard statistics for a specific time period  
**Authorization:** ADMIN, MANAGER

**Curl Command:**
```bash
curl -X GET "http://localhost:8082/api/dashboard/period?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Parameters:**
- `startDate`: Start date in ISO format (YYYY-MM-DD)
- `endDate`: End date in ISO format (YYYY-MM-DD)

### 9. Get Real-Time Dashboard
**Endpoint:** `GET /api/dashboard/realtime`  
**Description:** Retrieve real-time dashboard statistics (last 24 hours)  
**Authorization:** ADMIN, MANAGER

**Curl Command:**
```bash
curl -X GET http://localhost:8082/api/dashboard/realtime \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 10. Get My Dashboard
**Endpoint:** `GET /api/dashboard/my-dashboard`  
**Description:** Retrieve personalized dashboard for the current user  
**Authorization:** ADMIN, MANAGER, DEVELOPER, TESTER

**Curl Command:**
```bash
curl -X GET http://localhost:8082/api/dashboard/my-dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Optional Parameters:**
- `userId`: Specific user ID (if not provided, uses current user)

## Dashboard Metrics Explained

### Overall Statistics
- **totalProjects**: Total number of projects in the system
- **totalIssues**: Total number of issues across all projects
- **totalUsers**: Total number of users in the system

### Project Statistics
- **activeProjects**: Number of active projects
- **completedProjects**: Number of completed projects
- **overdueProjects**: Number of projects past their deadline

### Issue Statistics by Status
- **todoIssues**: Issues in TODO status
- **inProgressIssues**: Issues currently being worked on
- **inReviewIssues**: Issues under review
- **doneIssues**: Completed issues
- **blockedIssues**: Issues that are blocked

### Issue Statistics by Priority
- **criticalIssues**: Critical priority issues
- **highPriorityIssues**: High priority issues
- **mediumPriorityIssues**: Medium priority issues
- **lowPriorityIssues**: Low priority issues

### Issue Statistics by Type
- **bugIssues**: Bug type issues
- **storyIssues**: User story issues
- **taskIssues**: Task type issues
- **epicIssues**: Epic type issues

### Time-based Statistics
- **overdueIssues**: Issues past their due date
- **dueThisWeekIssues**: Issues due within the current week
- **dueNextWeekIssues**: Issues due within the next week

### Performance Metrics
- **averageIssueResolutionTime**: Average time to resolve issues (in hours)
- **projectCompletionRate**: Percentage of completed projects
- **issueCompletionRate**: Percentage of completed issues

### Charts Data
- **issuesByStatus**: Map of issue counts by status
- **issuesByPriority**: Map of issue counts by priority
- **issuesByType**: Map of issue counts by type
- **projectsByType**: Map of project counts by type
- **projectsByCategory**: Map of project counts by category

### Team Statistics
- **totalTeamMembers**: Total number of team members
- **activeTeamMembers**: Number of active team members
- **issuesByAssignee**: Map of issue counts by assignee

### Custom Metrics
- **totalComments**: Total number of comments across all issues
- **totalWatchers**: Total number of issue watchers
- **estimatedHours**: Total estimated hours across all issues
- **actualHours**: Total actual hours spent on issues
- **timeAccuracy**: Percentage accuracy of time estimates

## Recent Activity Data

### RecentProjectDto
- **id**: Project ID
- **projectKey**: Unique project key
- **name**: Project name
- **description**: Project description
- **projectType**: Type of project (SOFTWARE, HARDWARE, SERVICE)
- **projectCategory**: Category of project
- **createdAt**: Project creation timestamp
- **updatedAt**: Last update timestamp
- **isActive**: Whether project is active
- **projectLead**: User who leads the project
- **memberCount**: Number of project members
- **issueCount**: Total number of issues in project
- **completedIssueCount**: Number of completed issues
- **completionPercentage**: Percentage of completed issues

### RecentIssueDto
- **id**: Issue ID
- **issueKey**: Unique issue key
- **summary**: Issue summary
- **description**: Issue description
- **issueType**: Type of issue (BUG, STORY, TASK, EPIC)
- **priority**: Issue priority (CRITICAL, HIGH, MEDIUM, LOW)
- **status**: Current status (TODO, IN_PROGRESS, IN_REVIEW, DONE, BLOCKED)
- **resolution**: Issue resolution (if completed)
- **createdAt**: Issue creation timestamp
- **updatedAt**: Last update timestamp
- **dueDate**: Issue due date
- **estimatedTime**: Estimated time in hours
- **actualTime**: Actual time spent in hours
- **project**: Associated project
- **reporter**: User who reported the issue
- **assignee**: User assigned to the issue
- **commentCount**: Number of comments
- **watcherCount**: Number of watchers
- **isOverdue**: Whether issue is overdue
- **daysOverdue**: Number of days overdue (if applicable)

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Access denied"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Notes

1. **Performance Optimized**: Dashboard APIs use optimized database queries to provide fast response times
2. **Real-time Data**: All statistics are calculated in real-time from the database
3. **Role-based Access**: Different dashboard endpoints have different access levels based on user roles
4. **Comprehensive Metrics**: Provides both high-level overview and detailed breakdowns
5. **Chart-ready Data**: Returns data structures optimized for chart libraries
6. **Recent Activity**: Includes recent projects and issues for quick overview
7. **Time Tracking**: Includes estimated vs actual time metrics for project management
8. **Overdue Tracking**: Identifies overdue issues and projects
9. **Team Performance**: Tracks individual and team performance metrics
10. **Completion Rates**: Calculates project and issue completion percentages

## Use Cases

### For Project Managers
- Monitor overall project health
- Track team performance
- Identify bottlenecks and blocked issues
- Monitor time estimates vs actual time
- View recent activity and updates

### For Team Members
- Track assigned issues
- Monitor personal workload
- View project progress
- Check overdue items

### For Administrators
- System-wide overview
- User activity monitoring
- Performance analytics
- Resource allocation insights 