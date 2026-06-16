import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'

import { authStart, authSuccess, authFailure, logout, clearError, } from '../features/auth/authSlice'

import { loginAPI, registerAPI, logoutAPI } from '../features/auth/authAPI'

const useAuth = () => {
  const dispatch = useDispatch()

  const { user, isAuthenticated, loading, error, } = useSelector((state) => state.auth)

  const handleAuth = useCallback(
    async (apiCall, payload, errorMessage) => {
      dispatch(authStart())

      try {
        const data = await apiCall(payload)

        dispatch(authSuccess(data.data))
        return data
      } catch (err) {
        dispatch(
         authFailure(err.response?.data?.message || err.message || errorMessage)
        )
        throw err
      }
    },
    [dispatch]
  )

  const login = useCallback( (credentials) => handleAuth(loginAPI, credentials, 'Login failed'),
    [handleAuth]
  )

  const register = useCallback(
    (userData) =>
      handleAuth(
        registerAPI,
        userData,
        'Registration failed'
      ),
    [handleAuth]
  )

  const handleLogout = useCallback(async () => {
    try {
      await logoutAPI()
    } catch (error) {
      console.error(error)
    } finally {
      dispatch(logout())
    }
  }, [dispatch])

  const resetError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  return {
    user,
    isAuthenticated,
    loading,
    error,

    login,
    register,
    handleLogout,
    resetError,
  }
}

export default useAuth