import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { assignIssue, unassignIssue } from '../../store/slices/issuesSlice'
import { fetchUsers } from '../../store/slices/usersSlice'
import { colors, typography, spacing, shadows, borderRadius } from '../../styles/theme'

const QuickAssignmentModal = ({ issue, isOpen, onClose }) => {
  const dispatch = useDispatch()
  const { users, loading: usersLoading } = useSelector((state) => state.users)
  const { loading: issuesLoading } = useSelector((state) => state.issues)
  const [selectedUserId, setSelectedUserId] = useState(issue?.assignee?.id || '')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (isOpen && (!users || users.length === 0)) {
      dispatch(fetchUsers())
    }
  }, [dispatch, isOpen, users])

  useEffect(() => {
    setSelectedUserId(issue?.assignee?.id || '')
  }, [issue])

  const filteredUsers = users?.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const handleAssign = async (userId) => {
    try {
      if (userId) {
        await dispatch(assignIssue({ issueId: issue.id, assigneeId: userId })).unwrap()
      } else {
        await dispatch(unassignIssue(issue.id)).unwrap()
      }
      onClose()
    } catch (error) {
      console.error('Failed to update assignment:', error)
    }
  }

  const getUserAvatar = (user) => {
    if (!user) return '?'
    return user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?'
  }

  if (!isOpen) return null

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h3 style={styles.title}>Assign Issue</h3>
          <button onClick={onClose} style={styles.closeBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        <div style={styles.content}>
          <div style={styles.issueInfo}>
            <div style={styles.issueKey}>{issue?.issueKey}</div>
            <h4 style={styles.issueSummary}>{issue?.summary}</h4>
          </div>

          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.usersList}>
            {/* Unassign option */}
            <div
              style={{
                ...styles.userItem,
                ...(selectedUserId === '' && styles.userItemSelected)
              }}
              onClick={() => setSelectedUserId('')}
            >
              <div style={styles.userAvatar}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={styles.userInfo}>
                <div style={styles.userName}>Unassigned</div>
                <div style={styles.userEmail}>Remove current assignment</div>
              </div>
              {selectedUserId === '' && (
                <div style={styles.selectedIndicator}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>

            {usersLoading ? (
              <div style={styles.loadingContainer}>
                <div style={styles.spinner}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke={colors.primary[200]} strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="12" r="10" stroke={colors.primary[500]} strokeWidth="2" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="31.416">
                      <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                      <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                    </circle>
                  </svg>
                </div>
                <span>Loading users...</span>
              </div>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  style={{
                    ...styles.userItem,
                    ...(selectedUserId === user.id && styles.userItemSelected)
                  }}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  <div style={styles.userAvatar}>
                    {getUserAvatar(user)}
                  </div>
                  <div style={styles.userInfo}>
                    <div style={styles.userName}>{user.name}</div>
                    <div style={styles.userEmail}>{user.email}</div>
                  </div>
                  {selectedUserId === user.id && (
                    <div style={styles.selectedIndicator}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div style={styles.noResults}>
                <p>No users found</p>
              </div>
            )}
          </div>
        </div>

        <div style={styles.footer}>
          <button
            onClick={onClose}
            style={styles.cancelBtn}
            disabled={issuesLoading}
          >
            Cancel
          </button>
          <button
            onClick={() => handleAssign(selectedUserId || null)}
            style={styles.assignBtn}
            disabled={issuesLoading || selectedUserId === (issue?.assignee?.id || '')}
          >
            {issuesLoading ? (
              <div style={styles.buttonSpinner}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="31.416">
                    <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                    <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                  </circle>
                </svg>
              </div>
            ) : (
              'Assign'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
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
    width: '90%',
    maxWidth: '500px',
    maxHeight: '80vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: spacing[4],
    borderBottom: `1px solid ${colors.border.primary}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
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
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.background.secondary,
      color: colors.text.primary,
    },
  },
  content: {
    flex: 1,
    padding: spacing[4],
    overflowY: 'auto',
  },
  issueInfo: {
    marginBottom: spacing[4],
    padding: spacing[3],
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.base,
  },
  issueKey: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary[500],
    marginBottom: spacing[1],
  },
  issueSummary: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    margin: 0,
    lineHeight: typography.lineHeight.normal,
  },
  searchContainer: {
    marginBottom: spacing[4],
  },
  searchInput: {
    width: '100%',
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
  usersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[1],
  },
  userItem: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[3],
    borderRadius: borderRadius.base,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    border: '1px solid transparent',
    '&:hover': {
      backgroundColor: colors.background.secondary,
    },
  },
  userItemSelected: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[200],
  },
  userAvatar: {
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
    flexShrink: 0,
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  userEmail: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  selectedIndicator: {
    color: colors.primary[500],
    flexShrink: 0,
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    padding: spacing[4],
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  spinner: {
    color: colors.primary[500],
  },
  noResults: {
    textAlign: 'center',
    padding: spacing[4],
    color: colors.text.secondary,
  },
  footer: {
    padding: spacing[4],
    borderTop: `1px solid ${colors.border.primary}`,
    display: 'flex',
    gap: spacing[3],
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    padding: `${spacing[2]} ${spacing[4]}`,
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
  assignBtn: {
    padding: `${spacing[2]} ${spacing[4]}`,
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
  buttonSpinner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}

export default QuickAssignmentModal
