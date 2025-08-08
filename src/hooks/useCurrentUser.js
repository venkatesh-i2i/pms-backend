import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getCurrentUser } from '../store/slices/authSlice'

const useCurrentUser = () => {
  const dispatch = useDispatch()
  const { user, loading, error, isAuthenticated } = useSelector((state) => state.auth)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated && !user) {
      setIsLoading(true)
      dispatch(getCurrentUser())
        .finally(() => setIsLoading(false))
    }
  }, [dispatch, isAuthenticated, user])

  const refreshUser = async () => {
    setIsLoading(true)
    try {
      await dispatch(getCurrentUser()).unwrap()
    } catch (error) {
      console.error('Failed to refresh user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user,
    loading: loading || isLoading,
    error,
    isAuthenticated,
    refreshUser
  }
}

export default useCurrentUser 