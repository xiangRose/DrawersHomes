<template>
  <div class="px-4 py-6 max-w-lg mx-auto">
    <h2 class="text-lg font-bold text-gray-800 mb-4">价目表</h2>

    <LoadingSpinner v-if="artistStore.loading" text="加载价目表..." />
    <ErrorMessage v-else-if="artistStore.error" :message="artistStore.error" :retry="true" @retry="artistStore.fetchAll(Number(route.params.artistId))" />

    <div v-else-if="artistStore.pricing.length === 0" class="text-center py-12 text-gray-400 text-sm">
      暂未发布价目信息
    </div>

    <div v-else class="space-y-4">
      <PricingCard
        v-for="item in artistStore.pricing"
        :key="item.id"
        :item="item"
      />
    </div>

    <router-link
      v-if="artistStore.pricing.length > 0"
      :to="`/${route.params.artistId}/order`"
      class="mt-6 block w-full py-3 rounded-xl text-center text-white font-medium bg-indigo-500 hover:bg-indigo-600 active:scale-[0.98] transition-all"
    >
      立即约稿
    </router-link>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useArtistStore } from '@/stores/artist'
import PricingCard from '@/components/client/PricingCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const route = useRoute()
const artistStore = useArtistStore()
</script>