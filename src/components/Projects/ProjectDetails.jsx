import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProjectById, updateProject, addMemberToProject, removeMemberFromProject } from '../../store/slices/projectsSlice'
import { fetchUsers } from '../../store/slices/usersSlice'
import { colors, typography, spacing, shadows, borderRadius } from '../../styles/theme'

const ProjectDetails = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentProject, loading } = useSelector((state) => state.projects)
  const { users } = useSelector((state) => state.users || { users: [] })
  const { user: currentUser } = useSelector((state) => state.auth)

  const [isEditing, setIsEditing] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [selectedUser, setSelectedUser] = useState('')
  const [editData, setEditData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    projectLeadId: ''
  })

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectById(projectId))
      dispatch(fetchUsers())
    }
  }, [projectId, dispatch])

  useEffect(() => {
    if (currentProject) {
      setEditData({
        name: currentProject.name || '',
        description: currentProject.description || '',
        startDate: currentProject.startDate || '',
        endDate: currentProject.endDate || '',
        projectLeadId: currentProject.projectLead?.id || ''
      })
    }
  }, [currentProject])



  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditData({
      name: currentProject.name || '',
      description: currentProject.description || '',
      startDate: currentProject.startDate || '',
      endDate: currentProject.endDate || '',
      projectLeadId: currentProject.projectLead?.id || ''
    })
  }

  const handleSaveEdit = async () => {
    try {
      await dispatch(updateProject({
        id: projectId,
        projectData: {
          ...editData,
          projectLeadId: parseInt(editData.projectLeadId)
        }
      })).unwrap()
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update project:', error)
    }
  }

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddMember = async () => {
    if (!selectedUser) return

    try {
      await dispatch(addMemberToProject({
        projectId: parseInt(projectId),
        userId: parseInt(selectedUser)
      })).unwrap()
      setSelectedUser('')
      setShowAddMember(false)
    } catch (error) {
      console.error('Failed to add member:', error)
    }
  }

  const handleRemoveMember = async (userId) => {
    try {
      await dispatch(removeMemberFromProject({
        projectId: parseInt(projectId),
        userId: userId
      })).unwrap()
    } catch (error) {
      console.error('Failed to remove member:', error)
    }
  }

  const getAvailableUsers = () => {
    if (!users || !currentProject) return []
    const memberIds = currentProject.members?.map(m => m.id) || []
    return users.filter(user => !memberIds.includes(user.id))
  }

  const canEditProject = () => {
    if (!currentUser) return false
    return currentUser.role === 'ADMIN' || 
           currentUser.role === 'PROJECT_MANAGER' || 
           currentProject?.projectLead?.id === currentUser.id
  }

  if (loading || !currentProject) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading project details...</div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.backButton} onClick={() => navigate('/projects')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Projects
          </button>
          <div style={styles.projectTitle}>
            <span style={styles.projectKey}>{currentProject.projectKey}</span>
            <h1 style={styles.projectName}>{currentProject.name}</h1>
          </div>
        </div>
        <div style={styles.headerActions}>
          <button 
            style={styles.primaryButton}
            onClick={() => navigate(`/projects/${projectId}/board`)}
          >
            Manage Tasks
          </button>
          {canEditProject() && (
            <button 
              style={isEditing ? styles.saveButton : styles.editButton}
              onClick={isEditing ? handleSaveEdit : handleEdit}
            >
              {isEditing ? 'Save Changes' : 'Edit Project'}
            </button>
          )}
          {isEditing && (
            <button style={styles.cancelButton} onClick={handleCancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </div>

      <div style={styles.content}>
        {/* Project Info Card */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Project Information</h2>
          <div style={styles.cardContent}>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <label style={styles.label}>Project Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    style={styles.input}
                  />
                ) : (
                  <span style={styles.value}>{currentProject.name}</span>
                )}
              </div>

              <div style={styles.infoItem}>
                <label style={styles.label}>Description</label>
                {isEditing ? (
                  <textarea
                    value={editData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    style={styles.textarea}
                    rows="3"
                  />
                ) : (
                  <span style={styles.value}>{currentProject.description || 'No description provided'}</span>
                )}
              </div>

              <div style={styles.infoItem}>
                <label style={styles.label}>Project Type</label>
                <span style={styles.value}>{currentProject.projectType}</span>
              </div>

              <div style={styles.infoItem}>
                <label style={styles.label}>Category</label>
                <span style={styles.value}>{currentProject.projectCategory}</span>
              </div>

              <div style={styles.infoItem}>
                <label style={styles.label}>Start Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    style={styles.input}
                  />
                ) : (
                  <span style={styles.value}>{currentProject.startDate || 'Not set'}</span>
                )}
              </div>

              <div style={styles.infoItem}>
                <label style={styles.label}>End Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    style={styles.input}
                  />
                ) : (
                  <span style={styles.value}>{currentProject.endDate || 'Not set'}</span>
                )}
              </div>

              <div style={styles.infoItem}>
                <label style={styles.label}>Project Lead</label>
                {isEditing ? (
                  <select
                    value={editData.projectLeadId}
                    onChange={(e) => handleInputChange('projectLeadId', e.target.value)}
                    style={styles.select}
                  >
                    <option value="">Select a lead</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </select>
                ) : (
                  <span style={styles.value}>{currentProject.projectLead?.name || 'Unassigned'}</span>
                )}
              </div>

              <div style={styles.infoItem}>
                <label style={styles.label}>Status</label>
                <span style={{...styles.value, ...styles.statusBadge}}>
                  {currentProject.status || 'ACTIVE'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Project Stats */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Project Statistics</h2>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{currentProject.issueCount || 0}</div>
              <div style={styles.statLabel}>Total Tasks</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{currentProject.completedIssueCount || 0}</div>
              <div style={styles.statLabel}>Completed</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{currentProject.progress || 0}%</div>
              <div style={styles.statLabel}>Progress</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{currentProject.members?.length || 0}</div>
              <div style={styles.statLabel}>Team Members</div>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Team Members</h2>
            {canEditProject() && (
              <button 
                style={styles.addButton}
                onClick={() => setShowAddMember(true)}
              >
                Add Member
              </button>
            )}
          </div>
          <div style={styles.cardContent}>
            {currentProject.members && currentProject.members.length > 0 ? (
              <div style={styles.membersGrid}>
                {currentProject.members.map(member => (
                  <div key={member.id} style={styles.memberCard}>
                    <div style={styles.memberInfo}>
                      <div style={styles.avatar}>{member.avatar || member.name?.substring(0, 2)}</div>
                      <div>
                        <div style={styles.memberName}>{member.name}</div>
                        <div style={styles.memberRole}>{member.role}</div>
                        <div style={styles.memberEmail}>{member.email}</div>
                      </div>
                    </div>
                    {canEditProject() && member.id !== currentProject.projectLead?.id && (
                      <button 
                        style={styles.removeButton}
                        onClick={() => handleRemoveMember(member.id)}
                        title="Remove from project"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <p>No team members assigned to this project.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Add Team Member</h3>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              style={styles.select}
            >
              <option value="">Select a user</option>
              {getAvailableUsers().map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
            <div style={styles.modalActions}>
              <button style={styles.cancelButton} onClick={() => setShowAddMember(false)}>
                Cancel
              </button>
              <button 
                style={styles.primaryButton} 
                onClick={handleAddMember}
                disabled={!selectedUser}
              >
                Add Member
              </button>
            </div>
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
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
    fontSize: typography.fontSize.lg,
    color: colors.text.secondary,
  },
  header: {
    backgroundColor: colors.background.primary,
    padding: spacing[6],
    borderBottom: `1px solid ${colors.border.primary}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[4],
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    padding: `${spacing[2]} ${spacing[3]}`,
    backgroundColor: 'transparent',
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.md,
    color: colors.text.secondary,
    cursor: 'pointer',
    fontSize: typography.fontSize.sm,
  },
  projectTitle: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[1],
  },
  projectKey: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  projectName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    margin: 0,
  },
  headerActions: {
    display: 'flex',
    gap: spacing[3],
  },
  primaryButton: {
    padding: `${spacing[2]} ${spacing[4]}`,
    backgroundColor: colors.primary.main,
    color: colors.background.primary,
    border: 'none',
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  editButton: {
    padding: `${spacing[2]} ${spacing[4]}`,
    backgroundColor: colors.warning.main,
    color: colors.background.primary,
    border: 'none',
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  saveButton: {
    padding: `${spacing[2]} ${spacing[4]}`,
    backgroundColor: colors.success.main,
    color: colors.background.primary,
    border: 'none',
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  cancelButton: {
    padding: `${spacing[2]} ${spacing[4]}`,
    backgroundColor: colors.border.primary,
    color: colors.text.secondary,
    border: 'none',
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontSize: typography.fontSize.sm,
  },
  content: {
    padding: spacing[6],
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[6],
  },
  card: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.sm,
    border: `1px solid ${colors.border.primary}`,
  },
  cardHeader: {
    padding: spacing[4],
    borderBottom: `1px solid ${colors.border.primary}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    margin: 0,
    padding: spacing[4],
  },
  cardContent: {
    padding: spacing[4],
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: spacing[4],
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[1],
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.secondary,
  },
  value: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
  },
  input: {
    padding: spacing[2],
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.md,
    fontSize: typography.fontSize.md,
  },
  textarea: {
    padding: spacing[2],
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.md,
    fontSize: typography.fontSize.md,
    resize: 'vertical',
  },
  select: {
    padding: spacing[2],
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.md,
    fontSize: typography.fontSize.md,
    backgroundColor: colors.background.primary,
  },
  statusBadge: {
    padding: `${spacing[1]} ${spacing[2]}`,
    backgroundColor: colors.success.light,
    color: colors.success.dark,
    borderRadius: borderRadius.md,
    fontSize: typography.fontSize.sm,
    display: 'inline-block',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: spacing[4],
    padding: spacing[4],
  },
  statCard: {
    textAlign: 'center',
    padding: spacing[4],
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
  },
  statNumber: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.main,
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing[1],
  },
  addButton: {
    padding: `${spacing[2]} ${spacing[3]}`,
    backgroundColor: colors.success.main,
    color: colors.background.primary,
    border: 'none',
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontSize: typography.fontSize.sm,
  },
  membersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: spacing[3],
  },
  memberCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[3],
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    border: `1px solid ${colors.border.primary}`,
  },
  memberInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: colors.primary.main,
    color: colors.background.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  memberName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  memberRole: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  memberEmail: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  removeButton: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: colors.danger.main,
    color: colors.background.primary,
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  emptyState: {
    textAlign: 'center',
    padding: spacing[6],
    color: colors.text.secondary,
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: colors.background.primary,
    padding: spacing[6],
    borderRadius: borderRadius.lg,
    minWidth: '400px',
    maxWidth: '500px',
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing[4],
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: spacing[3],
    marginTop: spacing[4],
  },
}

export default ProjectDetails
