<template>
  <div class="min-h-screen bg-gray-50 flex flex-col"><!--最外层容器，撑满全屏，灰色背景，竖向排列-->
    <header class="sticky top-0 z-20 bg-white/95 backdrop-blur shadow-sm px-4 py-3 flex items-center gap-3">
      <!-- 顶部栏，粘性定位，半透明白底，模糊效果，阴影，内边距，水平排列，元素间距 -->
      <img
        v-if="artistStore.currentArtist?.avatar"
        :src="artistStore.currentArtist.avatar"
        class="w-8 h-8 rounded-full object-cover border border-gray-200"
      />
      <div class="flex-1 min-w-0">
        <h1 class="font-semibold text-base truncate">
          {{ artistStore.currentArtist?.name || '画师主页' }}
        </h1>
      </div>
      <span
        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
        :class="artistStore.currentArtist?.status === 'accepting' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'"
      >
        <span class="w-2 h-2 rounded-full" :class="artistStore.currentArtist?.status === 'accepting' ? 'bg-green-500' : 'bg-gray-400'" />
        {{ artistStore.statusText }}
      </span>
    </header>

    <main class="flex-1 pb-20">
      <router-view />
      <!-- 中间内容区，路由出口，底部留空给导航栏 -->
    </main>

    <ClientBottomNav />
    <!-- 底部导航栏组件 -->
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useArtistStore } from '@/stores/artist'
import ClientBottomNav from '@/components/client/ClientBottomNav.vue'

const route = useRoute()
const artistStore = useArtistStore()

watch(
  () => route.params.artistId,
  (id) => {
    if (id) artistStore.fetchAll(Number(id))
  },
  { immediate: true }
)
</script>
<!-- ① const route = useRoute()
     "给我一个能读到当前 URL 信息的工具"
     之后 route.params.artistId 就能拿到 /1 里的 "1"

  ② const artistStore = useArtistStore()
     "给我画师数据仓库的钥匙"
     之后 artistStore.currentArtist 就能拿到画师信息
     之后 artistStore.fetchAll() 就能去后端拉数据

  ③ watch(() => route.params.artistId, ...)
     "盯住 URL 里的画师 ID"

  ④ (id) => { artistStore.fetchAll(Number(id)) }
     "ID 一变（或者第一次进来），就拿这个 ID 去拉数据"

  ⑤ { immediate: true }
     "别等着变了才拉，第一次进页面也立刻拉" -->