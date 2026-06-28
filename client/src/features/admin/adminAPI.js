import api from '../../services/api'

// Products
export const getAllProductsAdminAPI = (params) =>
  api.get('/products', { params }).then(r => r.data)

export const createProductAPI = (data) =>
  api.post('/products', data).then(r => r.data)

export const updateProductAPI = (id, data) =>
  api.put(`/products/${id}`, data).then(r => r.data)

export const deleteProductAPI = (id) =>
  api.delete(`/products/${id}`).then(r => r.data)

// Orders
export const getAllOrdersAPI = (params) =>
  api.get('/orders', { params }).then(r => r.data)

export const updateOrderStatusAPI = (id, status) =>
  api.patch(`/orders/${id}`, { status }).then(r => r.data)

// Maintenance
export const getAllMaintenanceAdminAPI = (params) =>
  api.get('/maintenance', { params }).then(r => r.data)

export const updateMaintenanceStatusAPI = (id, data) =>
  api.patch(`/maintenance/${id}`, data).then(r => r.data)