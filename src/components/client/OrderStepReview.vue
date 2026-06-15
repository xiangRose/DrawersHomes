<template>
  <div class="space-y-4">
    <!-- Summary -->
    <div class="bg-gray-50 rounded-xl p-4 space-y-3">
      <div class="flex justify-between text-sm">
        <span class="text-gray-500">约稿类型</span>
        <span class="font-medium text-gray-800">{{ formData.commissionType }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-500">需求描述</span>
        <span class="font-medium text-gray-800 text-right max-w-[60%] truncate">{{ formData.description }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-500">姓名</span>
        <span class="font-medium text-gray-800">{{ formData.customerName }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-500">联系方式</span>
        <span class="font-medium text-gray-800">{{ formData.contactInfo }}</span>
      </div>
      <hr class="border-gray-200" />
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">您的预算（元）</label>
        <input
          v-model.number="formData.budget"
          type="number"
          min="0"
          step="100"
          placeholder="请输入您的预算金额"
          class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
        />
      </div>
    </div>

    <p class="text-xs text-gray-400 text-center">
      提交后画师将审核您的需求，通过后将联系您确认并开始创作
    </p>
  </div>
</template>

<script setup>
defineProps({
  formData: { type: Object, required: true },
  isSubmitting: { type: Boolean, default: false }
})
</script>