<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">您的姓名</label>
      <input
        v-model="formData.customerName"
        type="text"
        placeholder="请输入您的姓名或昵称"
        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
      />
      <p v-if="errors.customerName" class="text-red-500 text-xs mt-1">{{ errors.customerName }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">联系方式</label>
      <div class="flex gap-2 mb-3">
        <button
          v-for="method in contactMethods"
          :key="method.value"
          type="button"
          @click="formData.contactMethod = method.value"
          class="flex-1 py-2 rounded-lg text-sm font-medium border transition-all"
          :class="formData.contactMethod === method.value ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 text-gray-500'"
        >
          {{ method.label }}
        </button>
      </div>
      <input
        v-model="formData.contactInfo"
        type="text"
        :placeholder="contactPlaceholder"
        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
      />
      <p v-if="errors.contactInfo" class="text-red-500 text-xs mt-1">{{ errors.contactInfo }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  formData: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) }
})

const contactMethods = [
  { value: 'email', label: '邮箱' },
  { value: 'phone', label: '手机' },
  { value: 'wechat', label: '微信' }
]

const contactPlaceholder = computed(() => {
  const map = {
    email: '请输入邮箱地址，如 example@mail.com',
    phone: '请输入11位手机号码',
    wechat: '请输入微信号（6-20位字母或数字）'
  }
  return map[props.formData.contactMethod] || '请输入联系方式'
})
</script>