import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProjectManagerDashboard } from '../../store/slices/dashboardSlice'
import { colors, typography, spacing, shadows, borderRadius } from '../../styles/theme'

const ProjectManagerDashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { projectManagerDashboard: dashboardData, loading } = useSelector((state) => state.dashboard)

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchProjectManagerDashboard(user.id))
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
            <h1 style={styles.title}>Project Manager Dashboard</h1>
            <p style={styles.subtitle}>Welcome back, {user?.name || 'Project Manager'}</p>
          </div>
          <div style={styles.headerActions}>
            <button onClick={() => navigate('/projects/create')} style={styles.actionBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Create Project
            </button>
          </div>
        </div>
      </div>

      <div style={styles.content}>
        {/* Overview Cards */}
        <div style={styles.overviewGrid}>
          <div style={styles.overviewCard}>
            <div style={styles.cardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="13,2 13,9 20,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={styles.cardContent}>
              <h3 style={styles.cardNumber}>{dashboardData?.assignedProjects?.length || 0}</h3>
              <p style={styles.cardLabel}>Assigned Projects</p>
            </div>
          </div>

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
              <h3 style={styles.cardNumber}>{dashboardData?.totalTasks || 0}</h3>
              <p style={styles.cardLabel}>Total Tasks</p>
            </div>
          </div>

          <div style={styles.overviewCard}>
            <div style={styles.cardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c.32 0 .63.02.94.06" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={styles.cardContent}>
              <h3 style={styles.cardNumber}>{dashboardData?.highPriorityTasks?.length || 0}</h3>
              <p style={styles.cardLabel}>High Priority Tasks</p>
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
              <h3 style={styles.cardNumber}>{dashboardData?.overdueTasks || 0}</h3>
              <p style={styles.cardLabel}>Overdue Tasks</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={styles.mainGrid}>
          {/* Assigned Projects */}
          <div style={styles.mainCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Your Projects</h3>
              <button onClick={() => navigate('/projects')} style={styles.viewAllBtn}>
                View All
              </button>
            </div>
            <div style={styles.projectsList}>
              {dashboardData?.assignedProjects?.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="13,2 13,9 20,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h4 style={styles.emptyTitle}>No projects assigned</h4>
                  <p style={styles.emptyDescription}>You don't have any projects assigned yet.</p>
                </div>
              ) : (
                dashboardData?.assignedProjects?.map((project) => (
                  <div key={project.id} style={styles.projectItem}>
                    <div style={styles.projectHeader}>
                      <div style={styles.projectInfo}>
                        <h4 style={styles.projectName}>{project.name}</h4>
                        <span style={styles.projectKey}>{project.projectKey}</span>
                      </div>
                      <button
                        onClick={() => navigate(`/projects/${project.id}/board`)}
                        style={styles.projectViewBtn}
                        title="View project board"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </button>
                    </div>
                    <div style={styles.projectProgress}>
                      <div style={styles.progressBar}>
                        <div 
                          style={{
                            ...styles.progressFill,
                            width: `${project.progress || 0}%`,
                            backgroundColor: colors.primary[500]
                          }}
                        />
                      </div>
                      <span style={styles.progressText}>{project.progress || 0}% Complete</span>
                    </div>
                    <div style={styles.projectStats}>
                      <span style={styles.statItem}>
                        {project.completedIssueCount || 0}/{project.issueCount || 0} Tasks
                      </span>
                      <span style={styles.statItem}>
                        {project.members?.length || 0} Members
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Tasks by Status */}
          <div style={styles.sideCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Tasks by Status</h3>
            </div>
            <div style={styles.statusList}>
              {Object.entries(dashboardData?.tasksByStatus || {}).map(([status, count]) => (
                <div key={status} style={styles.statusItem}>
                  <div style={styles.statusInfo}>
                    <div 
                      style={{
                        ...styles.statusDot,
                        backgroundColor: getStatusColor(status)
                      }}
                    />
                    <span style={styles.statusName}>
                      {status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  <div style={styles.statusCount}>{count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* High Priority Tasks */}
        {dashboardData?.highPriorityTasks?.length > 0 && (
          <div style={styles.sectionCard}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>High Priority Tasks</h3>
              <span style={styles.taskCount}>{dashboardData.highPriorityTasks.length} tasks</span>
            </div>
            <div style={styles.tasksList}>
              {dashboardData.highPriorityTasks.slice(0, 5).map((task) => (
                <div key={task.id} style={styles.taskItem}>
                  <div style={styles.taskInfo}>
                    <div style={styles.taskHeader}>
                      <span style={styles.taskKey}>{task.taskKey}</span>
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
                      <span style={styles.taskStatus}>
                        {task.status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      {task.assignee && (
                        <span style={styles.taskAssignee}>
                          Assigned to {task.assignee.name}
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
                  </div>
                  <button
                    onClick={() => navigate(`/projects/${task.projectId}/tasks/${task.id}`)}
                    style={styles.taskViewBtn}
                    title="View task details"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div style={styles.quickActions}>
          <h3 style={styles.sectionTitle}>Quick Actions</h3>
          <div style={styles.actionsGrid}>
            <button onClick={() => navigate('/projects/create')} style={styles.quickActionBtn}>
              <div style={styles.quickActionIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={styles.quickActionContent}>
                <div style={styles.quickActionTitle}>Create Project</div>
                <div style={styles.quickActionDescription}>Start a new project with your team</div>
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
                <div style={styles.quickActionTitle}>View All Projects</div>
                <div style={styles.quickActionDescription}>See all projects you're managing</div>
              </div>
            </button>

            <button onClick={() => navigate('/reports/projects')} style={styles.quickActionBtn}>
              <div style={styles.quickActionIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={styles.quickActionContent}>
                <div style={styles.quickActionTitle}>Project Reports</div>
                <div style={styles.quickActionDescription}>Generate project progress reports</div>
              </div>
            </button>

            <button onClick={() => navigate('/teams')} style={styles.quickActionBtn}>
              <div style={styles.quickActionIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M20 8v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 11h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={styles.quickActionContent}>
                <div style={styles.quickActionTitle}>Manage Teams</div>
                <div style={styles.quickActionDescription}>Assign team members to projects</div>
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
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    padding: `${spacing[3]} ${spacing[4]}`,
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
  viewAllBtn: {
    padding: `${spacing[2]} ${spacing[3]}`,
    backgroundColor: 'transparent',
    color: colors.primary[500],
    border: `1px solid ${colors.primary[200]}`,
    borderRadius: borderRadius.base,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.primary[50],
    },
  },
  projectsList: {
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
  projectItem: {
    padding: spacing[4],
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.base,
    border: `1px solid ${colors.border.primary}`,
  },
  projectHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  projectInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
  },
  projectName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    margin: 0,
  },
  projectKey: {
    padding: `${spacing[1]} ${spacing[2]}`,
    backgroundColor: colors.primary[50],
    color: colors.primary[500],
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    borderRadius: borderRadius.base,
    textTransform: 'uppercase',
  },
  projectViewBtn: {
    padding: spacing[2],
    backgroundColor: 'transparent',
    border: 'none',
    color: colors.text.secondary,
    cursor: 'pointer',
    borderRadius: borderRadius.base,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.primary[50],
      color: colors.primary[500],
    },
  },
  projectProgress: {
    marginBottom: spacing[3],
  },
  progressBar: {
    height: '8px',
    backgroundColor: colors.background.primary,
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
  projectStats: {
    display: 'flex',
    gap: spacing[4],
  },
  statItem: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  statusList: {
    padding: spacing[4],
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[3],
  },
  statusItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${spacing[2]} 0`,
  },
  statusInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
  },
  statusDot: {
    width: '12px',
    height: '12px',
    borderRadius: borderRadius.full,
  },
  statusName: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
  statusCount: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
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
  taskCount: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  tasksList: {
    padding: spacing[4],
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[3],
  },
  taskItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[3],
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.base,
    border: `1px solid ${colors.border.primary}`,
  },
  taskInfo: {
    flex: 1,
    minWidth: 0,
  },
  taskHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[1],
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
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  taskMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  taskStatus: {},
  taskAssignee: {},
  taskDueDate: {},
  taskViewBtn: {
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

export default ProjectManagerDashboard
