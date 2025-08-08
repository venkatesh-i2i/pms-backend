# `/api/users/me` Endpoint Integration Guide

## 🎯 Overview

This guide documents the integration of the `/api/users/me` endpoint with the frontend application. This endpoint provides secure access to the current authenticated user's information.

## 📋 API Specification

### Endpoint Details
- **URL**: `GET /api/users/me`
- **Authorization**: Bearer token required
- **Content-Type**: `application/json`

### Request Example
```bash
curl -X GET http://localhost:8082/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### Response Format
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

## 🔧 Frontend Integration

### 1. Authentication Flow Updates

The authentication flow has been updated to use the `/api/users/me` endpoint:

```javascript
// In authSlice.js
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/login', credentials)
      localStorage.setItem('token', response.data.token)
      
      // Get user info from /api/users/me
      const userResponse = await api.get('/api/users/me')
      return {
        token: response.data.token,
        user: userResponse.data
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)
```

### 2. Custom Hook for Current User

A custom hook has been created for easy access to current user information:

```javascript
// In useCurrentUser.js
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getCurrentUser } from '../store/slices/authSlice'

const useCurrentUser = () => {
  const dispatch = useDispatch()
  const { user, loading, error, isAuthenticated } = useSelector((state) => state.auth)
  
  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(getCurrentUser())
    }
  }, [dispatch, isAuthenticated, user])

  return { user, loading, error, isAuthenticated }
}
```

### 3. Usage in Components

```javascript
// In any component
import useCurrentUser from '../hooks/useCurrentUser'

const MyComponent = () => {
  const { user, loading } = useCurrentUser()
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <p>Email: {user?.email}</p>
      <p>Roles: {user?.roles?.map(role => role.name).join(', ')}</p>
    </div>
  )
}
```

## 🚀 Benefits of Integration

### 1. **Security**
- Only returns current user's data
- Validates JWT token for each request
- Prevents unauthorized access to other users' data

### 2. **Performance**
- Single database query instead of fetching all users
- Reduces network traffic and server load
- Faster response times

### 3. **Clean API Design**
- Follows REST API conventions
- Dedicated endpoint for current user
- Consistent with other API endpoints

### 4. **Better User Experience**
- Displays real user names instead of generic labels
- Proper role-based navigation
- Accurate user information throughout the app

## 🔄 Fallback Strategy

The integration includes a robust fallback strategy:

1. **Primary**: Use `/api/users/me` endpoint
2. **Secondary**: Fetch all users and find by email
3. **Tertiary**: Create user object from credentials

```javascript
// Fallback logic in authSlice.js
try {
  const userResponse = await api.get('/api/users/me')
  return userResponse.data
} catch (userError) {
  // Fallback to fetching all users
  const usersResponse = await api.get('/api/users')
  const user = usersResponse.data.find(u => u.email === credentials.email)
  return user || createUserFromCredentials(credentials)
}
```

## 🧪 Testing

### Test Functions

Use the provided test utilities to verify integration:

```javascript
import { testCurrentUserEndpoint, testLoginFlow } from '../utils/apiTest'

// Test the endpoint
const testEndpoint = async () => {
  const result = await testCurrentUserEndpoint()
  console.log(result)
}

// Test the login flow
const testLogin = async () => {
  const result = await testLoginFlow({
    email: 'admin@example.com',
    password: 'password123'
  })
  console.log(result)
}
```

### Manual Testing

1. **Login with valid credentials**
2. **Check user name display** in navbar and dashboard
3. **Verify role-based navigation** (Admin vs Manager)
4. **Test logout and re-authentication**

## 🔧 Backend Requirements

### JWT Token Structure
The JWT token should include user information:

```json
{
  "sub": "user@example.com",
  "userId": 123,
  "iat": 1640995200,
  "exp": 1641081600
}
```

### Backend Implementation
```java
@GetMapping("/me")
public ResponseEntity<UserDto> getCurrentUser(@RequestHeader("Authorization") String token) {
    // Extract user ID from JWT token
    String userId = jwtService.extractUserId(token);
    
    // Find user in database
    User user = userService.findById(userId);
    
    // Convert to DTO and return
    UserDto userDto = userMapper.toDto(user);
    return ResponseEntity.ok(userDto);
}
```

## 📊 Error Handling

### Common Error Responses

**401 Unauthorized**
```json
{
  "timestamp": "2024-01-01T10:00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid or expired token",
  "path": "/api/users/me"
}
```

**404 Not Found**
```json
{
  "timestamp": "2024-01-01T10:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "User not found",
  "path": "/api/users/me"
}
```

### Frontend Error Handling
```javascript
// In authSlice.js
.addCase(getCurrentUser.rejected, (state, action) => {
  state.loading = false
  state.error = action.payload
  state.user = null
  state.token = null
  state.isAuthenticated = false
})
```

## 🎯 Summary

The `/api/users/me` endpoint integration provides:

- ✅ **Secure user data access**
- ✅ **Improved performance**
- ✅ **Better user experience**
- ✅ **Robust fallback strategy**
- ✅ **Comprehensive error handling**

This integration ensures that the frontend displays accurate user information and provides proper role-based functionality throughout the application. 