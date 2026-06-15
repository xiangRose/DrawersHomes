<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">选择约稿类型</label>
      <div class="grid grid-cols-1 gap-3">
        <button
          v-for="item in pricing"
          :key="item.id"
          type="button"
          @click="formData.commissionType = item.typeName"
          class="text-left p-4 rounded-xl border-2 transition-all"
          :class="formData.commissionType === item.typeName ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'"
        >
          <div class="flex items-center justify-between">
            <span class="font-medium text-gray-800">{{ item.typeName }}</span>
            <span class="text-indigo-600 font-bold">¥{{ item.price }}</span>
          </div>
          <p class="text-xs text-gray-400 mt-1">{{ item.description }}</p>
        </button>
      </div>
      <p v-if="errors.commissionType" class="text-red-500 text-xs mt-1">{{ errors.commissionType }}</p>
    </div>

    <div>
      <div class="flex items-center justify-between mb-2">
        <label class="block text-sm font-medium text-gray-700">需求描述</label>
        <button
          type="button"
          :disabled="optimizing || !formData.description || formData.description.length < 3"
          @click="handleOptimize"
          class="text-xs px-3 py-1 rounded-lg transition-all flex items-center gap-1"
          :class="optimizing
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 active:scale-95'"
        >
          <svg v-if="optimizing" class="animate-spin w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <svg v-else class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          {{ optimizing ? '优化中...' : 'AI 优化' }}
        </button>
      </div>
      <textarea
        v-model="formData.description"
        rows="4"
        placeholder="请详细描述您的约稿需求，例如：角色设定、风格偏好、场景要求等（至少10个字）"
        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none text-sm"
      />
      <p v-if="errors.description" class="text-red-500 text-xs mt-1">{{ errors.description }}</p>
      <p v-if="optimizeError" class="text-red-500 text-xs mt-1">{{ optimizeError }}</p>
      <p v-if="optimizedHint" class="text-green-600 text-xs mt-1">{{ optimizedHint }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { optimizeDescription } from '@/api/ai'

const props = defineProps({
  formData: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) },
  pricing: { type: Array, default: () => [] }
})

const optimizing = ref(false)
const optimizeError = ref('')
const optimizedHint = ref('')

async function handleOptimize() {
  if (!props.formData.description || props.formData.description.length < 3) return
  optimizing.value = true
  optimizeError.value = ''
  optimizedHint.value = ''
  try {
    const { result } = await optimizeDescription(props.formData.description)
    props.formData.description = result
    optimizedHint.value = 'AI 优化完成'
    setTimeout(() => { optimizedHint.value = '' }, 3000)
  } catch (e) {
    optimizeError.value = e.message || '优化失败，请重试'
    setTimeout(() => { optimizeError.value = '' }, 4000)
  } finally {
    optimizing.value = false
  }
}
</script>