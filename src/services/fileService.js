import api from './api'

// File upload services
export const fileService = {
  // Upload file to project
  uploadToProject: async (projectId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post(`/api/projects/${projectId}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    return response.data
  },

  // Upload file to issue/task
  uploadToTask: async (taskId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post(`/api/issues/${taskId}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    return response.data
  },

  // Get files for project
  getProjectFiles: async (projectId) => {
    const response = await api.get(`/api/projects/${projectId}/files`)
    return response.data
  },

  // Get files for task
  getTaskFiles: async (taskId) => {
    const response = await api.get(`/api/issues/${taskId}/files`)
    return response.data
  },

  // Get file details
  getFileDetails: async (fileId) => {
    const response = await api.get(`/api/files/${fileId}`)
    return response.data
  },

  // Download file
  downloadFile: async (fileId, filename) => {
    // Use authenticated request so Authorization header (token) is included
    const response = await api.get(`/api/files/${fileId}/download`, {
      responseType: 'blob',
    })
    let suggestedName = filename
    const disposition = response.headers?.['content-disposition'] || ''
    const match = disposition.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i)
    if (!suggestedName && match) {
      suggestedName = decodeURIComponent(match[1] || match[2])
    }
    const blob = new Blob([response.data])
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = suggestedName || `file-${fileId}`
    document.body.appendChild(link)
    link.click()
    URL.revokeObjectURL(url)
    document.body.removeChild(link)
  },

  // Delete file
  deleteFile: async (fileId) => {
    const response = await api.delete(`/api/files/${fileId}`)
    return response.data
  },

  // Upload multiple files to project
  uploadMultipleToProject: async (projectId, files) => {
    const uploadPromises = Array.from(files).map(file => 
      fileService.uploadToProject(projectId, file)
    )
    
    return Promise.all(uploadPromises)
  },

  // Upload multiple files to task
  uploadMultipleToTask: async (taskId, files) => {
    const uploadPromises = Array.from(files).map(file => 
      fileService.uploadToTask(taskId, file)
    )
    
    return Promise.all(uploadPromises)
  },

  // Format file size for display
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  // Get file icon based on file type
  getFileIcon: (fileType) => {
    if (fileType.startsWith('image/')) {
      return '🖼️'
    } else if (fileType.includes('pdf')) {
      return '📄'
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return '📝'
    } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
      return '📊'
    } else if (fileType.includes('powerpoint') || fileType.includes('presentation')) {
      return '📊'
    } else if (fileType.includes('zip') || fileType.includes('rar')) {
      return '🗜️'
    } else if (fileType.includes('video/')) {
      return '🎥'
    } else if (fileType.includes('audio/')) {
      return '🎵'
    } else {
      return '📎'
    }
  }
}

export default fileService

