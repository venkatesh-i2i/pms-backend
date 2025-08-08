import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { colors, typography, spacing, shadows, borderRadius } from '../../styles/theme'

const TimeTracking = () => {
  const { taskId } = useParams()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [isLogging, setIsLogging] = useState(false)
  const [showLogForm, setShowLogForm] = useState(false)
  const [activeTab, setActiveTab] = useState('worklog')

  const [logData, setLogData] = useState({
    timeSpent: '',
    timeSpentUnit: 'h',
    comment: '',
    date: new Date().toISOString().split('T')[0]
  })

  // Mock data - replace with actual API calls
  const task = {
    id: 1,
    title: 'Implement user authentication',
    key: 'PMS-1',
    timeEstimate: 16,
    timeSpent: 12,
    timeRemaining: 4,
    assignee: { id: 1, name: 'John Doe', avatar: 'JD' }
  }

  const workLogs = [
    {
      id: 1,
      author: { id: 1, name: 'John Doe', avatar: 'JD' },
      timeSpent: 4,
      timeSpentUnit: 'h',
      comment: 'Implemented JWT token generation and validation',
      date: '2024-01-20',
      startTime: '09:00',
      endTime: '13:00'
    },
    {
      id: 2,
      author: { id: 1, name: 'John Doe', avatar: 'JD' },
      timeSpent: 8,
      timeSpentUnit: 'h',
      comment: 'Added role-based access control and user permissions',
      date: '2024-01-19',
      startTime: '10:00',
      endTime: '18:00'
    }
  ]

  const handleLogTime = async (e) => {
    e.preventDefault()
    setIsLogging(true)
    
    try {
      // await dispatch(logTime({ taskId, ...logData })).unwrap()
      setShowLogForm(false)
      setLogData({
        timeSpent: '',
        timeSpentUnit: 'h',
        comment: '',
        date: new Date().toISOString().split('T')[0]
      })
    } catch (error) {
      console.error('Failed to log time:', error)
    } finally {
      setIsLogging(false)
    }
  }

  const formatTime = (hours) => {
    const wholeHours = Math.floor(hours)
    const minutes = Math.round((hours - wholeHours) * 60)
    
    if (minutes === 0) {
      return `${wholeHours}h`
    }
    return `${wholeHours}h ${minutes}m`
  }

  const getProgressPercentage = () => {
    return Math.min((task.timeSpent / task.timeEstimate) * 100, 100)
  }

  const getProgressColor = () => {
    const percentage = getProgressPercentage()
    if (percentage > 100) return colors.danger[500]
    if (percentage > 80) return colors.warning[500]
    return colors.success[500]
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.taskInfo}>
            <h1 style={styles.taskTitle}>{task.title}</h1>
            <div style={styles.taskKey}>{task.key}</div>
          </div>
          <div style={styles.headerActions}>
            <button 
              onClick={() => setShowLogForm(true)}
              style={styles.logTimeBtn}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Log Time
            </button>
          </div>
        </div>
      </div>

      <div style={styles.content}>
        {/* Time Summary */}
        <div style={styles.summarySection}>
          <div style={styles.summaryGrid}>
            <div style={styles.summaryCard}>
              <div style={styles.summaryIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div style={styles.summaryContent}>
                <h3 style={styles.summaryNumber}>{formatTime(task.timeEstimate)}</h3>
                <p style={styles.summaryLabel}>Original Estimate</p>
              </div>
            </div>

            <div style={styles.summaryCard}>
              <div style={styles.summaryIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div style={styles.summaryContent}>
                <h3 style={styles.summaryNumber}>{formatTime(task.timeSpent)}</h3>
                <p style={styles.summaryLabel}>Time Spent</p>
              </div>
            </div>

            <div style={styles.summaryCard}>
              <div style={styles.summaryIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div style={styles.summaryContent}>
                <h3 style={styles.summaryNumber}>{formatTime(task.timeRemaining)}</h3>
                <p style={styles.summaryLabel}>Remaining</p>
              </div>
            </div>

            <div style={styles.summaryCard}>
              <div style={styles.summaryIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div style={styles.summaryContent}>
                <h3 style={styles.summaryNumber}>{Math.round(getProgressPercentage())}%</h3>
                <p style={styles.summaryLabel}>Progress</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={styles.progressSection}>
            <div style={styles.progressHeader}>
              <span style={styles.progressLabel}>Time Progress</span>
              <span style={styles.progressText}>
                {formatTime(task.timeSpent)} of {formatTime(task.timeEstimate)}
              </span>
            </div>
            <div style={styles.progressBar}>
              <div 
                style={{
                  ...styles.progressFill,
                  width: `${getProgressPercentage()}%`,
                  backgroundColor: getProgressColor()
                }}
              />
            </div>
            {task.timeSpent > task.timeEstimate && (
              <div style={styles.overrunWarning}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                  <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Time overrun: {formatTime(task.timeSpent - task.timeEstimate)} over estimate
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab('worklog')}
            style={{
              ...styles.tab,
              ...(activeTab === 'worklog' && styles.activeTab)
            }}
          >
            Work Log
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            style={{
              ...styles.tab,
              ...(activeTab === 'reports' && styles.activeTab)
            }}
          >
            Reports
          </button>
        </div>

        {/* Work Log Tab */}
        {activeTab === 'worklog' && (
          <div style={styles.workLogSection}>
            <div style={styles.workLogHeader}>
              <h2 style={styles.sectionTitle}>Work Log</h2>
              <button 
                onClick={() => setShowLogForm(true)}
                style={styles.addLogBtn}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Add Work Log
              </button>
            </div>

            <div style={styles.workLogList}>
              {workLogs.map((log) => (
                                 <div key={log.id} style={styles.workLogItem}>
                   <div style={styles.workLogItemHeader}>
                     <div style={styles.workLogAuthor}>
                      <div style={styles.avatar}>{log.author.avatar}</div>
                      <div style={styles.authorInfo}>
                        <span style={styles.authorName}>{log.author.name}</span>
                        <span style={styles.logDate}>{log.date}</span>
                      </div>
                    </div>
                    <div style={styles.workLogTime}>
                      <span style={styles.timeSpent}>
                        {log.timeSpent}{log.timeSpentUnit}
                      </span>
                      <span style={styles.timeRange}>
                        {log.startTime} - {log.endTime}
                      </span>
                    </div>
                  </div>
                  
                  {log.comment && (
                    <div style={styles.workLogComment}>
                      <p style={styles.commentText}>{log.comment}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div style={styles.reportsSection}>
            <h2 style={styles.sectionTitle}>Time Reports</h2>
            <div style={styles.reportsGrid}>
              <div style={styles.reportCard}>
                <h3 style={styles.reportTitle}>Daily Breakdown</h3>
                <div style={styles.reportContent}>
                  <div style={styles.reportItem}>
                    <span style={styles.reportLabel}>Today</span>
                    <span style={styles.reportValue}>4h</span>
                  </div>
                  <div style={styles.reportItem}>
                    <span style={styles.reportLabel}>Yesterday</span>
                    <span style={styles.reportValue}>8h</span>
                  </div>
                  <div style={styles.reportItem}>
                    <span style={styles.reportLabel}>This Week</span>
                    <span style={styles.reportValue}>12h</span>
                  </div>
                </div>
              </div>

              <div style={styles.reportCard}>
                <h3 style={styles.reportTitle}>Efficiency Metrics</h3>
                <div style={styles.reportContent}>
                  <div style={styles.reportItem}>
                    <span style={styles.reportLabel}>Avg Daily</span>
                    <span style={styles.reportValue}>6h</span>
                  </div>
                  <div style={styles.reportItem}>
                    <span style={styles.reportLabel}>Completion Rate</span>
                    <span style={styles.reportValue}>75%</span>
                  </div>
                  <div style={styles.reportItem}>
                    <span style={styles.reportLabel}>Estimate Accuracy</span>
                    <span style={styles.reportValue}>85%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Log Time Modal */}
      {showLogForm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Log Time</h2>
              <button 
                onClick={() => setShowLogForm(false)}
                style={styles.closeBtn}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleLogTime} style={styles.logForm}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Time Spent</label>
                <div style={styles.timeInputGroup}>
                  <input
                    type="number"
                    name="timeSpent"
                    value={logData.timeSpent}
                    onChange={(e) => setLogData(prev => ({ ...prev, timeSpent: e.target.value }))}
                    placeholder="0"
                    min="0"
                    step="0.5"
                    style={styles.timeInput}
                    required
                  />
                  <select
                    name="timeSpentUnit"
                    value={logData.timeSpentUnit}
                    onChange={(e) => setLogData(prev => ({ ...prev, timeSpentUnit: e.target.value }))}
                    style={styles.timeUnitSelect}
                  >
                    <option value="h">hours</option>
                    <option value="m">minutes</option>
                    <option value="d">days</option>
                  </select>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Date</label>
                <input
                  type="date"
                  name="date"
                  value={logData.date}
                  onChange={(e) => setLogData(prev => ({ ...prev, date: e.target.value }))}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Comment</label>
                <textarea
                  name="comment"
                  value={logData.comment}
                  onChange={(e) => setLogData(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Describe the work done..."
                  rows={4}
                  style={styles.textarea}
                />
              </div>

              <div style={styles.formActions}>
                <button
                  type="button"
                  onClick={() => setShowLogForm(false)}
                  style={styles.cancelButton}
                  disabled={isLogging}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={styles.submitButton}
                  disabled={isLogging}
                >
                  {isLogging ? (
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
                    'Log Time'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
    padding: `${spacing[4]} 0`,
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `0 ${spacing[4]}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    margin: `0 0 ${spacing[2]} 0`,
  },
  taskKey: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary[500],
    backgroundColor: colors.primary[50],
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: borderRadius.base,
    display: 'inline-block',
  },
  headerActions: {
    display: 'flex',
    gap: spacing[3],
  },
  logTimeBtn: {
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
  summarySection: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing[5],
    marginBottom: spacing[6],
    boxShadow: shadows.sm,
    border: `1px solid ${colors.border.primary}`,
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: spacing[4],
    marginBottom: spacing[5],
  },
  summaryCard: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[4],
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.base,
    border: `1px solid ${colors.border.primary}`,
  },
  summaryIcon: {
    width: '48px',
    height: '48px',
    borderRadius: borderRadius.base,
    backgroundColor: colors.primary[50],
    color: colors.primary[500],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  summaryContent: {
    flex: 1,
  },
  summaryNumber: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    margin: `0 0 ${spacing[1]} 0`,
  },
  summaryLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    margin: 0,
  },
  progressSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[3],
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  progressText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  progressBar: {
    height: '8px',
    backgroundColor: colors.border.primary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
    transition: 'width 0.3s ease-in-out',
  },
  overrunWarning: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    padding: spacing[2],
    backgroundColor: colors.danger[50],
    border: `1px solid ${colors.danger[200]}`,
    borderRadius: borderRadius.base,
    color: colors.danger[700],
    fontSize: typography.fontSize.sm,
  },
  tabs: {
    display: 'flex',
    gap: spacing[1],
    marginBottom: spacing[4],
    borderBottom: `1px solid ${colors.border.primary}`,
  },
  tab: {
    padding: `${spacing[3]} ${spacing[4]}`,
    backgroundColor: 'transparent',
    border: 'none',
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    borderBottom: `2px solid transparent`,
    '&:hover': {
      color: colors.text.primary,
    },
  },
  activeTab: {
    color: colors.primary[500],
    borderBottomColor: colors.primary[500],
    fontWeight: typography.fontWeight.semibold,
  },
  workLogSection: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing[5],
    boxShadow: shadows.sm,
    border: `1px solid ${colors.border.primary}`,
  },
  workLogHeader: {
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
  addLogBtn: {
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
  workLogList: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[3],
  },
  workLogItem: {
    padding: spacing[4],
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.base,
    backgroundColor: colors.background.secondary,
  },
  workLogItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[3],
  },
  workLogAuthor: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[500],
    color: colors.text.inverse,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  authorInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[1],
  },
  authorName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  logDate: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  workLogTime: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: spacing[1],
  },
  timeSpent: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  timeRange: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  workLogComment: {
    paddingTop: spacing[3],
    borderTop: `1px solid ${colors.border.primary}`,
  },
  commentText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.relaxed,
    margin: 0,
  },
  reportsSection: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing[5],
    boxShadow: shadows.sm,
    border: `1px solid ${colors.border.primary}`,
  },
  reportsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: spacing[4],
  },
  reportCard: {
    padding: spacing[4],
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.base,
    backgroundColor: colors.background.secondary,
  },
  reportTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    margin: `0 0 ${spacing[3]} 0`,
  },
  reportContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[2],
  },
  reportItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${spacing[2]} 0`,
    borderBottom: `1px solid ${colors.border.primary}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  reportLabel: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  reportValue: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.xl,
    maxWidth: '500px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'hidden',
  },
  modalHeader: {
    padding: spacing[4],
    borderBottom: `1px solid ${colors.border.primary}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    margin: 0,
  },
  closeBtn: {
    padding: spacing[2],
    backgroundColor: 'transparent',
    border: 'none',
    color: colors.text.secondary,
    cursor: 'pointer',
    borderRadius: borderRadius.base,
    '&:hover': {
      backgroundColor: colors.background.secondary,
      color: colors.text.primary,
    },
  },
  logForm: {
    padding: spacing[4],
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[4],
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
  timeInputGroup: {
    display: 'flex',
    gap: spacing[2],
  },
  timeInput: {
    flex: 1,
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
  timeUnitSelect: {
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
}

export default TimeTracking 