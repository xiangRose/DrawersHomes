import apiClient from './index'

export function getGallery(artistId) {
  return apiClient.get(`/gallery?artistId=${artistId}`)
}

export function addGalleryItem(data) {
  return apiClient.post('/gallery', data)
}

export function deleteGalleryItem(id) {
  return apiClient.delete(`/gallery/${id}`)
}