<template>
  <div
    class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >
    <button
      @click="$emit('close')"
      class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
    >
      <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>

    <div class="flex flex-col md:flex-row items-center md:items-start gap-6 max-w-4xl w-full max-h-[90vh]">
      <img
        :src="image.imageUrl"
        :alt="image.title"
        class="w-full md:w-auto md:max-w-[55%] max-h-[60vh] md:max-h-[85vh] object-contain rounded-lg"
      />

      <div class="text-white md:self-center md:max-w-[35%] space-y-4">
        <h3 class="text-xl font-bold">{{ image.title }}</h3>
        <span class="inline-block px-3 py-1 rounded-full text-sm bg-white/10 text-white/80">{{ image.category }}</span>
        <p v-if="image.description" class="text-sm text-white/70 leading-relaxed">{{ image.description }}</p>
        <p v-else class="text-sm text-white/40 italic">暂无详细描述</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ image: { type: Object, required: true } })
defineEmits(['close'])
</script>
