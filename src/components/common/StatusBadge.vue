<template>
  <span
    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
    :class="colorClass"
  >
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ status: { type: String, required: true } })

const label = computed(() => {
  const map = { pending: '待审核', sketch: '草稿', color: '上色', done: '完成', rejected: '不通过' }
  return map[props.status] || props.status
})

const colorClass = computed(() => {
  const map = {
    pending: 'bg-yellow-100 text-yellow-700',
    sketch: 'bg-blue-100 text-blue-700',
    color: 'bg-orange-100 text-orange-700',
    done: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700'
  }
  return map[props.status] || 'bg-gray-100 text-gray-600'
})
</script>