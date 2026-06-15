<template>
  <div class="kanban-column w-72 flex-shrink-0 flex flex-col max-h-full">
    <!-- Column Header -->
    <div class="flex items-center justify-between mb-3 px-1">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full" :class="statusColor" />
        <h3 class="font-semibold text-sm text-gray-700">{{ title }}</h3>
        <span class="text-xs text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded-full">
          {{ modelValue.length }}
        </span>
      </div>
    </div>

    <!-- 拖拽 -->
    <draggable
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :group="{ name: 'kanban', pull: true, put: true }"
      item-key="id"
      class="flex-1 overflow-y-auto min-h-[200px] space-y-2 p-1 rounded-lg"
      :class="dropZoneClass"
      @change="onDragChange"
      ghost-class="opacity-50"
      drag-class="opacity-75"
    >
      <template #item="{ element }">
        <KanbanCard :order="element" />
      </template>

      <!--数组为空，显示无订单-->
      <template #footer>
        <div v-if="modelValue.length === 0" class="text-center py-8 text-gray-400 text-xs">
          暂无订单
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import draggable from 'vuedraggable'
import KanbanCard from '@/components/admin/KanbanCard.vue'

const props = defineProps({
  title: { type: String, required: true },
  status: { type: String, required: true },
  modelValue: { type: Array, required: true }
})

const emit = defineEmits(['update:modelValue', 'order-added'])

const statusColor = computed(() => {
  const map = {
    pending: 'bg-yellow-400',
    sketch: 'bg-blue-400',
    color: 'bg-orange-400',
    done: 'bg-green-400',
    rejected: 'bg-red-400'
  }
  return map[props.status] || 'bg-gray-400'
})

const dropZoneClass = computed(() => {
  const map = {
    pending: 'bg-yellow-50/50',
    sketch: 'bg-blue-50/50',
    color: 'bg-orange-50/50',
    done: 'bg-green-50/50',
    rejected: 'bg-red-50/50'
  }
  return map[props.status] || 'bg-gray-50/50'
})

function onDragChange(event) {
  if (event.added) {
    // 改变订单状态
    emit('order-added', event.added.element, props.status)
  }
}
 // event 有三种可能：
    // event.added   → 有卡片从别的列拖进来
    // event.removed → 有卡片被拖走了
    // event.moved   → 卡片在本列内上下排序
</script>