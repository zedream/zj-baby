<script setup lang="ts">
definePageMeta({ title: '相册' })

// Mock data - in production would come from API
const albums = ref([
  {
    id: '1',
    name: '旅行记录',
    description: '2024年各地旅行的照片集',
    coverPhoto: 'https://picsum.photos/400/300?random=101',
    photoCount: 24,
  },
  {
    id: '2',
    name: '日常生活',
    description: '生活中的点滴记录',
    coverPhoto: 'https://picsum.photos/400/300?random=102',
    photoCount: 56,
  },
  {
    id: '3',
    name: '美食探店',
    description: '各地美食打卡',
    coverPhoto: 'https://picsum.photos/400/300?random=103',
    photoCount: 18,
  },
  {
    id: '4',
    name: '宠物时光',
    description: '家里小可爱的日常',
    coverPhoto: 'https://picsum.photos/400/300?random=104',
    photoCount: 42,
  },
  {
    id: '5',
    name: '户外运动',
    description: '登山、跑步、骑行记录',
    coverPhoto: 'https://picsum.photos/400/300?random=105',
    photoCount: 31,
  },
  {
    id: '6',
    name: '节日庆典',
    description: '节日和特殊时刻',
    coverPhoto: 'https://picsum.photos/400/300?random=106',
    photoCount: 15,
  },
])
</script>

<template>
  <div class="min-h-screen bg-[#0f1117]">
    <!-- Header -->
    <div class="px-6 py-12 text-center">
      <h1 class="text-3xl font-bold text-white mb-2">📚 相册</h1>
      <p class="text-[#64748b]">点击卡片翻转查看详情</p>
    </div>

    <!-- Album Grid -->
    <div class="px-6 pb-12 max-w-6xl mx-auto">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div
          v-for="album in albums"
          :key="album.id"
          class="aspect-[4/3]"
        >
          <AlbumFlipCard
            :cover-photo="album.coverPhoto"
            :album-name="album.name"
            :description="album.description"
            :photo-count="album.photoCount"
          />
        </div>
      </div>
    </div>
  </div>
</template>
