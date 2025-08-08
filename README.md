# Project Management System (PMS)

A Spring Boot application for project management with user and role management capabilities.

## Features

- **User Management**: Create, read, update, and delete users
- **Role Management**: Assign and manage roles for users
- **Many-to-Many Relationship**: Users can have multiple roles, and roles can be assigned to multiple users
- **PostgreSQL Database**: Robust data persistence
- **RESTful API**: Complete CRUD operations via REST endpoints

## Database Schema

### Users Table
- `id` (Primary Key)
- `name` (Required, 2-100 characters)
- `username` (Required, unique, 3-50 characters)
- `email` (Required, unique, valid email format)
- `password` (Required, minimum 6 characters)
- `created_at` (Auto-generated timestamp)
- `updated_at` (Auto-updated timestamp)
- `is_active` (Boolean, default true)

### Roles Table
- `id` (Primary Key)
- `name` (Required, unique, 2-50 characters)
- `description` (Optional, max 255 characters)

### User_Roles Table (Junction Table)
- `user_id` (Foreign Key to Users)
- `role_id` (Foreign Key to Roles)

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/validate` - Validate JWT token

### Users
- `GET /api/users` - Get all users (ADMIN, MANAGER, DEVELOPER, TESTER)
- `GET /api/users/{id}` - Get user by ID (ADMIN, MANAGER, DEVELOPER, TESTER)
- `POST /api/users` - Create new user (ADMIN, MANAGER)
- `PUT /api/users/{id}` - Update user (ADMIN, MANAGER)
- `DELETE /api/users/{id}` - Delete user (ADMIN only)
- `GET /api/users/by-role/{roleName}` - Get users by role (ADMIN, MANAGER, DEVELOPER, TESTER)
- `POST /api/users/{userId}/roles/{roleId}` - Assign role to user (ADMIN, MANAGER)
- `DELETE /api/users/{userId}/roles/{roleId}` - Remove role from user (ADMIN, MANAGER)

### Roles
- `GET /api/roles` - Get all roles (ADMIN, MANAGER)
- `GET /api/roles/{id}` - Get role by ID (ADMIN, MANAGER)
- `GET /api/roles/name/{name}` - Get role by name (ADMIN, MANAGER)
- `POST /api/roles` - Create new role (ADMIN only)
- `PUT /api/roles/{id}` - Update role (ADMIN only)
- `DELETE /api/roles/{id}` - Delete role (ADMIN only)

## Database Configuration

The application is configured to use PostgreSQL with the following settings:
- **Host**: localhost
- **Port**: 5432
- **Database**: pms_db
- **Username**: postgres
- **Password**: root

## Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.6 or higher
- PostgreSQL 12 or higher

### Setup Database
1. Create PostgreSQL database:
```sql
CREATE DATABASE pms_db;
```

2. The application will automatically create tables on startup.

### Run the Application
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8082`

### Default Roles
The application automatically creates the following default roles on startup:
- ADMIN
- MANAGER
- DEVELOPER
- TESTER
- VIEWER

## Example API Usage

### Login
```bash
curl -X POST http://localhost:8082/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ideas2it.com",
    "password": "admin@123"
  }'
```

### Validate Token
```bash
curl -X POST http://localhost:8082/api/auth/validate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create a User (Requires ADMIN or MANAGER role)
```bash
curl -X POST http://localhost:8082/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "John Doe",
    "username": "johndoe",
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

### Assign Role to User (Requires ADMIN or MANAGER role)
```bash
curl -X POST http://localhost:8082/api/users/1/roles/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get All Users (Requires any role)
```bash
curl http://localhost:8082/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Validation Rules

### User Validation
- Name: 2-100 characters, required
- Username: 3-50 characters, required, unique
- Email: Valid email format, required, unique
- Password: Minimum 6 characters, required

### Role Validation
- Name: 2-50 characters, required, unique
- Description: Maximum 255 characters, optional

## Project Structure

```
src/main/java/com/i2i/pms/pms/
├── entity/
│   ├── User.java
│   └── Role.java
├── repository/
│   ├── UserRepository.java
│   └── RoleRepository.java
├── service/
│   ├── UserService.java
│   ├── RoleService.java
│   └── impl/
│       ├── UserServiceImpl.java
│       └── RoleServiceImpl.java
├── controller/
│   ├── UserController.java
│   └── RoleController.java
├── exception/
│   ├── ResourceNotFoundException.java
│   ├── DuplicateResourceException.java
│   └── GlobalExceptionHandler.java
├── config/
│   └── DataInitializer.java
└── PmsApplication.java
```

## Technologies Used

- **Spring Boot 3.4.8**
- **Spring Data JPA**
- **Spring Security**
- **JWT (JSON Web Tokens)**
- **PostgreSQL**
- **Maven**
- **Java 17**
- **Jakarta Validation**

## Architecture

The application follows a **layered architecture** pattern:

### **Controller Layer**
- Handles HTTP requests and responses
- Validates input data
- Delegates business logic to service layer
- Returns appropriate HTTP status codes
- **Security**: Method-level authorization with `@PreAuthorize`

### **Service Layer**
- Contains business logic and validation rules
- Handles transactions
- Throws custom exceptions for error scenarios
- Interacts with repository layer for data operations

### **Repository Layer**
- Handles data access operations
- Extends JpaRepository for CRUD operations
- Contains custom query methods

### **Entity Layer**
- JPA entities representing database tables
- Contains validation annotations
- Manages relationships between entities

### **Security Layer**
- **JWT Authentication**: Token-based authentication
- **Role-Based Access Control**: Method-level security
- **JWT Filter**: Extracts and validates tokens
- **Spring Security**: Framework for security implementation

### **Exception Handling**
- Custom exceptions for different error scenarios
- Global exception handler for consistent error responses
- Proper HTTP status codes for different error types

## Security Permissions

### **ADMIN Role**
- Full access to all operations
- Can create, read, update, delete users and roles
- Can assign/remove roles from users

### **MANAGER Role**
- Can read all users and roles
- Can create, update users (but not delete)
- Can assign/remove roles from users
- Cannot manage roles (create/update/delete)

### **DEVELOPER Role**
- Can only read user information
- Cannot modify any data

### **TESTER Role**
- Can only read user information
- Cannot modify any data 