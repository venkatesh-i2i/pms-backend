import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers, fetchRoles, createUser, updateUser, deleteUser, assignRoleToUser, removeRoleFromUser } from '../../store/slices/usersSlice'
import UserForm from './UserForm'

const UserManagement = () => {
  const dispatch = useDispatch()
  const { users, roles, loading, error } = useSelector((state) => state.users)
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    dispatch(fetchUsers())
    dispatch(fetchRoles())
  }, [dispatch])

  const handleCreateUser = async (userData) => {
    const result = await dispatch(createUser(userData))
    if (!result.error) {
      setShowForm(false)
    }
  }

  const handleUpdateUser = async (userData) => {
    const result = await dispatch(updateUser({ id: editingUser.id, userData }))
    if (!result.error) {
      setShowForm(false)
      setEditingUser(null)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await dispatch(deleteUser(userId))
    }
  }

  const handleAssignRole = async (userId, roleId) => {
    await dispatch(assignRoleToUser({ userId, roleId }))
  }

  const handleRemoveRole = async (userId, roleId) => {
    await dispatch(removeRoleFromUser({ userId, roleId }))
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setShowForm(true)
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading users...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>Error: {error}</div>
      </div>
    )
  }

  // Helpers to normalize role shapes
  const getUserRoleNames = (u) => {
    if (!u) return []
    if (Array.isArray(u.roles)) {
      return u.roles.map((r) => (typeof r === 'string' ? r : r?.name)).filter(Boolean)
    }
    if (typeof u.role === 'string') return [u.role]
    return []
  }

  const findRoleByName = (name) => roles?.find((r) => r?.name === name)

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>User Management</h1>
        <button 
          onClick={() => setShowForm(true)} 
          style={styles.createBtn}
        >
          Create New User
        </button>
      </div>

      {showForm && (
        <UserForm
          user={editingUser}
          onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
          onCancel={() => {
            setShowForm(false)
            setEditingUser(null)
          }}
        />
      )}

      <div style={styles.usersGrid}>
        {users.map((user) => (
          <div key={user.id} style={styles.userCard}>
            <div style={styles.userHeader}>
              <h3 style={styles.userName}>{user.name}</h3>
              <span style={styles.userStatus(user.isActive)}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <p style={styles.userEmail}>{user.email}</p>
            <p style={styles.userUsername}>@{user.username}</p>
            
            <div style={styles.userRoles}>
              <h4 style={styles.rolesTitle}>Roles:</h4>
              {getUserRoleNames(user).length === 0 ? (
                <span style={styles.noRole}>No roles assigned</span>
              ) : (
                getUserRoleNames(user).map((roleName) => {
                  const roleObj = findRoleByName(roleName)
                  return (
                    <span key={roleName} style={styles.roleTag}>
                      {roleName}
                      <button
                        onClick={() => roleObj?.id && handleRemoveRole(user.id, roleObj.id)}
                        style={styles.removeRoleBtn}
                        disabled={!roleObj?.id}
                        title={roleObj?.id ? 'Remove role' : 'Role id not found'}
                      >
                        ×
                      </button>
                    </span>
                  )
                })
              )}
            </div>

            <div style={styles.roleAssignment}>
              <h4 style={styles.rolesTitle}>Assign Role:</h4>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAssignRole(user.id, parseInt(e.target.value))
                    e.target.value = ''
                  }
                }}
                style={styles.roleSelect}
              >
                <option value="">Select role...</option>
                {(roles || [])
                  .filter((role) => !getUserRoleNames(user).includes(role.name))
                  .map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
              </select>
            </div>

            <div style={styles.userActions}>
              <button
                onClick={() => handleEditUser(user)}
                style={styles.editBtn}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteUser(user.id)}
                style={styles.deleteBtn}
              >
                Delete
              </button>
            </div>

            <div style={styles.userMeta}>
              <span style={styles.userDate}>
                Created: {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    color: '#2c3e50',
    margin: 0,
  },
  createBtn: {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  usersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem',
  },
  userCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    border: '1px solid #eee',
  },
  userHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  userName: {
    fontSize: '1.25rem',
    color: '#2c3e50',
    margin: 0,
    flex: 1,
  },
  userStatus: (isActive) => ({
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '500',
    backgroundColor: isActive ? '#d4edda' : '#f8d7da',
    color: isActive ? '#155724' : '#721c24',
  }),
  userEmail: {
    color: '#666',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
  },
  userUsername: {
    color: '#999',
    marginBottom: '1rem',
    fontSize: '0.8rem',
  },
  userRoles: {
    marginBottom: '1rem',
  },
  rolesTitle: {
    fontSize: '0.9rem',
    color: '#2c3e50',
    margin: '0 0 0.5rem 0',
  },
  roleTag: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
    marginRight: '0.25rem',
    marginBottom: '0.25rem',
  },
  removeRoleBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#1976d2',
    marginLeft: '0.5rem',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  noRole: {
    color: '#999',
    fontSize: '0.8rem',
    fontStyle: 'italic',
  },
  roleAssignment: {
    marginBottom: '1rem',
  },
  roleSelect: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.9rem',
  },
  userActions: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  editBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    flex: 1,
  },
  deleteBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    flex: 1,
  },
  userMeta: {
    fontSize: '0.8rem',
    color: '#666',
  },
  userDate: {
    fontSize: '0.8rem',
    color: '#666',
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#666',
    padding: '2rem',
  },
  error: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#e74c3c',
    padding: '2rem',
  },
}

export default UserManagement 