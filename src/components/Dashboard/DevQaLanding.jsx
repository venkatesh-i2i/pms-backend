import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchProjectsByMember } from '../../store/slices/projectsSlice'
import { colors, typography, spacing } from '../../styles/theme'

const DevQaLanding = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { filteredProjects, loading } = useSelector((state) => state.projects)

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchProjectsByMember(user.id))
    }
  }, [dispatch, user?.id])

  useEffect(() => {
    if (loading) return
    if (filteredProjects && filteredProjects.length > 0) {
      navigate(`/projects/${filteredProjects[0].id}/board`, { replace: true })
    } else {
      navigate('/projects', { replace: true })
    }
  }, [filteredProjects, loading, navigate])

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.spinner}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke={colors.primary[200]} strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="12" r="10" stroke={colors.primary[500]} strokeWidth="2" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="31.416">
              <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
              <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
            </circle>
          </svg>
        </div>
        <p style={styles.text}>Preparing your board…</p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing[3],
  },
  spinner: {
    color: colors.primary[500],
  },
  text: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    margin: 0,
  },
}

export default DevQaLanding


