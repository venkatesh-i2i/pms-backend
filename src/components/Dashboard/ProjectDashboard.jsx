import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchProjectManagerDashboard } from '../../store/slices/dashboardSlice'
import { fetchIssuesByAssignee, fetchIssuesByReporter } from '../../store/slices/issuesSlice'
import { fetchUsers } from '../../store/slices/usersSlice'
import QuickAssignmentModal from '../Issues/QuickAssignmentModal'
import { colors, typography, spacing, shadows, borderRadius } from '../../styles/theme'

const ProjectDashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { projectManagerDashboard, loading, error } = useSelector((state) => state.dashboard)
  const { issues, loading: issuesLoading } = useSelector((state) => state.issues)
  const { users } = useSelector((state) => state.users)
  const [activeTab, setActiveTab] = useState('overview')
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)
  const [issueToAssign, setIssueToAssign] = useState(null)

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchProjectManagerDashboard(user.id))
      dispatch(fetchIssuesByAssignee(user.id))
      dispatch(fetchUsers())
    }
  }, [dispatch, user?.id])

  // Helper function to get user display name
  const getUserDisplayName = () => {
    if (!user) return 'Project Manager'
    return user.name || user.email?.split('@')[0] || 'Project Manager'
  }

  const handleCreateProject = () => {
    navigate('/projects/create')
  }

  const handleCreateIssue = () => {
    // If user has recent projects, navigate to the first one's issue creation
    const recentProjects = dashboard?.recentProjects
    if (recentProjects && recentProjects.length > 0) {
      navigate(`/projects/${recentProjects[0].id}/issues/create`)
    } else {
      // Show modal to select project or navigate to projects page
      navigate('/projects')
    }
  }

  const handleAssignClick = (e, issue) => {
    e.stopPropagation() // Prevent any parent click handlers
    setIssueToAssign(issue)
    setShowAssignmentModal(true)
  }

  const handleAssignmentModalClose = () => {
    setShowAssignmentModal(false)
    setIssueToAssign(null)
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
          <p style={styles.loadingText}>Loading your dashboard...</p>
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
          <h3 style={styles.errorTitle}>Something went wrong</h3>
          <p style={styles.errorMessage}>{error}</p>
        </div>
      </div>
    )
  }

  const dashboard = projectManagerDashboard

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.welcomeSection}>
            <h1 style={styles.title}>Welcome back, {getUserDisplayName()}!</h1>
            <p style={styles.subtitle}>Here's your project overview and key metrics</p>
          </div>
          <div style={styles.headerActions}>
            <button onClick={handleCreateIssue} style={styles.actionBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Create Issue
            </button>
            {(user?.role === 'PROJECT_MANAGER' || user?.role === 'MANAGER' || user?.roles?.some(r => (typeof r === 'string' ? r : r?.name) === 'PROJECT_MANAGER' || (typeof r === 'string' ? r : r?.name) === 'MANAGER')) && (
            <button onClick={handleCreateProject} style={styles.actionBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Create Project
            </button>
            )}
          </div>
        </div>
      </div>

      <div style={styles.content}>
        {/* Navigation Tabs */}
        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              ...styles.tab,
              ...(activeTab === 'overview' && styles.activeTab)
            }}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            style={{
              ...styles.tab,
              ...(activeTab === 'projects' && styles.activeTab)
            }}
          >
            My Projects
          </button>
          <button
            onClick={() => setActiveTab('issues')}
            style={{
              ...styles.tab,
              ...(activeTab === 'issues' && styles.activeTab)
            }}
          >
            My Issues
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            style={{
              ...styles.tab,
              ...(activeTab === 'reports' && styles.activeTab)
            }}
          >
            Reports
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && dashboard && (
          <div style={styles.overview}>
            {/* Key Metrics */}
            <div style={styles.metricsGrid}>
              <div style={styles.metricCard}>
                <div style={styles.metricIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={styles.metricContent}>
                  <h3 style={styles.metricNumber}>{dashboard.totalProjects || 0}</h3>
                  <p style={styles.metricLabel}>Total Projects</p>
                </div>
              </div>

              <div style={styles.metricCard}>
                <div style={styles.metricIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div style={styles.metricContent}>
                  <h3 style={styles.metricNumber}>{dashboard.totalIssues || 0}</h3>
                  <p style={styles.metricLabel}>Total Issues</p>
                </div>
              </div>

              <div style={styles.metricCard}>
                <div style={styles.metricIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={styles.metricContent}>
                  <h3 style={styles.metricNumber}>{dashboard.activeTeamMembers || 0}</h3>
                  <p style={styles.metricLabel}>Team Members</p>
                </div>
              </div>

              <div style={styles.metricCard}>
                <div style={styles.metricIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div style={styles.metricContent}>
                  <h3 style={styles.metricNumber}>{dashboard.averageIssueResolutionTime || 0}h</h3>
                  <p style={styles.metricLabel}>Avg Resolution Time</p>
                </div>
              </div>
            </div>

            {/* Issue Status Breakdown */}
            <div style={styles.chartsGrid}>
              <div style={styles.chartCard}>
                <h3 style={styles.chartTitle}>Issues by Status</h3>
                <div style={styles.chartContent}>
                  {dashboard.issuesByStatus && Object.entries(dashboard.issuesByStatus).map(([status, count]) => (
                    <div key={status} style={styles.statusItem}>
                      <div style={styles.statusInfo}>
                        <span style={styles.statusName}>{status}</span>
                        <span style={styles.statusCount}>{count}</span>
                      </div>
                      <div style={styles.statusBar}>
                        <div 
                          style={{
                            ...styles.statusProgress,
                            width: `${(count / Object.values(dashboard.issuesByStatus).reduce((a, b) => a + b, 0)) * 100}%`,
                            backgroundColor: getStatusColor(status)
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.chartCard}>
                <h3 style={styles.chartTitle}>Issues by Priority</h3>
                <div style={styles.chartContent}>
                  {dashboard.issuesByPriority && Object.entries(dashboard.issuesByPriority).map(([priority, count]) => (
                    <div key={priority} style={styles.priorityItem}>
                      <div style={styles.priorityInfo}>
                        <span style={styles.priorityName}>{priority}</span>
                        <span style={styles.priorityCount}>{count}</span>
                      </div>
                      <div style={styles.priorityBar}>
                        <div 
                          style={{
                            ...styles.priorityProgress,
                            width: `${(count / Object.values(dashboard.issuesByPriority).reduce((a, b) => a + b, 0)) * 100}%`,
                            backgroundColor: getPriorityColor(priority)
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div style={styles.recentActivity}>
              <h3 style={styles.sectionTitle}>Recent Projects</h3>
              <div style={styles.projectsGrid}>
                {dashboard.recentProjects && dashboard.recentProjects.slice(0, 3).map((project) => (
                  <div key={project.id} style={styles.projectCard}>
                    <div style={styles.projectHeader}>
                      <div style={styles.projectKey}>{project.projectKey}</div>
                      <div style={styles.projectStatus(project.isActive)}>
                        {project.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                    <h4 style={styles.projectName}>{project.name}</h4>
                    <p style={styles.projectDescription}>{project.description}</p>
                    <div style={styles.projectStats}>
                      <div style={styles.projectStat}>
                        <span style={styles.statLabel}>Issues</span>
                        <span style={styles.statValue}>{project.issueCount}</span>
                      </div>
                      <div style={styles.projectStat}>
                        <span style={styles.statLabel}>Members</span>
                        <span style={styles.statValue}>{project.memberCount}</span>
                      </div>
                      <div style={styles.projectStat}>
                        <span style={styles.statLabel}>Progress</span>
                        <span style={styles.statValue}>{project.completionPercentage}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div style={styles.projectsTab}>
            <h2 style={styles.tabTitle}>My Projects</h2>
            <p style={styles.tabDescription}>Manage and monitor your projects</p>
            {/* Project list will be implemented here */}
          </div>
        )}

        {/* Issues Tab */}
        {activeTab === 'issues' && (
          <div style={styles.issuesTab}>
            <div style={styles.tabHeader}>
              <div>
                <h2 style={styles.tabTitle}>My Issues</h2>
                <p style={styles.tabDescription}>Track issues assigned to you</p>
              </div>
              <button onClick={handleCreateIssue} style={styles.actionBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Create Issue
              </button>
            </div>
            
            {issuesLoading ? (
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
                <p style={styles.loadingText}>Loading issues...</p>
              </div>
            ) : issues && issues.length > 0 ? (
              <div style={styles.issuesGrid}>
                {issues.slice(0, 10).map((issue) => (
                  <div key={issue.id} style={styles.issueCard}>
                    <div style={styles.issueHeader}>
                      <div style={styles.issueKey}>{issue.issueKey}</div>
                      <div style={styles.issuePriority(issue.priority)}>
                        {getPriorityIcon(issue.priority)}
                      </div>
                    </div>
                    <h4 style={styles.issueTitle}>{issue.summary}</h4>
                    <p style={styles.issueDescription}>{issue.description}</p>
                    <div style={styles.issueFooter}>
                      <div style={styles.issueLeftFooter}>
                        <div style={styles.issueStatus(issue.status)}>
                          {getStatusLabel(issue.status)}
                        </div>
                        <div style={styles.issueProject}>
                          {issue.project?.name}
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleAssignClick(e, issue)}
                        style={styles.assignIssueBtn}
                        title={issue.assignee ? `Assigned to ${issue.assignee.name}` : 'Click to assign'}
                      >
                        {issue.assignee ? (
                          <div style={styles.issueAssigneeAvatar}>
                            {issue.assignee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                        ) : (
                          <div style={styles.unassignedAvatar}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                              <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        )}
                      </button>
                    </div>
                    <div style={styles.issueTime}>
                      {issue.estimatedTime && (
                        <span style={styles.timeEstimate}>
                          Est: {Math.floor(issue.estimatedTime / 60)}h {issue.estimatedTime % 60}m
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <div style={styles.emptyStateIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 style={styles.emptyStateTitle}>No issues assigned</h3>
                <p style={styles.emptyStateMessage}>
                  You don't have any issues assigned to you yet. Create a new issue to get started.
                </p>
                <button onClick={handleCreateIssue} style={styles.actionBtn}>
                  Create Your First Issue
                </button>
              </div>
            )}
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div style={styles.reportsTab}>
            <h2 style={styles.tabTitle}>Reports & Analytics</h2>
            <p style={styles.tabDescription}>Generate reports and view analytics</p>
            {/* Reports will be implemented here */}
          </div>
        )}
      </div>

      {/* Quick Assignment Modal */}
      <QuickAssignmentModal 
        issue={issueToAssign}
        isOpen={showAssignmentModal}
        onClose={handleAssignmentModalClose}
      />
    </div>
  )
}

// Helper functions for colors
const getPriorityColor = (priority) => {
  const colors = {
    'CRITICAL': '#FF5630',
    'HIGHEST': '#FF5630',
    'HIGH': '#FF8B00',
    'MEDIUM': '#0052CC',
    'LOW': '#36B37E',
    'LOWEST': '#36B37E'
  }
  return colors[priority] || '#97A0AF'
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

const getStatusLabel = (status) => {
  const labels = {
    'TODO': 'To Do',
    'IN_PROGRESS': 'In Progress',
    'IN_REVIEW': 'In Review',
    'TESTING': 'Testing',
    'DONE': 'Done',
    'BLOCKED': 'Blocked',
    'CANCELLED': 'Cancelled'
  }
  return labels[status] || status
}

const getStatusColor = (status) => {
  const colors = {
    'TODO': '#97A0AF',
    'IN_PROGRESS': '#0052CC',
    'IN_REVIEW': '#FFAB00',
    'TESTING': '#8B5CF6',
    'DONE': '#36B37E',
    'BLOCKED': '#FF5630',
    'CANCELLED': '#6B7280'
  }
  return colors[status] || '#97A0AF'
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: colors.background.secondary,
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
  },
  tabs: {
    display: 'flex',
    gap: spacing[1],
    marginBottom: spacing[6],
    borderBottom: `1px solid ${colors.border.primary}`,
  },
  tab: {
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
    },
  },
  activeTab: {
    color: colors.primary[500],
    borderBottomColor: colors.primary[500],
    fontWeight: typography.fontWeight.semibold,
  },
  overview: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[6],
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: spacing[4],
  },
  metricCard: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing[5],
    boxShadow: shadows.sm,
    border: `1px solid ${colors.border.primary}`,
    display: 'flex',
    alignItems: 'center',
    gap: spacing[4],
  },
  metricIcon: {
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
  metricContent: {
    flex: 1,
  },
  metricNumber: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    margin: `0 0 ${spacing[1]} 0`,
  },
  metricLabel: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    margin: 0,
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: spacing[4],
  },
  chartCard: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing[5],
    boxShadow: shadows.sm,
    border: `1px solid ${colors.border.primary}`,
  },
  chartTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    margin: `0 0 ${spacing[4]} 0`,
  },
  chartContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[3],
  },
  statusItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[1],
  },
  statusInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusName: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
  },
  statusCount: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  statusBar: {
    height: '8px',
    backgroundColor: colors.border.primary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  statusProgress: {
    height: '100%',
    borderRadius: borderRadius.full,
    transition: 'width 0.3s ease-in-out',
  },
  priorityItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[1],
  },
  priorityInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityName: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
  },
  priorityCount: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  priorityBar: {
    height: '8px',
    backgroundColor: colors.border.primary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  priorityProgress: {
    height: '100%',
    borderRadius: borderRadius.full,
    transition: 'width 0.3s ease-in-out',
  },
  recentActivity: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing[5],
    boxShadow: shadows.sm,
    border: `1px solid ${colors.border.primary}`,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    margin: `0 0 ${spacing[4]} 0`,
  },
  projectsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: spacing[4],
  },
  projectCard: {
    padding: spacing[4],
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.base,
    backgroundColor: colors.background.secondary,
  },
  projectHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  projectKey: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary[500],
    backgroundColor: colors.primary[50],
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: borderRadius.base,
  },
  projectStatus: (isActive) => ({
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: borderRadius.full,
    backgroundColor: isActive ? colors.success[100] : colors.neutral[100],
    color: isActive ? colors.success[700] : colors.neutral[600],
  }),
  projectName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    margin: `0 0 ${spacing[1]} 0`,
  },
  projectDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    margin: `0 0 ${spacing[3]} 0`,
  },
  projectStats: {
    display: 'flex',
    gap: spacing[4],
  },
  projectStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    marginBottom: spacing[1],
  },
  statValue: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  tabTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    margin: `0 0 ${spacing[2]} 0`,
  },
  tabDescription: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    margin: 0,
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
  },
  tabHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  issuesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: spacing[4],
  },
  issueCard: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    boxShadow: shadows.sm,
    border: `1px solid ${colors.border.primary}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      boxShadow: shadows.md,
      transform: 'translateY(-2px)',
    },
  },
  issueHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  issueKey: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary[500],
    backgroundColor: colors.primary[50],
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: borderRadius.base,
  },
  issuePriority: (priority) => ({
    fontSize: typography.fontSize.base,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  issueTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    margin: `0 0 ${spacing[2]} 0`,
    lineHeight: typography.lineHeight.normal,
  },
  issueDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    margin: `0 0 ${spacing[3]} 0`,
    lineHeight: typography.lineHeight.relaxed,
    display: '-webkit-box',
    '-webkit-line-clamp': 3,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
  },
  issueFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  issueLeftFooter: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[1],
    flex: 1,
  },
  assignIssueBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: borderRadius.full,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.background.secondary,
    },
  },
  issueAssigneeAvatar: {
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
  unassignedAvatar: {
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
  issueStatus: (status) => ({
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: borderRadius.full,
    backgroundColor: `${getStatusColor(status)}20`,
    color: getStatusColor(status),
  }),
  issueProject: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  issueTime: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  timeEstimate: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    backgroundColor: colors.background.secondary,
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: borderRadius.base,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${spacing[12]} ${spacing[4]}`,
    textAlign: 'center',
  },
  emptyStateIcon: {
    color: colors.text.tertiary,
    marginBottom: spacing[4],
  },
  emptyStateTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    margin: `0 0 ${spacing[2]} 0`,
  },
  emptyStateMessage: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    margin: `0 0 ${spacing[4]} 0`,
    maxWidth: '400px',
  },
}

export default ProjectDashboard 