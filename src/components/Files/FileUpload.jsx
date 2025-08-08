import React, { useState, useRef } from 'react'
import api from '../../services/api'

const FileUpload = ({ 
  projectId, 
  taskId = null, 
  onUploadSuccess, 
  onUploadError,
  className = '',
  showFileList = true 
}) => {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [files, setFiles] = useState([])
  const fileInputRef = useRef(null)

  const handleFileSelect = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles)
    uploadFiles(fileArray)
  }

  const uploadFiles = async (filesToUpload) => {
    setUploading(true)
    
    try {
      const uploadedFiles = []
      
      for (const file of filesToUpload) {
        const formData = new FormData()
        formData.append('file', file)
        
        let uploadUrl
        if (taskId) {
          uploadUrl = `/api/issues/${taskId}/files`
        } else {
          uploadUrl = `/api/projects/${projectId}/files`
        }
        
        const response = await api.post(uploadUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        
        uploadedFiles.push(response.data)
      }
      
      setFiles(prev => [...prev, ...uploadedFiles])
      
      if (onUploadSuccess) {
        onUploadSuccess(uploadedFiles)
      }
      
    } catch (error) {
      console.error('File upload failed:', error)
      if (onUploadError) {
        onUploadError(error)
      }
    } finally {
      setUploading(false)
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

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles)
    }
  }

  const handleFileInputChange = (e) => {
    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files)
    }
  }

  const handleDeleteFile = async (fileId) => {
    try {
      await api.delete(`/api/files/${fileId}`)
      setFiles(prev => prev.filter(file => file.id !== fileId))
    } catch (error) {
      console.error('File deletion failed:', error)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`file-upload-container ${className}`}>
      {/* Upload Area */}
      <div
        className={`file-upload-area ${dragOver ? 'drag-over' : ''} ${uploading ? 'uploading' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? '#007bff' : '#ccc'}`,
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center',
          cursor: uploading ? 'not-allowed' : 'pointer',
          backgroundColor: dragOver ? '#f8f9fa' : '#fff',
          transition: 'all 0.3s ease',
          marginBottom: showFileList ? '16px' : '0'
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          multiple
          style={{ display: 'none' }}
          disabled={uploading}
        />
        
        {uploading ? (
          <div>
            <div className="spinner" style={{
              width: '20px',
              height: '20px',
              border: '2px solid #f3f3f3',
              borderTop: '2px solid #007bff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 8px'
            }} />
            <p>Uploading files...</p>
          </div>
        ) : (
          <div>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="#6c757d" style={{ marginBottom: '8px' }}>
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
            <p style={{ margin: '0', color: '#6c757d' }}>
              Drag and drop files here or click to browse
            </p>
            <small style={{ color: '#6c757d' }}>
              Supports all file types
            </small>
          </div>
        )}
      </div>

      {/* File List */}
      {showFileList && files.length > 0 && (
        <div className="uploaded-files-list">
          <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>
            Uploaded Files ({files.length})
          </h4>
          <div className="files-grid" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {files.map((file) => (
              <div
                key={file.id}
                className="file-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  border: '1px solid #e9ecef',
                  borderRadius: '6px',
                  backgroundColor: '#f8f9fa'
                }}
              >
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#6c757d">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '500', fontSize: '13px', color: '#212529' }}>
                      {file.originalFilename}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6c757d' }}>
                      {formatFileSize(file.fileSize)} • {new Date(file.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '4px' }}>
                  <a
                    href={`${api.defaults.baseURL}${file.downloadUrl}`}
                    download={file.originalFilename}
                    style={{
                      padding: '4px 8px',
                      fontSize: '11px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Download
                  </a>
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    style={{
                      padding: '4px 8px',
                      fontSize: '11px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .file-upload-area:hover {
          border-color: #007bff !important;
          background-color: #f8f9fa !important;
        }
        
        .file-item:hover {
          background-color: #e9ecef !important;
        }
      `}</style>
    </div>
  )
}

export default FileUpload

