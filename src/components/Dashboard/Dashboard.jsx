import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProjects } from '../../store/slices/projectsSlice'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { projects, loading, error } = useSelector((state) => state.projects)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchProjects())
  }, [dispatch])

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading dashboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>Error: {error}</div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Welcome back, {user?.name || 'User'}!</h1>
        <p style={styles.subtitle}>Here's an overview of your projects</p>
      </div>

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>{projects.length}</h3>
          <p style={styles.statLabel}>Total Projects</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>
            {projects.filter(p => p.status === 'active').length}
          </h3>
          <p style={styles.statLabel}>Active Projects</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>
            {projects.filter(p => p.status === 'completed').length}
          </h3>
          <p style={styles.statLabel}>Completed Projects</p>
        </div>
      </div>

      <div style={styles.recentProjects}>
        <h2 style={styles.sectionTitle}>Recent Projects</h2>
        {projects.length === 0 ? (
          <p style={styles.noProjects}>No projects found. Create your first project!</p>
        ) : (
          <div style={styles.projectGrid}>
            {projects.slice(0, 6).map((project) => (
              <div key={project.id} style={styles.projectCard}>
                <h3 style={styles.projectTitle}>{project.name}</h3>
                <p style={styles.projectDescription}>{project.description}</p>
                <div style={styles.projectMeta}>
                  <span style={styles.projectStatus(project.status)}>
                    {project.status}
                  </span>
                  <span style={styles.projectDate}>
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    color: '#2c3e50',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#666',
    fontSize: '1.1rem',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '3rem',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '2rem',
    color: '#3498db',
    margin: '0 0 0.5rem 0',
  },
  statLabel: {
    color: '#666',
    margin: 0,
  },
  recentProjects: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    marginBottom: '1.5rem',
  },
  noProjects: {
    textAlign: 'center',
    color: '#666',
    fontSize: '1.1rem',
  },
  projectGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1rem',
  },
  projectCard: {
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '1rem',
    transition: 'box-shadow 0.3s',
  },
  projectTitle: {
    fontSize: '1.1rem',
    color: '#2c3e50',
    marginBottom: '0.5rem',
  },
  projectDescription: {
    color: '#666',
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },
  projectMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectStatus: (status) => ({
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '500',
    backgroundColor: status === 'active' ? '#d4edda' : '#d1ecf1',
    color: status === 'active' ? '#155724' : '#0c5460',
  }),
  projectDate: {
    fontSize: '0.8rem',
    color: '#666',
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#666',
    padding: '2rem',
  },
  error: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#e74c3c',
    padding: '2rem',
  },
}

export default Dashboard 