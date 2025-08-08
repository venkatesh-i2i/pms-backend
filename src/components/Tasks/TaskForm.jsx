import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { createIssue } from '../../store/slices/issuesSlice'
import { fetchUsers } from '../../store/slices/usersSlice'
import { colors, typography, spacing, shadows, borderRadius } from '../../styles/theme'

const TaskForm = () => {
  const { projectId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { users } = useSelector((state) => state.users)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    summary: '', // Backend uses 'summary' not 'title'
    description: '',
    issueType: 'TASK',
    priority: 'MEDIUM',
    assigneeId: '',
    projectId: projectId ? parseInt(projectId) : null,
    dueDate: '',
    estimatedTime: '' // Backend uses estimatedTime in minutes
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    // Fetch users for assignment
    dispatch(fetchUsers())
  }, [dispatch])

  const issueTypes = [
    { value: 'BUG', label: 'Bug', icon: '🐛' },
    { value: 'TASK', label: 'Task', icon: '📋' },
    { value: 'STORY', label: 'Story', icon: '📖' },
    { value: 'EPIC', label: 'Epic', icon: '🎯' },
    { value: 'SUBTASK', label: 'Subtask', icon: '🔗' },
    { value: 'IMPROVEMENT', label: 'Improvement', icon: '🔧' },
    { value: 'NEW_FEATURE', label: 'New Feature', icon: '✨' }
  ]

  const priorities = [
    { value: 'CRITICAL', label: 'Critical', color: '#FF5630' },
    { value: 'HIGHEST', label: 'Highest', color: '#FF5630' },
    { value: 'HIGH', label: 'High', color: '#FF8B00' },
    { value: 'MEDIUM', label: 'Medium', color: '#0052CC' },
    { value: 'LOW', label: 'Low', color: '#36B37E' },
    { value: 'LOWEST', label: 'Lowest', color: '#36B37E' }
  ]



  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }



  const validateForm = () => {
    const newErrors = {}

    if (!formData.summary.trim()) {
      newErrors.summary = 'Summary is required'
    } else if (formData.summary.length < 2) {
      newErrors.summary = 'Summary must be at least 2 characters'
    } else if (formData.summary.length > 255) {
      newErrors.summary = 'Summary cannot exceed 255 characters'
    }

    if (formData.description && formData.description.length > 10000) {
      newErrors.description = 'Description cannot exceed 10000 characters'
    }

    if (!formData.projectId) {
      newErrors.projectId = 'Project is required'
    }

    if (formData.estimatedTime && formData.estimatedTime < 1) {
      newErrors.estimatedTime = 'Estimated time must be at least 1 minute'
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
      // Convert time from hours to minutes if provided
      const issueData = {
        ...formData,
        estimatedTime: formData.estimatedTime ? parseInt(formData.estimatedTime) : null,
        assigneeId: formData.assigneeId ? parseInt(formData.assigneeId) : null,
        dueDate: formData.dueDate || null
      }
      
      await dispatch(createIssue(issueData)).unwrap()
      navigate(`/projects/${projectId}/board`)
    } catch (error) {
      console.error('Failed to create issue:', error)
      // Error will be shown via the error state in the slice
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate(`/projects/${projectId}/board`)
  }

  const getPriorityColor = (priority) => {
    const priorityObj = priorities.find(p => p.value === priority)
    return priorityObj?.color || '#97A0AF'
  }



  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.breadcrumb}>
            <button onClick={() => navigate(`/projects/${projectId}/board`)} style={styles.breadcrumbLink}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Project Board
            </button>
            <span style={styles.breadcrumbSeparator}>/</span>
            <span style={styles.breadcrumbCurrent}>Create Issue</span>
          </div>
          <h1 style={styles.title}>Create Issue</h1>
          <p style={styles.subtitle}>Add a new issue to the project</p>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Issue Type */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Issue Type <span style={styles.required}>*</span>
              </label>
              <div style={styles.issueTypeGrid}>
                {issueTypes.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, issueType: type.value }))}
                    style={{
                      ...styles.issueTypeBtn,
                      ...(formData.issueType === type.value && styles.issueTypeBtnActive)
                    }}
                  >
                    <span style={styles.issueTypeIcon}>{type.icon}</span>
                    <span style={styles.issueTypeLabel}>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Summary <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                placeholder="Enter a summary of the issue"
                style={{
                  ...styles.input,
                  ...(errors.summary && styles.inputError)
                }}
              />
              {errors.summary && (
                <span style={styles.errorText}>{errors.summary}</span>
              )}
            </div>

            {/* Description */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Description <span style={styles.required}>*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the issue in detail"
                rows={6}
                style={{
                  ...styles.textarea,
                  ...(errors.description && styles.inputError)
                }}
              />
              {errors.description && (
                <span style={styles.errorText}>{errors.description}</span>
              )}
            </div>

            {/* Priority and Due Date */}
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  style={styles.select}
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
                <div style={styles.priorityIndicator}>
                  <div 
                    style={{
                      ...styles.priorityDot,
                      backgroundColor: getPriorityColor(formData.priority)
                    }}
                  />
                  <span style={styles.priorityText}>
                    {priorities.find(p => p.value === formData.priority)?.label}
                  </span>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Due Date</label>
                <input
                  type="datetime-local"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  style={styles.input}
                />
                <p style={styles.helpText}>
                  Optional: Set a deadline for this issue
                </p>
              </div>
            </div>

            {/* Assignee and Estimated Time */}
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Assignee</label>
                <select
                  name="assigneeId"
                  value={formData.assigneeId}
                  onChange={handleInputChange}
                  style={{
                    ...styles.select,
                    ...(errors.assigneeId && styles.inputError)
                  }}
                >
                  <option value="">Unassigned</option>
                  {users?.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
                {errors.assigneeId && (
                  <span style={styles.errorText}>{errors.assigneeId}</span>
                )}
                <p style={styles.helpText}>
                  Optional: Assign this issue to a team member
                </p>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Estimated Time (minutes)</label>
                <input
                  type="number"
                  name="estimatedTime"
                  value={formData.estimatedTime}
                  onChange={handleInputChange}
                  placeholder="60"
                  min="1"
                  step="1"
                  style={{
                    ...styles.input,
                    ...(errors.estimatedTime && styles.inputError)
                  }}
                />
                {errors.estimatedTime && (
                  <span style={styles.errorText}>{errors.estimatedTime}</span>
                )}
                <p style={styles.helpText}>
                  Optional: Estimated time to complete in minutes
                </p>
              </div>
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
                  'Create Issue'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarCard}>
            <h3 style={styles.sidebarTitle}>Issue Information</h3>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Issue Type:</span>
              <span style={styles.infoValue}>
                {issueTypes.find(t => t.value === formData.issueType)?.label}
              </span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Priority:</span>
              <span style={styles.infoValue}>
                <div style={styles.priorityBadge}>
                  <div 
                    style={{
                      ...styles.priorityDot,
                      backgroundColor: getPriorityColor(formData.priority)
                    }}
                  />
                  {priorities.find(p => p.value === formData.priority)?.label}
                </div>
              </span>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Assignee:</span>
              <span style={styles.infoValue}>
                {users?.find(u => u.id === parseInt(formData.assigneeId))?.name || 'Unassigned'}
              </span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Estimated Time:</span>
              <span style={styles.infoValue}>
                {formData.estimatedTime ? `${formData.estimatedTime} min` : 'Not set'}
              </span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Due Date:</span>
              <span style={styles.infoValue}>
                {formData.dueDate ? new Date(formData.dueDate).toLocaleDateString() : 'Not set'}
              </span>
            </div>
          </div>

          <div style={styles.sidebarCard}>
            <h3 style={styles.sidebarTitle}>Tips</h3>
            <ul style={styles.tipsList}>
              <li>Use clear, descriptive summaries</li>
              <li>Provide detailed descriptions</li>
              <li>Set appropriate priority levels</li>
              <li>Assign to team members for accountability</li>
              <li>Set realistic time estimates in minutes</li>
              <li>Use due dates for time-sensitive issues</li>
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
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: spacing[4],
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
    minHeight: '120px',
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
  issueTypeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: spacing[2],
  },
  issueTypeBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing[2],
    padding: spacing[3],
    backgroundColor: colors.background.secondary,
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.base,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.background.primary,
      borderColor: colors.border.secondary,
    },
  },
  issueTypeBtnActive: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[500],
    color: colors.primary[500],
  },
  issueTypeIcon: {
    fontSize: typography.fontSize['2xl'],
  },
  issueTypeLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  priorityIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    marginTop: spacing[1],
  },
  priorityDot: {
    width: '12px',
    height: '12px',
    borderRadius: borderRadius.full,
  },
  priorityText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    marginTop: spacing[1],
  },
  statusDot: {
    width: '12px',
    height: '12px',
    borderRadius: borderRadius.full,
  },
  statusText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
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
  priorityBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
  },
  tipsList: {
    margin: 0,
    paddingLeft: spacing[4],
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.relaxed,
  },
}

export default TaskForm 