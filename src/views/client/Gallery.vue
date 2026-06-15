<template>
  <div class="px-4 py-6 max-w-lg mx-auto">
    <h2 class="text-lg font-bold text-gray-800 mb-4">作品橱窗</h2>

    <LoadingSpinner v-if="artistStore.loading" text="加载作品中..." />
    <ErrorMessage v-else-if="artistStore.error" :message="artistStore.error" :retry="true" @retry="artistStore.fetchAll(Number(route.params.artistId))" />

    <div v-else-if="artistStore.gallery.length === 0" class="text-center py-12 text-gray-400 text-sm">
      暂无作品展示
    </div>

    <!-- Masonry Grid -->
    <div v-else class="columns-2 gap-4 space-y-4">
      <ImageCard
        v-for="img in artistStore.gallery"
        :key="img.id"
        :image="img"
        @click="openLightbox(img)"
      />
      <!--给每个卡片一个身份证号。
      Vue用它来跟踪"哪些卡片是新的、哪些被删了，
      这样更新时不用重新渲染所有卡片。-->
    </div>

    <!-- Lightbox灯箱-->
    <Lightbox
      v-if="lightboxImage"
      :image="lightboxImage"
      @close="lightboxImage = null"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useArtistStore } from '@/stores/artist'
import ImageCard from '@/components/client/ImageCard.vue'
import Lightbox from '@/components/client/Lightbox.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const route = useRoute()
const artistStore = useArtistStore()
const lightboxImage = ref(null)

function openLightbox(img) {
  lightboxImage.value = img
}
</script>