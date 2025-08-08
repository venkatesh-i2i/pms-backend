import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminDashboard } from '../../store/slices/dashboardSlice'
import { colors, typography, spacing, shadows, borderRadius } from '../../styles/theme'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { adminDashboard: dashboardData, loading } = useSelector((state) => state.dashboard)

  useEffect(() => {
    dispatch(fetchAdminDashboard())
  }, [dispatch])

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return colors.danger[500]
      case 'PROJECT_MANAGER': return colors.primary[500]
      case 'DEVELOPER': return colors.success[500]
      case 'QA': return colors.warning[500]
      default: return colors.text.secondary
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
          <p style={styles.loadingText}>Loading admin dashboard...</p>
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
            <h1 style={styles.title}>Admin Dashboard</h1>
            <p style={styles.subtitle}>System overview and user management</p>
          </div>
          <div style={styles.headerActions}>
            <button onClick={() => navigate('/users/create')} style={styles.actionBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M20 8v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23 11h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Add User
            </button>
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M20 8v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23 11h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={styles.cardContent}>
              <h3 style={styles.cardNumber}>{dashboardData?.totalUsers || 0}</h3>
              <p style={styles.cardLabel}>Total Users</p>
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
              <h3 style={styles.cardNumber}>{dashboardData?.totalProjects || 0}</h3>
              <p style={styles.cardLabel}>Total Projects</p>
            </div>
          </div>

          <div style={styles.overviewCard}>
            <div style={styles.cardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="13,2 13,9 20,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={styles.cardContent}>
              <h3 style={styles.cardNumber}>{dashboardData?.activeProjects || 0}</h3>
              <p style={styles.cardLabel}>Active Projects</p>
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
        </div>

        {/* Charts Section */}
        <div style={styles.chartsGrid}>
          {/* Users by Role */}
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <h3 style={styles.chartTitle}>Users by Role</h3>
            </div>
            <div style={styles.chartContent}>
              {Object.entries(dashboardData?.usersByRole || {}).map(([role, count]) => (
                <div key={role} style={styles.roleItem}>
                  <div style={styles.roleInfo}>
                    <div 
                      style={{
                        ...styles.roleDot,
                        backgroundColor: getRoleColor(role)
                      }}
                    />
                    <span style={styles.roleName}>
                      {role.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  <div style={styles.roleCount}>{count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks by Status */}
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <h3 style={styles.chartTitle}>Tasks by Status</h3>
            </div>
            <div style={styles.chartContent}>
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

          {/* Tasks by Priority */}
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <h3 style={styles.chartTitle}>Tasks by Priority</h3>
            </div>
            <div style={styles.chartContent}>
              {Object.entries(dashboardData?.tasksByPriority || {}).map(([priority, count]) => (
                <div key={priority} style={styles.priorityItem}>
                  <div style={styles.priorityInfo}>
                    <div 
                      style={{
                        ...styles.priorityDot,
                        backgroundColor: getPriorityColor(priority)
                      }}
                    />
                    <span style={styles.priorityName}>
                      {priority.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  <div style={styles.priorityCount}>{count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Recent Users</h3>
            <button onClick={() => navigate('/users')} style={styles.viewAllBtn}>
              View All Users
            </button>
          </div>
          <div style={styles.usersList}>
            {dashboardData?.recentUsers?.map((user) => (
              <div key={user.id} style={styles.userItem}>
                <div style={styles.userAvatar}>
                  {user.avatar || user.name.charAt(0)}
                </div>
                <div style={styles.userInfo}>
                  <div style={styles.userName}>{user.name}</div>
                  <div style={styles.userEmail}>{user.email}</div>
                </div>
                <div style={styles.userRole}>
                  <span 
                    style={{
                      ...styles.roleBadge,
                      backgroundColor: `${getRoleColor(user.role)}20`,
                      color: getRoleColor(user.role)
                    }}
                  >
                    {user.role.replace('_', ' ')}
                  </span>
                </div>
                <div style={styles.userStatus}>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: user.isActive ? colors.success[50] : colors.danger[50],
                    color: user.isActive ? colors.success[500] : colors.danger[500]
                  }}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div style={styles.userActions}>
                  <button 
                    onClick={() => navigate(`/users/${user.id}/edit`)}
                    style={styles.editUserBtn}
                    title="Edit user"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.quickActions}>
          <h3 style={styles.sectionTitle}>Quick Actions</h3>
          <div style={styles.actionsGrid}>
            <button onClick={() => navigate('/users')} style={styles.quickActionBtn}>
              <div style={styles.quickActionIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M20 8v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 11h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={styles.quickActionContent}>
                <div style={styles.quickActionTitle}>Manage Users</div>
                <div style={styles.quickActionDescription}>View, create, and edit user accounts</div>
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
                <div style={styles.quickActionTitle}>Manage Projects</div>
                <div style={styles.quickActionDescription}>Oversee all projects and their progress</div>
              </div>
            </button>

            <button onClick={() => navigate('/settings')} style={styles.quickActionBtn}>
              <div style={styles.quickActionIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div style={styles.quickActionContent}>
                <div style={styles.quickActionTitle}>System Settings</div>
                <div style={styles.quickActionDescription}>Configure system preferences and security</div>
              </div>
            </button>

            <button onClick={() => navigate('/reports')} style={styles.quickActionBtn}>
              <div style={styles.quickActionIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={styles.quickActionContent}>
                <div style={styles.quickActionTitle}>View Reports</div>
                <div style={styles.quickActionDescription}>Generate system and usage reports</div>
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
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: spacing[4],
  },
  chartCard: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    border: `1px solid ${colors.border.primary}`,
    boxShadow: shadows.sm,
    overflow: 'hidden',
  },
  chartHeader: {
    padding: spacing[4],
    borderBottom: `1px solid ${colors.border.primary}`,
    backgroundColor: colors.background.secondary,
  },
  chartTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    margin: 0,
  },
  chartContent: {
    padding: spacing[4],
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[3],
  },
  roleItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${spacing[2]} 0`,
  },
  roleInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
  },
  roleDot: {
    width: '12px',
    height: '12px',
    borderRadius: borderRadius.full,
  },
  roleName: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
  roleCount: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
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
  priorityItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${spacing[2]} 0`,
  },
  priorityInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
  },
  priorityDot: {
    width: '12px',
    height: '12px',
    borderRadius: borderRadius.full,
  },
  priorityName: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
  priorityCount: {
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
  usersList: {
    padding: spacing[4],
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[3],
  },
  userItem: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[3],
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.base,
    border: `1px solid ${colors.border.primary}`,
  },
  userAvatar: {
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
    flexShrink: 0,
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  userEmail: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  userRole: {
    flexShrink: 0,
  },
  roleBadge: {
    padding: `${spacing[1]} ${spacing[2]}`,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    borderRadius: borderRadius.base,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  userStatus: {
    flexShrink: 0,
  },
  statusBadge: {
    padding: `${spacing[1]} ${spacing[2]}`,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    borderRadius: borderRadius.base,
  },
  userActions: {
    flexShrink: 0,
  },
  editUserBtn: {
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

export default AdminDashboard
