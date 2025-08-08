import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { logoutUser } from '../../store/slices/authSlice'
import { colors, typography, spacing, shadows } from '../../styles/theme'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/login')
  }

  const isActiveRoute = (path) => location.pathname === path

  // Helper function to get user display name
  const getUserDisplayName = () => {
    if (!user) return 'User'
    return user.name || user.email?.split('@')[0] || 'User'
  }

  // Helper function to check if user is admin
  const isAdmin = () => {
    if (!user) return false
    if (Array.isArray(user.roles)) {
      if (user.roles.some((role) => (typeof role === 'string' ? role : role.name) === 'ADMIN')) return true
    }
    return user.role === 'ADMIN'
  }

  // Role helpers
  const getRoleNames = () => {
    if (!user) return []
    if (Array.isArray(user.roles)) return user.roles.map((r) => (typeof r === 'string' ? r : r?.name)).filter(Boolean)
    return user.role ? [user.role] : []
  }

  const shouldShowDashboard = () => {
    const roles = getRoleNames()
    const hasManagerial = roles.some((r) => r === 'ADMIN' || r === 'PROJECT_MANAGER' || r === 'MANAGER')
    const hasDevOrTester = roles.some((r) => r === 'DEVELOPER' || r === 'TESTER' || r === 'QA')
    // Hide Dashboard if user is only Developer/Tester (incl. QA alias) without managerial roles
    if (hasDevOrTester && !hasManagerial) return false
    return true
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <div style={styles.leftSection}>
          <Link to="/" style={styles.logo}>
            <div style={styles.logoIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke={colors.primary[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke={colors.primary[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke={colors.primary[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={styles.logoText}>PMS Tool</span>
          </Link>
          
          {isAuthenticated && (
            <div style={styles.navigation}>
              {shouldShowDashboard() && (
                <Link 
                  to="/dashboard" 
                  style={{
                    ...styles.navLink,
                    ...(isActiveRoute('/dashboard') && styles.navLinkActive)
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={styles.navIcon}>
                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Dashboard
                </Link>
              )}
              <Link 
                to="/projects" 
                style={{
                  ...styles.navLink,
                  ...(isActiveRoute('/projects') && styles.navLinkActive)
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={styles.navIcon}>
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Projects
              </Link>
              {isAdmin() && (
                <Link 
                  to="/users" 
                  style={{
                    ...styles.navLink,
                    ...(isActiveRoute('/users') && styles.navLinkActive)
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={styles.navIcon}>
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Users
                </Link>
              )}
            </div>
          )}
        </div>
        
        <div style={styles.rightSection}>
          {isAuthenticated ? (
            <div style={styles.userSection}>
              <div style={styles.userInfo}>
                <div style={styles.userAvatar}>
                  {getUserDisplayName().charAt(0).toUpperCase()}
                </div>
                <span style={styles.userName}>
                  {getUserDisplayName()}
                </span>
              </div>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ) : (
            <Link to="/login" style={styles.loginBtn}>
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    backgroundColor: colors.background.primary,
    borderBottom: `1px solid ${colors.border.primary}`,
    boxShadow: shadows.sm,
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `0 ${spacing[4]}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '60px',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[6],
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    textDecoration: 'none',
    color: colors.text.primary,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.lg,
  },
  logoIcon: {
    display: 'flex',
    alignItems: 'center',
  },
  logoText: {
    color: colors.primary[500],
  },
  navigation: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    padding: `${spacing[2]} ${spacing[3]}`,
    color: colors.text.secondary,
    textDecoration: 'none',
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    borderRadius: '3px',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.background.secondary,
      color: colors.text.primary,
    },
  },
  navLinkActive: {
    backgroundColor: colors.primary[50],
    color: colors.primary[500],
    fontWeight: typography.fontWeight.semibold,
  },
  navIcon: {
    color: 'currentColor',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
  },
  userAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: colors.primary[500],
    color: colors.text.inverse,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  userName: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    border: 'none',
    backgroundColor: 'transparent',
    color: colors.text.secondary,
    cursor: 'pointer',
    borderRadius: '3px',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.background.secondary,
      color: colors.text.primary,
    },
  },
  loginBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${spacing[2]} ${spacing[4]}`,
    backgroundColor: colors.primary[500],
    color: colors.text.inverse,
    textDecoration: 'none',
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    borderRadius: '3px',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.primary[600],
    },
  },
}

export default Navbar 