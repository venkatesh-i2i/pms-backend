import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAttachments, uploadAttachment } from '../../store/slices/tasksSlice'
import { colors, typography, spacing, shadows, borderRadius } from '../../styles/theme'

const FileAttachments = ({ projectId, taskId, title = "Attachments" }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { attachments: files, loading } = useSelector((state) => state.tasks)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (taskId) {
      dispatch(fetchAttachments(taskId))
    }
    // If project-level files are needed, add a new thunk in a files slice and call it here
  }, [projectId, taskId, dispatch])

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files)
    if (selectedFiles.length > 0) {
      uploadFiles(selectedFiles)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    if (droppedFiles.length > 0) {
      uploadFiles(droppedFiles)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const uploadFiles = async (fileList) => {
    setUploading(true)
    try {
      for (const file of fileList) {
        await dispatch(uploadAttachment({ taskId: parseInt(taskId), file })).unwrap()
      }
    } catch (error) {
      console.error('Failed to upload files:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteFile = async (fileId) => {
    if (!confirm('Are you sure you want to delete this file?')) return
    // TODO: implement delete file thunk when backend endpoint is ready: DELETE /api/files/{id}
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
          <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
          <polyline points="21,15 16,10 5,21" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    } else if (fileType === 'application/pdf') {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="currentColor"/>
        </svg>
      )
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="currentColor"/>
          <path d="M8,12H16V14H8V12M8,16H13V18H8V16Z" fill="white"/>
        </svg>
      )
    } else if (fileType.includes('sheet') || fileType.includes('excel')) {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="currentColor"/>
          <path d="M8,12H16V14H8V12M8,16H16V18H8V16Z" fill="white"/>
        </svg>
      )
    } else {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="currentColor"/>
        </svg>
      )
    }
  }

  const canDeleteFile = (file) => {
    return user && file.uploadedBy.id === user.id
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
          <p style={styles.loadingText}>Loading files...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>
          {title} ({files.length})
        </h3>
      </div>

      {/* Upload Area */}
      <div
        style={{
          ...styles.uploadArea,
          ...(dragOver && styles.uploadAreaDragOver)
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <div style={styles.uploadContent}>
          {uploading ? (
            <>
              <div style={styles.uploadSpinner}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="31.416">
                    <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                    <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                  </circle>
                </svg>
              </div>
              <p style={styles.uploadText}>Uploading files...</p>
            </>
          ) : (
            <>
              <div style={styles.uploadIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p style={styles.uploadText}>
                Drop files here or <span style={styles.uploadLink}>click to browse</span>
              </p>
              <p style={styles.uploadHint}>
                Supports: PDF, DOC, DOCX, XLS, XLSX, PNG, JPG, ZIP and more
              </p>
            </>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        style={styles.hiddenInput}
        disabled={uploading}
      />

      {/* Files List */}
      <div style={styles.filesList}>
        {files.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="13,2 13,9 20,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h4 style={styles.emptyTitle}>No files attached</h4>
            <p style={styles.emptyDescription}>
              Upload files to share documents, images, or other resources with your team.
            </p>
          </div>
        ) : (
          files.map((file) => (
            <div key={file.id} style={styles.fileItem}>
              <div style={styles.fileInfo}>
                <div style={styles.fileIcon}>
                  {getFileIcon(file.fileType)}
                </div>
                <div style={styles.fileDetails}>
                  <h4 style={styles.fileName}>{file.originalFilename}</h4>
                  <div style={styles.fileMetadata}>
                    <span style={styles.fileSize}>{formatFileSize(file.fileSize)}</span>
                    <span style={styles.fileSeparator}>•</span>
                    <span style={styles.fileUploader}>
                      Uploaded by {file.uploadedBy.name}
                    </span>
                    <span style={styles.fileSeparator}>•</span>
                    <span style={styles.fileDate}>
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div style={styles.fileActions}>
                <button
                  onClick={() => window.open(file.downloadUrl, '_blank')}
                  style={styles.actionButton}
                  title="Download file"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {canDeleteFile(file) && (
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    style={styles.deleteButton}
                    title="Delete file"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))
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
  uploadArea: {
    margin: spacing[5],
    padding: spacing[6],
    border: `2px dashed ${colors.border.primary}`,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.secondary,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      borderColor: colors.primary[300],
      backgroundColor: colors.primary[25],
    },
  },
  uploadAreaDragOver: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  uploadContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  uploadIcon: {
    marginBottom: spacing[3],
    color: colors.text.secondary,
  },
  uploadSpinner: {
    marginBottom: spacing[3],
    color: colors.primary[500],
  },
  uploadText: {
    margin: `0 0 ${spacing[2]} 0`,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
  uploadLink: {
    color: colors.primary[500],
    textDecoration: 'underline',
  },
  uploadHint: {
    margin: 0,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  hiddenInput: {
    display: 'none',
  },
  filesList: {
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
  fileItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[4],
    marginBottom: spacing[3],
    backgroundColor: colors.background.secondary,
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.base,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.background.primary,
      boxShadow: shadows.sm,
    },
    '&:last-child': {
      marginBottom: 0,
    },
  },
  fileInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    flex: 1,
  },
  fileIcon: {
    color: colors.primary[500],
    flexShrink: 0,
  },
  fileDetails: {
    flex: 1,
    minWidth: 0, // Allow truncation
  },
  fileName: {
    margin: `0 0 ${spacing[1]} 0`,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  fileMetadata: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  fileSize: {
    fontWeight: typography.fontWeight.medium,
  },
  fileSeparator: {
    color: colors.text.tertiary,
  },
  fileUploader: {},
  fileDate: {},
  fileActions: {
    display: 'flex',
    gap: spacing[1],
    flexShrink: 0,
  },
  actionButton: {
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
  deleteButton: {
    padding: spacing[2],
    backgroundColor: 'transparent',
    border: 'none',
    color: colors.text.secondary,
    cursor: 'pointer',
    borderRadius: borderRadius.base,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.danger[50],
      color: colors.danger[500],
    },
  },
}

export default FileAttachments
