import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDeveloperDashboard } from '../../store/slices/dashboardSlice'
import { colors, typography, spacing, shadows, borderRadius } from '../../styles/theme'

const DeveloperDashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { developerDashboard: dashboardData, loading } = useSelector((state) => state.dashboard)

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchDeveloperDashboard(user.id))
    }
  }, [user, dispatch])

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

  const getUserRoleDisplay = () => {
    if (user?.role === 'QA') return 'QA Engineer'
    if (user?.role === 'DEVELOPER') return 'Developer'
    return 'Team Member'
  }

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
          <p style={styles.loadingText}>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.welcomeSection}>
            <h1 style={styles.title}>{getUserRoleDisplay()} Dashboard</h1>
            <p style={styles.subtitle}>Welcome back, {user?.name || 'Developer'}</p>
          </div>
          <div style={styles.headerActions}>
            <div style={styles.timeCard}>
              <span style={styles.timeLabel}>Hours This Week</span>
              <span style={styles.timeValue}>{dashboardData?.hoursThisWeek || 0}h</span>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.content}>
        {/* Overview Cards */}
        <div style={styles.overviewGrid}>
          <div style={styles.overviewCard}>
            <div style={styles.cardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={styles.cardContent}>
              <h3 style={styles.cardNumber}>{dashboardData?.assignedTasks?.length || 0}</h3>
              <p style={styles.cardLabel}>Assigned Tasks</p>
            </div>
          </div>

          <div style={styles.overviewCard}>
            <div style={styles.cardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div style={styles.cardContent}>
              <h3 style={styles.cardNumber}>{Math.round(dashboardData?.totalHoursLogged || 0)}h</h3>
              <p style={styles.cardLabel}>Total Hours Logged</p>
            </div>
          </div>

          <div style={styles.overviewCard}>
            <div style={styles.cardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="13,2 13,9 20,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={styles.cardContent}>
              <h3 style={styles.cardNumber}>{dashboardData?.recentFiles?.length || 0}</h3>
              <p style={styles.cardLabel}>Recent Files</p>
            </div>
          </div>

          <div style={styles.overviewCard}>
            <div style={styles.cardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={styles.cardContent}>
              <h3 style={styles.cardNumber}>{dashboardData?.upcomingDeadlines?.length || 0}</h3>
              <p style={styles.cardLabel}>Upcoming Deadlines</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={styles.mainGrid}>
          {/* Assigned Tasks */}
          <div style={styles.mainCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>My Tasks</h3>
              <span style={styles.taskCount}>
                {dashboardData?.assignedTasks?.length || 0} tasks
              </span>
            </div>
            <div style={styles.tasksList}>
              {dashboardData?.assignedTasks?.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h4 style={styles.emptyTitle}>No tasks assigned</h4>
                  <p style={styles.emptyDescription}>You don't have any tasks assigned at the moment.</p>
                </div>
              ) : (
                dashboardData?.assignedTasks?.map((task) => (
                  <div key={task.id} style={styles.taskItem}>
                    <div style={styles.taskHeader}>
                      <div style={styles.taskInfo}>
                        <span style={styles.taskKey}>{task.taskKey}</span>
                        <div style={styles.taskStatus}>
                          <div 
                            style={{
                              ...styles.statusDot,
                              backgroundColor: getStatusColor(task.status)
                            }}
                          />
                          <span style={styles.statusText}>
                            {task.status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                      </div>
                      <div style={styles.taskPriority}>
                        <div 
                          style={{
                            ...styles.priorityDot,
                            backgroundColor: getPriorityColor(task.priority)
                          }}
                        />
                        <span style={styles.priorityText}>
                          {task.priority.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                    </div>
                    <h4 style={styles.taskTitle}>{task.title}</h4>
                    <div style={styles.taskMeta}>
                      <span style={styles.taskProgress}>{task.progress || 0}% Complete</span>
                      {task.estimatedHours && (
                        <span style={styles.taskEstimate}>
                          {task.actualHours || 0}h / {task.estimatedHours}h
                        </span>
                      )}
                      {task.dueDate && (
                        <span style={{
                          ...styles.taskDueDate,
                          color: new Date(task.dueDate) < new Date() ? colors.danger[500] : colors.text.secondary
                        }}>
                          Due {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div style={styles.taskActions}>
                      <button
                        onClick={() => navigate(`/projects/${task.projectId}/tasks/${task.id}`)}
                        style={styles.taskActionBtn}
                        title="View task details"
                      >
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/tasks/${task.id}/time`)}
                        style={styles.taskActionBtn}
                        title="Log time"
                      >
                        Log Time
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div style={styles.sideCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Upcoming Deadlines</h3>
            </div>
            <div style={styles.deadlinesList}>
              {dashboardData?.upcomingDeadlines?.length === 0 ? (
                <div style={styles.emptyState}>
                  <p style={styles.emptyText}>No upcoming deadlines</p>
                </div>
              ) : (
                dashboardData?.upcomingDeadlines?.map((task) => (
                  <div key={task.id} style={styles.deadlineItem}>
                    <div style={styles.deadlineInfo}>
                      <span style={styles.deadlineKey}>{task.taskKey}</span>
                      <p style={styles.deadlineTitle}>{task.title}</p>
                      <span style={{
                        ...styles.deadlineDate,
                        color: new Date(task.dueDate) < new Date() ? colors.danger[500] : colors.warning[500]
                      }}>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Files */}
        {dashboardData?.recentFiles?.length > 0 && (
          <div style={styles.sectionCard}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Recent Files</h3>
              <span style={styles.fileCount}>{dashboardData.recentFiles.length} files</span>
            </div>
            <div style={styles.filesList}>
              {dashboardData.recentFiles.map((file) => (
                <div key={file.id} style={styles.fileItem}>
                  <div style={styles.fileIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="13,2 13,9 20,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div style={styles.fileInfo}>
                    <h4 style={styles.fileName}>{file.originalFilename}</h4>
                    <div style={styles.fileMeta}>
                      <span style={styles.fileSize}>
                        {(file.fileSize / 1024).toFixed(1)} KB
                      </span>
                      <span style={styles.fileDate}>
                        {new Date(file.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => window.open(file.downloadUrl, '_blank')}
                    style={styles.fileDownloadBtn}
                    title="Download file"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Time Tracking Summary */}
        <div style={styles.timeTrackingCard}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Time Tracking Summary</h3>
          </div>
          <div style={styles.timeStatsGrid}>
            <div style={styles.timeStat}>
              <div style={styles.timeStatIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={styles.timeStatContent}>
                <span style={styles.timeStatNumber}>{dashboardData?.hoursThisWeek || 0}h</span>
                <span style={styles.timeStatLabel}>This Week</span>
              </div>
            </div>
            
            <div style={styles.timeStat}>
              <div style={styles.timeStatIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={styles.timeStatContent}>
                <span style={styles.timeStatNumber}>{Math.round(dashboardData?.totalHoursLogged || 0)}h</span>
                <span style={styles.timeStatLabel}>Total Logged</span>
              </div>
            </div>
            
            <div style={styles.timeStat}>
              <div style={styles.timeStatIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={styles.timeStatContent}>
                <span style={styles.timeStatNumber}>
                  {Math.round((dashboardData?.hoursThisWeek || 0) / 5 * 10) / 10}h
                </span>
                <span style={styles.timeStatLabel}>Daily Average</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.quickActions}>
          <h3 style={styles.sectionTitle}>Quick Actions</h3>
          <div style={styles.actionsGrid}>
            <button onClick={() => navigate('/tasks/my')} style={styles.quickActionBtn}>
              <div style={styles.quickActionIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={styles.quickActionContent}>
                <div style={styles.quickActionTitle}>View All Tasks</div>
                <div style={styles.quickActionDescription}>See all your assigned tasks</div>
              </div>
            </button>

            <button onClick={() => navigate('/time-tracking')} style={styles.quickActionBtn}>
              <div style={styles.quickActionIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={styles.quickActionContent}>
                <div style={styles.quickActionTitle}>Time Tracking</div>
                <div style={styles.quickActionDescription}>Log time and view reports</div>
              </div>
            </button>

            <button onClick={() => navigate('/projects')} style={styles.quickActionBtn}>
              <div style={styles.quickActionIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="13,2 13,9 20,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={styles.quickActionContent}>
                <div style={styles.quickActionTitle}>View Projects</div>
                <div style={styles.quickActionDescription}>Browse project documentation</div>
              </div>
            </button>

            <button onClick={() => navigate('/files')} style={styles.quickActionBtn}>
              <div style={styles.quickActionIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="13,2 13,9 20,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={styles.quickActionContent}>
                <div style={styles.quickActionTitle}>Manage Files</div>
                <div style={styles.quickActionDescription}>Upload and download project files</div>
              </div>
            </button>
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
  header: {
    backgroundColor: colors.background.primary,
    borderBottom: `1px solid ${colors.border.primary}`,
    padding: `${spacing[6]} 0`,
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `0 ${spacing[4]}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeSection: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    margin: `0 0 ${spacing[2]} 0`,
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.text.secondary,
    margin: 0,
  },
  headerActions: {
    display: 'flex',
    gap: spacing[3],
  },
  timeCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: spacing[4],
    backgroundColor: colors.primary[50],
    border: `1px solid ${colors.primary[200]}`,
    borderRadius: borderRadius.lg,
  },
  timeLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.primary[600],
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing[1],
  },
  timeValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[500],
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `${spacing[6]} ${spacing[4]}`,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[6],
  },
  overviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: spacing[4],
  },
  overviewCard: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[4],
    padding: spacing[5],
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    border: `1px solid ${colors.border.primary}`,
    boxShadow: shadows.sm,
  },
  cardIcon: {
    width: '48px',
    height: '48px',
    borderRadius: borderRadius.base,
    backgroundColor: colors.primary[50],
    color: colors.primary[500],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardContent: {
    flex: 1,
  },
  cardNumber: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    margin: `0 0 ${spacing[1]} 0`,
  },
  cardLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    margin: 0,
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: spacing[4],
  },
  mainCard: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    border: `1px solid ${colors.border.primary}`,
    boxShadow: shadows.sm,
    overflow: 'hidden',
  },
  sideCard: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    border: `1px solid ${colors.border.primary}`,
    boxShadow: shadows.sm,
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[4],
    borderBottom: `1px solid ${colors.border.primary}`,
    backgroundColor: colors.background.secondary,
  },
  cardTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    margin: 0,
  },
  taskCount: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  tasksList: {
    padding: spacing[4],
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[4],
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[8],
    textAlign: 'center',
  },
  emptyIcon: {
    marginBottom: spacing[4],
    color: colors.text.tertiary,
  },
  emptyTitle: {
    margin: `0 0 ${spacing[2]} 0`,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.secondary,
  },
  emptyDescription: {
    margin: 0,
    fontSize: typography.fontSize.base,
    color: colors.text.tertiary,
    lineHeight: typography.lineHeight.relaxed,
  },
  emptyText: {
    margin: 0,
    fontSize: typography.fontSize.base,
    color: colors.text.tertiary,
    textAlign: 'center',
    padding: spacing[4],
  },
  taskItem: {
    padding: spacing[4],
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.base,
    border: `1px solid ${colors.border.primary}`,
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  taskInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
  },
  taskKey: {
    padding: `${spacing[1]} ${spacing[2]}`,
    backgroundColor: colors.primary[50],
    color: colors.primary[500],
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    borderRadius: borderRadius.base,
    textTransform: 'uppercase',
  },
  taskStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: borderRadius.full,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    textTransform: 'uppercase',
  },
  taskPriority: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
  },
  priorityDot: {
    width: '8px',
    height: '8px',
    borderRadius: borderRadius.full,
  },
  priorityText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    textTransform: 'uppercase',
  },
  taskTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    margin: `0 0 ${spacing[2]} 0`,
  },
  taskMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing[3],
  },
  taskProgress: {},
  taskEstimate: {},
  taskDueDate: {},
  taskActions: {
    display: 'flex',
    gap: spacing[2],
  },
  taskActionBtn: {
    padding: `${spacing[2]} ${spacing[3]}`,
    backgroundColor: colors.primary[500],
    color: colors.text.inverse,
    border: 'none',
    borderRadius: borderRadius.base,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.primary[600],
    },
  },
  deadlinesList: {
    padding: spacing[4],
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[3],
  },
  deadlineItem: {
    padding: spacing[3],
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.base,
    border: `1px solid ${colors.border.primary}`,
  },
  deadlineInfo: {},
  deadlineKey: {
    padding: `${spacing[1]} ${spacing[2]}`,
    backgroundColor: colors.warning[50],
    color: colors.warning[600],
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    borderRadius: borderRadius.base,
    textTransform: 'uppercase',
    marginBottom: spacing[2],
    display: 'inline-block',
  },
  deadlineTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    margin: `0 0 ${spacing[1]} 0`,
  },
  deadlineDate: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  sectionCard: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    border: `1px solid ${colors.border.primary}`,
    boxShadow: shadows.sm,
    overflow: 'hidden',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[4],
    borderBottom: `1px solid ${colors.border.primary}`,
    backgroundColor: colors.background.secondary,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    margin: 0,
  },
  fileCount: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  filesList: {
    padding: spacing[4],
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[3],
  },
  fileItem: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[3],
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.base,
    border: `1px solid ${colors.border.primary}`,
  },
  fileIcon: {
    color: colors.primary[500],
    flexShrink: 0,
  },
  fileInfo: {
    flex: 1,
    minWidth: 0,
  },
  fileName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    margin: `0 0 ${spacing[1]} 0`,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  fileMeta: {
    display: 'flex',
    gap: spacing[3],
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  fileSize: {},
  fileDate: {},
  fileDownloadBtn: {
    padding: spacing[2],
    backgroundColor: 'transparent',
    border: 'none',
    color: colors.text.secondary,
    cursor: 'pointer',
    borderRadius: borderRadius.base,
    flexShrink: 0,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.primary[50],
      color: colors.primary[500],
    },
  },
  timeTrackingCard: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    border: `1px solid ${colors.border.primary}`,
    boxShadow: shadows.sm,
    overflow: 'hidden',
  },
  timeStatsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: spacing[4],
    padding: spacing[4],
  },
  timeStat: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[3],
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.base,
    border: `1px solid ${colors.border.primary}`,
  },
  timeStatIcon: {
    width: '40px',
    height: '40px',
    borderRadius: borderRadius.base,
    backgroundColor: colors.primary[50],
    color: colors.primary[500],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  timeStatContent: {
    flex: 1,
  },
  timeStatNumber: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    display: 'block',
    marginBottom: spacing[1],
  },
  timeStatLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  quickActions: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    border: `1px solid ${colors.border.primary}`,
    boxShadow: shadows.sm,
    padding: spacing[5],
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: spacing[4],
    marginTop: spacing[4],
  },
  quickActionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[4],
    backgroundColor: colors.background.secondary,
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.base,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    textAlign: 'left',
    '&:hover': {
      backgroundColor: colors.primary[25],
      borderColor: colors.primary[200],
    },
  },
  quickActionIcon: {
    width: '48px',
    height: '48px',
    borderRadius: borderRadius.base,
    backgroundColor: colors.primary[50],
    color: colors.primary[500],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  quickActionDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.relaxed,
  },
}

export default DeveloperDashboard
