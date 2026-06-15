import apiClient from './index'
//apiClient是 src/api/index.js 里创建的axios的实例，
// 已经设置了基础URL和一些默认配置，可以直接使用它来发送HTTP请求。
export function getArtist(id) {
  return apiClient.get(`/artists/${id}`)
}

export function updateArtist(id, data) {
  return apiClient.put(`/artists/${id}`, data)
}