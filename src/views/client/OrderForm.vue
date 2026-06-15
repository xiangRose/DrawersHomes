<template>
  <div class="px-4 py-6 max-w-lg mx-auto">
    <!-- Success State -->
    <div v-if="submitSuccess" class="flex flex-col items-center py-12 text-center">
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h3 class="text-lg font-bold text-gray-800 mb-2">提交成功！</h3>
      <p class="text-sm text-gray-500 mb-6">您的约稿请求已提交，画师会尽快与您联系确认。</p>
      <router-link
        :to="`/${route.params.artistId}`"
        class="px-6 py-2 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600 transition-colors"
      >
        返回主页
      </router-link>
    </div>

    <template v-else>
      <h2 class="text-lg font-bold text-gray-800 mb-4">提交约稿</h2>

      <!-- Step Indicator -->
      <div class="flex items-center mb-8">
        <div
          v-for="(step, i) in steps"
          :key="step.key"
          class="flex-1 flex items-center"
        >
          <div class="flex flex-col items-center flex-1">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all"
              :class="i <= currentStep ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-400'"
            >
              {{ i + 1 }}
            </div>
            <span class="text-xs mt-1" :class="i <= currentStep ? 'text-indigo-600 font-medium' : 'text-gray-400'">
              {{ step.title }}
            </span>
          </div>
          <div
            v-if="i < steps.length - 1"
            class="flex-1 h-0.5 mx-2 mt-[-1rem]"
            :class="i < currentStep ? 'bg-indigo-500' : 'bg-gray-200'"
          />
        </div>
      </div>

      <!-- Steps -->
      <OrderStepType
        v-if="currentStep === 0"
        :form-data="formData"
        :errors="errors"
        :pricing="artistStore.pricing"
      />
      <OrderStepContact
        v-else-if="currentStep === 1"
        :form-data="formData"
        :errors="errors"
      />
      <OrderStepReview
        v-else-if="currentStep === 2"
        :form-data="formData"
        :is-submitting="isSubmitting"
      />

      <!-- Navigation -->
      <div class="flex gap-3 mt-8">
        <button
          v-if="currentStep > 0"
          @click="prevStep"
          class="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
        >
          上一步
        </button>
        <button
          v-if="currentStep < 2"
          @click="nextStep"
          class="flex-1 py-3 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-colors"
        >
          下一步
        </button>
        <button
          v-if="currentStep === 2"
          @click="submitOrder"
          :disabled="isSubmitting"
          class="flex-1 py-3 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ isSubmitting ? '提交中...' : '确认提交' }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useArtistStore } from '@/stores/artist'
import { useOrderForm } from '@/composables/useOrderForm'
import OrderStepType from '@/components/client/OrderStepType.vue'
import OrderStepContact from '@/components/client/OrderStepContact.vue'
import OrderStepReview from '@/components/client/OrderStepReview.vue'

const route = useRoute()
const artistStore = useArtistStore()
const { currentStep, formData, errors, steps, isSubmitting, submitSuccess, nextStep, prevStep, submitOrder } = useOrderForm(route.params.artistId)
</script>