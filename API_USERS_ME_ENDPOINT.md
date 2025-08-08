# `/api/users/me` Endpoint Documentation

## Overview

The `/api/users/me` endpoint allows authenticated users to retrieve their own profile information based on their JWT token.

## Endpoint Details

- **URL**: `GET /api/users/me`
- **Authorization**: Bearer token required
- **Content-Type**: `application/json`

## Request

### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Example cURL Request
```bash
curl -X GET http://localhost:8082/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

## Response

### Success Response (200 OK)
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

### Error Responses

#### 401 Unauthorized
```json
{
  "timestamp": "2024-01-01T10:00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid or expired token",
  "path": "/api/users/me"
}
```

#### 403 Forbidden
```json
{
  "timestamp": "2024-01-01T10:00:00",
  "status": 403,
  "error": "Forbidden",
  "message": "User account is inactive",
  "path": "/api/users/me"
}
```

#### 404 Not Found
```json
{
  "timestamp": "2024-01-01T10:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "User not found",
  "path": "/api/users/me"
}
```

## Security Features

1. **JWT Token Validation**: The endpoint validates the JWT token signature and expiration
2. **User ID Extraction**: User ID is extracted from the JWT token payload
3. **User Lookup**: User is retrieved from the database using the ID from the token
4. **Active Status Check**: Only active users can access their profile
5. **Role Information**: User roles are included in the response

## Implementation Details

### JWT Token Structure
The JWT token includes the user ID in its payload:
```json
{
  "sub": "user@example.com",
  "userId": 123,
  "iat": 1640995200,
  "exp": 1641081600
}
```

### Backend Implementation
- **Controller**: `UserController.getCurrentUser()`
- **Service**: Uses `AuthService` for token validation and user ID extraction
- **Repository**: Uses `UserService` for user lookup
- **DTO**: Returns `UserDto` (excludes sensitive information like password)

## Usage Examples

### Frontend JavaScript
```javascript
// Get current user profile
const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('jwt_token');
    const response = await fetch('/api/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const user = await response.json();
      console.log('Current user:', user);
      return user;
    } else {
      console.error('Failed to get user profile');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### React Hook Example
```javascript
import { useState, useEffect } from 'react';

const useCurrentUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await fetch('/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setError('Failed to fetch user profile');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
};
```

## Benefits

1. **Security**: Only returns current user's data
2. **Performance**: Single database query
3. **Clean API**: Dedicated endpoint for current user
4. **Consistency**: Follows REST API conventions
5. **Role-based Access**: Includes user roles for frontend authorization

## Testing

The endpoint includes comprehensive error handling and can be tested with:

1. **Valid Token**: Should return user profile
2. **Invalid Token**: Should return 401 Unauthorized
3. **Missing Token**: Should return 401 Unauthorized
4. **Inactive User**: Should return 403 Forbidden
5. **Non-existent User**: Should return 404 Not Found

## Integration with Existing System

This endpoint integrates seamlessly with the existing authentication system and follows the same patterns as other endpoints in the application. 