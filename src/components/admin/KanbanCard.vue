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

    <!-- Reject button for pending orders -->
    <button
      v-if="order.status === 'pending'"
      @click.stop="handleReject"
      class="mt-2 w-full py-1.5 text-xs rounded-md border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
    >
      审核不通过
    </button>
  </div>
</template>

<script setup>
import StatusBadge from '@/components/common/StatusBadge.vue'
import { useOrderStore } from '@/stores/order'

const props = defineProps({ order: { type: Object, required: true } })
const orderStore = useOrderStore()

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

async function handleReject() {
  await orderStore.updateOrderStatus(props.order.id, 'rejected')
}
</script>
