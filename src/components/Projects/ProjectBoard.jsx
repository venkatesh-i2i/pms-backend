import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchIssuesByProject, updateIssueStatus } from '../../store/slices/issuesSlice'
import { fetchProjectById } from '../../store/slices/projectsSlice'
import { fetchWorkLogs, logTime } from '../../store/slices/tasksSlice'
import TaskComments from '../Tasks/TaskComments'
import QuickAssignmentModal from '../Issues/QuickAssignmentModal'
import FileUpload from '../Files/FileUpload'
import { colors, typography, spacing, shadows, borderRadius } from '../../styles/theme'
import api from '../../services/api'
import fileService from '../../services/fileService'

// Priority color helper at module scope so style factories can access it
const getPriorityColor = (priority) => {
  const priorityToColorMap = {
    CRITICAL: '#FF5630',
    HIGHEST: '#FF5630',
    HIGH: '#FF8B00',
    MEDIUM: '#0052CC',
    LOW: '#36B37E',
    LOWEST: '#36B37E',
  }
  return priorityToColorMap[priority] || '#97A0AF'
}

//

const ProjectBoard = () => {
  const { projectId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { issues, loading, error } = useSelector((state) => state.issues)
  const { currentProject } = useSelector((state) => state.projects)
  const [activeIssue, setActiveIssue] = useState(null)
  // const [showCreateIssue, setShowCreateIssue] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState('TODO')
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)
  const [issueToAssign, setIssueToAssign] = useState(null)
  // Time logging local state
  const { workLogs } = useSelector((state) => state.tasks)
  const [hoursWorked, setHoursWorked] = useState('')
  const [workDate, setWorkDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [workDescription, setWorkDescription] = useState('')
  const [isLoggingTime, setIsLoggingTime] = useState(false)
  const [showProjectFiles, setShowProjectFiles] = useState(false)
  const [projectFiles, setProjectFiles] = useState([])
  const [projectFilesLoading, setProjectFilesLoading] = useState(false)
  const [showProjectUploader, setShowProjectUploader] = useState(false)
  const [taskFiles, setTaskFiles] = useState([])
  const [taskFilesLoading, setTaskFilesLoading] = useState(false)
  const [showTaskUploader, setShowTaskUploader] = useState(false)
  const [deletingFileId, setDeletingFileId] = useState(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState({ id: null, scope: null })

  useEffect(() => {
    if (projectId) {
      dispatch(fetchIssuesByProject(projectId))
      dispatch(fetchProjectById(projectId))
    }
  }, [dispatch, projectId])

  // Load project files when Files panel opens
  useEffect(() => {
    const loadProjectFiles = async () => {
      if (!projectId || !showProjectFiles) return
      setProjectFilesLoading(true)
      try {
        const files = await fileService.getProjectFiles(projectId)
        setProjectFiles(Array.isArray(files) ? files : [])
      } catch (e) {
        console.error('Failed to fetch project files', e)
        setProjectFiles([])
      } finally {
        setProjectFilesLoading(false)
      }
    }
    loadProjectFiles()
  }, [projectId, showProjectFiles])

  // Load work logs when opening an issue
  useEffect(() => {
    if (activeIssue?.id) {
      dispatch(fetchWorkLogs(activeIssue.id))
    }
  }, [dispatch, activeIssue?.id])

  // Load task files when opening an issue
  useEffect(() => {
    const loadTaskFiles = async () => {
      if (!activeIssue?.id) return
      setTaskFilesLoading(true)
      try {
        const files = await fileService.getTaskFiles(activeIssue.id)
        setTaskFiles(Array.isArray(files) ? files : [])
      } catch (e) {
        console.error('Failed to fetch task files', e)
        setTaskFiles([])
      } finally {
        setTaskFilesLoading(false)
      }
    }
    loadTaskFiles()
  }, [activeIssue?.id])

  const columns = [
    { id: 'TODO', title: 'To Do', color: '#97A0AF' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: '#0052CC' },
    { id: 'IN_REVIEW', title: 'In Review', color: '#FFAB00' },
    { id: 'TESTING', title: 'Testing', color: '#8B5CF6' },
    { id: 'DONE', title: 'Done', color: '#36B37E' },
    { id: 'BLOCKED', title: 'Blocked', color: '#FF5630' }
  ]

  const handleCreateIssue = (columnId) => {
    setSelectedColumn(columnId)
    navigate(`/projects/${projectId}/issues/create`)
  }

  const handleIssueClick = (issue) => {
    setActiveIssue(issue)
  }

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      await dispatch(updateIssueStatus({ issueId, status: newStatus })).unwrap()
    } catch (error) {
      console.error('Failed to update issue status:', error)
    }
  }

  const handleAssignClick = (e, issue) => {
    e.stopPropagation() // Prevent issue detail modal from opening
    setIssueToAssign(issue)
    setShowAssignmentModal(true)
  }

  const handleAssignmentModalClose = () => {
    setShowAssignmentModal(false)
    setIssueToAssign(null)
  }

  const handleProjectFileUpload = async (uploadedFiles) => {
    console.log('Project files uploaded:', uploadedFiles)
    setShowProjectUploader(false)
    // Refresh list
    try {
      const files = await fileService.getProjectFiles(projectId)
      setProjectFiles(Array.isArray(files) ? files : [])
    } catch {}
  }

  const handleTaskFileUpload = async (uploadedFiles) => {
    console.log('Task files uploaded:', uploadedFiles)
    setShowTaskUploader(false)
    // Refresh list
    try {
      const files = await fileService.getTaskFiles(activeIssue?.id)
      setTaskFiles(Array.isArray(files) ? files : [])
    } catch {}
  }

  const handleFileUploadError = (error) => {
    console.error('File upload error:', error)
    // Could show an error notification here
  }

  // Role/ownership check for delete visibility
  const getRoleNames = () => {
    if (!user) return []
    if (Array.isArray(user.roles)) {
      return user.roles.map((r) => (typeof r === 'string' ? r : r?.name)).filter(Boolean)
    }
    return user.role ? [user.role] : []
  }

  const hasAnyRole = (roles) => {
    const names = getRoleNames()
    return roles.some((r) => names.includes(r))
  }

  const canDeleteFile = (file) => {
    if (!user || !file) return false
    if (hasAnyRole(['ADMIN', 'MANAGER'])) return true
    return file.uploadedBy?.id && user.id && file.uploadedBy.id === user.id
  }

  const handleDeleteFile = async (fileId, scope) => {
    if (!fileId) return
    setDeletingFileId(fileId)
    try {
      await fileService.deleteFile(fileId)
      // Refresh respective list
      if (scope === 'project') {
        const files = await fileService.getProjectFiles(projectId)
        setProjectFiles(Array.isArray(files) ? files : [])
      } else if (scope === 'task' && activeIssue?.id) {
        const files = await fileService.getTaskFiles(activeIssue.id)
        setTaskFiles(Array.isArray(files) ? files : [])
      }
    } catch (e) {
      console.error('Failed to delete file', e)
      alert('Unable to delete file. You may not have permission.')
    } finally {
      setDeletingFileId(null)
    }
  }

  const requestDelete = (fileId, scope) => {
    setDeleteTarget({ id: fileId, scope })
    setIsDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    const { id, scope } = deleteTarget || {}
    setIsDeleteConfirmOpen(false)
    await handleDeleteFile(id, scope)
    setDeleteTarget({ id: null, scope: null })
  }

  const cancelDelete = () => {
    setIsDeleteConfirmOpen(false)
    setDeleteTarget({ id: null, scope: null })
  }

  // Helpers for time logging
  const toMinutes = (hoursString) => {
    // Accept formats: "1.5", "1:30"
    if (!hoursString) return 0
    const trimmed = String(hoursString).trim()
    if (trimmed.includes(':')) {
      const [h, m] = trimmed.split(':').map((v) => parseInt(v || '0', 10))
      return Math.max(0, (h || 0) * 60 + (m || 0))
    }
    const num = parseFloat(trimmed)
    if (Number.isFinite(num)) return Math.max(0, Math.round(num * 60))
    return 0
  }

  const formatMinutes = (mins) => {
    const m = Math.max(0, Math.floor(mins || 0))
    const h = Math.floor(m / 60)
    const r = m % 60
    return `${h}h ${r}m`
  }

  const totalLoggedMinutes = Array.isArray(workLogs)
    ? workLogs.reduce((sum, wl) => sum + (wl.timeSpent ?? Math.round((wl.hoursWorked || 0) * 60)), 0)
    : 0

  const handleLogTime = async (e) => {
    e.preventDefault()
    if (!activeIssue?.id) return
    const minutes = toMinutes(hoursWorked)
    if (!minutes) return
    setIsLoggingTime(true)
    try {
      const timeData = {
        // provide both for backend compatibility
        timeSpent: minutes,
        hoursWorked: minutes / 60,
        description: workDescription || '',
        workDate: workDate, // YYYY-MM-DD
      }
      await dispatch(logTime({ taskId: activeIssue.id, timeData })).unwrap()
      // Clear inputs and refresh logs
      setHoursWorked('')
      setWorkDescription('')
      dispatch(fetchWorkLogs(activeIssue.id))
      // Optimistically reflect on the open modal if available
      setActiveIssue((prev) => (prev ? { ...prev, actualTime: (prev.actualTime || 0) + minutes } : prev))
    } catch (err) {
      console.error('Failed to log time:', err)
    } finally {
      setIsLoggingTime(false)
    }
  }

  // Status movement helpers using column order
  const getStatusIndex = (status) => columns.findIndex((c) => c.id === status)
  const getPrevStatus = (status) => {
    const idx = getStatusIndex(status)
    return idx > 0 ? columns[idx - 1].id : null
  }
  const getNextStatus = (status) => {
    const idx = getStatusIndex(status)
    return idx >= 0 && idx < columns.length - 1 ? columns[idx + 1].id : null
  }

  const getPriorityIcon = (priority) => {
    const icons = {
      'CRITICAL': '🔴',
      'HIGHEST': '🔥',
      'HIGH': '⚡',
      'MEDIUM': '📌',
      'LOW': '📝',
      'LOWEST': '⬇️'
    }
    return icons[priority] || '📌'
  }

  const getIssuesByStatus = (status) => issues.filter(issue => issue.status === status)

  const getColumnCount = (status) => {
    return getIssuesByStatus(status).length
  }

  const getUserAvatar = (user) => {
    if (!user) return '?'
    return user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?'
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke={colors.primary[200]} strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="12" r="10" stroke={colors.primary[500]} strokeWidth="2" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="31.416">
                <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
              </circle>
            </svg>
          </div>
          <p style={styles.loadingText}>Loading project board...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
              <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <h3 style={styles.errorTitle}>Failed to load project board</h3>
          <p style={styles.errorMessage}>{error}</p>
          <button 
            onClick={() => dispatch(fetchIssuesByProject(projectId))}
            style={styles.retryBtn}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.projectInfo}>
            <h1 style={styles.projectTitle}>{currentProject?.name || 'Project Board'}</h1>
            <div style={styles.projectMeta}>
              {currentProject?.projectKey && (
                <span style={styles.projectKey}>{currentProject.projectKey}</span>
              )}
              {currentProject?.projectLead?.name && (
                <span style={styles.projectLead}>Lead: {currentProject.projectLead.name}</span>
              )}
              {Array.isArray(currentProject?.members) && (
                <span style={styles.projectMembers}>{currentProject.members.length} members</span>
              )}
            </div>
          </div>
          <div style={styles.headerActions}>
            <button style={styles.actionBtn} onClick={() => handleCreateIssue(selectedColumn)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Create Issue
            </button>
            <button 
              style={styles.actionBtn}
              onClick={() => setShowProjectFiles(!showProjectFiles)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Files
            </button>
            <button style={styles.actionBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Board Controls */}
      <div style={styles.boardControls}>
        <div style={styles.controlsLeft}>
          <div style={styles.viewOptions}>
            <button style={styles.viewBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Board
            </button>
            <button style={styles.viewBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2"/>
                <line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2"/>
                <line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2"/>
                <line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" strokeWidth="2"/>
                <line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" strokeWidth="2"/>
                <line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" strokeWidth="2"/>
              </svg>
              List
            </button>
            <button style={styles.viewBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 11H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 7H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 3H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 7H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 11H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 15H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Backlog
            </button>
          </div>
        </div>
        <div style={styles.controlsRight}>
          <button style={styles.filterBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Filter
          </button>
          <button style={styles.filterBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 18H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Sort
          </button>
        </div>
      </div>

      {/* Project Files Section */}
      {showProjectFiles && (
        <div style={styles.filesSection}>
          <div style={styles.filesSectionHeader}>
            <h3 style={styles.filesSectionTitle}>Project Files</h3>
            <div style={{ display: 'flex', gap: spacing[2], alignItems: 'center' }}>
              <button
                onClick={() => setShowProjectUploader((v) => !v)}
                style={styles.actionBtn}
              >
                {showProjectUploader ? 'Close' : 'Add File'}
              </button>
              <button 
                onClick={() => setShowProjectFiles(false)}
                style={styles.closeSectionBtn}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            </div>
          </div>
          <div style={styles.filesSectionContent}>
            {/* List files */}
            {projectFilesLoading ? (
              <div style={{ padding: spacing[3], color: colors.text.secondary }}>Loading files…</div>
            ) : projectFiles.length === 0 ? (
              <div style={{ padding: spacing[3], color: colors.text.secondary }}>No files</div>
            ) : (
              projectFiles.map((f) => {
                return (
                  <div key={f.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: spacing[2], border: `1px solid ${colors.border.primary}`, borderRadius: borderRadius.base,
                    background: colors.background.secondary, marginBottom: spacing[2]
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600 }}>{f.originalFilename || f.name}</span>
                      <span style={{ color: colors.text.secondary, fontSize: typography.fontSize.xs }}>
                        {f.fileSize ? `${Math.round(f.fileSize / 1024)} KB` : ''}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: spacing[2] }}>
                      <button
                        onClick={() => fileService.downloadFile(f.id, f.originalFilename || f.name)}
                        style={styles.actionBtn}
                      >
                        Download
                      </button>
                      {canDeleteFile(f) && (
                        <button
                          onClick={() => requestDelete(f.id, 'project')}
                          style={{ ...styles.actionBtn, backgroundColor: colors.danger[50], color: colors.danger[600] }}
                          disabled={deletingFileId === f.id}
                        >
                          {deletingFileId === f.id ? 'Deleting…' : 'Delete'}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })
            )}

            {/* Uploader only when requested */}
            {showProjectUploader && (
              <div style={{ marginTop: spacing[3] }}>
                <FileUpload
                  projectId={projectId}
                  onUploadSuccess={handleProjectFileUpload}
                  onUploadError={handleFileUploadError}
                  className="project-file-upload"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div style={styles.board}>
        {columns.map((column) => (
          <div key={column.id} style={styles.column}>
            <div style={styles.columnHeader}>
              <div style={styles.columnInfo}>
                <div style={styles.columnTitle}>
                  <div style={{ ...styles.columnColor, backgroundColor: column.color }} />
                  {column.title}
                </div>
                <span style={styles.columnCount}>{getColumnCount(column.id)}</span>
              </div>
              <button 
                onClick={() => handleCreateIssue(column.id)}
                style={styles.addTaskBtn}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div style={styles.columnContent}>
              {getIssuesByStatus(column.id).map((issue) => (
                <div 
                  key={issue.id} 
                  style={styles.taskCard}
                  onClick={() => handleIssueClick(issue)}
                >
                   <div style={styles.taskHeader}>
                    <div style={styles.taskKey}>{issue.issueKey || issue.taskKey}</div>
                    <div style={styles.taskPriority}>
                      <span style={styles.priorityIcon}>{getPriorityIcon(issue.priority)}</span>
                    </div>
                  </div>
                  
                  <h4 style={styles.taskTitle}>{issue.title || issue.summary}</h4>
                  <p style={styles.taskDescription}>{issue.description}</p>
                  
                  <div style={styles.taskMeta}>
                    {issue.issueType && (
                      <div style={styles.taskType}>
                        <span style={styles.issueType}>{issue.issueType}</span>
                      </div>
                    )}
                    {(issue.estimatedHours || issue.estimatedTime) && (
                      <div style={styles.taskStoryPoints}>
                        <span style={styles.storyPoints}>
                          {Math.floor((issue.estimatedHours ?? Math.ceil((issue.estimatedTime||0)/60)))}h
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div style={styles.taskFooter}>
                    <div style={styles.taskAssignee}>
                      <button
                        onClick={(e) => handleAssignClick(e, issue)}
                        style={styles.assigneeBtn}
                        title={issue.assignee ? `Assigned to ${issue.assignee.name}` : 'Click to assign'}
                      >
                        {issue.assignee ? (
                          <div style={styles.avatar}>{getUserAvatar(issue.assignee)}</div>
                        ) : (
                          <div style={styles.avatarEmpty}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                              <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        )}
                      </button>
                    </div>
                    <div style={styles.taskActions}>
                      <button
                        title="Move left"
                        style={styles.moveBtn}
                        disabled={!getPrevStatus(issue.status)}
                        onClick={(e) => {
                          e.stopPropagation()
                          const prev = getPrevStatus(issue.status)
                          if (prev) handleStatusChange(issue.id, prev)
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <select
                        value={issue.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          e.stopPropagation()
                          handleStatusChange(issue.id, e.target.value)
                        }}
                        style={styles.statusSelect}
                      >
                        {columns.map((c) => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                      <button
                        title="Move right"
                        style={styles.moveBtn}
                        disabled={!getNextStatus(issue.status)}
                        onClick={(e) => {
                          e.stopPropagation()
                          const next = getNextStatus(issue.status)
                          if (next) handleStatusChange(issue.id, next)
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                    <div style={styles.taskStats}>
                      <div style={styles.taskStat}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {issue.commentCount || 0}
                      </div>
                      {issue.dueDate && (
                      <div style={styles.taskStat}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                          {new Date(issue.dueDate).toLocaleDateString()}
                      </div>
                      )}
                    </div>
                  </div>
                  
                   {(issue.estimatedHours || issue.estimatedTime) && (issue.actualHours || issue.actualTime) && (
                  <div style={styles.timeTracking}>
                    <div style={styles.timeBar}>
                      <div 
                        style={{
                          ...styles.timeProgress,
                            width: `${Math.min(
                              ((issue.actualHours ?? 0) / (issue.estimatedHours ?? Math.max(1, (issue.estimatedTime||0)/60))) * 100,
                              100
                            )}%`
                        }}
                      />
                    </div>
                      <span style={styles.timeText}>
                        {Math.floor(issue.actualHours ?? (issue.actualTime||0)/60)}h {Math.round(((issue.actualHours ?? 0)%1)*60)}m /
                        {Math.floor(issue.estimatedHours ?? (issue.estimatedTime||0)/60)}h {Math.round(((issue.estimatedHours ?? 0)%1)*60)}m
                      </span>
                  </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Issue Detail Modal */}
      {activeIssue && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{activeIssue.summary}</h2>
              <button 
                onClick={() => setActiveIssue(null)}
                style={styles.closeBtn}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            </div>
            <div style={styles.modalContent}>
              <div style={styles.taskDetail}>
                <div style={styles.detailSection}>
                  <h3 style={styles.sectionTitle}>Description</h3>
                  <p style={styles.description}>{activeIssue.description || 'No description provided'}</p>
                </div>
                
                <div style={styles.detailGrid}>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Issue Key</span>
                    <span style={styles.issueKeyBadge}>{activeIssue.issueKey}</span>
                  </div>
                  
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Type</span>
                    <span style={styles.typeBadge}>{activeIssue.issueType}</span>
                  </div>
                  
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Assignee</span>
                    {activeIssue.assignee ? (
                    <div style={styles.assigneeInfo}>
                        <div style={styles.avatar}>{getUserAvatar(activeIssue.assignee)}</div>
                        <span>{activeIssue.assignee.name}</span>
                    </div>
                    ) : (
                      <span>Unassigned</span>
                    )}
                  </div>
                  
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Reporter</span>
                    {activeIssue.reporter && (
                    <div style={styles.assigneeInfo}>
                        <div style={styles.avatar}>{getUserAvatar(activeIssue.reporter)}</div>
                        <span>{activeIssue.reporter.name}</span>
                    </div>
                    )}
                  </div>
                  
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Priority</span>
                    <span style={styles.priorityBadge(activeIssue.priority)}>
                      {getPriorityIcon(activeIssue.priority)} {activeIssue.priority}
                    </span>
                  </div>
                  
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Status</span>
                    <span style={styles.statusBadge}>{activeIssue.status}</span>
                  </div>
                </div>
                
                {/* Files */}
                <div style={styles.detailSection}>
                  <h3 style={styles.sectionTitle}>Files</h3>
                  {/* List task files */}
                  {taskFilesLoading ? (
                    <div style={{ color: colors.text.secondary }}>Loading files…</div>
                  ) : taskFiles.length === 0 ? (
                    <div style={{ color: colors.text.secondary }}>No files</div>
                  ) : (
                    taskFiles.map((f) => {
                      return (
                        <div key={f.id} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: spacing[2], border: `1px solid ${colors.border.primary}`, borderRadius: borderRadius.base,
                          background: colors.background.secondary, marginBottom: spacing[2]
                        }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 600 }}>{f.originalFilename || f.name}</span>
                            <span style={{ color: colors.text.secondary, fontSize: typography.fontSize.xs }}>
                              {f.fileSize ? `${Math.round(f.fileSize / 1024)} KB` : ''}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: spacing[2] }}>
                            <button
                              onClick={() => fileService.downloadFile(f.id, f.originalFilename || f.name)}
                              style={styles.actionBtn}
                            >
                              Download
                            </button>
                            {canDeleteFile(f) && (
                              <button
                              onClick={() => requestDelete(f.id, 'task')}
                                style={{ ...styles.actionBtn, backgroundColor: colors.danger[50], color: colors.danger[600] }}
                                disabled={deletingFileId === f.id}
                              >
                                {deletingFileId === f.id ? 'Deleting…' : 'Delete'}
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })
                  )}
                  {/* Add file button toggles uploader */}
                  <div style={{ marginTop: spacing[2] }}>
                    <button
                      onClick={() => setShowTaskUploader((v) => !v)}
                      style={styles.actionBtn}
                    >
                      {showTaskUploader ? 'Close' : 'Add File'}
                    </button>
                  </div>
                  {showTaskUploader && (
                    <div style={{ marginTop: spacing[2] }}>
                      <FileUpload
                        projectId={projectId}
                        taskId={activeIssue.id}
                        onUploadSuccess={handleTaskFileUpload}
                        onUploadError={handleFileUploadError}
                        className="task-file-upload"
                      />
                    </div>
                  )}
                </div>

                {/* Comments */}
                <div style={styles.detailSection}>
                  <h3 style={styles.sectionTitle}>Comments</h3>
                  <div>
                    <TaskComments taskId={activeIssue.id} />
                  </div>
                </div>
                {/* Work Logs */}
                <div style={styles.detailSection}>
                  <h3 style={styles.sectionTitle}>Work Logs</h3>
                  <form onSubmit={handleLogTime} style={styles.timeLogForm}>
                    <div style={styles.timeLogRow}>
                      <div style={styles.timeLogField}>
                        <label style={styles.timeLogLabel}>Hours</label>
                        <input
                          type="text"
                          placeholder="e.g. 1.5 or 1:30"
                          value={hoursWorked}
                          onChange={(e) => setHoursWorked(e.target.value)}
                          style={styles.timeLogInput}
                          autoComplete="off"
                        />
                      </div>
                      <div style={styles.timeLogField}>
                        <label style={styles.timeLogLabel}>Date</label>
                        <input
                          type="date"
                          value={workDate}
                          onChange={(e) => setWorkDate(e.target.value)}
                          style={styles.timeLogInput}
                        />
                      </div>
                    </div>
                    <div style={styles.timeLogField}>
                      <label style={styles.timeLogLabel}>Description</label>
                      <input
                        type="text"
                        placeholder="What did you work on?"
                        value={workDescription}
                        onChange={(e) => setWorkDescription(e.target.value)}
                        style={styles.timeLogInput}
                        autoComplete="off"
                      />
                    </div>
                    <div style={styles.timeLogActions}>
                      <button type="submit" style={styles.logTimeBtn} disabled={isLoggingTime || !hoursWorked.trim()}>
                        {isLoggingTime ? 'Logging…' : 'Log Time'}
                      </button>
                      <div style={styles.timeTotal}>Total: {formatMinutes(totalLoggedMinutes)}</div>
                    </div>
                  </form>
                  <div style={styles.workLogsList}>
                    {Array.isArray(workLogs) && workLogs.length > 0 ? (
                      workLogs.map((wl) => (
                        <div key={wl.id} style={styles.workLogItem}>
                          <div style={styles.workLogMeta}>
                            <span>{new Date(wl.workDate || wl.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{formatMinutes(wl.timeSpent ?? Math.round((wl.hoursWorked || 0) * 60))}</span>
                          </div>
                          {wl.description && <div style={styles.workLogDesc}>{wl.description}</div>}
                        </div>
                      ))
                    ) : (
                      <div style={styles.noWorkLogs}>No work logs yet</div>
                    )}
                  </div>
                </div>
              </div>
                
                {(activeIssue.estimatedTime || activeIssue.actualTime) && (
                <div style={styles.detailSection}>
                  <h3 style={styles.sectionTitle}>Time Tracking</h3>
                  <div style={styles.timeTrackingDetail}>
                      {activeIssue.actualTime && (
                    <div style={styles.timeItem}>
                      <span>Time Spent:</span>
                          <span>{Math.floor(activeIssue.actualTime / 60)}h {activeIssue.actualTime % 60}m</span>
                    </div>
                      )}
                      {activeIssue.estimatedTime && (
                    <div style={styles.timeItem}>
                      <span>Time Estimate:</span>
                          <span>{Math.floor(activeIssue.estimatedTime / 60)}h {activeIssue.estimatedTime % 60}m</span>
                    </div>
                      )}
                      {activeIssue.estimatedTime && activeIssue.actualTime && (
                    <div style={styles.timeItem}>
                      <span>Remaining:</span>
                          <span>{Math.floor(Math.max(0, activeIssue.estimatedTime - activeIssue.actualTime) / 60)}h {Math.max(0, activeIssue.estimatedTime - activeIssue.actualTime) % 60}m</span>
                    </div>
                      )}
                  </div>
                </div>
                )}
                
                {activeIssue.dueDate && (
                  <div style={styles.detailSection}>
                    <h3 style={styles.sectionTitle}>Due Date</h3>
                    <p style={styles.dueDateText}>
                      {new Date(activeIssue.dueDate).toLocaleDateString()} at {new Date(activeIssue.dueDate).toLocaleTimeString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
      )}

      {/* Quick Assignment Modal */}
      <QuickAssignmentModal 
        issue={issueToAssign}
        isOpen={showAssignmentModal}
        onClose={handleAssignmentModalClose}
      />
      {isDeleteConfirmOpen && (
        <div style={styles.confirmOverlay}>
          <div style={styles.confirmModal}>
            <h3 style={styles.confirmTitle}>Delete file?</h3>
            <p style={styles.confirmText}>This action cannot be undone.</p>
            <div style={styles.confirmActions}>
              <button onClick={cancelDelete} style={styles.cancelBtn}>Cancel</button>
              <button
                onClick={confirmDelete}
                style={styles.dangerBtn}
                disabled={deletingFileId === deleteTarget.id}
              >
                {deletingFileId === deleteTarget.id ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: colors.background.secondary,
  },
  header: {
    backgroundColor: colors.background.primary,
    borderBottom: `1px solid ${colors.border.primary}`,
    padding: `${spacing[4]} 0`,
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: `0 ${spacing[4]}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectInfo: {
    flex: 1,
  },
  projectTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    margin: `0 0 ${spacing[2]} 0`,
  },
  projectMeta: {
    display: 'flex',
    gap: spacing[3],
    alignItems: 'center',
  },
  projectKey: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary[500],
    backgroundColor: colors.primary[50],
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: borderRadius.base,
  },
  projectLead: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  projectMembers: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  headerActions: {
    display: 'flex',
    gap: spacing[3],
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    padding: `${spacing[2]} ${spacing[4]}`,
    backgroundColor: colors.primary[500],
    color: colors.text.inverse,
    border: 'none',
    borderRadius: borderRadius.base,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.primary[600],
    },
  },
  boardControls: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: `${spacing[4]} ${spacing[4]} 0`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlsLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  viewOptions: {
    display: 'flex',
    gap: spacing[1],
  },
  viewBtn: {
    padding: `${spacing[2]} ${spacing[3]}`,
    backgroundColor: 'transparent',
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.base,
    color: colors.text.secondary,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
    '&:hover': {
      backgroundColor: colors.background.primary,
      color: colors.text.primary,
    },
  },
  controlsRight: {
    display: 'flex',
    gap: spacing[2],
  },
  filterBtn: {
    padding: `${spacing[2]} ${spacing[3]}`,
    backgroundColor: 'transparent',
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.base,
    color: colors.text.secondary,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
    '&:hover': {
      backgroundColor: colors.background.primary,
      color: colors.text.primary,
    },
  },
  board: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: spacing[4],
    display: 'flex',
    gap: spacing[4],
    minHeight: 'calc(100vh - 200px)',
  },
  column: {
    flex: 1,
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    border: `1px solid ${colors.border.primary}`,
    display: 'flex',
    flexDirection: 'column',
    minWidth: '300px',
  },
  columnHeader: {
    padding: spacing[4],
    borderBottom: `1px solid ${colors.border.primary}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  columnInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
  },
  columnTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  columnColor: {
    width: '12px',
    height: '12px',
    borderRadius: borderRadius.full,
  },
  columnCount: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    backgroundColor: colors.background.secondary,
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: borderRadius.base,
  },
  addTaskBtn: {
    padding: spacing[2],
    backgroundColor: 'transparent',
    border: 'none',
    color: colors.text.secondary,
    cursor: 'pointer',
    borderRadius: borderRadius.base,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.background.secondary,
      color: colors.text.primary,
    },
  },
  columnContent: {
    flex: 1,
    padding: spacing[3],
    overflowY: 'auto',
  },
  taskCard: {
    backgroundColor: colors.background.secondary,
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.base,
    padding: spacing[3],
    marginBottom: spacing[3],
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      boxShadow: shadows.md,
      transform: 'translateY(-2px)',
    },
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  taskKey: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.secondary,
  },
  taskPriority: {
    display: 'flex',
    alignItems: 'center',
  },
  priorityIcon: {
    fontSize: typography.fontSize.sm,
  },
  taskTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    margin: `0 0 ${spacing[2]} 0`,
    lineHeight: typography.lineHeight.normal,
  },
  taskDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    margin: `0 0 ${spacing[3]} 0`,
    lineHeight: typography.lineHeight.relaxed,
  },
  taskMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  taskLabels: {
    display: 'flex',
    gap: spacing[1],
  },
  label: {
    fontSize: typography.fontSize.xs,
    backgroundColor: colors.neutral[100],
    color: colors.text.secondary,
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: borderRadius.base,
  },
  taskStoryPoints: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  storyPoints: {
    backgroundColor: colors.primary[50],
    color: colors.primary[500],
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: borderRadius.base,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  taskFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  taskAssignee: {
    display: 'flex',
    alignItems: 'center',
  },
  assigneeBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '2px',
    borderRadius: borderRadius.full,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.background.secondary,
    },
  },
  avatar: {
    width: '24px',
    height: '24px',
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[500],
    color: colors.text.inverse,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  taskStats: {
    display: 'flex',
    gap: spacing[2],
  },
  taskActions: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
  },
  moveBtn: {
    backgroundColor: 'transparent',
    border: `1px solid ${colors.border.primary}`,
    color: colors.text.secondary,
    borderRadius: borderRadius.base,
    padding: spacing[1],
    cursor: 'pointer',
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  statusSelect: {
    padding: `${spacing[1]} ${spacing[2]}`,
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.base,
    backgroundColor: colors.background.primary,
    color: colors.text.secondary,
    fontSize: typography.fontSize.xs,
    cursor: 'pointer',
  },
  taskStat: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
  },
  timeTracking: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[1],
  },
  timeBar: {
    height: '4px',
    backgroundColor: colors.border.primary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  timeProgress: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.full,
    transition: 'width 0.3s ease-in-out',
  },
  timeText: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.xl,
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'hidden',
  },
  modalHeader: {
    padding: spacing[4],
    borderBottom: `1px solid ${colors.border.primary}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    margin: 0,
  },
  closeBtn: {
    padding: spacing[2],
    backgroundColor: 'transparent',
    border: 'none',
    color: colors.text.secondary,
    cursor: 'pointer',
    borderRadius: borderRadius.base,
    '&:hover': {
      backgroundColor: colors.background.secondary,
      color: colors.text.primary,
    },
  },
  modalContent: {
    padding: spacing[4],
    overflowY: 'auto',
    maxHeight: 'calc(80vh - 80px)',
  },
  taskDetail: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[4],
  },
  detailSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[2],
  },
  sectionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    margin: 0,
  },
  description: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.relaxed,
    margin: 0,
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: spacing[4],
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[1],
  },
  detailLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  assigneeInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
  },
  priorityBadge: (priority) => ({
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: borderRadius.base,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    backgroundColor: getPriorityColor(priority) + '20',
    color: getPriorityColor(priority),
  }),
  storyPointsBadge: {
    padding: `${spacing[1]} ${spacing[2]}`,
    backgroundColor: colors.primary[50],
    color: colors.primary[500],
    borderRadius: borderRadius.base,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  timeTrackingDetail: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[2],
  },
  timeLogForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[3],
    marginTop: spacing[2],
  },
  timeLogRow: {
    display: 'flex',
    gap: spacing[3],
    flexWrap: 'wrap',
  },
  timeLogField: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[1],
    flex: 1,
    minWidth: '140px',
  },
  timeLogLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
  },
  timeLogInput: {
    padding: `${spacing[2]} ${spacing[3]}`,
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.base,
    backgroundColor: colors.background.primary,
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
  },
  timeLogActions: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
  },
  logTimeBtn: {
    padding: `${spacing[2]} ${spacing[4]}`,
    backgroundColor: colors.primary[500],
    color: colors.text.inverse,
    border: 'none',
    borderRadius: borderRadius.base,
    cursor: 'pointer',
  },
  timeTotal: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  workLogsList: {
    marginTop: spacing[2],
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[2],
  },
  workLogItem: {
    backgroundColor: colors.background.secondary,
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.base,
    padding: spacing[3],
  },
  workLogMeta: {
    display: 'flex',
    gap: spacing[2],
    color: colors.text.secondary,
    fontSize: typography.fontSize.xs,
    marginBottom: spacing[1],
  },
  workLogDesc: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
  },
  noWorkLogs: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  timeItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${spacing[2]} 0`,
    borderBottom: `1px solid ${colors.border.primary}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: spacing[4],
  },
  spinner: {
    color: colors.primary[500],
  },
  loadingText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: spacing[4],
  },
  errorIcon: {
    color: colors.danger[500],
  },
  errorTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    margin: 0,
  },
  errorMessage: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    margin: 0,
    textAlign: 'center',
  },
  retryBtn: {
    padding: `${spacing[2]} ${spacing[4]}`,
    backgroundColor: colors.primary[500],
    color: colors.text.inverse,
    border: 'none',
    borderRadius: borderRadius.base,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.primary[600],
    },
  },
  taskType: {
    display: 'flex',
    alignItems: 'center',
  },
  issueType: {
    fontSize: typography.fontSize.xs,
    backgroundColor: colors.neutral[100],
    color: colors.text.secondary,
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: borderRadius.base,
    fontWeight: typography.fontWeight.medium,
  },
  avatarEmpty: {
    width: '24px',
    height: '24px',
    borderRadius: borderRadius.full,
    backgroundColor: colors.neutral[200],
    color: colors.text.secondary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  issueKeyBadge: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary[500],
    backgroundColor: colors.primary[50],
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: borderRadius.base,
  },
  typeBadge: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    backgroundColor: colors.background.secondary,
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: borderRadius.base,
  },
  statusBadge: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    backgroundColor: colors.background.secondary,
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: borderRadius.base,
  },
  dueDateText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    margin: 0,
  },
  filesSection: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: `${spacing[4]} ${spacing[4]} 0`,
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    border: `1px solid ${colors.border.primary}`,
    marginTop: spacing[4],
  },
  filesSectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
    paddingBottom: spacing[3],
    borderBottom: `1px solid ${colors.border.primary}`,
  },
  filesSectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    margin: 0,
  },
  closeSectionBtn: {
    padding: spacing[2],
    backgroundColor: 'transparent',
    border: 'none',
    color: colors.text.secondary,
    cursor: 'pointer',
    borderRadius: borderRadius.base,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.background.secondary,
      color: colors.text.primary,
    },
  },
  filesSectionContent: {
    paddingBottom: spacing[4],
  },
  confirmOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1100,
  },
  confirmModal: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.lg,
    width: '90%',
    maxWidth: '360px',
    padding: spacing[4],
  },
  confirmTitle: {
    margin: 0,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  confirmText: {
    marginTop: spacing[2],
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  confirmActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: spacing[2],
    marginTop: spacing[4],
  },
  cancelBtn: {
    padding: `${spacing[2]} ${spacing[3]}`,
    backgroundColor: colors.background.secondary,
    color: colors.text.primary,
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.base,
    cursor: 'pointer',
  },
  dangerBtn: {
    padding: `${spacing[2]} ${spacing[3]}`,
    backgroundColor: colors.danger[500],
    color: colors.text.inverse,
    border: 'none',
    borderRadius: borderRadius.base,
    cursor: 'pointer',
  },
}

export default ProjectBoard 