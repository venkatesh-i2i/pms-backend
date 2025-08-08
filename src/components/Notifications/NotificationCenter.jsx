import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import api from '../../services/api'
import { colors, typography, spacing, shadows, borderRadius } from '../../styles/theme'

const NotificationCenter = ({ isOpen, onClose }) => {
  const { user } = useSelector((state) => state.auth)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, unread, tasks, projects

  useEffect(() => {
    if (isOpen && user) {
      loadNotifications()
    }
  }, [isOpen, user])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/api/users/${user.id}/notifications`)
      setNotifications(res.data)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(`/api/notifications/${notificationId}/read`)
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      )
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.patch(`/api/users/${user.id}/notifications/read-all`)
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'TASK_ASSIGNED':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
            <path d="m17 11 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      case 'TASK_COMPLETED':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c.32 0 .63.02.94.06" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      case 'COMMENT_ADDED':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      case 'DUE_DATE_REMINDER':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      case 'MILESTONE_COMPLETED':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 6v6" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 18h.01" stroke="currentColor" strokeWidth="2"/>
          </svg>
        )
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'TASK_ASSIGNED': return colors.primary[500]
      case 'TASK_COMPLETED': return colors.success[500]
      case 'COMMENT_ADDED': return colors.info[500]
      case 'DUE_DATE_REMINDER': return colors.warning[500]
      case 'MILESTONE_COMPLETED': return colors.success[500]
      default: return colors.text.secondary
    }
  }

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.isRead
      case 'tasks':
        return ['TASK_ASSIGNED', 'TASK_COMPLETED', 'COMMENT_ADDED', 'DUE_DATE_REMINDER'].includes(notification.type)
      case 'projects':
        return ['MILESTONE_COMPLETED'].includes(notification.type)
      default:
        return true
    }
  })

  const unreadCount = notifications.filter(n => !n.isRead).length

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div style={styles.overlay} onClick={onClose} />
      
      {/* Notification Panel */}
      <div style={styles.panel}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h2 style={styles.title}>Notifications</h2>
            {unreadCount > 0 && (
              <span style={styles.unreadBadge}>{unreadCount}</span>
            )}
          </div>
          <div style={styles.headerActions}>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} style={styles.markAllReadBtn}>
                Mark all read
              </button>
            )}
            <button onClick={onClose} style={styles.closeBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={styles.filterTabs}>
          {[
            { id: 'all', label: 'All' },
            { id: 'unread', label: 'Unread' },
            { id: 'tasks', label: 'Tasks' },
            { id: 'projects', label: 'Projects' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              style={{
                ...styles.filterTab,
                ...(filter === tab.id && styles.activeFilterTab)
              }}
            >
              {tab.label}
              {tab.id === 'unread' && unreadCount > 0 && (
                <span style={styles.tabBadge}>{unreadCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div style={styles.notificationsList}>
          {loading ? (
            <div style={styles.loadingState}>
              <div style={styles.spinner}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="31.416">
                    <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                    <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                  </circle>
                </svg>
              </div>
              <p style={styles.loadingText}>Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 style={styles.emptyTitle}>
                {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
              </h3>
              <p style={styles.emptyDescription}>
                {filter === 'unread' 
                  ? "You're all caught up! Check back later for new updates."
                  : "You'll see notifications about task assignments, updates, and project milestones here."
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                style={{
                  ...styles.notificationItem,
                  ...(notification.isRead ? styles.readNotification : styles.unreadNotification)
                }}
                onClick={() => !notification.isRead && markAsRead(notification.id)}
              >
                <div style={styles.notificationIcon}>
                  <div style={{
                    ...styles.iconWrapper,
                    color: getNotificationColor(notification.type)
                  }}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  {!notification.isRead && <div style={styles.unreadDot} />}
                </div>
                
                <div style={styles.notificationContent}>
                  <h4 style={styles.notificationTitle}>{notification.title}</h4>
                  <p style={styles.notificationMessage}>{notification.message}</p>
                  <span style={styles.notificationTime}>
                    {formatRelativeTime(notification.createdAt)}
                  </span>
                </div>

                {(notification.relatedTaskId || notification.relatedProjectId) && (
                  <div style={styles.notificationActions}>
                    <button style={styles.viewButton}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {filteredNotifications.length > 0 && (
          <div style={styles.footer}>
            <button style={styles.viewAllBtn}>
              View all notifications
            </button>
          </div>
        )}
      </div>
    </>
  )
}

// Notification Bell Component for Navbar
export const NotificationBell = ({ onClick, notificationCount = 0 }) => {
  return (
    <button onClick={onClick} style={styles.bellButton}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {notificationCount > 0 && (
        <span style={styles.notificationBadge}>
          {notificationCount > 99 ? '99+' : notificationCount}
        </span>
      )}
    </button>
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
    zIndex: 998,
  },
  panel: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '400px',
    height: '100vh',
    backgroundColor: colors.background.primary,
    boxShadow: shadows.xl,
    zIndex: 999,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[4],
    borderBottom: `1px solid ${colors.border.primary}`,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
  },
  title: {
    margin: 0,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  unreadBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '20px',
    height: '20px',
    padding: `0 ${spacing[1]}`,
    backgroundColor: colors.danger[500],
    color: colors.text.inverse,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    borderRadius: borderRadius.full,
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
  },
  markAllReadBtn: {
    padding: `${spacing[1]} ${spacing[2]}`,
    fontSize: typography.fontSize.sm,
    color: colors.primary[500],
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: borderRadius.base,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.primary[50],
    },
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
  filterTabs: {
    display: 'flex',
    borderBottom: `1px solid ${colors.border.primary}`,
  },
  filterTab: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
    padding: `${spacing[3]} ${spacing[2]}`,
    backgroundColor: 'transparent',
    border: 'none',
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    borderBottom: `2px solid transparent`,
    '&:hover': {
      color: colors.text.primary,
      backgroundColor: colors.background.secondary,
    },
  },
  activeFilterTab: {
    color: colors.primary[500],
    borderBottomColor: colors.primary[500],
    backgroundColor: colors.primary[25],
  },
  tabBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '16px',
    height: '16px',
    padding: `0 ${spacing[1]}`,
    backgroundColor: colors.danger[500],
    color: colors.text.inverse,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    borderRadius: borderRadius.full,
  },
  notificationsList: {
    flex: 1,
    overflowY: 'auto',
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[8],
    color: colors.text.secondary,
  },
  spinner: {
    marginBottom: spacing[3],
    color: colors.primary[500],
  },
  loadingText: {
    margin: 0,
    fontSize: typography.fontSize.base,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[8],
    textAlign: 'center',
  },
  emptyIcon: {
    marginBottom: spacing[4],
    color: colors.text.tertiary,
  },
  emptyTitle: {
    margin: `0 0 ${spacing[2]} 0`,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.secondary,
  },
  emptyDescription: {
    margin: 0,
    fontSize: typography.fontSize.base,
    color: colors.text.tertiary,
    lineHeight: typography.lineHeight.relaxed,
  },
  notificationItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: spacing[3],
    padding: spacing[4],
    borderBottom: `1px solid ${colors.border.primary}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.background.secondary,
    },
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  readNotification: {
    opacity: 0.7,
  },
  unreadNotification: {
    backgroundColor: colors.primary[25],
  },
  notificationIcon: {
    position: 'relative',
    flexShrink: 0,
  },
  iconWrapper: {
    width: '40px',
    height: '40px',
    borderRadius: borderRadius.full,
    backgroundColor: 'currentColor',
    color: colors.primary[500],
    opacity: 0.1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '12px',
    height: '12px',
    backgroundColor: colors.danger[500],
    borderRadius: borderRadius.full,
    border: `2px solid ${colors.background.primary}`,
  },
  notificationContent: {
    flex: 1,
    minWidth: 0,
  },
  notificationTitle: {
    margin: `0 0 ${spacing[1]} 0`,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  notificationMessage: {
    margin: `0 0 ${spacing[2]} 0`,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.relaxed,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  notificationTime: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    fontWeight: typography.fontWeight.medium,
  },
  notificationActions: {
    flexShrink: 0,
  },
  viewButton: {
    padding: spacing[2],
    backgroundColor: 'transparent',
    border: 'none',
    color: colors.text.secondary,
    cursor: 'pointer',
    borderRadius: borderRadius.base,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.primary[50],
      color: colors.primary[500],
    },
  },
  footer: {
    padding: spacing[4],
    borderTop: `1px solid ${colors.border.primary}`,
  },
  viewAllBtn: {
    width: '100%',
    padding: `${spacing[3]} ${spacing[4]}`,
    backgroundColor: 'transparent',
    color: colors.primary[500],
    border: `1px solid ${colors.primary[200]}`,
    borderRadius: borderRadius.base,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.primary[50],
    },
  },
  bellButton: {
    position: 'relative',
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
  notificationBadge: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '18px',
    height: '18px',
    padding: `0 ${spacing[1]}`,
    backgroundColor: colors.danger[500],
    color: colors.text.inverse,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    borderRadius: borderRadius.full,
    border: `2px solid ${colors.background.primary}`,
  },
}

export default NotificationCenter
