import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { validateToken } from './store/slices/authSlice'
import Layout from './components/Layout/Layout'
import LoginForm from './components/Auth/LoginForm'
import RoleBasedRoute from './components/Auth/RoleBasedRoute'
import AdminDashboard from './components/Admin/AdminDashboard'
import UserManagement from './components/Admin/UserManagement'
import ProjectDashboard from './components/Dashboard/ProjectDashboard'
import DeveloperDashboard from './components/Dashboard/DeveloperDashboard'
import ProjectManagement from './components/Projects/ProjectManagement'
import ProjectForm from './components/Projects/ProjectForm'
import ProjectBoard from './components/Projects/ProjectBoard'
import ProjectDetails from './components/Projects/ProjectDetails'
import IssueForm from './components/Tasks/TaskForm' // Rename TaskForm to IssueForm later
import TimeTracking from './components/Tasks/TimeTracking'
import './services/api'

const App = () => {
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(validateToken())
    }
  }, [dispatch, isAuthenticated])

  const getDashboardComponent = () => {
    if (!user) return <ProjectDashboard />
    
    const roleNames = Array.isArray(user?.roles)
      ? user.roles.map((r) => (typeof r === 'string' ? r : r?.name)).filter(Boolean)
      : []
    const isAdmin = roleNames.includes('ADMIN') || user?.role === 'ADMIN'
    if (isAdmin) return <AdminDashboard />

    const isPm = roleNames.includes('PROJECT_MANAGER') || user?.role === 'PROJECT_MANAGER'
    const isDevOrTester = roleNames.some((r) => r === 'DEVELOPER' || r === 'TESTER' || r === 'QA') || ['DEVELOPER', 'TESTER', 'QA'].includes(user?.role)

    if (isPm) return <ProjectDashboard />
    if (isDevOrTester) return <Navigate to="/projects" replace />
    return <DeveloperDashboard />
  }

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    )
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={getDashboardComponent()} />
          <Route
            path="/users"
            element={
              <RoleBasedRoute allowedRoles={["ADMIN"]}>
                <UserManagement />
              </RoleBasedRoute>
            }
          />
          <Route path="/projects" element={<ProjectManagement />} />
          <Route
            path="/projects/create"
            element={
              <RoleBasedRoute allowedRoles={["PROJECT_MANAGER", "MANAGER"]}>
                <ProjectForm />
              </RoleBasedRoute>
            }
          />
          <Route path="/projects/:projectId" element={<ProjectDetails />} />
          <Route path="/projects/:projectId/board" element={<ProjectBoard />} />
          <Route path="/projects/:projectId/issues/create" element={<IssueForm />} />
          <Route path="/issues/:issueId/time-tracking" element={<TimeTracking />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
