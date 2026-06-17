import apiClient from './index'

export function optimizeDescription(description) {
  return apiClient.post('/ai/optimize-description', { description }, {
    timeout: 120000
  })
}

export function getReplySuggestion(orderData) {
  return apiClient.post('/ai/reply-suggestion', orderData, {
    timeout: 120000
  })
}
