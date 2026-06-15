<template>
  <div
    class="break-inside-avoid bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98]"
    @click="$emit('click')"
  >
    <img
      :src="image.imageUrl"
      :alt="image.title"
      loading="lazy"
      class="w-full object-cover"
      :style="{ aspectRatio: imageAspectRatio }"
    />
    <div class="p-3">
      <h3 class="text-sm font-medium text-gray-800 truncate">{{ image.title }}</h3>
      <span class="text-xs text-gray-400 mt-0.5">{{ image.category }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ image: { type: Object, required: true } })
defineEmits(['click'])

// Generate a deterministic aspect ratio from image ID for varied masonry heights
const imageAspectRatio = computed(() => {
  const ratios = ['3/4', '2/3', '1/1', '4/5', '3/5']
  return ratios[props.image.id % ratios.length]
})
</script>