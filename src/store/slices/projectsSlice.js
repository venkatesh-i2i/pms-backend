import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// Async thunk for fetching all projects
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/projects')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects')
    }
  }
)

// Async thunk for fetching project by ID
export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/projects/${id}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch project')
    }
  }
)

// Async thunk for creating a project
export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/projects', projectData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create project')
    }
  }
)

// Async thunk for updating a project
export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, projectData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/projects/${id}`, projectData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update project')
    }
  }
)

// Async thunk for deleting a project
export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/projects/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete project')
    }
  }
)

// Async thunk for fetching projects by type
export const fetchProjectsByType = createAsyncThunk(
  'projects/fetchProjectsByType',
  async (projectType, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/projects/type/${projectType}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects by type')
    }
  }
)

// Async thunk for fetching projects by category
export const fetchProjectsByCategory = createAsyncThunk(
  'projects/fetchProjectsByCategory',
  async (projectCategory, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/projects/category/${projectCategory}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects by category')
    }
  }
)

// Async thunk for fetching projects by lead
export const fetchProjectsByLead = createAsyncThunk(
  'projects/fetchProjectsByLead',
  async (leadUserId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/projects/lead/${leadUserId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects by lead')
    }
  }
)

// Async thunk for fetching projects by member
export const fetchProjectsByMember = createAsyncThunk(
  'projects/fetchProjectsByMember',
  async (memberUserId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/projects/member/${memberUserId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects by member')
    }
  }
)

// Async thunk for searching projects
export const searchProjects = createAsyncThunk(
  'projects/searchProjects',
  async (keyword, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/projects/search?keyword=${encodeURIComponent(keyword)}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search projects')
    }
  }
)

// Async thunk for adding member to project
export const addMemberToProject = createAsyncThunk(
  'projects/addMemberToProject',
  async ({ projectId, userId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/projects/${projectId}/members/${userId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add member to project')
    }
  }
)

// Async thunk for removing member from project
export const removeMemberFromProject = createAsyncThunk(
  'projects/removeMemberFromProject',
  async ({ projectId, userId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/projects/${projectId}/members/${userId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove member from project')
    }
  }
)

// Async thunk for setting project lead
export const setProjectLead = createAsyncThunk(
  'projects/setProjectLead',
  async ({ projectId, userId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/projects/${projectId}/lead/${userId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to set project lead')
    }
  }
)

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: [],
    currentProject: null,
    filteredProjects: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentProject: (state) => {
      state.currentProject = null
    },
    setFilteredProjects: (state, action) => {
      state.filteredProjects = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false
        state.projects = action.payload
        state.filteredProjects = action.payload
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch project by ID
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false
        state.currentProject = action.payload
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create project
      .addCase(createProject.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false
        state.projects.push(action.payload)
        state.filteredProjects = state.projects
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update project
      .addCase(updateProject.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false
        const index = state.projects.findIndex(project => project.id === action.payload.id)
        if (index !== -1) {
          state.projects[index] = action.payload
        }
        if (state.currentProject && state.currentProject.id === action.payload.id) {
          state.currentProject = action.payload
        }
        state.filteredProjects = state.projects
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false
        state.projects = state.projects.filter(project => project.id !== action.payload)
        state.filteredProjects = state.projects
        if (state.currentProject && state.currentProject.id === action.payload) {
          state.currentProject = null
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch projects by type
      .addCase(fetchProjectsByType.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProjectsByType.fulfilled, (state, action) => {
        state.loading = false
        state.filteredProjects = action.payload
      })
      .addCase(fetchProjectsByType.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch projects by category
      .addCase(fetchProjectsByCategory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProjectsByCategory.fulfilled, (state, action) => {
        state.loading = false
        state.filteredProjects = action.payload
      })
      .addCase(fetchProjectsByCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch projects by lead
      .addCase(fetchProjectsByLead.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProjectsByLead.fulfilled, (state, action) => {
        state.loading = false
        state.filteredProjects = action.payload
      })
      .addCase(fetchProjectsByLead.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch projects by member
      .addCase(fetchProjectsByMember.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProjectsByMember.fulfilled, (state, action) => {
        state.loading = false
        state.filteredProjects = action.payload
      })
      .addCase(fetchProjectsByMember.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Search projects
      .addCase(searchProjects.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchProjects.fulfilled, (state, action) => {
        state.loading = false
        state.filteredProjects = action.payload
      })
      .addCase(searchProjects.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Add member to project
      .addCase(addMemberToProject.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addMemberToProject.fulfilled, (state, action) => {
        state.loading = false
        const index = state.projects.findIndex(project => project.id === action.payload.id)
        if (index !== -1) {
          state.projects[index] = action.payload
        }
        if (state.currentProject && state.currentProject.id === action.payload.id) {
          state.currentProject = action.payload
        }
        state.filteredProjects = state.projects
      })
      .addCase(addMemberToProject.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Remove member from project
      .addCase(removeMemberFromProject.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(removeMemberFromProject.fulfilled, (state, action) => {
        state.loading = false
        const index = state.projects.findIndex(project => project.id === action.payload.id)
        if (index !== -1) {
          state.projects[index] = action.payload
        }
        if (state.currentProject && state.currentProject.id === action.payload.id) {
          state.currentProject = action.payload
        }
        state.filteredProjects = state.projects
      })
      .addCase(removeMemberFromProject.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Set project lead
      .addCase(setProjectLead.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(setProjectLead.fulfilled, (state, action) => {
        state.loading = false
        const index = state.projects.findIndex(project => project.id === action.payload.id)
        if (index !== -1) {
          state.projects[index] = action.payload
        }
        if (state.currentProject && state.currentProject.id === action.payload.id) {
          state.currentProject = action.payload
        }
        state.filteredProjects = state.projects
      })
      .addCase(setProjectLead.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearCurrentProject, setFilteredProjects } = projectsSlice.actions
export default projectsSlice.reducer 