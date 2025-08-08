import axios from 'axios'

// Read API base URL from Vite env. Define VITE_API_BASE_URL in your .env files.
// Fallback to localhost:8082 to preserve current behavior if not set.
const envBaseUrl = import.meta?.env?.VITE_API_BASE_URL
const API_BASE_URL = (envBaseUrl && String(envBaseUrl).trim()) || 'http://localhost:8082'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api