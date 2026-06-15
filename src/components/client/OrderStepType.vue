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
      <label class="block text-sm font-medium text-gray-700 mb-2">需求描述</label>
      <textarea
        v-model="formData.description"
        rows="4"
        placeholder="请详细描述您的约稿需求，例如：角色设定、风格偏好、场景要求等（至少10个字）"
        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none text-sm"
      />
      <p v-if="errors.description" class="text-red-500 text-xs mt-1">{{ errors.description }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  formData: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) },
  pricing: { type: Array, default: () => [] }
})
</script>