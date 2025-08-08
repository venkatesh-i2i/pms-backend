import { useSelector } from 'react-redux'
import AdminDashboard from './AdminDashboard'
import ProjectManagerDashboard from './ProjectManagerDashboard'
import DeveloperDashboard from './DeveloperDashboard'
import { colors, typography, spacing } from '../../styles/theme'

const RoleBasedDashboard = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  if (!isAuthenticated || !user) {
    return (
      <div style={styles.container}>
        <div style={styles.errorState}>
          <h2 style={styles.errorTitle}>Access Denied</h2>
          <p style={styles.errorMessage}>Please log in to access the dashboard.</p>
        </div>
      </div>
    )
  }

  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case 'ADMIN':
      return <AdminDashboard />
    
    case 'PROJECT_MANAGER':
      return <ProjectManagerDashboard />
    
    case 'DEVELOPER':
    case 'QA':
      return <DeveloperDashboard />
    
    default:
      return (
        <div style={styles.container}>
          <div style={styles.errorState}>
            <h2 style={styles.errorTitle}>Unknown Role</h2>
            <p style={styles.errorMessage}>
              Your role "{user.role}" is not recognized. Please contact your administrator.
            </p>
          </div>
        </div>
      )
  }
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: colors.background.secondary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorState: {
    textAlign: 'center',
    padding: spacing[8],
    backgroundColor: colors.background.primary,
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  errorTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing[4],
  },
  errorMessage: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    margin: 0,
  },
}

export default RoleBasedDashboard
