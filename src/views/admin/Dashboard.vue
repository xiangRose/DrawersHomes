<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-800">订单看板</h2>
      <button
        @click="handleRefresh"
        class="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >刷新
      </button>
    </div>

    <!--加载中-->
    <LoadingSpinner v-if="orderStore.loading" text="加载订单中..." />
    <!-- 出错了 -->
    <ErrorMessage
      v-else-if="orderStore.error"
      :message="orderStore.error"
      :retry="true"
      @retry="orderStore.fetchOrders(1)"
    />

    <!--四列看板-->
    <div v-else class="flex-1 flex gap-4 overflow-x-auto pb-4">
      <KanbanColumn
        v-for="col in orderStore.columnsArray"
        :key="col.key"
        :title="col.title"
        :status="col.key"
        :model-value="col.orders"
        @update:model-value="(val) => orderStore.columns[col.key] = val"
        @order-added="handleOrderDropped"
      />
    </div>
  </div>
</template>

<script setup>
import { useOrderStore } from '@/stores/order'
import KanbanColumn from '@/components/admin/KanbanColumn.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import { useKanbanDrag } from '@/composables/useKanbanDrag'

const orderStore = useOrderStore()

// Fetch orders on mount
orderStore.fetchOrders(1)

function handleOrderDropped(order, newStatus) {
  const { onDragChange } = useKanbanDrag(newStatus, orderStore)
  onDragChange({ added: { element: order } })
}

function handleRefresh() {
  orderStore.fetchOrders(1)
}
</script>