import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getArtist, updateArtist } from '@/api/artists'
import { getGallery, addGalleryItem, deleteGalleryItem } from '@/api/gallery'
import { getPricing, updatePricingItem, createPricingItem, deletePricingItem } from '@/api/pricing'

export const useArtistStore = defineStore('artist', () => {
  const currentArtist = ref(null)
  const gallery = ref([])
  const pricing = ref([])
  const loading = ref(false)
  const error = ref(null)

  const profileStatus = computed(() => {
    if (!currentArtist.value) return 'resting'
    return currentArtist.value.status
  })

  const statusText = computed(() => {
    return currentArtist.value?.status === 'accepting' ? '接单中' : '休息中'
  })

  const galleryByCategory = computed(() => {
    const map = {}
    gallery.value.forEach(item => {
      const cat = item.category || '其他'
      if (!map[cat]) map[cat] = []
      map[cat].push(item)
    })
    return map
  })

  async function fetchAll(artistId) {
    loading.value = true
    error.value = null
    try {
      const [artistData, galleryData, pricingData] = await Promise.all([
        getArtist(artistId),//请求1：画师信息
        getGallery(artistId),//请求2：作品列表
        getPricing(artistId)//请求3：价目表
      ])
      currentArtist.value = artistData
      gallery.value = galleryData
      pricing.value = pricingData
      //存到仓库里，组件里就能用
    } catch (e) {
      error.value = e.message || '加载失败'
    } finally {
      loading.value = false
    }
  }

  async function saveArtist(artistId, data) {
    try {
      const updated = await updateArtist(artistId, data)
      currentArtist.value = updated
      return true
    } catch (e) {
      error.value = e.message
      return false
    }
  }

  async function savePricingItem(id, data) {
    try {
      const updated = await updatePricingItem(id, data)
      const idx = pricing.value.findIndex(p => p.id === id)
      if (idx !== -1) pricing.value[idx] = updated
      return true
    } catch (e) {
      error.value = e.message
      return false
    }
  }

  async function addPricingItem(data) {
    try {
      const created = await createPricingItem(data)
      pricing.value.push(created)
      return true
    } catch (e) {
      error.value = e.message
      return false
    }
  }

  async function addGallery(data) {
    try {
      const created = await addGalleryItem(data)
      gallery.value.push(created)
      return true
    } catch (e) {
      error.value = e.message
      return false
    }
  }

  async function removeGallery(id) {
    try {
      await deleteGalleryItem(id)
      gallery.value = gallery.value.filter(g => g.id !== id)
      return true
    } catch (e) {
      error.value = e.message
      return false
    }
  }

  async function removePricingItem(id) {
    try {
      await deletePricingItem(id)
      pricing.value = pricing.value.filter(p => p.id !== id)
      return true
    } catch (e) {
      error.value = e.message
      return false
    }
  }

  return {
    currentArtist, gallery, pricing, loading, error,
    profileStatus, statusText, galleryByCategory,
    fetchAll, saveArtist, savePricingItem, addPricingItem, removePricingItem, addGallery, removeGallery
  }
})