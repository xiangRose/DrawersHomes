<template>
  <div class="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
    <div class="flex items-start justify-between mb-2">
      <h4 class="font-medium text-sm text-gray-800 truncate flex-1 mr-2">{{ order.customerName }}</h4>
      <StatusBadge :status="order.status" />
    </div>
    <div class="text-xs text-indigo-600 font-medium mb-1">{{ order.commissionType }}</div>
    <p v-if="order.description" class="text-xs text-gray-400 line-clamp-2 mb-2">{{ order.description }}</p>

    <!-- Contact Info -->
    <div class="text-xs text-gray-500 bg-gray-50 rounded px-2 py-1.5 mb-2">
      <span class="font-medium text-gray-600">联系方式：</span>{{ order.contactInfo }}
    </div>

    <div class="flex items-center justify-between text-xs text-gray-400">
      <span>¥{{ order.budget }}</span>
      <span>{{ formatDate(order.createdAt) }}</span>
    </div>

    <!-- AI Reply Suggestion -->
    <button
      @click.stop="handleReplySuggestion"
      class="mt-2 w-full py-1.5 text-xs rounded-md border border-indigo-200 text-indigo-500 hover:bg-indigo-50 transition-colors"
    >
      回复建议 (AI)
    </button>

    <!-- Reject button for pending orders -->
    <button
      v-if="order.status === 'pending'"
      @click.stop="handleReject"
      class="mt-1 w-full py-1.5 text-xs rounded-md border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
    >
      审核不通过
    </button>

    <!-- AI Reply Dialog -->
    <el-dialog v-model="showReplyDialog" title="AI 回复建议" width="420px" :close-on-click-modal="false">
      <div
        v-if="generatingReply"
        class="flex items-center justify-center py-10 text-gray-400 text-sm"
      >
        <svg class="animate-spin w-5 h-5 mr-2 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        正在生成回复...
      </div>
      <div
        v-else
        class="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed min-h-[100px]"
      >
        {{ replySuggestion }}
      </div>
      <template #footer>
        <el-button @click="showReplyDialog = false">关闭</el-button>
        <el-button type="primary" :disabled="generatingReply || !replySuggestion" @click="copyReply">
          {{ copyBtnText }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { useOrderStore } from '@/stores/order'
import { getReplySuggestion } from '@/api/ai'

const props = defineProps({ order: { type: Object, required: true } })
const orderStore = useOrderStore()

const showReplyDialog = ref(false)
const replySuggestion = ref('')
const generatingReply = ref(false)
const copyBtnText = ref('复制回复')

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

async function handleReject() {
  await orderStore.updateOrderStatus(props.order.id, 'rejected')
}

async function handleReplySuggestion() {
  generatingReply.value = true
  replySuggestion.value = ''
  showReplyDialog.value = true
  try {
    const { result } = await getReplySuggestion({
      customerName: props.order.customerName,
      commissionType: props.order.commissionType,
      description: props.order.description,
      budget: props.order.budget
    })
    replySuggestion.value = result
  } catch (e) {
    replySuggestion.value = '生成回复失败：' + (e.message || '请重试')
  } finally {
    generatingReply.value = false
  }
}

async function copyReply() {
  try {
    await navigator.clipboard.writeText(replySuggestion.value)
    copyBtnText.value = '已复制'
    setTimeout(() => { copyBtnText.value = '复制回复' }, 2000)
  } catch {
    copyBtnText.value = '复制失败'
    setTimeout(() => { copyBtnText.value = '复制回复' }, 2000)
  }
}
</script>
