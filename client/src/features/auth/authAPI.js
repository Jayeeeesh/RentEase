import api from '../../services/api'

export const loginAPI = async (credentials) => {
  const response = await api.post('/auth/login', credentials)
  return response.data
}

export const registerAPI = async (userData) => {
  const response = await api.post('/auth/register', userData)
  return response.data
}

export const logoutAPI = async () => {
  const response = await api.post('/auth/logout')
  return response.data
}