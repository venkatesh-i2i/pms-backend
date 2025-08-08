import api from '../services/api'

// Test function to verify /api/users/me endpoint integration
export const testCurrentUserEndpoint = async () => {
  try {
    console.log('Testing /api/users/me endpoint...')
    
    const response = await api.get('/api/users/me')
    console.log('✅ /api/users/me endpoint working:', response.data)
    
    return {
      success: true,
      user: response.data,
      message: 'Endpoint working correctly'
    }
  } catch (error) {
    console.error('❌ /api/users/me endpoint failed:', error.response?.data || error.message)
    
    return {
      success: false,
      error: error.response?.data || error.message,
      message: 'Endpoint not available or authentication failed'
    }
  }
}

// Test function to verify login flow with /api/users/me
export const testLoginFlow = async (credentials) => {
  try {
    console.log('Testing login flow with /api/users/me...')
    
    // Step 1: Login
    const loginResponse = await api.post('/api/auth/login', credentials)
    console.log('✅ Login successful:', loginResponse.data)
    
    // Step 2: Get current user
    const userResponse = await api.get('/api/users/me')
    console.log('✅ Current user retrieved:', userResponse.data)
    
    return {
      success: true,
      token: loginResponse.data.token,
      user: userResponse.data,
      message: 'Login flow working correctly'
    }
  } catch (error) {
    console.error('❌ Login flow failed:', error.response?.data || error.message)
    
    return {
      success: false,
      error: error.response?.data || error.message,
      message: 'Login flow failed'
    }
  }
}

// Helper function to check if user is authenticated
export const checkAuthentication = () => {
  const token = localStorage.getItem('token')
  return {
    hasToken: !!token,
    token: token ? 'Bearer ' + token.substring(0, 20) + '...' : null
  }
} 