import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// Async thunk for fetching admin dashboard
export const fetchAdminDashboard = createAsyncThunk(
  'dashboard/fetchAdminDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/dashboard/admin')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin dashboard')
    }
  }
)

// Async thunk for fetching project manager dashboard
export const fetchProjectManagerDashboard = createAsyncThunk(
  'dashboard/fetchProjectManagerDashboard',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/dashboard/project-manager/${userId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch project manager dashboard')
    }
  }
)

// Async thunk for fetching developer dashboard
export const fetchDeveloperDashboard = createAsyncThunk(
  'dashboard/fetchDeveloperDashboard',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/dashboard/developer/${userId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch developer dashboard')
    }
  }
)



const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    adminDashboard: null,
    projectManagerDashboard: null,
    developerDashboard: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearDashboard: (state) => {
      state.adminDashboard = null
      state.projectManagerDashboard = null
      state.developerDashboard = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch admin dashboard
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.loading = false
        state.adminDashboard = action.payload
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch project manager dashboard
      .addCase(fetchProjectManagerDashboard.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProjectManagerDashboard.fulfilled, (state, action) => {
        state.loading = false
        state.projectManagerDashboard = action.payload
      })
      .addCase(fetchProjectManagerDashboard.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch developer dashboard
      .addCase(fetchDeveloperDashboard.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDeveloperDashboard.fulfilled, (state, action) => {
        state.loading = false
        state.developerDashboard = action.payload
      })
      .addCase(fetchDeveloperDashboard.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearDashboard } = dashboardSlice.actions
export default dashboardSlice.reducer 