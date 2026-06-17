<template>
  <div class="max-w-2xl mx-auto">
    <h2 class="text-xl font-bold text-gray-800 mb-6">基础设置</h2>

    <el-tabs v-model="activeTab" type="border-card">
      <!-- Profile Tab -->
      <el-tab-pane label="个人资料" name="profile">
        <el-form
          v-if="artistStore.currentArtist"
          :model="profileForm"
          label-width="80px"
          label-position="top"
          size="default"
        >
          <el-form-item label="画师名称">
            <el-input v-model="profileForm.name" />
          </el-form-item>
          <el-form-item label="头像链接">
            <el-input v-model="profileForm.avatar" />
          </el-form-item>
          <el-form-item label="接单状态">
            <el-select v-model="profileForm.status" style="width: 100%">
              <el-option label="接单中" value="accepting" />
              <el-option label="休息中" value="resting" />
            </el-select>
          </el-form-item>
          <el-form-item label="个人简介">
            <el-input v-model="profileForm.bio" type="textarea" :rows="3" />
          </el-form-item>
          <el-button type="primary" @click="saveProfile" :loading="savingProfile">保存修改</el-button>
        </el-form>
      </el-tab-pane>

      <!-- Pricing Tab -->
      <el-tab-pane label="价目管理" name="pricing">
        <div class="mb-4">
          <el-button type="primary" size="small" @click="showPricingDialog = true">新增类型</el-button>
        </div>
        <el-table :data="artistStore.pricing" border stripe style="width: 100%" row-key="id">
          <el-table-column prop="typeName" label="类型名称" />
          <el-table-column prop="price" label="价格" width="100">
            <template #default="{ row }">¥{{ row.price }}</template>
          </el-table-column>
          <el-table-column prop="description" label="描述" />
          <el-table-column label="操作" width="80" fixed="right">
            <template #default="{ row }">
              <el-button type="danger" size="small" @click="confirmDeletePricing(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- Delete Pricing Confirm -->
        <el-dialog v-model="showDeletePricingConfirm" title="确认删除" width="320px" :close-on-click-modal="false">
          <p class="text-sm text-gray-600">确定删除该约稿类型？</p>
          <template #footer>
            <el-button @click="showDeletePricingConfirm = false">取消</el-button>
            <el-button type="danger" :loading="deletingPricing" @click="handleDeletePricing">确定</el-button>
          </template>
        </el-dialog>

        <!-- Pricing Dialog -->
        <el-dialog v-model="showPricingDialog" title="新增约稿类型" width="400px">
          <el-form :model="pricingForm" label-position="top">
            <el-form-item label="类型名称">
              <el-input v-model="pricingForm.typeName" placeholder="如：头像、半身像" />
            </el-form-item>
            <el-form-item label="价格 (¥)">
              <el-input-number v-model="pricingForm.price" :min="0" :max="999999" style="width: 100%" />
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="pricingForm.description" type="textarea" :rows="2" placeholder="对约稿类型的简要说明" />
            </el-form-item>
          </el-form>
          <template #footer>
            <el-button @click="showPricingDialog = false">取消</el-button>
            <el-button type="primary" :loading="savingPricing" @click="handleAddPricing">确定</el-button>
          </template>
        </el-dialog>
      </el-tab-pane>

      <!-- Gallery Tab -->
      <el-tab-pane label="作品管理" name="gallery">
        <div class="mb-4">
          <el-button type="primary" size="small" @click="showGalleryDialog = true">新增作品</el-button>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div
            v-for="item in artistStore.gallery"
            :key="item.id"
            class="relative group"
          >
            <img
              :src="item.imageUrl"
              :alt="item.title"
              class="w-full aspect-square object-cover rounded-lg"
            />
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <el-button type="danger" size="small" @click="handleDeleteGallery(item.id)">删除</el-button>
            </div>
            <p class="text-xs text-gray-500 mt-1 truncate">{{ item.title }}</p>
          </div>
        </div>

        <!-- Gallery Dialog -->
        <el-dialog v-model="showGalleryDialog" title="新增作品" width="450px">
          <el-form :model="galleryForm" label-position="top">
            <el-form-item label="上传图片">
              <div class="flex items-center gap-3 w-full">
                <input
                  ref="fileInputRef"
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  class="hidden"
                  @change="handleFileSelect"
                />
                <el-button type="default" @click="fileInputRef?.click()" :disabled="uploading">
                  {{ uploading ? '上传中...' : '选择图片' }}
                </el-button>
                <span class="text-xs text-gray-400">或输入链接</span>
              </div>
              <div v-if="galleryForm.imageUrl" class="mt-2">
                <img :src="galleryForm.imageUrl" class="w-32 h-32 object-cover rounded-lg border" />
              </div>
            </el-form-item>
            <el-form-item label="图片链接">
              <el-input v-model="galleryForm.imageUrl" placeholder="选择图片后自动填入，也可手动输入URL" />
            </el-form-item>
            <el-form-item label="作品名称">
              <el-input v-model="galleryForm.title" placeholder="如：夏日少女" />
            </el-form-item>
            <el-form-item label="分类">
              <el-input v-model="galleryForm.category" placeholder="如：头像、场景、角色设计" />
            </el-form-item>
            <el-form-item label="作品描述">
              <el-input v-model="galleryForm.description" type="textarea" :rows="3" placeholder="对作品的详细描述" />
            </el-form-item>
          </el-form>
          <template #footer>
            <el-button @click="showGalleryDialog = false">取消</el-button>
            <el-button type="primary" :loading="savingGallery" @click="handleAddGallery">确定</el-button>
          </template>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, watch, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useArtistStore } from '@/stores/artist'
import apiClient from '@/api/index'

const artistStore = useArtistStore()
const activeTab = ref('profile')
const savingProfile = ref(false)

const profileForm = reactive({
  name: '',
  avatar: '',
  status: '',
  bio: ''
})

// Pricing dialog
const showPricingDialog = ref(false)
const savingPricing = ref(false)
const pricingForm = reactive({
  typeName: '',
  price: 0,
  description: ''
})

// Delete pricing confirm
const showDeletePricingConfirm = ref(false)
const deletingPricing = ref(false)
const deletePricingTargetId = ref(null)

// Gallery dialog
const showGalleryDialog = ref(false)
const savingGallery = ref(false)
const uploading = ref(false)
const fileInputRef = ref(null)
const galleryForm = reactive({
  imageUrl: '',
  title: '',
  category: '',
  description: ''
})

async function handleFileSelect(e) {
  const file = e.target.files?.[0]
  if (!file) return
  uploading.value = true
  try {
    const form = new FormData()
    form.append('image', file)
    const { url } = await apiClient.post('/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    galleryForm.imageUrl = url
    ElMessage.success('图片上传成功')
  } catch (err) {
    ElMessage.error(err.response?.data?.error || err.message || '上传失败')
  } finally {
    uploading.value = false
    if (fileInputRef.value) fileInputRef.value.value = ''
  }
}

// Fetch data on mount
artistStore.fetchAll(1)

// Sync store data to profile form
watch(() => artistStore.currentArtist, (artist) => {
  if (artist) {
    profileForm.name = artist.name
    profileForm.avatar = artist.avatar
    profileForm.status = artist.status
    profileForm.bio = artist.bio
  }
}, { immediate: true })

async function saveProfile() {
  savingProfile.value = true
  await artistStore.saveArtist(1, { ...profileForm })
  savingProfile.value = false
  ElMessage.success('个人资料已保存')
}

async function handleAddPricing() {
  if (!pricingForm.typeName.trim()) {
    ElMessage.warning('请输入类型名称')
    return
  }
  savingPricing.value = true
  await artistStore.addPricingItem({
    artistId: 1,
    typeName: pricingForm.typeName,
    price: pricingForm.price,
    description: pricingForm.description,
    features: []
  })
  savingPricing.value = false
  showPricingDialog.value = false
  pricingForm.typeName = ''
  pricingForm.price = 0
  pricingForm.description = ''
  ElMessage.success('约稿类型已添加')
}

async function handleAddGallery() {
  if (!galleryForm.imageUrl.trim() || !galleryForm.title.trim()) {
    ElMessage.warning('请填写图片链接和作品名称')
    return
  }
  savingGallery.value = true
  await artistStore.addGallery({
    artistId: 1,
    imageUrl: galleryForm.imageUrl,
    title: galleryForm.title,
    category: galleryForm.category,
    description: galleryForm.description
  })
  savingGallery.value = false
  showGalleryDialog.value = false
  galleryForm.imageUrl = ''
  galleryForm.title = ''
  galleryForm.category = ''
  galleryForm.description = ''
  ElMessage.success('作品已添加')
}

function confirmDeletePricing(id) {
  deletePricingTargetId.value = id
  showDeletePricingConfirm.value = true
}

async function handleDeletePricing() {
  deletingPricing.value = true
  await artistStore.removePricingItem(deletePricingTargetId.value)
  deletingPricing.value = false
  showDeletePricingConfirm.value = false
  deletePricingTargetId.value = null
  ElMessage.success('约稿类型已删除')
}

async function handleDeleteGallery(id) {
  await artistStore.removeGallery(id)
  ElMessage.success('作品已删除')
}
</script>
