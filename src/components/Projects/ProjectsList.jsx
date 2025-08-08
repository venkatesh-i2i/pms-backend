import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchProjects } from '../../store/slices/projectsSlice'

const ProjectsList = () => {
  const dispatch = useDispatch()
  const { projects, loading, error } = useSelector((state) => state.projects)

  useEffect(() => {
    dispatch(fetchProjects())
  }, [dispatch])

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading projects...</div>
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
        <h1 style={styles.title}>Projects</h1>
        <Link to="/projects/create" style={styles.createBtn}>
          Create New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div style={styles.emptyState}>
          <h3 style={styles.emptyTitle}>No projects yet</h3>
          <p style={styles.emptyText}>
            Get started by creating your first project
          </p>
          <Link to="/projects/create" style={styles.emptyBtn}>
            Create Project
          </Link>
        </div>
      ) : (
        <div style={styles.projectsGrid}>
          {projects.map((project) => (
            <div key={project.id} style={styles.projectCard}>
              <div style={styles.projectHeader}>
                <h3 style={styles.projectTitle}>{project.name}</h3>
                <span style={styles.projectStatus(project.status)}>
                  {project.status}
                </span>
              </div>
              
              <p style={styles.projectDescription}>
                {project.description}
              </p>
              
              <div style={styles.projectMeta}>
                <div style={styles.metaItem}>
                  <strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}
                </div>
                {project.endDate && (
                  <div style={styles.metaItem}>
                    <strong>End Date:</strong> {new Date(project.endDate).toLocaleDateString()}
                  </div>
                )}
                <div style={styles.metaItem}>
                  <strong>Created:</strong> {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div style={styles.projectActions}>
                <Link 
                  to={`/projects/${project.id}`} 
                  style={styles.viewBtn}
                >
                  View Details
                </Link>
                <Link 
                  to={`/projects/${project.id}/tasks`} 
                  style={styles.tasksBtn}
                >
                  View Tasks
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    color: '#2c3e50',
    margin: 0,
  },
  createBtn: {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '1rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  emptyTitle: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    marginBottom: '1rem',
  },
  emptyText: {
    color: '#666',
    marginBottom: '2rem',
  },
  emptyBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '1rem',
  },
  projectsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem',
  },
  projectCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    border: '1px solid #eee',
  },
  projectHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  projectTitle: {
    fontSize: '1.25rem',
    color: '#2c3e50',
    margin: 0,
    flex: 1,
  },
  projectStatus: (status) => ({
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '500',
    backgroundColor: status === 'active' ? '#d4edda' : 
                   status === 'completed' ? '#d1ecf1' : '#fff3cd',
    color: status === 'active' ? '#155724' : 
          status === 'completed' ? '#0c5460' : '#856404',
  }),
  projectDescription: {
    color: '#666',
    marginBottom: '1rem',
    lineHeight: '1.5',
  },
  projectMeta: {
    marginBottom: '1.5rem',
  },
  metaItem: {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '0.5rem',
  },
  projectActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  viewBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '0.9rem',
    flex: 1,
    textAlign: 'center',
  },
  tasksBtn: {
    backgroundColor: '#f39c12',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '0.9rem',
    flex: 1,
    textAlign: 'center',
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

export default ProjectsList 