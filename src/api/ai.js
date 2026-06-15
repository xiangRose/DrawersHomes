import apiClient from './index'

export function optimizeDescription(description) {
  return apiClient.post('/ai/optimize-description', { description })
}

export function getReplySuggestion(orderData) {
  return apiClient.post('/ai/reply-suggestion', orderData)
}
