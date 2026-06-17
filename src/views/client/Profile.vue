<template>
  <div class="px-4 py-6 space-y-6 max-w-lg mx-auto">
    <LoadingSpinner v-if="artistStore.loading" text="加载画师信息..." /><!--第一段：加载中-->
    <ErrorMessage v-else-if="artistStore.error" :message="artistStore.error" :retry="true" @retry="artistStore.fetchAll(Number(route.params.artistId))" />
    <!--第二段：出错了-->
    <template v-else-if="artistStore.currentArtist"><!--第三段：正常显示-->
      <!-- Avatar & Basic Info -->
      <div class="flex flex-col items-center text-center">
        <img
          :src="artistStore.currentArtist.avatar"
          class="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
        />
        <h2 class="mt-4 text-xl font-bold text-gray-800">{{ artistStore.currentArtist.name }}</h2>
        <p class="mt-2 text-sm text-gray-500 leading-relaxed max-w-sm">
          {{ artistStore.currentArtist.bio }}
        </p>
      </div>

      <!-- Social Links -->
      <div v-if="artistStore.currentArtist.socialLinks" class="flex justify-center gap-4">
        <a
          v-for="(link, platform) in artistStore.currentArtist.socialLinks"
          :key="platform"
          :href="link"
          target="_blank"
          class="px-4 py-2 bg-white rounded-full shadow-sm text-xs text-gray-600 hover:text-indigo-600 hover:shadow transition-all border border-gray-100"
        ><!--社交链接-->
          {{ platform === 'weibo' ? '微博' : platform === 'twitter' ? 'Twitter' : platform === 'pixiv' ? 'Pixiv' : platform }}
        </a>
      </div>

      <!-- 统计数据：作品书/约稿类型数/接单状态` -->
      <div class="grid grid-cols-3 gap-3">
        <div class="bg-white rounded-xl p-4 text-center shadow-sm">
          <div class="text-2xl font-bold text-indigo-600">{{ artistStore.gallery.length }}</div>
          <div class="text-xs text-gray-400 mt-1">作品</div>
        </div>
        <div class="bg-white rounded-xl p-4 text-center shadow-sm">
          <div class="text-2xl font-bold text-indigo-600">{{ artistStore.pricing.length }}</div>
          <div class="text-xs text-gray-400 mt-1">约稿类型</div>
        </div>
        <div class="bg-white rounded-xl p-4 text-center shadow-sm">
          <div class="text-2xl font-bold" :class="artistStore.currentArtist.status === 'accepting' ? 'text-green-500' : 'text-gray-400'">
            {{ artistStore.currentArtist.status === 'accepting' ? '接单中' : '休息中' }}
          </div>
          <div class="text-xs text-gray-400 mt-1">状态</div>
        </div>
      </div>

      <!-- Quick Actions -->
      <router-link
        :to="`/${route.params.artistId}/order`"
        class="block w-full py-3 rounded-xl text-center text-white font-medium transition-all"
        :class="artistStore.currentArtist.status === 'accepting' ? 'bg-indigo-500 hover:bg-indigo-600 active:scale-[0.98]' : 'bg-gray-300 pointer-events-none'"
      >
        {{ artistStore.currentArtist.status === 'accepting' ? '立即约稿' : '暂停接单中' }}
      </router-link>
    </template>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useArtistStore } from '@/stores/artist'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const route = useRoute()
const artistStore = useArtistStore()
</script>