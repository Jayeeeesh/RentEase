import api from '../../services/api'

export const createMaintenanceAPI = async (data) => {
  const response = await api.post('/maintenance', data)
  return response.data
}

export const getUserMaintenanceAPI = async (params) => {
  const response = await api.get('/maintenance', { params })
  return response.data
}

export const getUserRentalsAPI = async () => {
  const response = await api.get('/rentals')
  return response.data
}