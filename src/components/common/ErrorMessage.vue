<template>
  <div class="flex flex-col items-center justify-center py-12 px-4">
    <svg class="w-12 h-12 text-gray-300 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
    </svg>
    <p class="text-gray-500 text-sm mb-4">{{ message || '加载失败' }}</p>
    <button
      v-if="retry"
      @click="$emit('retry')"
      class="px-4 py-2 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors"
    >
      重试
    </button>
  </div>
</template>

<script setup>
defineProps({ message: String, retry: Boolean })
defineEmits(['retry'])
</script>