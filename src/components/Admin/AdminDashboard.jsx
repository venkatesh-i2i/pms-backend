import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchUsers, fetchRoles } from '../../store/slices/usersSlice'
import { colors, typography, spacing, shadows, borderRadius } from '../../styles/theme'

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { users, roles, loading, error } = useSelector((state) => state.users)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchUsers())
    dispatch(fetchRoles())
  }, [dispatch])

  const handleCreateUser = () => {
    navigate('/users')
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
          <p style={styles.loadingText}>Loading dashboard...</p>
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

  // Normalize role names from users slice and users list
  const extractUserRoleNames = (u) => {
    if (!u) return []
    if (Array.isArray(u.roles)) {
      return u.roles.map((r) => (typeof r === 'string' ? r : r?.name)).filter(Boolean)
    }
    if (typeof u.role === 'string') {
      return [u.role]
    }
    return []
  }

  const normalizedRoleNames = (() => {
    const fromStore = Array.isArray(roles) && roles.length > 0
      ? roles.map((r) => r?.name || (typeof r === 'string' ? r : null)).filter(Boolean)
      : []
    if (fromStore.length > 0) return fromStore
    const fromUsers = Array.from(new Set(users.flatMap(extractUserRoleNames)))
    return fromUsers
  })()

  // Count users by role
  const usersByRole = normalizedRoleNames.reduce((acc, roleName) => {
    acc[roleName] = users.filter((u) => extractUserRoleNames(u).includes(roleName)).length
    return acc
  }, {})

  const activeUsers = users.filter(user => user.isActive).length
  const inactiveUsers = users.length - activeUsers

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.welcomeSection}>
            <h1 style={styles.title}>Welcome back, {user?.name || 'Admin'}!</h1>
            <p style={styles.subtitle}>Here's what's happening with your team</p>
          </div>
          <div style={styles.headerActions}>
            <button onClick={handleCreateUser} style={styles.actionBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Create User
            </button>
          </div>
        </div>
      </div>

      <div style={styles.content}>
        {/* Statistics Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={styles.statContent}>
              <h3 style={styles.statNumber}>{users.length}</h3>
              <p style={styles.statLabel}>Total Users</p>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={styles.statContent}>
              <h3 style={styles.statNumber}>{normalizedRoleNames.length}</h3>
              <p style={styles.statLabel}>Total Roles</p>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div style={styles.statContent}>
              <h3 style={styles.statNumber}>{activeUsers}</h3>
              <p style={styles.statLabel}>Active Users</p>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M10.29 3.86L1.82 18A2 2 0 0 0 3.66 21H20.34A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={styles.statContent}>
              <h3 style={styles.statNumber}>{inactiveUsers}</h3>
              <p style={styles.statLabel}>Inactive Users</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={styles.mainGrid}>
          {/* Users by Role */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Users by Role</h2>
              <button onClick={() => navigate('/users')} style={styles.sectionAction}>
                View all
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div style={styles.roleGrid}>
              {normalizedRoleNames.map((roleName) => (
                <div key={roleName} style={styles.roleCard}>
                  <div style={styles.roleHeader}>
                    <div style={styles.roleIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div style={styles.roleInfo}>
                      <h4 style={styles.roleName}>{roleName}</h4>
                      <p style={styles.roleDescription}></p>
                    </div>
                  </div>
                  <div style={styles.roleStats}>
                    <span style={styles.roleCount}>{usersByRole[roleName] || 0} users</span>
                    <div style={styles.roleProgress}>
                      <div 
                        style={{
                          ...styles.roleProgressBar,
                          width: `${((usersByRole[roleName] || 0) / Math.max(1, users.length)) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Users */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Recent Users</h2>
              <button onClick={() => navigate('/users')} style={styles.sectionAction}>
                View all
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            {users.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 style={styles.emptyTitle}>No users yet</h3>
                <p style={styles.emptyText}>Get started by creating your first user</p>
                <button onClick={handleCreateUser} style={styles.emptyActionBtn}>
                  Create User
                </button>
              </div>
            ) : (
              <div style={styles.userList}>
                {users.slice(0, 5).map((user) => (
                  <div key={user.id} style={styles.userItem}>
                    <div style={styles.userAvatar}>
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div style={styles.userInfo}>
                      <h4 style={styles.userName}>{user.name}</h4>
                      <p style={styles.userEmail}>{user.email}</p>
                    </div>
                    <div style={styles.userStatus}>
                      <span style={{
                        ...styles.statusBadge,
                        ...(user.isActive ? styles.statusActive : styles.statusInactive)
                      }}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: spacing[4],
    marginBottom: spacing[8],
  },
  statCard: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing[5],
    boxShadow: shadows.sm,
    border: `1px solid ${colors.border.primary}`,
    display: 'flex',
    alignItems: 'center',
    gap: spacing[4],
  },
  statIcon: {
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
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    margin: `0 0 ${spacing[1]} 0`,
  },
  statLabel: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    margin: 0,
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: spacing[6],
  },
  section: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing[5],
    boxShadow: shadows.sm,
    border: `1px solid ${colors.border.primary}`,
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    margin: 0,
  },
  sectionAction: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
    backgroundColor: 'transparent',
    border: 'none',
    color: colors.text.link,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    transition: 'color 0.2s ease-in-out',
    '&:hover': {
      color: colors.primary[600],
    },
  },
  roleGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[3],
  },
  roleCard: {
    padding: spacing[4],
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.base,
    backgroundColor: colors.background.secondary,
  },
  roleHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  roleIcon: {
    width: '32px',
    height: '32px',
    borderRadius: borderRadius.base,
    backgroundColor: colors.primary[100],
    color: colors.primary[600],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleInfo: {
    flex: 1,
  },
  roleName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    margin: `0 0 ${spacing[1]} 0`,
  },
  roleDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    margin: 0,
  },
  roleStats: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
  },
  roleCount: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  roleProgress: {
    flex: 1,
    height: '4px',
    backgroundColor: colors.border.primary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  roleProgressBar: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.full,
    transition: 'width 0.3s ease-in-out',
  },
  userList: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[3],
  },
  userItem: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[3],
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.base,
    backgroundColor: colors.background.secondary,
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: colors.primary[500],
    color: colors.text.inverse,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    margin: `0 0 ${spacing[1]} 0`,
  },
  userEmail: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    margin: 0,
  },
  userStatus: {
    flexShrink: 0,
  },
  statusBadge: {
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  statusActive: {
    backgroundColor: colors.success[100],
    color: colors.success[700],
  },
  statusInactive: {
    backgroundColor: colors.neutral[100],
    color: colors.neutral[600],
  },
  emptyState: {
    textAlign: 'center',
    padding: spacing[8],
  },
  emptyIcon: {
    color: colors.text.tertiary,
    marginBottom: spacing[4],
  },
  emptyTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    margin: `0 0 ${spacing[2]} 0`,
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    margin: 0,
  },
  emptyActionBtn: {
    marginTop: spacing[4],
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
}

export default AdminDashboard 