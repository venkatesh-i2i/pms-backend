import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchComments, addComment } from '../../store/slices/tasksSlice'
import { colors, typography, spacing, shadows, borderRadius } from '../../styles/theme'

const TaskComments = ({ taskId }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { comments, loading } = useSelector((state) => state.tasks)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editingContent, setEditingContent] = useState('')

  useEffect(() => {
    dispatch(fetchComments(taskId))
  }, [taskId, dispatch])

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const comment = {
        content: newComment.trim()
      }
      await dispatch(addComment({ taskId: parseInt(taskId), comment })).unwrap()
      setNewComment('')
      // Refresh the thread to ensure consistency with backend and stay on the same view
      dispatch(fetchComments(taskId))
    } catch (error) {
      console.error('Failed to create comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id)
    setEditingContent(comment.content)
  }

  const handleSaveEdit = async (commentId) => {
    if (!editingContent.trim()) return

    try {
      const updatedComment = await mockAPI.comments.update(commentId, editingContent.trim())
      setComments(prev => prev.map(c => c.id === commentId ? updatedComment : c))
      setEditingCommentId(null)
      setEditingContent('')
    } catch (error) {
      console.error('Failed to update comment:', error)
    }
  }

  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditingContent('')
  }

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      await mockAPI.comments.delete(commentId)
      setComments(prev => prev.filter(c => c.id !== commentId))
    } catch (error) {
      console.error('Failed to delete comment:', error)
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

  const canEditComment = (comment) => {
    const authorId = comment?.author?.id
    return Boolean(user && authorId && authorId === user.id)
  }

  const resolveAuthor = (comment) => {
    if (comment?.author && (comment.author.name || comment.author.id)) return comment.author
    if (user) return { id: user.id, name: user.name || user.username || 'You' }
    return { id: null, name: 'User' }
  }

  if (loading) {
    return (
      <div style={styles.container}>
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
          <p style={styles.loadingText}>Loading comments...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>
          Comments ({comments.length})
        </h3>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmitComment} style={styles.commentForm}>
        <div style={styles.commentInputSection}>
          <div style={styles.userAvatar}>
            {user?.avatar || user?.name?.charAt(0) || 'U'}
          </div>
          <div style={styles.inputWrapper}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows={3}
              style={styles.commentInput}
              disabled={isSubmitting}
            />
            <div style={styles.inputActions}>
              <div style={styles.inputHint}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 6v6" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 18h.01" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Use @ to mention team members
              </div>
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmitting}
                style={styles.submitButton}
              >
                {isSubmitting ? (
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
                  'Comment'
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div style={styles.commentsList}>
        {comments.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h4 style={styles.emptyTitle}>No comments yet</h4>
            <p style={styles.emptyDescription}>
              Be the first to comment on this task. Share updates, ask questions, or provide feedback.
            </p>
          </div>
        ) : (
          comments.map((comment) => {
            const author = resolveAuthor(comment)
            const authorInitial = (author?.avatar ? '' : (author?.name?.charAt(0) || 'U'))
            return (
            <div key={comment.id} style={styles.commentItem}>
              <div style={styles.commentHeader}>
                <div style={styles.commentAuthor}>
                  <div style={styles.authorAvatar}>
                    {author?.avatar || authorInitial}
                  </div>
                  <div style={styles.authorInfo}>
                    <span style={styles.authorName}>{author?.name || 'User'}</span>
                    <span style={styles.commentTime}>{formatRelativeTime(comment.createdAt)}</span>
                  </div>
                </div>
                {canEditComment(comment) && (
                  <div style={styles.commentActions}>
                    <button
                      onClick={() => handleEditComment(comment)}
                      style={styles.actionButton}
                      title="Edit comment"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      style={styles.actionButton}
                      title="Delete comment"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              
              <div style={styles.commentContent}>
                {editingCommentId === comment.id ? (
                  <div style={styles.editForm}>
                    <textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      style={styles.editInput}
                      rows={3}
                      autoFocus
                    />
                    <div style={styles.editActions}>
                      <button
                        onClick={handleCancelEdit}
                        style={styles.cancelButton}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(comment.id)}
                        style={styles.saveButton}
                        disabled={!editingContent.trim()}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p style={styles.commentText}>{comment.content}</p>
                )}
              </div>
              
              {comment.updatedAt !== comment.createdAt && editingCommentId !== comment.id && (
                <div style={styles.editedIndicator}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Edited
                </div>
              )}
            </div>
          )})
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    border: `1px solid ${colors.border.primary}`,
    overflow: 'hidden',
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
  header: {
    padding: `${spacing[4]} ${spacing[5]}`,
    borderBottom: `1px solid ${colors.border.primary}`,
    backgroundColor: colors.background.secondary,
  },
  title: {
    margin: 0,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  commentForm: {
    padding: spacing[5],
    borderBottom: `1px solid ${colors.border.primary}`,
  },
  commentInputSection: {
    display: 'flex',
    gap: spacing[3],
    alignItems: 'flex-start',
  },
  userAvatar: {
    width: '36px',
    height: '36px',
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
  inputWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[3],
  },
  commentInput: {
    width: '100%',
    padding: spacing[3],
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.normal,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.base,
    resize: 'vertical',
    minHeight: '80px',
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
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
  },
  inputActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputHint: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
  submitButton: {
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
  buttonSpinner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentsList: {
    padding: spacing[5],
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
    maxWidth: '400px',
    lineHeight: typography.lineHeight.relaxed,
  },
  commentItem: {
    padding: `${spacing[4]} 0`,
    borderBottom: `1px solid ${colors.border.primary}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  commentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[3],
  },
  commentAuthor: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
  },
  authorAvatar: {
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
  commentTime: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  commentActions: {
    display: 'flex',
    gap: spacing[1],
  },
  actionButton: {
    padding: spacing[2],
    backgroundColor: 'transparent',
    border: 'none',
    color: colors.text.tertiary,
    cursor: 'pointer',
    borderRadius: borderRadius.base,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.background.secondary,
      color: colors.text.secondary,
    },
  },
  commentContent: {
    marginLeft: '44px', // Account for avatar + gap
  },
  commentText: {
    margin: 0,
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.relaxed,
    color: colors.text.primary,
    whiteSpace: 'pre-wrap',
  },
  editForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[3],
  },
  editInput: {
    width: '100%',
    padding: spacing[3],
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.normal,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.base,
    resize: 'vertical',
    minHeight: '80px',
    transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    outline: 'none',
    fontFamily: 'inherit',
    '&:focus': {
      borderColor: colors.border.focus,
      boxShadow: `0 0 0 1px ${colors.border.focus}`,
    },
  },
  editActions: {
    display: 'flex',
    gap: spacing[2],
    justifyContent: 'flex-end',
  },
  cancelButton: {
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
  saveButton: {
    padding: `${spacing[2]} ${spacing[3]}`,
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
  editedIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
    marginLeft: '44px',
    marginTop: spacing[2],
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
}

export default TaskComments
