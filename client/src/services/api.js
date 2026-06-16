import axios from 'axios'

// Create a reusable Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  withCredentials: true,
})

// Tracks refresh-token requests to prevent duplicates
let isRefreshing = false

// Stores failed requests while token refresh is in progress
let failedQueue = []

/**
 * Resolves or rejects all queued requests
 * after refresh-token request completes.
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve(token)
    }
  })

  failedQueue = []
}

/**
 * Request Interceptor
 * Attaches access token to every outgoing request.
 */
api.interceptors.request.use( (config) => {
    const token = localStorage.getItem('accessToken')
  
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

/**
 * Response Interceptor
 * Handles token expiration and automatic request retry.
 */
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config

    // Exit if no server response is available
    if (!error.response) {
      return Promise.reject(error)
    }

    const isUnauthorized = error.response.status === 401

    // Prevent refresh-token endpoint from triggering itself
    const isRefreshRequest =
      originalRequest.url?.includes('/auth/refresh-token')

    if (
      isUnauthorized &&
      !originalRequest._retry &&
      !isRefreshRequest
    ) {
      originalRequest._retry = true

      /**
       * If a refresh request is already running,
       * queue the current request until a new token is available.
       */
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      isRefreshing = true

      try {
        /**
         * Request a new access token using the refresh token.
         */
        const refreshRes = await api.post('/auth/refresh-token')

        const newToken = refreshRes.data?.data?.accessToken

        // Persist the updated access token
        localStorage.setItem('accessToken', newToken)

        // Retry all queued requests
        processQueue(null, newToken)

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`

        return api(originalRequest)
      } catch (refreshError) {
        /**
         * Refresh token is invalid or expired.
         * Clear authentication state and redirect user.
         */
        processQueue(refreshError, null)

        localStorage.removeItem('accessToken')

        window.location.replace('/login')

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api