# Project Module API Documentation

## Base URL
```
http://localhost:8082
```

## Project Management Endpoints

### 1. Get All Projects
**Endpoint:** `GET /api/projects`  
**Description:** Retrieve all projects  
**Authorization:** ADMIN, MANAGER, DEVELOPER, TESTER

**Curl Command:**
```bash
curl -X GET http://localhost:8082/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
[
  {
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
    "members": [
      {
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
      }
    ],
    "issueCount": 15
  }
]
```

### 2. Get Project by ID
**Endpoint:** `GET /api/projects/{id}`  
**Description:** Retrieve project by ID  
**Authorization:** ADMIN, MANAGER, DEVELOPER, TESTER

**Curl Command:**
```bash
curl -X GET http://localhost:8082/api/projects/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
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
  "members": [
    {
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
    }
  ],
  "issueCount": 15
}
```

### 3. Get Project by Key
**Endpoint:** `GET /api/projects/key/{projectKey}`  
**Description:** Retrieve project by project key  
**Authorization:** ADMIN, MANAGER, DEVELOPER, TESTER

**Curl Command:**
```bash
curl -X GET http://localhost:8082/api/projects/key/PMS \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:** Same as Get Project by ID

### 4. Create Project
**Endpoint:** `POST /api/projects`  
**Description:** Create a new project  
**Authorization:** ADMIN, MANAGER

**Request Body:**
```json
{
  "projectKey": "WEB",
  "name": "Web Application",
  "description": "A modern web application",
  "projectType": "SOFTWARE",
  "projectCategory": "SOFTWARE_DEVELOPMENT",
  "projectLeadId": 1
}
```

**Curl Command:**
```bash
curl -X POST http://localhost:8082/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "projectKey": "WEB",
    "name": "Web Application",
    "description": "A modern web application",
    "projectType": "SOFTWARE",
    "projectCategory": "SOFTWARE_DEVELOPMENT",
    "projectLeadId": 1
  }'
```

**Response:**
```json
{
  "id": 2,
  "projectKey": "WEB",
  "name": "Web Application",
  "description": "A modern web application",
  "projectType": "SOFTWARE",
  "projectCategory": "SOFTWARE_DEVELOPMENT",
  "isActive": true,
  "createdAt": "2024-01-01T12:00:00",
  "updatedAt": "2024-01-01T12:00:00",
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
  "members": [
    {
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
    }
  ],
  "issueCount": 0
}
```

### 5. Update Project
**Endpoint:** `PUT /api/projects/{id}`  
**Description:** Update project information  
**Authorization:** ADMIN, MANAGER

**Request Body:**
```json
{
  "projectKey": "WEB",
  "name": "Updated Web Application",
  "description": "An updated modern web application",
  "projectType": "SOFTWARE",
  "projectCategory": "SOFTWARE_DEVELOPMENT",
  "projectLeadId": 2
}
```

**Curl Command:**
```bash
curl -X PUT http://localhost:8082/api/projects/2 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "projectKey": "WEB",
    "name": "Updated Web Application",
    "description": "An updated modern web application",
    "projectType": "SOFTWARE",
    "projectCategory": "SOFTWARE_DEVELOPMENT",
    "projectLeadId": 2
  }'
```

**Response:** Same as Create Project

### 6. Delete Project
**Endpoint:** `DELETE /api/projects/{id}`  
**Description:** Delete project by ID  
**Authorization:** ADMIN only

**Curl Command:**
```bash
curl -X DELETE http://localhost:8082/api/projects/2 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:** `200 OK` (No content)

### 7. Get Projects by Type
**Endpoint:** `GET /api/projects/type/{projectType}`  
**Description:** Get projects by project type  
**Authorization:** ADMIN, MANAGER, DEVELOPER, TESTER

**Curl Command:**
```bash
curl -X GET http://localhost:8082/api/projects/type/SOFTWARE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:** Array of projects with the specified type

### 8. Get Projects by Category
**Endpoint:** `GET /api/projects/category/{projectCategory}`  
**Description:** Get projects by project category  
**Authorization:** ADMIN, MANAGER, DEVELOPER, TESTER

**Curl Command:**
```bash
curl -X GET http://localhost:8082/api/projects/category/SOFTWARE_DEVELOPMENT \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:** Array of projects with the specified category

### 9. Get Projects by Lead
**Endpoint:** `GET /api/projects/lead/{leadUserId}`  
**Description:** Get projects where user is the project lead  
**Authorization:** ADMIN, MANAGER, DEVELOPER, TESTER

**Curl Command:**
```bash
curl -X GET http://localhost:8082/api/projects/lead/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:** Array of projects where the user is the project lead

### 10. Get Projects by Member
**Endpoint:** `GET /api/projects/member/{memberUserId}`  
**Description:** Get projects where user is a member  
**Authorization:** ADMIN, MANAGER, DEVELOPER, TESTER

**Curl Command:**
```bash
curl -X GET http://localhost:8082/api/projects/member/2 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:** Array of projects where the user is a member

### 11. Search Projects
**Endpoint:** `GET /api/projects/search?keyword={keyword}`  
**Description:** Search projects by keyword  
**Authorization:** ADMIN, MANAGER, DEVELOPER, TESTER

**Curl Command:**
```bash
curl -X GET "http://localhost:8082/api/projects/search?keyword=web" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:** Array of projects matching the keyword

### 12. Add Member to Project
**Endpoint:** `POST /api/projects/{projectId}/members/{userId}`  
**Description:** Add a user as a member to a project  
**Authorization:** ADMIN, MANAGER

**Curl Command:**
```bash
curl -X POST http://localhost:8082/api/projects/1/members/3 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:** Updated project with new member

### 13. Remove Member from Project
**Endpoint:** `DELETE /api/projects/{projectId}/members/{userId}`  
**Description:** Remove a user from project membership  
**Authorization:** ADMIN, MANAGER

**Curl Command:**
```bash
curl -X DELETE http://localhost:8082/api/projects/1/members/3 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:** Updated project without the removed member

### 14. Set Project Lead
**Endpoint:** `POST /api/projects/{projectId}/lead/{userId}`  
**Description:** Set a user as the project lead  
**Authorization:** ADMIN, MANAGER

**Curl Command:**
```bash
curl -X POST http://localhost:8082/api/projects/1/lead/2 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:** Updated project with new project lead

## Project Types and Categories

### Project Types
- **SOFTWARE**: Software development projects
- **BUSINESS**: Business process projects
- **SERVICE_DESK**: IT service desk projects
- **OPERATIONS**: Operations and maintenance projects

### Project Categories
- **BUSINESS**: General business projects
- **SOFTWARE_DEVELOPMENT**: Software development projects
- **IT_SERVICE**: IT service projects
- **MARKETING**: Marketing projects
- **SALES**: Sales projects
- **HR**: Human resources projects
- **FINANCE**: Finance projects

## Error Responses

### 400 Bad Request
```json
{
  "timestamp": "2024-01-01T10:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Project with key 'PMS' already exists",
  "path": "/api/projects"
}
```

### 401 Unauthorized
```json
{
  "timestamp": "2024-01-01T10:00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Access denied",
  "path": "/api/projects"
}
```

### 403 Forbidden
```json
{
  "timestamp": "2024-01-01T10:00:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Access denied",
  "path": "/api/projects"
}
```

### 404 Not Found
```json
{
  "timestamp": "2024-01-01T10:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Project not found with id: 999",
  "path": "/api/projects/999"
}
```

### 409 Conflict
```json
{
  "timestamp": "2024-01-01T10:00:00",
  "status": 409,
  "error": "Conflict",
  "message": "Project with key 'PMS' already exists",
  "path": "/api/projects"
}
```

## Authorization Levels

- **ADMIN**: Full access to all project endpoints
- **MANAGER**: Access to project management (except delete operations)
- **DEVELOPER**: Read access to projects and project details
- **TESTER**: Read access to projects and project details

## Notes

1. All requests require a valid JWT token in the Authorization header
2. The token format should be: `Bearer <your_jwt_token>`
3. The server runs on port 8082 by default
4. Global CORS configuration allows all origins, methods, and headers
5. Project keys must be unique and between 2-10 characters
6. Project names must be unique and between 2-100 characters
7. Project leads are automatically added as project members
8. Project leads cannot be removed from project membership
9. All endpoints use DTOs instead of entities for better security and API consistency
10. MapStruct is used for automatic mapping between entities and DTOs
11. Lombok is used to reduce boilerplate code in DTOs
12. Issue count is automatically calculated and included in project responses 