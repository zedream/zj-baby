<script setup lang="ts">
definePageMeta({ title: '照片浏览' })

const route = useRoute()
const router = useRouter()

// Mock data for demo - in production this would come from API
const photos = ref([
  { id: '1', src: 'https://picsum.photos/1200/900?random=1', cdnUrl: '' },
  { id: '2', src: 'https://picsum.photos/1200/900?random=2', cdnUrl: '' },
  { id: '3', src: 'https://picsum.photos/1200/900?random=3', cdnUrl: '' },
  { id: '4', src: 'https://picsum.photos/1200/900?random=4', cdnUrl: '' },
  { id: '5', src: 'https://picsum.photos/1200/900?random=5', cdnUrl: '' },
  { id: '6', src: 'https://picsum.photos/1200/900?random=6', cdnUrl: '' },
  { id: '7', src: 'https://picsum.photos/1200/900?random=7', cdnUrl: '' },
  { id: '8', src: 'https://picsum.photos/1200/900?random=8', cdnUrl: '' },
])

const currentIndex = ref(0)
const currentPhoto = computed(() => photos.value[currentIndex.value])
const hasPrev = computed(() => currentIndex.value > 0)
const hasNext = computed(() => currentIndex.value < photos.value.length - 1)

const goPrev = () => {
  if (hasPrev.value) currentIndex.value--
}

const goNext = () => {
  if (hasNext.value) currentIndex.value++
}

const close = () => {
  router.back()
}

// Handle keyboard navigation
onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close()
    if (e.key === 'ArrowLeft') goPrev()
    if (e.key === 'ArrowRight') goNext()
  })
})
</script>

<template>
  <div class="fixed inset-0 bg-[#0a0a0a] z-50">
    <!-- Close button -->
    <button
      class="absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      @click="close"
    >
      <span class="text-white text-2xl">×</span>
    </button>

    <!-- Navigation: Previous -->
    <button
      v-if="hasPrev"
      class="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      @click="goPrev"
    >
      <span class="text-white text-2xl">‹</span>
    </button>

    <!-- Navigation: Next -->
    <button
      v-if="hasNext"
      class="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      @click="goNext"
    >
      <span class="text-white text-2xl">›</span>
    </button>

    <!-- Photo counter -->
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-white/60 text-sm">
      {{ currentIndex + 1 }} / {{ photos.length }}
    </div>

    <!-- 3D Photo Viewer -->
    <ClientOnly>
      <PhotoViewer
        v-if="currentPhoto"
        :key="currentPhoto.id"
        :src="currentPhoto.src"
        :alt="`Photo ${currentPhoto.id}`"
        @close="close"
        @prev="goPrev"
        @next="goNext"
      />
      <template #fallback>
        <div class="w-full h-full flex items-center justify-center">
          <span class="text-white/60">加载中...</span>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
