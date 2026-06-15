import apiClient from './index'

export function getOrders(artistId) {
  return apiClient.get(`/orders?artistId=${artistId}&_sort=createdAt&_order=desc`)
}

export function updateOrder(id, data) {
  return apiClient.patch(`/orders/${id}`, data)
}

export function createOrder(data) {
  return apiClient.post('/orders', { ...data, createdAt: new Date().toISOString() })
}

export function deleteOrder(id) {
  return apiClient.delete(`/orders/${id}`)
}