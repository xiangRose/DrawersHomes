import apiClient from './index'

export function getPricing(artistId) {
  return apiClient.get(`/pricing?artistId=${artistId}`)
}

export function updatePricingItem(id, data) {
  return apiClient.put(`/pricing/${id}`, data)
}

export function createPricingItem(data) {
  return apiClient.post('/pricing', data)
}

export function deletePricingItem(id) {
  return apiClient.delete(`/pricing/${id}`)
}