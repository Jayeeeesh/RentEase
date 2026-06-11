import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    // Authentication request start
    authStart: (state) => {
      state.loading = true
      state.error = null
    },

    // Login / User fetch success
    authSuccess: (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.isAuthenticated = true
      state.error = null
      localStorage.setItem('accessToken', action.payload.accessToken)
    },

    // Authentication failed
    authFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
      state.isAuthenticated = false
    },

    // Logout
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
      localStorage.removeItem('accessToken')
    },

    // Clear error manually
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  authStart,
  authSuccess,
  authFailure,
  logout,
  clearError,
} = authSlice.actions

export default authSlice.reducer