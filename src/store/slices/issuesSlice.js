import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// Async thunks for issue management
export const fetchIssues = createAsyncThunk(
  'issues/fetchIssues',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/issues')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch issues')
    }
  }
)

export const fetchIssuesByProject = createAsyncThunk(
  'issues/fetchIssuesByProject',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/projects/${projectId}/issues`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch issues')
    }
  }
)

export const createIssue = createAsyncThunk(
  'issues/createIssue',
  async (issueData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/issues', issueData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create issue')
    }
  }
)

export const updateIssue = createAsyncThunk(
  'issues/updateIssue',
  async ({ issueId, issueData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/issues/${issueId}`, issueData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update issue')
    }
  }
)

export const deleteIssue = createAsyncThunk(
  'issues/deleteIssue',
  async (issueId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/issues/${issueId}`)
      return issueId
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete issue')
    }
  }
)

export const fetchIssueById = createAsyncThunk(
  'issues/fetchIssueById',
  async (issueId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/issues/${issueId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch issue')
    }
  }
)

export const fetchIssueByKey = createAsyncThunk(
  'issues/fetchIssueByKey',
  async (issueKey, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/issues/key/${issueKey}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch issue')
    }
  }
)

export const updateIssueStatus = createAsyncThunk(
  'issues/updateIssueStatus',
  async ({ issueId, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/issues/${issueId}/status`, { status })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update issue status')
    }
  }
)

export const updateIssuePriority = createAsyncThunk(
  'issues/updateIssuePriority',
  async ({ issueId, priority }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/issues/${issueId}/priority/${priority}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update issue priority')
    }
  }
)

export const assignIssue = createAsyncThunk(
  'issues/assignIssue',
  async ({ issueId, assigneeId }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/issues/${issueId}/assign/${assigneeId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign issue')
    }
  }
)

export const unassignIssue = createAsyncThunk(
  'issues/unassignIssue',
  async (issueId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/issues/${issueId}/unassign`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unassign issue')
    }
  }
)

export const searchIssues = createAsyncThunk(
  'issues/searchIssues',
  async (keyword, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/issues/search', { params: { keyword } })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search issues')
    }
  }
)

export const searchIssuesByProject = createAsyncThunk(
  'issues/searchIssuesByProject',
  async ({ projectId, keyword }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/issues/project/${projectId}/search`, { 
        params: { keyword } 
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search issues')
    }
  }
)

export const fetchIssuesByAssignee = createAsyncThunk(
  'issues/fetchIssuesByAssignee',
  async (assigneeId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/users/${assigneeId}/issues`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch issues by assignee')
    }
  }
)

export const fetchIssuesByReporter = createAsyncThunk(
  'issues/fetchIssuesByReporter',
  async (reporterId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/issues/reporter/${reporterId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch issues by reporter')
    }
  }
)

export const fetchIssuesByStatus = createAsyncThunk(
  'issues/fetchIssuesByStatus',
  async (status, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/issues/status/${status}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch issues by status')
    }
  }
)

export const fetchIssuesByPriority = createAsyncThunk(
  'issues/fetchIssuesByPriority',
  async (priority, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/issues/priority/${priority}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch issues by priority')
    }
  }
)

export const fetchIssuesByType = createAsyncThunk(
  'issues/fetchIssuesByType',
  async (issueType, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/issues/type/${issueType}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch issues by type')
    }
  }
)

export const fetchIssuesByProjectAndStatus = createAsyncThunk(
  'issues/fetchIssuesByProjectAndStatus',
  async ({ projectId, status }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/issues/project/${projectId}/status/${status}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch issues')
    }
  }
)

export const fetchIssuesByProjectAndAssignee = createAsyncThunk(
  'issues/fetchIssuesByProjectAndAssignee',
  async ({ projectId, assigneeId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/issues/project/${projectId}/assignee/${assigneeId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch issues')
    }
  }
)

export const resolveIssue = createAsyncThunk(
  'issues/resolveIssue',
  async ({ issueId, resolution }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/issues/${issueId}/resolve/${resolution}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to resolve issue')
    }
  }
)

export const addWatcher = createAsyncThunk(
  'issues/addWatcher',
  async ({ issueId, userId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/issues/${issueId}/watchers/${userId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add watcher')
    }
  }
)

export const removeWatcher = createAsyncThunk(
  'issues/removeWatcher',
  async ({ issueId, userId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/issues/${issueId}/watchers/${userId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove watcher')
    }
  }
)

export const fetchOverdueIssues = createAsyncThunk(
  'issues/fetchOverdueIssues',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/issues/overdue')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch overdue issues')
    }
  }
)

export const fetchIssueCountByProject = createAsyncThunk(
  'issues/fetchIssueCountByProject',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/issues/project/${projectId}/count`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch issue count')
    }
  }
)

const initialState = {
  issues: [],
  currentIssue: null,
  filteredIssues: [],
  loading: false,
  error: null,
  // Track previous statuses for optimistic updates
  _optimisticPrevStatus: {},
  filters: {
    status: '',
    priority: '',
    assignee: '',
    reporter: '',
    issueType: '',
    search: ''
  },
  pagination: {
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0
  }
}

const issuesSlice = createSlice({
  name: 'issues',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {
        status: '',
        priority: '',
        assignee: '',
        reporter: '',
        issueType: '',
        search: ''
      }
    },
    setCurrentIssue: (state, action) => {
      state.currentIssue = action.payload
    },
    clearCurrentIssue: (state) => {
      state.currentIssue = null
    },
    updateIssueInList: (state, action) => {
      const index = state.issues.findIndex(issue => issue.id === action.payload.id)
      if (index !== -1) {
        state.issues[index] = action.payload
      }
      const filteredIndex = state.filteredIssues.findIndex(issue => issue.id === action.payload.id)
      if (filteredIndex !== -1) {
        state.filteredIssues[filteredIndex] = action.payload
      }
    },
    removeIssueFromList: (state, action) => {
      state.issues = state.issues.filter(issue => issue.id !== action.payload)
      state.filteredIssues = state.filteredIssues.filter(issue => issue.id !== action.payload)
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    }
  },
  extraReducers: (builder) => {
    // Fetch issues
    builder
      .addCase(fetchIssues.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchIssues.fulfilled, (state, action) => {
        state.loading = false
        state.issues = action.payload
        state.filteredIssues = action.payload
      })
      .addCase(fetchIssues.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Fetch issues by project
    builder
      .addCase(fetchIssuesByProject.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchIssuesByProject.fulfilled, (state, action) => {
        state.loading = false
        state.issues = action.payload
        state.filteredIssues = action.payload
      })
      .addCase(fetchIssuesByProject.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Create issue
    builder
      .addCase(createIssue.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createIssue.fulfilled, (state, action) => {
        state.loading = false
        state.issues.push(action.payload)
        state.filteredIssues.push(action.payload)
      })
      .addCase(createIssue.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Update issue
    builder
      .addCase(updateIssue.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateIssue.fulfilled, (state, action) => {
        state.loading = false
        const index = state.issues.findIndex(issue => issue.id === action.payload.id)
        if (index !== -1) {
          state.issues[index] = action.payload
        }
        const filteredIndex = state.filteredIssues.findIndex(issue => issue.id === action.payload.id)
        if (filteredIndex !== -1) {
          state.filteredIssues[filteredIndex] = action.payload
        }
        if (state.currentIssue?.id === action.payload.id) {
          state.currentIssue = action.payload
        }
      })
      .addCase(updateIssue.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Delete issue
    builder
      .addCase(deleteIssue.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteIssue.fulfilled, (state, action) => {
        state.loading = false
        state.issues = state.issues.filter(issue => issue.id !== action.payload)
        state.filteredIssues = state.filteredIssues.filter(issue => issue.id !== action.payload)
        if (state.currentIssue?.id === action.payload) {
          state.currentIssue = null
        }
      })
      .addCase(deleteIssue.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Fetch issue by ID
    builder
      .addCase(fetchIssueById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchIssueById.fulfilled, (state, action) => {
        state.loading = false
        state.currentIssue = action.payload
      })
      .addCase(fetchIssueById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Fetch issue by key
    builder
      .addCase(fetchIssueByKey.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchIssueByKey.fulfilled, (state, action) => {
        state.loading = false
        state.currentIssue = action.payload
      })
      .addCase(fetchIssueByKey.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Update issue status (optimistic UI)
    builder
      .addCase(updateIssueStatus.pending, (state, action) => {
        const { issueId, status } = action.meta.arg || {}
        if (!issueId || !status) return
        const idx = state.issues.findIndex((i) => i.id === issueId)
        if (idx !== -1) {
          // store previous status to rollback if needed
          state._optimisticPrevStatus[issueId] = state.issues[idx].status
          state.issues[idx] = { ...state.issues[idx], status }
        }
        const fidx = state.filteredIssues.findIndex((i) => i.id === issueId)
        if (fidx !== -1) {
          state.filteredIssues[fidx] = { ...state.filteredIssues[fidx], status }
        }
      })
      .addCase(updateIssueStatus.fulfilled, (state, action) => {
        const index = state.issues.findIndex(issue => issue.id === action.payload.id)
        if (index !== -1) {
          state.issues[index] = action.payload
        }
        const filteredIndex = state.filteredIssues.findIndex(issue => issue.id === action.payload.id)
        if (filteredIndex !== -1) {
          state.filteredIssues[filteredIndex] = action.payload
        }
        if (state.currentIssue?.id === action.payload.id) {
          state.currentIssue = action.payload
        }
        // clear optimistic record
        delete state._optimisticPrevStatus[action.payload.id]
      })
      .addCase(updateIssueStatus.rejected, (state, action) => {
        const { issueId } = action.meta.arg || {}
        if (!issueId) return
        const prev = state._optimisticPrevStatus[issueId]
        if (prev) {
          const idx = state.issues.findIndex((i) => i.id === issueId)
          if (idx !== -1) state.issues[idx] = { ...state.issues[idx], status: prev }
          const fidx = state.filteredIssues.findIndex((i) => i.id === issueId)
          if (fidx !== -1) state.filteredIssues[fidx] = { ...state.filteredIssues[fidx], status: prev }
          if (state.currentIssue?.id === issueId) state.currentIssue = { ...state.currentIssue, status: prev }
          delete state._optimisticPrevStatus[issueId]
        }
      })

    // Update issue priority
    builder
      .addCase(updateIssuePriority.fulfilled, (state, action) => {
        const index = state.issues.findIndex(issue => issue.id === action.payload.id)
        if (index !== -1) {
          state.issues[index] = action.payload
        }
        const filteredIndex = state.filteredIssues.findIndex(issue => issue.id === action.payload.id)
        if (filteredIndex !== -1) {
          state.filteredIssues[filteredIndex] = action.payload
        }
        if (state.currentIssue?.id === action.payload.id) {
          state.currentIssue = action.payload
        }
      })

    // Assign issue
    builder
      .addCase(assignIssue.fulfilled, (state, action) => {
        const index = state.issues.findIndex(issue => issue.id === action.payload.id)
        if (index !== -1) {
          state.issues[index] = action.payload
        }
        const filteredIndex = state.filteredIssues.findIndex(issue => issue.id === action.payload.id)
        if (filteredIndex !== -1) {
          state.filteredIssues[filteredIndex] = action.payload
        }
        if (state.currentIssue?.id === action.payload.id) {
          state.currentIssue = action.payload
        }
      })

    // Unassign issue
    builder
      .addCase(unassignIssue.fulfilled, (state, action) => {
        const index = state.issues.findIndex(issue => issue.id === action.payload.id)
        if (index !== -1) {
          state.issues[index] = action.payload
        }
        const filteredIndex = state.filteredIssues.findIndex(issue => issue.id === action.payload.id)
        if (filteredIndex !== -1) {
          state.filteredIssues[filteredIndex] = action.payload
        }
        if (state.currentIssue?.id === action.payload.id) {
          state.currentIssue = action.payload
        }
      })

    // Search issues
    builder
      .addCase(searchIssues.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchIssues.fulfilled, (state, action) => {
        state.loading = false
        state.filteredIssues = action.payload
      })
      .addCase(searchIssues.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Search issues by project
    builder
      .addCase(searchIssuesByProject.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchIssuesByProject.fulfilled, (state, action) => {
        state.loading = false
        state.filteredIssues = action.payload
      })
      .addCase(searchIssuesByProject.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Fetch issues by assignee
    builder
      .addCase(fetchIssuesByAssignee.fulfilled, (state, action) => {
        state.filteredIssues = action.payload
      })

    // Fetch issues by reporter
    builder
      .addCase(fetchIssuesByReporter.fulfilled, (state, action) => {
        state.filteredIssues = action.payload
      })

    // Fetch issues by status
    builder
      .addCase(fetchIssuesByStatus.fulfilled, (state, action) => {
        state.filteredIssues = action.payload
      })

    // Fetch issues by priority
    builder
      .addCase(fetchIssuesByPriority.fulfilled, (state, action) => {
        state.filteredIssues = action.payload
      })

    // Fetch issues by type
    builder
      .addCase(fetchIssuesByType.fulfilled, (state, action) => {
        state.filteredIssues = action.payload
      })

    // Fetch issues by project and status
    builder
      .addCase(fetchIssuesByProjectAndStatus.fulfilled, (state, action) => {
        state.filteredIssues = action.payload
      })

    // Fetch issues by project and assignee
    builder
      .addCase(fetchIssuesByProjectAndAssignee.fulfilled, (state, action) => {
        state.filteredIssues = action.payload
      })

    // Resolve issue
    builder
      .addCase(resolveIssue.fulfilled, (state, action) => {
        const index = state.issues.findIndex(issue => issue.id === action.payload.id)
        if (index !== -1) {
          state.issues[index] = action.payload
        }
        const filteredIndex = state.filteredIssues.findIndex(issue => issue.id === action.payload.id)
        if (filteredIndex !== -1) {
          state.filteredIssues[filteredIndex] = action.payload
        }
        if (state.currentIssue?.id === action.payload.id) {
          state.currentIssue = action.payload
        }
      })

    // Add watcher
    builder
      .addCase(addWatcher.fulfilled, (state, action) => {
        const index = state.issues.findIndex(issue => issue.id === action.payload.id)
        if (index !== -1) {
          state.issues[index] = action.payload
        }
        const filteredIndex = state.filteredIssues.findIndex(issue => issue.id === action.payload.id)
        if (filteredIndex !== -1) {
          state.filteredIssues[filteredIndex] = action.payload
        }
        if (state.currentIssue?.id === action.payload.id) {
          state.currentIssue = action.payload
        }
      })

    // Remove watcher
    builder
      .addCase(removeWatcher.fulfilled, (state, action) => {
        const index = state.issues.findIndex(issue => issue.id === action.payload.id)
        if (index !== -1) {
          state.issues[index] = action.payload
        }
        const filteredIndex = state.filteredIssues.findIndex(issue => issue.id === action.payload.id)
        if (filteredIndex !== -1) {
          state.filteredIssues[filteredIndex] = action.payload
        }
        if (state.currentIssue?.id === action.payload.id) {
          state.currentIssue = action.payload
        }
      })

    // Fetch overdue issues
    builder
      .addCase(fetchOverdueIssues.fulfilled, (state, action) => {
        state.filteredIssues = action.payload
      })

    // Fetch issue count by project
    builder
      .addCase(fetchIssueCountByProject.fulfilled, (state, action) => {
        // Store count in pagination or separate state as needed
        state.pagination.totalElements = action.payload
      })
  }
})

export const {
  clearError,
  setFilters,
  clearFilters,
  setCurrentIssue,
  clearCurrentIssue,
  updateIssueInList,
  removeIssueFromList,
  setPagination
} = issuesSlice.actions

export default issuesSlice.reducer
