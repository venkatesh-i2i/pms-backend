# User Module API Documentation

## Base URL
```
http://localhost:8082
```

## Authentication Endpoints

### 1. User Login
**Endpoint:** `POST /api/auth/login`  
**Description:** Authenticate user and get JWT token  
**Authorization:** None required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Curl Command:**
```bash
curl -X POST http://localhost:8082/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}
```

### 2. Validate Token
**Endpoint:** `POST /api/auth/validate`  
**Description:** Validate JWT token  
**Authorization:** Bearer token required

**Curl Command:**
```bash
curl -X POST http://localhost:8082/api/auth/validate \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
true
```

## User Management Endpoints

### 3. Get All Users
**Endpoint:** `GET /api/users`  
**Description:** Retrieve all users  
**Authorization:** ADMIN, MANAGER, DEVELOPER, TESTER

**Curl Command:**
```bash
curl -X GET http://localhost:8082/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
[
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
]
```

### 4. Get User by ID
**Endpoint:** `GET /api/users/{id}`  
**Description:** Retrieve user by ID  
**Authorization:** ADMIN, MANAGER, DEVELOPER, TESTER

**Curl Command:**
```bash
curl -X GET http://localhost:8082/api/users/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
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
```

### 5. Create User
**Endpoint:** `POST /api/users`  
**Description:** Create a new user  
**Authorization:** ADMIN, MANAGER

**Request Body:**
```json
{
  "name": "Jane Smith",
  "username": "janesmith",
  "email": "jane@example.com",
  "password": "password123"
}
```

**Curl Command:**
```bash
curl -X POST http://localhost:8082/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Jane Smith",
    "username": "janesmith",
    "email": "jane@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "id": 2,
  "name": "Jane Smith",
  "username": "janesmith",
  "email": "jane@example.com",
  "isActive": true,
  "createdAt": "2024-01-01T11:00:00",
  "updatedAt": "2024-01-01T11:00:00",
  "roles": []
}
```

**Note:** The response now uses DTOs which exclude sensitive information like passwords.

### 6. Update User
**Endpoint:** `PUT /api/users/{id}`  
**Description:** Update user information  
**Authorization:** ADMIN, MANAGER

**Request Body:**
```json
{
  "name": "Jane Smith Updated",
  "username": "janesmith",
  "email": "jane.updated@example.com",
  "password": "newpassword123",
  "isActive": true
}
```

**Note:** All fields are optional in the update request. Only provided fields will be updated.

**Curl Command:**
```bash
curl -X PUT http://localhost:8082/api/users/2 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Jane Smith Updated",
    "username": "janesmith",
    "email": "jane.updated@example.com",
    "password": "newpassword123"
  }'
```

**Response:**
```json
{
  "id": 2,
  "name": "Jane Smith Updated",
  "username": "janesmith",
  "email": "jane.updated@example.com",
  "isActive": true,
  "createdAt": "2024-01-01T11:00:00",
  "updatedAt": "2024-01-01T12:00:00",
  "roles": []
}
```

### 7. Delete User
**Endpoint:** `DELETE /api/users/{id}`  
**Description:** Delete user by ID  
**Authorization:** ADMIN only

**Curl Command:**
```bash
curl -X DELETE http://localhost:8082/api/users/2 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:** `200 OK` (No content)

### 8. Get All Roles
**Endpoint:** `GET /api/users/roles`  
**Description:** Get all available roles  
**Authorization:** ADMIN, MANAGER

**Curl Command:**
```bash
curl -X GET http://localhost:8082/api/users/roles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "ADMIN",
    "description": "Administrator role"
  },
  {
    "id": 2,
    "name": "MANAGER",
    "description": "Manager role"
  },
  {
    "id": 3,
    "name": "DEVELOPER",
    "description": "Developer role"
  },
  {
    "id": 4,
    "name": "TESTER",
    "description": "Tester role"
  }
]
```

### 9. Assign Role to User
**Endpoint:** `POST /api/users/{userId}/roles/{roleId}`  
**Description:** Assign a role to a user  
**Authorization:** ADMIN, MANAGER

**Curl Command:**
```bash
curl -X POST http://localhost:8082/api/users/2/roles/3 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "id": 2,
  "name": "Jane Smith",
  "username": "janesmith",
  "email": "jane@example.com",
  "isActive": true,
  "createdAt": "2024-01-01T11:00:00",
  "updatedAt": "2024-01-01T12:00:00",
  "roles": [
    {
      "id": 3,
      "name": "DEVELOPER",
      "description": "Developer role"
    }
  ]
}
```

### 10. Remove Role from User
**Endpoint:** `DELETE /api/users/{userId}/roles/{roleId}`  
**Description:** Remove a role from a user  
**Authorization:** ADMIN, MANAGER

**Curl Command:**
```bash
curl -X DELETE http://localhost:8082/api/users/2/roles/3 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "id": 2,
  "name": "Jane Smith",
  "username": "janesmith",
  "email": "jane@example.com",
  "isActive": true,
  "createdAt": "2024-01-01T11:00:00",
  "updatedAt": "2024-01-01T12:00:00",
  "roles": []
}
```

### 11. Get Users by Role
**Endpoint:** `GET /api/users/by-role/{roleName}`  
**Description:** Get all users with a specific role  
**Authorization:** ADMIN, MANAGER, DEVELOPER, TESTER

**Curl Command:**
```bash
curl -X GET http://localhost:8082/api/users/by-role/DEVELOPER \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
[
  {
    "id": 2,
    "name": "Jane Smith",
    "username": "janesmith",
    "email": "jane@example.com",
    "isActive": true,
    "createdAt": "2024-01-01T11:00:00",
    "updatedAt": "2024-01-01T12:00:00",
    "roles": [
      {
        "id": 3,
        "name": "DEVELOPER",
        "description": "Developer role"
      }
    ]
  }
]
```

## Role Management Endpoints

### 12. Get All Roles
**Endpoint:** `GET /api/roles`  
**Description:** Get all roles  
**Authorization:** ADMIN, MANAGER

**Curl Command:**
```bash
curl -X GET http://localhost:8082/api/roles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "ADMIN",
    "description": "Administrator role"
  },
  {
    "id": 2,
    "name": "MANAGER",
    "description": "Manager role"
  },
  {
    "id": 3,
    "name": "DEVELOPER",
    "description": "Developer role"
  },
  {
    "id": 4,
    "name": "TESTER",
    "description": "Tester role"
  }
]
```

### 13. Get Role by ID
**Endpoint:** `GET /api/roles/{id}`  
**Description:** Get role by ID  
**Authorization:** ADMIN, MANAGER

**Curl Command:**
```bash
curl -X GET http://localhost:8082/api/roles/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "id": 1,
  "name": "ADMIN",
  "description": "Administrator role"
}
```

### 14. Get Role by Name
**Endpoint:** `GET /api/roles/name/{name}`  
**Description:** Get role by name  
**Authorization:** ADMIN, MANAGER

**Curl Command:**
```bash
curl -X GET http://localhost:8082/api/roles/name/ADMIN \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "id": 1,
  "name": "ADMIN",
  "description": "Administrator role"
}
```

### 15. Create Role
**Endpoint:** `POST /api/roles`  
**Description:** Create a new role  
**Authorization:** ADMIN only

**Request Body:**
```json
{
  "name": "ANALYST",
  "description": "Business Analyst role"
}
```

**Note:** The request and response now use RoleDto for better security and consistency.

**Curl Command:**
```bash
curl -X POST http://localhost:8082/api/roles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "ANALYST",
    "description": "Business Analyst role"
  }'
```

**Response:**
```json
{
  "id": 5,
  "name": "ANALYST",
  "description": "Business Analyst role"
}
```

### 16. Update Role
**Endpoint:** `PUT /api/roles/{id}`  
**Description:** Update role information  
**Authorization:** ADMIN only

**Request Body:**
```json
{
  "name": "ANALYST",
  "description": "Updated Business Analyst role"
}
```

**Note:** The request and response now use RoleDto for better security and consistency.

**Curl Command:**
```bash
curl -X PUT http://localhost:8082/api/roles/5 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "ANALYST",
    "description": "Updated Business Analyst role"
  }'
```

**Response:**
```json
{
  "id": 5,
  "name": "ANALYST",
  "description": "Updated Business Analyst role"
}
```

### 17. Delete Role
**Endpoint:** `DELETE /api/roles/{id}`  
**Description:** Delete role by ID  
**Authorization:** ADMIN only

**Curl Command:**
```bash
curl -X DELETE http://localhost:8082/api/roles/5 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:** `200 OK` (No content)

## Error Responses

### 400 Bad Request
```json
{
  "timestamp": "2024-01-01T10:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/users"
}
```

### 401 Unauthorized
```json
{
  "timestamp": "2024-01-01T10:00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Access denied",
  "path": "/api/users"
}
```

### 403 Forbidden
```json
{
  "timestamp": "2024-01-01T10:00:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Access denied",
  "path": "/api/users"
}
```

### 404 Not Found
```json
{
  "timestamp": "2024-01-01T10:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Resource not found",
  "path": "/api/users/999"
}
```

### 409 Conflict
```json
{
  "timestamp": "2024-01-01T10:00:00",
  "status": 409,
  "error": "Conflict",
  "message": "Resource already exists",
  "path": "/api/users"
}
```

## Authorization Levels

- **ADMIN**: Full access to all endpoints
- **MANAGER**: Access to user and role management (except delete operations)
- **DEVELOPER**: Read access to users and roles
- **TESTER**: Read access to users and roles

## Notes

1. All requests (except login) require a valid JWT token in the Authorization header
2. The token format should be: `Bearer <your_jwt_token>`
3. The server runs on port 8082 by default
4. All endpoints support CORS with `*` origin
5. User passwords are hashed before storage
6. Email and username must be unique
7. Role names must be unique
8. **NEW:** All endpoints now use DTOs instead of entities for better security and API consistency
9. **NEW:** MapStruct is used for automatic mapping between entities and DTOs
10. **NEW:** Lombok is used to reduce boilerplate code in DTOs 