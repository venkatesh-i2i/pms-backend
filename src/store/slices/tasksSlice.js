import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// Async thunks for task management
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = projectId 
        ? await api.get(`/api/projects/${projectId}/issues`)
        : await api.get('/api/issues')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks')
    }
  }
)

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/issues', taskData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create task')
    }
  }
)

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, taskData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/issues/${taskId}`, taskData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update task')
    }
  }
)

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/issues/${taskId}`)
      return taskId
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete task')
    }
  }
)

export const fetchTaskById = createAsyncThunk(
  'tasks/fetchTaskById',
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/issues/${taskId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch task')
    }
  }
)

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/issues/${taskId}/status`, { status })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update task status')
    }
  }
)

export const assignTask = createAsyncThunk(
  'tasks/assignTask',
  async ({ taskId, assigneeId }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/issues/${taskId}/assign`, { assigneeId })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign task')
    }
  }
)

export const searchTasks = createAsyncThunk(
  'tasks/searchTasks',
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/issues/search', { params: searchParams })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search tasks')
    }
  }
)

export const fetchTasksByAssignee = createAsyncThunk(
  'tasks/fetchTasksByAssignee',
  async (assigneeId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/users/${assigneeId}/issues`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks by assignee')
    }
  }
)

export const fetchTasksByStatus = createAsyncThunk(
  'tasks/fetchTasksByStatus',
  async (status, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/issues/status/${status}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks by status')
    }
  }
)

// Time tracking thunks
export const logTime = createAsyncThunk(
  'tasks/logTime',
  async ({ taskId, timeData }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/worklogs', { ...timeData, taskId })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to log time')
    }
  }
)

export const fetchWorkLogs = createAsyncThunk(
  'tasks/fetchWorkLogs',
  async (taskId, { rejectWithValue }) => {
    try {
      // Preferred endpoint per API spec; backend also supports /api/issues/{id}/worklogs
      const response = await api.get(`/api/worklogs/issue/${taskId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch work logs')
    }
  }
)

export const updateTimeEstimate = createAsyncThunk(
  'tasks/updateTimeEstimate',
  async ({ taskId, timeEstimate }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/issues/${taskId}/estimate`, { timeEstimate })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update time estimate')
    }
  }
)

// Comments and attachments
export const addComment = createAsyncThunk(
  'tasks/addComment',
  async ({ taskId, comment }, { rejectWithValue }) => {
    try {
      // Follow backend DTO: { taskId, content }
      const response = await api.post('/api/comments', {
        taskId: taskId,
        content: comment?.content,
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add comment')
    }
  }
)

export const fetchComments = createAsyncThunk(
  'tasks/fetchComments',
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/issues/${taskId}/comments`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments')
    }
  }
)

export const uploadAttachment = createAsyncThunk(
  'tasks/uploadAttachment',
  async ({ taskId, projectId, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (taskId) formData.append('taskId', taskId)
      if (projectId) formData.append('projectId', projectId)
      
      const response = await api.post('/api/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload attachment')
    }
  }
)

export const fetchAttachments = createAsyncThunk(
  'tasks/fetchAttachments',
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/issues/${taskId}/files`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attachments')
    }
  }
)

export const fetchProjectFiles = createAsyncThunk(
  'tasks/fetchProjectFiles',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/projects/${projectId}/files`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch project files')
    }
  }
)

const initialState = {
  tasks: [],
  currentTask: null,
  filteredTasks: [],
  workLogs: [],
  comments: [],
  attachments: [],
  loading: false,
  error: null,
  filters: {
    status: '',
    priority: '',
    assignee: '',
    search: ''
  }
}

const tasksSlice = createSlice({
  name: 'tasks',
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
        search: ''
      }
    },
    setCurrentTask: (state, action) => {
      state.currentTask = action.payload
    },
    clearCurrentTask: (state) => {
      state.currentTask = null
    },
    updateTaskInList: (state, action) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id)
      if (index !== -1) {
        state.tasks[index] = action.payload
      }
    },
    removeTaskFromList: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload)
    }
  },
  extraReducers: (builder) => {
    // Fetch tasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false
        state.tasks = action.payload
        state.filteredTasks = action.payload
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Create task
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false
        state.tasks.push(action.payload)
        state.filteredTasks.push(action.payload)
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Update task
    builder
      .addCase(updateTask.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false
        const index = state.tasks.findIndex(task => task.id === action.payload.id)
        if (index !== -1) {
          state.tasks[index] = action.payload
          state.filteredTasks[index] = action.payload
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Delete task
    builder
      .addCase(deleteTask.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false
        state.tasks = state.tasks.filter(task => task.id !== action.payload)
        state.filteredTasks = state.filteredTasks.filter(task => task.id !== action.payload)
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Fetch task by ID
    builder
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false
        state.currentTask = action.payload
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Update task status
    builder
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id)
        if (index !== -1) {
          state.tasks[index] = action.payload
          state.filteredTasks[index] = action.payload
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload
        }
      })

    // Assign task
    builder
      .addCase(assignTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id)
        if (index !== -1) {
          state.tasks[index] = action.payload
          state.filteredTasks[index] = action.payload
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload
        }
      })

    // Search tasks
    builder
      .addCase(searchTasks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchTasks.fulfilled, (state, action) => {
        state.loading = false
        state.filteredTasks = action.payload
      })
      .addCase(searchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Fetch tasks by assignee
    builder
      .addCase(fetchTasksByAssignee.fulfilled, (state, action) => {
        state.filteredTasks = action.payload
      })

    // Fetch tasks by status
    builder
      .addCase(fetchTasksByStatus.fulfilled, (state, action) => {
        state.filteredTasks = action.payload
      })

    // Log time
    builder
      .addCase(logTime.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(logTime.fulfilled, (state, action) => {
        state.loading = false
        state.workLogs.push(action.payload)
        // Update task time spent
        if (state.currentTask?.id === action.payload.taskId) {
          state.currentTask.timeSpent += action.payload.timeSpent
        }
      })
      .addCase(logTime.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Fetch work logs
    builder
      .addCase(fetchWorkLogs.fulfilled, (state, action) => {
        state.workLogs = action.payload
      })

    // Update time estimate
    builder
      .addCase(updateTimeEstimate.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id)
        if (index !== -1) {
          state.tasks[index] = action.payload
          state.filteredTasks[index] = action.payload
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload
        }
      })

    // Add comment
    builder
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload)
      })

    // Fetch comments
    builder
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload
      })

    // Upload attachment
    builder
      .addCase(uploadAttachment.fulfilled, (state, action) => {
        state.attachments.push(action.payload)
      })

    // Fetch attachments
    builder
      .addCase(fetchAttachments.fulfilled, (state, action) => {
        state.attachments = action.payload
      })
  }
})

export const {
  clearError,
  setFilters,
  clearFilters,
  setCurrentTask,
  clearCurrentTask,
  updateTaskInList,
  removeTaskFromList
} = tasksSlice.actions

export default tasksSlice.reducer 