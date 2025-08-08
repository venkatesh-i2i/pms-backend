import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchProjects, searchProjects, fetchProjectsByType, fetchProjectsByCategory } from '../../store/slices/projectsSlice'
import { colors, typography, spacing, shadows, borderRadius } from '../../styles/theme'

const ProjectManagement = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { filteredProjects, loading, error } = useSelector((state) => state.projects)
  const { user } = useSelector((state) => state.auth)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    dispatch(fetchProjects())
  }, [dispatch])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      dispatch(searchProjects(searchTerm))
    } else {
      dispatch(fetchProjects())
    }
  }

  const handleTypeFilter = (type) => {
    setSelectedType(type)
    setSelectedCategory('')
    if (type) {
      dispatch(fetchProjectsByType(type))
    } else {
      dispatch(fetchProjects())
    }
  }

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category)
    setSelectedType('')
    if (category) {
      dispatch(fetchProjectsByCategory(category))
    } else {
      dispatch(fetchProjects())
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedType('')
    setSelectedCategory('')
    dispatch(fetchProjects())
  }

  const handleCreateProject = () => {
    navigate('/projects/create')
  }

  const handleEditProject = (projectId) => {
    navigate(`/projects/${projectId}/board`)
  }

  const handleViewProject = (projectId) => {
    navigate(`/projects/${projectId}`)
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
          <p style={styles.loadingText}>Loading projects...</p>
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.welcomeSection}>
            <h1 style={styles.title}>Project Management</h1>
            <p style={styles.subtitle}>Manage and monitor all projects</p>
          </div>
          <div style={styles.headerActions}>
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
        {/* Filters and Search */}
        <div style={styles.filtersSection}>
          <div style={styles.searchSection}>
            <form onSubmit={handleSearch} style={styles.searchForm}>
              <div style={styles.searchInput}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={styles.searchIcon}>
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={styles.searchField}
                />
              </div>
              <button type="submit" style={styles.searchBtn}>
                Search
              </button>
            </form>
          </div>

          <div style={styles.filters}>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Project Type</label>
              <select
                value={selectedType}
                onChange={(e) => handleTypeFilter(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="">All Types</option>
                <option value="SOFTWARE">Software</option>
                <option value="BUSINESS">Business</option>
                <option value="SERVICE_DESK">Service Desk</option>
                <option value="OPERATIONS">Operations</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="">All Categories</option>
                <option value="BUSINESS">Business</option>
                <option value="SOFTWARE_DEVELOPMENT">Software Development</option>
                <option value="IT_SERVICE">IT Service</option>
                <option value="MARKETING">Marketing</option>
                <option value="SALES">Sales</option>
                <option value="HR">HR</option>
                <option value="FINANCE">Finance</option>
              </select>
            </div>

            <button onClick={clearFilters} style={styles.clearBtn}>
              Clear Filters
            </button>
          </div>
        </div>

        {/* Projects List */}
        <div style={styles.projectsSection}>
          <div style={styles.projectsHeader}>
            <h2 style={styles.sectionTitle}>
              Projects ({filteredProjects.length})
            </h2>
            <div style={styles.viewOptions}>
              <button style={styles.viewBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                  <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                  <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                  <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
              <button style={styles.viewBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2"/>
                  <line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2"/>
                  <line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2"/>
                  <line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" strokeWidth="2"/>
                  <line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" strokeWidth="2"/>
                  <line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 style={styles.emptyTitle}>No projects found</h3>
              <p style={styles.emptyText}>
                {searchTerm || selectedType || selectedCategory 
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first project'
                }
              </p>
              {!searchTerm && !selectedType && !selectedCategory && (
                <button onClick={handleCreateProject} style={styles.emptyActionBtn}>
                  Create Project
                </button>
              )}
            </div>
          ) : (
            <div style={styles.projectsGrid}>
              {filteredProjects.map((project) => (
                <div key={project.id} style={styles.projectCard}>
                  <div style={styles.projectHeader}>
                    <div style={styles.projectKey}>{project.projectKey}</div>
                    <div style={styles.projectStatus(project.isActive)}>
                      {project.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  
                  <h3 style={styles.projectName}>{project.name}</h3>
                  <p style={styles.projectDescription}>{project.description}</p>
                  
                  <div style={styles.projectMeta}>
                    <div style={styles.projectType}>
                      <span style={styles.metaLabel}>Type:</span>
                      <span style={styles.metaValue}>{project.projectType}</span>
                    </div>
                    <div style={styles.projectCategory}>
                      <span style={styles.metaLabel}>Category:</span>
                      <span style={styles.metaValue}>{project.projectCategory}</span>
                    </div>
                  </div>

                  <div style={styles.projectStats}>
                    <div style={styles.projectStat}>
                      <span style={styles.statLabel}>Issues</span>
                      <span style={styles.statValue}>{project.issueCount}</span>
                    </div>
                    <div style={styles.projectStat}>
                      <span style={styles.statLabel}>Members</span>
                      <span style={styles.statValue}>{project.members?.length || 0}</span>
                    </div>
                    <div style={styles.projectStat}>
                      <span style={styles.statLabel}>Lead</span>
                      <span style={styles.statValue}>{project.projectLead?.name || 'Unassigned'}</span>
                    </div>
                  </div>

                  <div style={styles.projectActions}>
                    <button 
                      style={styles.actionButton}
                      onClick={() => handleEditProject(project.id)}
                      title="Edit Project & Manage Tasks"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 18.9609 21.7893 19.3359 21.4142C19.7109 21.0391 19.9216 20.5304 19.9216 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Edit
                    </button>
                    <button 
                      style={styles.actionButton}
                      onClick={() => handleViewProject(project.id)}
                      title="View Project Details"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
  filtersSection: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing[5],
    marginBottom: spacing[6],
    boxShadow: shadows.sm,
    border: `1px solid ${colors.border.primary}`,
  },
  searchSection: {
    marginBottom: spacing[4],
  },
  searchForm: {
    display: 'flex',
    gap: spacing[3],
  },
  searchInput: {
    position: 'relative',
    flex: 1,
  },
  searchIcon: {
    position: 'absolute',
    left: spacing[3],
    top: '50%',
    transform: 'translateY(-50%)',
    color: colors.text.tertiary,
    zIndex: 1,
  },
  searchField: {
    width: '100%',
    padding: `${spacing[3]} ${spacing[3]} ${spacing[3]} ${spacing[8]}`,
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.normal,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.base,
    transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    outline: 'none',
    '&:hover': {
      borderColor: colors.border.secondary,
    },
    '&:focus': {
      borderColor: colors.border.focus,
      boxShadow: `0 0 0 1px ${colors.border.focus}`,
    },
  },
  searchBtn: {
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
  filters: {
    display: 'flex',
    gap: spacing[4],
    alignItems: 'flex-end',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[1],
  },
  filterLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  filterSelect: {
    padding: `${spacing[2]} ${spacing[3]}`,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.base,
    outline: 'none',
    cursor: 'pointer',
    '&:hover': {
      borderColor: colors.border.secondary,
    },
    '&:focus': {
      borderColor: colors.border.focus,
      boxShadow: `0 0 0 1px ${colors.border.focus}`,
    },
  },
  clearBtn: {
    padding: `${spacing[2]} ${spacing[3]}`,
    backgroundColor: 'transparent',
    color: colors.text.secondary,
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.base,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.background.secondary,
      color: colors.text.primary,
    },
  },
  projectsSection: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing[5],
    boxShadow: shadows.sm,
    border: `1px solid ${colors.border.primary}`,
  },
  projectsHeader: {
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
  viewOptions: {
    display: 'flex',
    gap: spacing[1],
  },
  viewBtn: {
    padding: spacing[2],
    backgroundColor: 'transparent',
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.base,
    color: colors.text.secondary,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.background.secondary,
      color: colors.text.primary,
    },
  },
  projectsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: spacing[4],
  },
  projectCard: {
    padding: spacing[4],
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.base,
    backgroundColor: colors.background.secondary,
    transition: 'box-shadow 0.2s ease-in-out',
    '&:hover': {
      boxShadow: shadows.md,
    },
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
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    margin: `0 0 ${spacing[1]} 0`,
  },
  projectDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    margin: `0 0 ${spacing[3]} 0`,
    lineHeight: typography.lineHeight.relaxed,
  },
  projectMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[1],
    marginBottom: spacing[3],
  },
  projectType: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectCategory: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  metaValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  projectStats: {
    display: 'flex',
    gap: spacing[4],
    marginBottom: spacing[3],
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
  projectActions: {
    display: 'flex',
    gap: spacing[2],
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
    padding: `${spacing[2]} ${spacing[3]}`,
    backgroundColor: 'transparent',
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.base,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.secondary,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.background.primary,
      color: colors.text.primary,
    },
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
    margin: `0 0 ${spacing[4]} 0`,
  },
  emptyActionBtn: {
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

export default ProjectManagement 