<template>
  <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
    <div class="flex items-start justify-between mb-3">
      <div>
        <h3 class="font-bold text-lg text-gray-800">{{ item.typeName }}</h3>
        <p class="text-sm text-gray-400 mt-0.5">{{ item.description }}</p>
      </div>
      <span class="text-xl font-bold text-indigo-600 flex-shrink-0">
        ¥{{ item.price }}
      </span>
    </div>
    <ul class="space-y-2">
      <li
        v-for="(feature, i) in item.features"
        :key="i"
        class="flex items-start gap-2 text-sm text-gray-600"
      >
        <svg class="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        <span>{{ feature }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({ item: { type: Object, required: true } })
</script>