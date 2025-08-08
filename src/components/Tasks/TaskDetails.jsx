import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchTaskById, updateTask } from '../../store/slices/tasksSlice'
import TaskComments from './TaskComments'
import FileUpload from '../Files/FileUpload'
import TimeTracking from './TimeTracking'
import { colors, typography, spacing, shadows, borderRadius } from '../../styles/theme'

const TaskDetails = () => {
  const { taskId, projectId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { currentTask: task, loading } = useSelector((state) => state.tasks)
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})

  useEffect(() => {
    dispatch(fetchTaskById(taskId))
  }, [taskId, dispatch])

  useEffect(() => {
    if (task) {
      setEditData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        estimatedHours: task.estimatedHours
      })
    }
  }, [task])

  const handleStatusChange = async (newStatus) => {
    try {
      await dispatch(updateTask({ taskId, taskData: { status: newStatus } })).unwrap()
    } catch (error) {
      console.error('Failed to update task status:', error)
    }
  }

  const handleSaveEdit = async () => {
    try {
      await dispatch(updateTask({ taskId, taskData: editData })).unwrap()
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'TODO': return '#97A0AF'
      case 'IN_PROGRESS': return '#0052CC'
      case 'IN_REVIEW': return '#FFAB00'
      case 'DONE': return '#36B37E'
      case 'BLOCKED': return '#FF5630'
      default: return '#97A0AF'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICAL': return '#FF5630'
      case 'HIGH': return '#FF8B00'
      case 'MEDIUM': return '#0052CC'
      case 'LOW': return '#36B37E'
      default: return '#97A0AF'
    }
  }

  const canEditTask = () => {
    if (!user || !task) return false
    return user.role === 'ADMIN' || user.role === 'PROJECT_MANAGER' || task.assignee?.id === user.id
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'comments', label: 'Comments', icon: '💬' },
    { id: 'attachments', label: 'Attachments', icon: '📎' },
    { id: 'time', label: 'Time Tracking', icon: '⏱️' }
  ]

  const statuses = [
    { value: 'TODO', label: 'To Do' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'IN_REVIEW', label: 'In Review' },
    { value: 'DONE', label: 'Done' },
    { value: 'BLOCKED', label: 'Blocked' }
  ]

  const priorities = [
    { value: 'CRITICAL', label: 'Critical' },
    { value: 'HIGH', label: 'High' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'LOW', label: 'Low' }
  ]

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingState}>
          <div style={styles.spinner}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="31.416">
                <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
              </circle>
            </svg>
          </div>
          <p style={styles.loadingText}>Loading task details...</p>
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div style={styles.container}>
        <div style={styles.errorState}>
          <h2>Task not found</h2>
          <p>The task you're looking for doesn't exist or you don't have permission to view it.</p>
          <button onClick={() => navigate(`/projects/${projectId}/board`)} style={styles.backButton}>
            Back to Project Board
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.breadcrumb}>
            <button onClick={() => navigate(`/projects/${projectId}/board`)} style={styles.breadcrumbLink}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Project Board
            </button>
            <span style={styles.breadcrumbSeparator}>/</span>
            <span style={styles.breadcrumbCurrent}>{task.taskKey}</span>
          </div>
          
          <div style={styles.taskHeader}>
            <div style={styles.taskInfo}>
              <div style={styles.taskKeyBadge}>{task.taskKey}</div>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                  style={styles.editTitleInput}
                />
              ) : (
                <h1 style={styles.taskTitle}>{task.title}</h1>
              )}
            </div>
            
            <div style={styles.taskActions}>
              {canEditTask() && (
                <>
                  {isEditing ? (
                    <>
                      <button onClick={() => setIsEditing(false)} style={styles.cancelButton}>
                        Cancel
                      </button>
                      <button onClick={handleSaveEdit} style={styles.saveButton}>
                        Save
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setIsEditing(true)} style={styles.editButton}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Edit
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <div style={styles.mainContent}>
          {/* Tabs */}
          <div style={styles.tabs}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  ...styles.tab,
                  ...(activeTab === tab.id && styles.activeTab)
                }}
              >
                <span style={styles.tabIcon}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={styles.tabContent}>
            {activeTab === 'overview' && (
              <div style={styles.overviewContent}>
                <div style={styles.descriptionSection}>
                  <h3 style={styles.sectionTitle}>Description</h3>
                  {isEditing ? (
                    <textarea
                      value={editData.description}
                      onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                      style={styles.editDescriptionTextarea}
                      rows={6}
                    />
                  ) : (
                    <p style={styles.description}>
                      {task.description || 'No description provided.'}
                    </p>
                  )}
                </div>

                <div style={styles.progressSection}>
                  <h3 style={styles.sectionTitle}>Progress</h3>
                  <div style={styles.progressBar}>
                    <div 
                      style={{
                        ...styles.progressFill,
                        width: `${task.progress || 0}%`,
                        backgroundColor: getStatusColor(task.status)
                      }}
                    />
                  </div>
                  <div style={styles.progressText}>
                    {task.progress || 0}% Complete
                  </div>
                </div>

                {task.actualHours > 0 && (
                  <div style={styles.timeSpentSection}>
                    <h3 style={styles.sectionTitle}>Time Spent</h3>
                    <div style={styles.timeMetrics}>
                      <div style={styles.timeMetric}>
                        <span style={styles.timeLabel}>Estimated:</span>
                        <span style={styles.timeValue}>{task.estimatedHours || 0}h</span>
                      </div>
                      <div style={styles.timeMetric}>
                        <span style={styles.timeLabel}>Actual:</span>
                        <span style={styles.timeValue}>{task.actualHours || 0}h</span>
                      </div>
                      <div style={styles.timeMetric}>
                        <span style={styles.timeLabel}>Remaining:</span>
                        <span style={styles.timeValue}>
                          {Math.max(0, (task.estimatedHours || 0) - (task.actualHours || 0))}h
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'comments' && (
              <TaskComments taskId={taskId} />
            )}

            {activeTab === 'attachments' && (
              <FileUpload
                projectId={projectId}
                taskId={taskId}
                onUploadSuccess={(files) => console.log('Files uploaded:', files)}
                onUploadError={(error) => console.error('Upload error:', error)}
                showFileList={true}
              />
            )}

            {activeTab === 'time' && (
              <TimeTracking taskId={taskId} />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={styles.sidebar}>
          {/* Status */}
          <div style={styles.sidebarCard}>
            <h3 style={styles.sidebarTitle}>Status</h3>
            {canEditTask() ? (
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                style={styles.statusSelect}
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            ) : (
              <div style={styles.statusBadge}>
                <div 
                  style={{
                    ...styles.statusDot,
                    backgroundColor: getStatusColor(task.status)
                  }}
                />
                {statuses.find(s => s.value === task.status)?.label}
              </div>
            )}
          </div>

          {/* Priority */}
          <div style={styles.sidebarCard}>
            <h3 style={styles.sidebarTitle}>Priority</h3>
            {isEditing ? (
              <select
                value={editData.priority}
                onChange={(e) => setEditData(prev => ({ ...prev, priority: e.target.value }))}
                style={styles.select}
              >
                {priorities.map(priority => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            ) : (
              <div style={styles.priorityBadge}>
                <div 
                  style={{
                    ...styles.priorityDot,
                    backgroundColor: getPriorityColor(task.priority)
                  }}
                />
                {priorities.find(p => p.value === task.priority)?.label}
              </div>
            )}
          </div>

          {/* Assignee */}
          <div style={styles.sidebarCard}>
            <h3 style={styles.sidebarTitle}>Assignee</h3>
            {task.assignee ? (
              <div style={styles.assigneeInfo}>
                <div style={styles.assigneeAvatar}>
                  {task.assignee.avatar || task.assignee.name.charAt(0)}
                </div>
                <div style={styles.assigneeDetails}>
                  <div style={styles.assigneeName}>{task.assignee.name}</div>
                  <div style={styles.assigneeEmail}>{task.assignee.email}</div>
                </div>
              </div>
            ) : (
              <div style={styles.unassigned}>Unassigned</div>
            )}
          </div>

          {/* Dates */}
          <div style={styles.sidebarCard}>
            <h3 style={styles.sidebarTitle}>Dates</h3>
            <div style={styles.dateItem}>
              <span style={styles.dateLabel}>Created:</span>
              <span style={styles.dateValue}>
                {new Date(task.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div style={styles.dateItem}>
              <span style={styles.dateLabel}>Updated:</span>
              <span style={styles.dateValue}>
                {new Date(task.updatedAt).toLocaleDateString()}
              </span>
            </div>
            {task.dueDate && (
              <div style={styles.dateItem}>
                <span style={styles.dateLabel}>Due:</span>
                <span style={{
                  ...styles.dateValue,
                  color: new Date(task.dueDate) < new Date() ? colors.danger[500] : colors.text.primary
                }}>
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: colors.background.secondary,
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[8],
    color: colors.text.secondary,
  },
  spinner: {
    marginBottom: spacing[4],
    color: colors.primary[500],
  },
  loadingText: {
    margin: 0,
    fontSize: typography.fontSize.lg,
  },
  errorState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[8],
    textAlign: 'center',
  },
  backButton: {
    padding: `${spacing[3]} ${spacing[4]}`,
    backgroundColor: colors.primary[500],
    color: colors.text.inverse,
    border: 'none',
    borderRadius: borderRadius.base,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    marginTop: spacing[4],
  },
  header: {
    backgroundColor: colors.background.primary,
    borderBottom: `1px solid ${colors.border.primary}`,
    padding: `${spacing[4]} 0`,
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `0 ${spacing[4]}`,
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  breadcrumbLink: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
    backgroundColor: 'transparent',
    border: 'none',
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    cursor: 'pointer',
    textDecoration: 'none',
    '&:hover': {
      color: colors.text.primary,
    },
  },
  breadcrumbSeparator: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
  },
  breadcrumbCurrent: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  taskInfo: {
    flex: 1,
  },
  taskKeyBadge: {
    display: 'inline-block',
    padding: `${spacing[1]} ${spacing[2]}`,
    backgroundColor: colors.primary[50],
    color: colors.primary[500],
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    borderRadius: borderRadius.base,
    marginBottom: spacing[2],
  },
  taskTitle: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    margin: 0,
  },
  editTitleInput: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.base,
    padding: spacing[2],
    width: '100%',
    '&:focus': {
      borderColor: colors.border.focus,
      outline: 'none',
    },
  },
  taskActions: {
    display: 'flex',
    gap: spacing[2],
  },
  editButton: {
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
  cancelButton: {
    padding: `${spacing[2]} ${spacing[4]}`,
    backgroundColor: 'transparent',
    color: colors.text.secondary,
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.base,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.background.secondary,
      color: colors.text.primary,
    },
  },
  saveButton: {
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
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `${spacing[6]} ${spacing[4]}`,
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: spacing[6],
  },
  mainContent: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    border: `1px solid ${colors.border.primary}`,
    overflow: 'hidden',
  },
  tabs: {
    display: 'flex',
    borderBottom: `1px solid ${colors.border.primary}`,
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    padding: `${spacing[3]} ${spacing[4]}`,
    backgroundColor: 'transparent',
    border: 'none',
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    borderBottom: `2px solid transparent`,
    '&:hover': {
      color: colors.text.primary,
      backgroundColor: colors.background.secondary,
    },
  },
  activeTab: {
    color: colors.primary[500],
    borderBottomColor: colors.primary[500],
    backgroundColor: colors.primary[25],
  },
  tabIcon: {
    fontSize: typography.fontSize.base,
  },
  tabContent: {
    padding: spacing[5],
  },
  overviewContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[5],
  },
  descriptionSection: {},
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    margin: `0 0 ${spacing[3]} 0`,
  },
  description: {
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.relaxed,
    color: colors.text.secondary,
    margin: 0,
    whiteSpace: 'pre-wrap',
  },
  editDescriptionTextarea: {
    width: '100%',
    padding: spacing[3],
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.normal,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.base,
    resize: 'vertical',
    fontFamily: 'inherit',
    '&:focus': {
      borderColor: colors.border.focus,
      outline: 'none',
    },
  },
  progressSection: {},
  progressBar: {
    height: '8px',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing[2],
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
    transition: 'width 0.3s ease-in-out',
  },
  progressText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  timeSpentSection: {},
  timeMetrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: spacing[4],
  },
  timeMetric: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[1],
  },
  timeLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  timeValue: {
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[4],
  },
  sidebarCard: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    boxShadow: shadows.sm,
    border: `1px solid ${colors.border.primary}`,
  },
  sidebarTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    margin: `0 0 ${spacing[3]} 0`,
  },
  statusSelect: {
    width: '100%',
    padding: `${spacing[2]} ${spacing[3]}`,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.base,
    outline: 'none',
    cursor: 'pointer',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    padding: `${spacing[2]} ${spacing[3]}`,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.base,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  statusDot: {
    width: '12px',
    height: '12px',
    borderRadius: borderRadius.full,
  },
  priorityBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    padding: `${spacing[2]} ${spacing[3]}`,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.base,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  priorityDot: {
    width: '12px',
    height: '12px',
    borderRadius: borderRadius.full,
  },
  select: {
    width: '100%',
    padding: `${spacing[2]} ${spacing[3]}`,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.base,
    outline: 'none',
    cursor: 'pointer',
  },
  assigneeInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
  },
  assigneeAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[500],
    color: colors.text.inverse,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  assigneeDetails: {
    flex: 1,
  },
  assigneeName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  assigneeEmail: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  unassigned: {
    padding: `${spacing[2]} ${spacing[3]}`,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.base,
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  dateItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${spacing[2]} 0`,
    borderBottom: `1px solid ${colors.border.primary}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  dateLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  dateValue: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
  },
}

export default TaskDetails
