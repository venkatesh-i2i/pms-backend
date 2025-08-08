import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createProject } from '../../store/slices/projectsSlice'
import { fetchUsers } from '../../store/slices/usersSlice'
import { colors, typography, spacing, shadows, borderRadius } from '../../styles/theme'

const ProjectForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.projects)
  const { users } = useSelector((state) => state.users)
  const { user: currentUser } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    projectKey: '',
    name: '',
    description: '',
    projectType: 'SOFTWARE',
    projectCategory: 'SOFTWARE_DEVELOPMENT',
    projectLeadId: currentUser?.id || '',
    startDate: '',
    endDate: '',
    milestones: []
  })

  const [newMilestone, setNewMilestone] = useState({
    name: '',
    date: '',
    description: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Fetch users for project lead selection
    dispatch(fetchUsers())
  }, [dispatch])

  const projectTypes = [
    { value: 'SOFTWARE', label: 'Software Development' },
    { value: 'BUSINESS', label: 'Business Process' },
    { value: 'SERVICE_DESK', label: 'Service Desk' },
    { value: 'OPERATIONS', label: 'Operations' }
  ]

  const projectCategories = [
    { value: 'BUSINESS', label: 'Business' },
    { value: 'SOFTWARE_DEVELOPMENT', label: 'Software Development' },
    { value: 'IT_SERVICE', label: 'IT Service' },
    { value: 'MARKETING', label: 'Marketing' },
    { value: 'SALES', label: 'Sales' },
    { value: 'HR', label: 'Human Resources' },
    { value: 'FINANCE', label: 'Finance' }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleMilestoneInputChange = (e) => {
    const { name, value } = e.target
    setNewMilestone(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addMilestone = () => {
    if (!newMilestone.name.trim() || !newMilestone.date) return
    
    const milestone = {
      id: Date.now(),
      name: newMilestone.name.trim(),
      date: newMilestone.date,
      description: newMilestone.description.trim(),
      completed: false
    }
    
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, milestone]
    }))
    
    setNewMilestone({ name: '', date: '', description: '' })
  }

  const removeMilestone = (id) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter(m => m.id !== id)
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.projectKey.trim()) {
      newErrors.projectKey = 'Project key is required'
    } else if (formData.projectKey.length < 2 || formData.projectKey.length > 10) {
      newErrors.projectKey = 'Project key must be between 2-10 characters'
    } else if (!/^[A-Z0-9]+$/.test(formData.projectKey)) {
      newErrors.projectKey = 'Project key must contain only uppercase letters and numbers'
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required'
    } else if (formData.name.length < 2 || formData.name.length > 100) {
      newErrors.name = 'Project name must be between 2-100 characters'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required'
    }

    if (!formData.projectLeadId) {
      newErrors.projectLeadId = 'Project lead is required'
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        newErrors.endDate = 'End date must be after start date'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      await dispatch(createProject(formData)).unwrap()
      navigate('/projects')
    } catch (error) {
      console.error('Failed to create project:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate('/projects')
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.breadcrumb}>
            <button onClick={() => navigate('/projects')} style={styles.breadcrumbLink}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Projects
            </button>
            <span style={styles.breadcrumbSeparator}>/</span>
            <span style={styles.breadcrumbCurrent}>Create Project</span>
          </div>
          <h1 style={styles.title}>Create Project</h1>
          <p style={styles.subtitle}>Set up a new project for your team</p>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Project Key */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Project Key <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="projectKey"
                value={formData.projectKey}
                onChange={handleInputChange}
                placeholder="e.g., PMS, WEB, APP"
                style={{
                  ...styles.input,
                  ...(errors.projectKey && styles.inputError)
                }}
                maxLength={10}
              />
              {errors.projectKey && (
                <span style={styles.errorText}>{errors.projectKey}</span>
              )}
              <p style={styles.helpText}>
                A unique identifier for your project (2-10 characters, uppercase letters and numbers only)
              </p>
            </div>

            {/* Project Name */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Project Name <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter project name"
                style={{
                  ...styles.input,
                  ...(errors.name && styles.inputError)
                }}
                maxLength={100}
              />
              {errors.name && (
                <span style={styles.errorText}>{errors.name}</span>
              )}
            </div>

            {/* Project Description */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Description <span style={styles.required}>*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your project"
                rows={4}
                style={{
                  ...styles.textarea,
                  ...(errors.description && styles.inputError)
                }}
              />
              {errors.description && (
                <span style={styles.errorText}>{errors.description}</span>
              )}
            </div>

            {/* Project Type */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Project Type</label>
              <select
                name="projectType"
                value={formData.projectType}
                onChange={handleInputChange}
                style={styles.select}
              >
                {projectTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Project Category */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Project Category</label>
              <select
                name="projectCategory"
                value={formData.projectCategory}
                onChange={handleInputChange}
                style={styles.select}
              >
                {projectCategories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Project Lead */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Project Lead <span style={styles.required}>*</span>
              </label>
              <select
                name="projectLeadId"
                value={formData.projectLeadId}
                onChange={handleInputChange}
                style={{
                  ...styles.select,
                  ...(errors.projectLeadId && styles.inputError)
                }}
              >
                <option value="">Select a project lead</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              {errors.projectLeadId && (
                <span style={styles.errorText}>{errors.projectLeadId}</span>
              )}
            </div>

            {/* Project Timeline */}
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  style={{
                    ...styles.input,
                    ...(errors.startDate && styles.inputError)
                  }}
                />
                {errors.startDate && (
                  <span style={styles.errorText}>{errors.startDate}</span>
                )}
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  style={{
                    ...styles.input,
                    ...(errors.endDate && styles.inputError)
                  }}
                />
                {errors.endDate && (
                  <span style={styles.errorText}>{errors.endDate}</span>
                )}
              </div>
            </div>

            {/* Project Milestones */}
            <div style={styles.milestonesSection}>
              <div style={styles.milestonesHeader}>
                <label style={styles.label}>Project Milestones</label>
                <p style={styles.helpText}>Define key milestones and deadlines for your project</p>
              </div>
              
              {/* Add Milestone Form */}
              <div style={styles.addMilestoneForm}>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <input
                      type="text"
                      name="name"
                      value={newMilestone.name}
                      onChange={handleMilestoneInputChange}
                      placeholder="Milestone name"
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <input
                      type="date"
                      name="date"
                      value={newMilestone.date}
                      onChange={handleMilestoneInputChange}
                      style={styles.input}
                    />
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <input
                    type="text"
                    name="description"
                    value={newMilestone.description}
                    onChange={handleMilestoneInputChange}
                    placeholder="Milestone description (optional)"
                    style={styles.input}
                  />
                </div>
                <button
                  type="button"
                  onClick={addMilestone}
                  disabled={!newMilestone.name.trim() || !newMilestone.date}
                  style={styles.addMilestoneBtn}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Add Milestone
                </button>
              </div>

              {/* Milestones List */}
              {formData.milestones.length > 0 && (
                <div style={styles.milestonesList}>
                  <h4 style={styles.milestonesListTitle}>Milestones ({formData.milestones.length})</h4>
                  {formData.milestones
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map((milestone) => (
                      <div key={milestone.id} style={styles.milestoneItem}>
                        <div style={styles.milestoneContent}>
                          <div style={styles.milestoneHeader}>
                            <h5 style={styles.milestoneName}>{milestone.name}</h5>
                            <span style={styles.milestoneDate}>
                              {new Date(milestone.date).toLocaleDateString()}
                            </span>
                          </div>
                          {milestone.description && (
                            <p style={styles.milestoneDescription}>{milestone.description}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeMilestone(milestone.id)}
                          style={styles.removeMilestoneBtn}
                          title="Remove milestone"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
                            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div style={styles.formActions}>
              <button
                type="button"
                onClick={handleCancel}
                style={styles.cancelButton}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div style={styles.loadingSpinner}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="31.416">
                        <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                        <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                      </circle>
                    </svg>
                  </div>
                ) : (
                  'Create Project'
                )}
              </button>
            </div>

            {error && (
              <div style={styles.errorMessage}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                  <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
                </svg>
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Sidebar with Project Info */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarCard}>
            <h3 style={styles.sidebarTitle}>Project Information</h3>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Project Key:</span>
              <span style={styles.infoValue}>{formData.projectKey || 'Not set'}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Project Type:</span>
              <span style={styles.infoValue}>
                {projectTypes.find(t => t.value === formData.projectType)?.label || 'Not set'}
              </span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Category:</span>
              <span style={styles.infoValue}>
                {projectCategories.find(c => c.value === formData.projectCategory)?.label || 'Not set'}
              </span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Project Lead:</span>
              <span style={styles.infoValue}>
                {users.find(u => u.id === parseInt(formData.projectLeadId))?.name || 'Not set'}
              </span>
            </div>
          </div>

          <div style={styles.sidebarCard}>
            <h3 style={styles.sidebarTitle}>Tips</h3>
            <ul style={styles.tipsList}>
              <li>Choose a memorable project key that's easy to reference</li>
              <li>Make the project name descriptive and clear</li>
              <li>Select the appropriate project type for your workflow</li>
              <li>Assign a project lead who will manage the project</li>
            </ul>
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
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  breadcrumbLink: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
    backgroundColor: 'transparent',
    border: 'none',
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    cursor: 'pointer',
    textDecoration: 'none',
    '&:hover': {
      color: colors.text.primary,
    },
  },
  breadcrumbSeparator: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
  },
  breadcrumbCurrent: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
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
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `${spacing[6]} ${spacing[4]}`,
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: spacing[6],
  },
  formContainer: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing[6],
    boxShadow: shadows.sm,
    border: `1px solid ${colors.border.primary}`,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[5],
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[2],
  },
  label: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  required: {
    color: colors.danger[500],
  },
  input: {
    padding: `${spacing[3]} ${spacing[4]}`,
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
  inputError: {
    borderColor: colors.danger[500],
    '&:focus': {
      borderColor: colors.danger[500],
      boxShadow: `0 0 0 1px ${colors.danger[500]}`,
    },
  },
  textarea: {
    padding: `${spacing[3]} ${spacing[4]}`,
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.normal,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.base,
    resize: 'vertical',
    minHeight: '100px',
    transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    outline: 'none',
    fontFamily: 'inherit',
    '&:hover': {
      borderColor: colors.border.secondary,
    },
    '&:focus': {
      borderColor: colors.border.focus,
      boxShadow: `0 0 0 1px ${colors.border.focus}`,
    },
  },
  select: {
    padding: `${spacing[3]} ${spacing[4]}`,
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
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.danger[500],
    marginTop: spacing[1],
  },
  helpText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing[1],
  },
  formActions: {
    display: 'flex',
    gap: spacing[3],
    justifyContent: 'flex-end',
    paddingTop: spacing[4],
    borderTop: `1px solid ${colors.border.primary}`,
  },
  cancelButton: {
    padding: `${spacing[3]} ${spacing[4]}`,
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
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
  },
  submitButton: {
    padding: `${spacing[3]} ${spacing[4]}`,
    backgroundColor: colors.primary[500],
    color: colors.text.inverse,
    border: 'none',
    borderRadius: borderRadius.base,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    '&:hover': {
      backgroundColor: colors.primary[600],
    },
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
  },
  loadingSpinner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    padding: spacing[3],
    backgroundColor: colors.danger[50],
    border: `1px solid ${colors.danger[200]}`,
    borderRadius: borderRadius.base,
    color: colors.danger[700],
    fontSize: typography.fontSize.sm,
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[4],
  },
  sidebarCard: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    boxShadow: shadows.sm,
    border: `1px solid ${colors.border.primary}`,
  },
  sidebarTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    margin: `0 0 ${spacing[3]} 0`,
  },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${spacing[2]} 0`,
    borderBottom: `1px solid ${colors.border.primary}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  infoLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  infoValue: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
  },
  tipsList: {
    margin: 0,
    paddingLeft: spacing[4],
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.relaxed,
  },
  milestonesSection: {
    marginTop: spacing[2],
    padding: spacing[4],
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.base,
    border: `1px solid ${colors.border.primary}`,
  },
  milestonesHeader: {
    marginBottom: spacing[4],
  },
  addMilestoneForm: {
    padding: spacing[4],
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.base,
    border: `1px solid ${colors.border.primary}`,
    marginBottom: spacing[4],
  },
  addMilestoneBtn: {
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
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
  },
  milestonesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[3],
  },
  milestonesListTitle: {
    margin: `0 0 ${spacing[3]} 0`,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  milestoneItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: spacing[3],
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.base,
    border: `1px solid ${colors.border.primary}`,
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[1],
  },
  milestoneName: {
    margin: 0,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  milestoneDate: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary[500],
    backgroundColor: colors.primary[50],
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: borderRadius.base,
  },
  milestoneDescription: {
    margin: 0,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.relaxed,
  },
  removeMilestoneBtn: {
    padding: spacing[2],
    backgroundColor: 'transparent',
    border: 'none',
    color: colors.text.tertiary,
    cursor: 'pointer',
    borderRadius: borderRadius.base,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.danger[50],
      color: colors.danger[500],
    },
  },
}

export default ProjectForm 