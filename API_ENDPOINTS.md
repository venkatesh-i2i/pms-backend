# API Endpoints Documentation

## Authentication APIs

### Login
```
API: /api/auth/login
Method: POST
Role Access: Public
Request Body:
{
  "email": "user@example.com",
  "password": "password123"
}
Response:
{
  "token": "jwt_token_string",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name",
    "role": "ADMIN|PROJECT_MANAGER|DEVELOPER|QA"
  }
}
```

### Logout
```
API: /api/auth/logout
Method: POST
Role Access: All authenticated users
Request Body: {}
Response:
{
  "message": "Logged out successfully"
}
```

## User APIs

### Get All Users
```
API: /api/users
Method: GET
Role Access: ADMIN, PROJECT_MANAGER
Request Body: N/A
Response:
[
  {
    "id": 1,
    "name": "User Name",
    "email": "user@example.com",
    "role": "ADMIN|PROJECT_MANAGER|DEVELOPER|QA",
    "isActive": true,
    "avatar": "UN",
    "createdAt": "2024-01-01T10:00:00Z",
    "updatedAt": "2024-01-01T10:00:00Z"
  }
]
```

### Get Current User
```
API: /api/users/me
Method: GET
Role Access: All authenticated users
Request Body: N/A
Response:
{
  "id": 1,
  "name": "User Name",
  "email": "user@example.com",
  "role": "ADMIN|PROJECT_MANAGER|DEVELOPER|QA",
  "isActive": true,
  "avatar": "UN"
}
```

### Create User
```
API: /api/users
Method: POST
Role Access: ADMIN
Request Body:
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123",
  "role": "ADMIN|PROJECT_MANAGER|DEVELOPER|QA"
}
Response:
{
  "id": 2,
  "name": "New User",
  "email": "newuser@example.com",
  "role": "DEVELOPER",
  "isActive": true,
  "avatar": "NU",
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-01-01T10:00:00Z"
}
```

### Update User
```
API: /api/users/{id}
Method: PUT
Role Access: ADMIN, Own profile
Request Body:
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "role": "DEVELOPER",
  "isActive": true
}
Response:
{
  "id": 1,
  "name": "Updated Name",
  "email": "updated@example.com",
  "role": "DEVELOPER",
  "isActive": true,
  "avatar": "UN",
  "updatedAt": "2024-01-01T10:00:00Z"
}
```

## Project APIs

### Get All Projects
```
API: /api/projects
Method: GET
Role Access: All authenticated users
Request Body: N/A
Response:
[
  {
    "id": 1,
    "projectKey": "ECOM",
    "name": "E-commerce Platform",
    "description": "A comprehensive e-commerce platform",
    "projectType": "SOFTWARE",
    "projectCategory": "SOFTWARE_DEVELOPMENT",
    "projectLead": {
      "id": 2,
      "name": "John Smith",
      "email": "john@example.com"
    },
    "isActive": true,
    "startDate": "2024-01-15",
    "endDate": "2024-06-15",
    "progress": 65,
    "status": "IN_PROGRESS",
    "members": [
      {
        "id": 2,
        "name": "John Smith",
        "email": "john@example.com"
      }
    ],
    "milestones": [
      {
        "id": 1,
        "name": "Project Setup",
        "date": "2024-02-01",
        "description": "Initial project setup",
        "completed": true
      }
    ],
    "issueCount": 45,
    "completedIssueCount": 29,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-20T10:00:00Z"
  }
]
```

### Get Project by ID
```
API: /api/projects/{id}
Method: GET
Role Access: All authenticated users
Request Body: N/A
Response:
{
  "id": 1,
  "projectKey": "ECOM",
  "name": "E-commerce Platform",
  "description": "A comprehensive e-commerce platform",
  "projectType": "SOFTWARE",
  "projectCategory": "SOFTWARE_DEVELOPMENT",
  "projectLead": {
    "id": 2,
    "name": "John Smith",
    "email": "john@example.com"
  },
  "isActive": true,
  "startDate": "2024-01-15",
  "endDate": "2024-06-15",
  "progress": 65,
  "status": "IN_PROGRESS",
  "members": [],
  "milestones": [],
  "issueCount": 45,
  "completedIssueCount": 29
}
```

### Create Project
```
API: /api/projects
Method: POST
Role Access: ADMIN, PROJECT_MANAGER
Request Body:
{
  "projectKey": "PROJ",
  "name": "New Project",
  "description": "Project description",
  "projectType": "SOFTWARE",
  "projectCategory": "SOFTWARE_DEVELOPMENT",
  "projectLeadId": 2,
  "startDate": "2024-01-01",
  "endDate": "2024-06-01",
  "milestones": [
    {
      "name": "Milestone 1",
      "date": "2024-02-01",
      "description": "First milestone"
    }
  ]
}
Response:
{
  "id": 2,
  "projectKey": "PROJ",
  "name": "New Project",
  "description": "Project description",
  "projectType": "SOFTWARE",
  "projectCategory": "SOFTWARE_DEVELOPMENT",
  "projectLead": {
    "id": 2,
    "name": "John Smith",
    "email": "john@example.com"
  },
  "isActive": true,
  "startDate": "2024-01-01",
  "endDate": "2024-06-01",
  "progress": 0,
  "status": "PLANNING",
  "members": [],
  "milestones": [],
  "issueCount": 0,
  "completedIssueCount": 0,
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-01-01T10:00:00Z"
}
```

### Update Project
```
API: /api/projects/{id}
Method: PUT
Role Access: ADMIN, PROJECT_MANAGER (own projects)
Request Body:
{
  "name": "Updated Project Name",
  "description": "Updated description",
  "startDate": "2024-01-01",
  "endDate": "2024-06-01",
  "milestones": []
}
Response:
{
  "id": 1,
  "projectKey": "ECOM",
  "name": "Updated Project Name",
  "description": "Updated description",
  "updatedAt": "2024-01-01T10:00:00Z"
}
```

### Add Member to Project
```
API: /api/projects/{projectId}/members/{userId}
Method: POST
Role Access: ADMIN, PROJECT_MANAGER (own projects)
Request Body: {}
Response:
{
  "id": 1,
  "members": [
    {
      "id": 3,
      "name": "Sarah Johnson",
      "email": "sarah@example.com"
    }
  ]
}
```

### Remove Member from Project
```
API: /api/projects/{projectId}/members/{userId}
Method: DELETE
Role Access: ADMIN, PROJECT_MANAGER (own projects)
Request Body: N/A
Response:
{
  "id": 1,
  "members": []
}
```

## Task/Issue APIs

### Get All Issues
```
API: /api/issues
Method: GET
Role Access: All authenticated users
Request Body: N/A
Response:
[
  {
    "id": 1,
    "taskKey": "ECOM-1",
    "title": "User Authentication System",
    "description": "Implement JWT-based user authentication",
    "priority": "HIGH",
    "status": "DONE",
    "projectId": 1,
    "assignee": {
      "id": 2,
      "name": "Sarah Johnson",
      "email": "sarah@example.com"
    },
    "reporter": {
      "id": 1,
      "name": "John Smith",
      "email": "john@example.com"
    },
    "estimatedHours": 16,
    "actualHours": 18,
    "dueDate": "2024-02-15",
    "progress": 100,
    "tags": ["backend", "security"],
    "createdAt": "2024-01-16T10:00:00Z",
    "updatedAt": "2024-02-14T10:00:00Z"
  }
]
```

### Get Issue by ID
```
API: /api/issues/{id}
Method: GET
Role Access: All authenticated users
Request Body: N/A
Response:
{
  "id": 1,
  "taskKey": "ECOM-1",
  "title": "User Authentication System",
  "description": "Implement JWT-based user authentication",
  "priority": "HIGH",
  "status": "DONE",
  "projectId": 1,
  "assignee": {
    "id": 2,
    "name": "Sarah Johnson",
    "email": "sarah@example.com"
  },
  "reporter": {
    "id": 1,
    "name": "John Smith",
    "email": "john@example.com"
  },
  "estimatedHours": 16,
  "actualHours": 18,
  "dueDate": "2024-02-15",
  "progress": 100,
  "tags": ["backend", "security"]
}
```

### Get Issues by Project
```
API: /api/projects/{projectId}/issues
Method: GET
Role Access: All authenticated users
Request Body: N/A
Response:
[
  {
    "id": 1,
    "taskKey": "ECOM-1",
    "title": "User Authentication System",
    "status": "DONE",
    "priority": "HIGH",
    "assignee": {
      "id": 2,
      "name": "Sarah Johnson"
    }
  }
]
```

### Get Issues by Assignee
```
API: /api/users/{userId}/issues
Method: GET
Role Access: All authenticated users (own issues), ADMIN, PROJECT_MANAGER
Request Body: N/A
Response:
[
  {
    "id": 1,
    "taskKey": "ECOM-1",
    "title": "User Authentication System",
    "status": "DONE",
    "priority": "HIGH",
    "projectId": 1
  }
]
```

### Create Issue
```
API: /api/issues
Method: POST
Role Access: All authenticated users
Request Body:
{
  "title": "New Task",
  "description": "Task description",
  "priority": "MEDIUM",
  "projectId": 1,
  "assigneeId": 2,
  "dueDate": "2024-03-01",
  "estimatedHours": 8,
  "tags": ["frontend"]
}
Response:
{
  "id": 2,
  "taskKey": "ECOM-2",
  "title": "New Task",
  "description": "Task description",
  "priority": "MEDIUM",
  "status": "TODO",
  "projectId": 1,
  "assignee": {
    "id": 2,
    "name": "Sarah Johnson",
    "email": "sarah@example.com"
  },
  "estimatedHours": 8,
  "actualHours": 0,
  "dueDate": "2024-03-01",
  "progress": 0,
  "tags": ["frontend"],
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-01-01T10:00:00Z"
}
```

### Update Issue
```
API: /api/issues/{id}
Method: PUT
Role Access: All authenticated users (assigned issues), ADMIN, PROJECT_MANAGER
Request Body:
{
  "title": "Updated Task",
  "description": "Updated description",
  "priority": "HIGH",
  "status": "IN_PROGRESS",
  "estimatedHours": 10
}
Response:
{
  "id": 1,
  "title": "Updated Task",
  "description": "Updated description",
  "priority": "HIGH",
  "status": "IN_PROGRESS",
  "estimatedHours": 10,
  "updatedAt": "2024-01-01T10:00:00Z"
}
```

### Update Issue Status
```
API: /api/issues/{id}/status
Method: PATCH
Role Access: All authenticated users (assigned issues), ADMIN, PROJECT_MANAGER
Request Body:
{
  "status": "IN_PROGRESS"
}
Response:
{
  "id": 1,
  "status": "IN_PROGRESS",
  "progress": 25,
  "updatedAt": "2024-01-01T10:00:00Z"
}
```

## Comment APIs

### Get Comments by Issue
```
API: /api/issues/{issueId}/comments
Method: GET
Role Access: All authenticated users
Request Body: N/A
Response:
[
  {
    "id": 1,
    "taskId": 1,
    "author": {
      "id": 1,
      "name": "John Smith",
      "email": "john@example.com",
      "avatar": "JS"
    },
    "content": "Great work on the authentication system!",
    "createdAt": "2024-02-10T14:30:00Z",
    "updatedAt": "2024-02-10T14:30:00Z"
  }
]
```

### Create Comment
```
API: /api/comments
Method: POST
Role Access: All authenticated users
Request Body:
{
  "taskId": 1,
  "content": "This is a new comment"
}
Response:
{
  "id": 2,
  "taskId": 1,
  "author": {
    "id": 2,
    "name": "Sarah Johnson",
    "email": "sarah@example.com",
    "avatar": "SJ"
  },
  "content": "This is a new comment",
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-01-01T10:00:00Z"
}
```

### Update Comment
```
API: /api/comments/{id}
Method: PUT
Role Access: Author of comment, ADMIN
Request Body:
{
  "content": "Updated comment content"
}
Response:
{
  "id": 1,
  "content": "Updated comment content",
  "updatedAt": "2024-01-01T10:00:00Z"
}
```

### Delete Comment
```
API: /api/comments/{id}
Method: DELETE
Role Access: Author of comment, ADMIN
Request Body: N/A
Response:
{
  "message": "Comment deleted successfully"
}
```

## File APIs

### Get Files by Project
```
API: /api/projects/{projectId}/files
Method: GET
Role Access: All authenticated users
Request Body: N/A
Response:
[
  {
    "id": 1,
    "filename": "auth_system_design.pdf",
    "originalFilename": "Authentication System Design.pdf",
    "fileSize": 2048576,
    "fileType": "application/pdf",
    "projectId": 1,
    "taskId": null,
    "uploadedBy": {
      "id": 2,
      "name": "Sarah Johnson"
    },
    "uploadedAt": "2024-01-18T10:00:00Z",
    "downloadUrl": "/api/files/1/download"
  }
]
```

### Get Files by Issue
```
API: /api/issues/{issueId}/files
Method: GET
Role Access: All authenticated users
Request Body: N/A
Response:
[
  {
    "id": 2,
    "filename": "api_documentation.md",
    "originalFilename": "API Documentation.md",
    "fileSize": 51200,
    "fileType": "text/markdown",
    "projectId": 1,
    "taskId": 2,
    "uploadedBy": {
      "id": 3,
      "name": "Mike Wilson"
    },
    "uploadedAt": "2024-02-01T14:30:00Z",
    "downloadUrl": "/api/files/2/download"
  }
]
```

### Upload File
```
API: /api/files
Method: POST
Role Access: All authenticated users
Request Body: (multipart/form-data)
{
  "file": [binary file data],
  "projectId": 1,
  "taskId": 2 (optional)
}
Response:
{
  "id": 3,
  "filename": "generated_filename.pdf",
  "originalFilename": "document.pdf",
  "fileSize": 1024000,
  "fileType": "application/pdf",
  "projectId": 1,
  "taskId": 2,
  "uploadedBy": {
    "id": 2,
    "name": "Sarah Johnson"
  },
  "uploadedAt": "2024-01-01T10:00:00Z",
  "downloadUrl": "/api/files/3/download"
}
```

### Download File
```
API: /api/files/{id}/download
Method: GET
Role Access: All authenticated users
Request Body: N/A
Response: Binary file data with appropriate headers
```

### Delete File
```
API: /api/files/{id}
Method: DELETE
Role Access: File uploader, ADMIN, PROJECT_MANAGER
Request Body: N/A
Response:
{
  "message": "File deleted successfully"
}
```

## Work Log APIs

### Get Work Logs by Issue
```
API: /api/issues/{issueId}/worklogs
Method: GET
Role Access: All authenticated users
Request Body: N/A
Response:
[
  {
    "id": 1,
    "taskId": 1,
    "userId": 2,
    "hoursWorked": 4.5,
    "workDate": "2024-02-08",
    "description": "Implemented JWT token generation and validation logic",
    "createdAt": "2024-02-08T17:00:00Z"
  }
]
```

### Get Work Logs by User
```
API: /api/users/{userId}/worklogs
Method: GET
Role Access: Own work logs, ADMIN, PROJECT_MANAGER
Request Body: N/A
Response:
[
  {
    "id": 1,
    "taskId": 1,
    "userId": 2,
    "hoursWorked": 4.5,
    "workDate": "2024-02-08",
    "description": "Implemented JWT token generation and validation logic",
    "createdAt": "2024-02-08T17:00:00Z"
  }
]
```

### Create Work Log
```
API: /api/worklogs
Method: POST
Role Access: All authenticated users
Request Body:
{
  "taskId": 1,
  "hoursWorked": 3.5,
  "workDate": "2024-01-01",
  "description": "Fixed authentication bugs"
}
Response:
{
  "id": 2,
  "taskId": 1,
  "userId": 2,
  "hoursWorked": 3.5,
  "workDate": "2024-01-01",
  "description": "Fixed authentication bugs",
  "createdAt": "2024-01-01T17:00:00Z"
}
```

## Notification APIs

### Get User Notifications
```
API: /api/users/{userId}/notifications
Method: GET
Role Access: Own notifications, ADMIN
Request Body: N/A
Response:
[
  {
    "id": 1,
    "userId": 2,
    "title": "New task assigned",
    "message": "You have been assigned to task ECOM-3: Shopping Cart Frontend",
    "type": "TASK_ASSIGNED",
    "isRead": false,
    "createdAt": "2024-01-25T10:00:00Z",
    "relatedTaskId": 3,
    "relatedProjectId": 1
  }
]
```

### Mark Notification as Read
```
API: /api/notifications/{id}/read
Method: PATCH
Role Access: Notification owner, ADMIN
Request Body: {}
Response:
{
  "id": 1,
  "isRead": true,
  "updatedAt": "2024-01-01T10:00:00Z"
}
```

### Mark All Notifications as Read
```
API: /api/users/{userId}/notifications/read-all
Method: PATCH
Role Access: Notification owner, ADMIN
Request Body: {}
Response:
{
  "message": "All notifications marked as read",
  "count": 5
}
```

## Dashboard APIs

### Get Admin Dashboard
```
API: /api/dashboard/admin
Method: GET
Role Access: ADMIN
Request Body: N/A
Response:
{
  "totalUsers": 6,
  "usersByRole": {
    "ADMIN": 1,
    "PROJECT_MANAGER": 1,
    "DEVELOPER": 3,
    "QA": 1
  },
  "totalProjects": 3,
  "activeProjects": 3,
  "totalTasks": 8,
  "tasksByStatus": {
    "TODO": 2,
    "IN_PROGRESS": 3,
    "IN_REVIEW": 1,
    "DONE": 2
  },
  "tasksByPriority": {
    "CRITICAL": 1,
    "HIGH": 2,
    "MEDIUM": 3,
    "LOW": 2
  },
  "recentUsers": [
    {
      "id": 6,
      "name": "David Brown",
      "email": "david@example.com",
      "role": "DEVELOPER",
      "isActive": true
    }
  ]
}
```

### Get Project Manager Dashboard
```
API: /api/dashboard/project-manager/{userId}
Method: GET
Role Access: PROJECT_MANAGER (own), ADMIN
Request Body: N/A
Response:
{
  "assignedProjects": [
    {
      "id": 1,
      "name": "E-commerce Platform",
      "projectKey": "ECOM",
      "progress": 65,
      "issueCount": 45,
      "completedIssueCount": 29,
      "members": []
    }
  ],
  "tasksByStatus": {
    "TODO": 10,
    "IN_PROGRESS": 15,
    "IN_REVIEW": 8,
    "DONE": 12
  },
  "highPriorityTasks": [
    {
      "id": 4,
      "taskKey": "ECOM-4",
      "title": "Payment Gateway Integration",
      "priority": "CRITICAL",
      "status": "TODO",
      "projectId": 1,
      "assignee": null,
      "dueDate": "2024-04-01"
    }
  ],
  "overdueTasks": 2,
  "totalTasks": 45
}
```

### Get Developer Dashboard
```
API: /api/dashboard/developer/{userId}
Method: GET
Role Access: DEVELOPER/QA (own), ADMIN, PROJECT_MANAGER
Request Body: N/A
Response:
{
  "assignedTasks": [
    {
      "id": 1,
      "taskKey": "ECOM-1",
      "title": "User Authentication System",
      "priority": "HIGH",
      "status": "DONE",
      "projectId": 1,
      "progress": 100,
      "estimatedHours": 16,
      "actualHours": 18,
      "dueDate": "2024-02-15"
    }
  ],
  "totalHoursLogged": 45.5,
  "hoursThisWeek": 12.0,
  "recentFiles": [
    {
      "id": 1,
      "originalFilename": "auth_system_design.pdf",
      "fileSize": 2048576,
      "uploadedAt": "2024-01-18T10:00:00Z",
      "downloadUrl": "/api/files/1/download"
    }
  ],
  "upcomingDeadlines": [
    {
      "id": 3,
      "taskKey": "ECOM-3",
      "title": "Shopping Cart Frontend",
      "dueDate": "2024-03-15"
    }
  ]
}
```
