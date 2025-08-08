import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const RoleBasedRoute = ({ children, allowedRoles = [], redirectTo = '/dashboard' }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // If no specific roles required, allow all authenticated users
  if (allowedRoles.length === 0) {
    return children
  }

  // Normalize roles from user payload: supports user.role (string) and user.roles (array of role objects or strings)
  const userRoleNames = (() => {
    if (!user) return []
    if (Array.isArray(user.roles)) {
      return user.roles.map((r) => (typeof r === 'string' ? r : r.name)).filter(Boolean)
    }
    if (typeof user.role === 'string') {
      return [user.role]
    }
    return []
  })()

  // Check if user has at least one of the allowed roles
  const isAllowed = userRoleNames.some((roleName) => allowedRoles.includes(roleName))
  if (isAllowed) {
    return children
  }

  // User doesn't have required role, redirect
  return <Navigate to={redirectTo} replace />
}

export default RoleBasedRoute
