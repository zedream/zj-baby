<script setup lang="ts">
definePageMeta({ title: '瀑布流' })

// 占位图片生成
const placeholderImg = (w: number, h: number, seed?: number) => {
  const s = seed ?? Math.floor(Math.random() * 1000)
  return `https://picsum.photos/${w}/${h}?random=${s}`
}

const photos = ref<Array<{
  id: number
  src: string
  thumb: string
  width: number
  height: number
  title: string
}>>([])

const generatePhotos = () => {
  const sizes = [
    { w: 400, h: 600 },
    { w: 400, h: 300 },
    { w: 400, h: 500 },
    { w: 400, h: 400 },
    { w: 400, h: 700 },
    { w: 400, h: 350 },
  ]
  const titles = ['风景', '人像', '建筑', '静物', '街拍', '自然', '旅行', '生活']

  return Array.from({ length: 20 }, (_, i) => {
    const size = sizes[i % sizes.length]
    return {
      id: i + 1,
      src: placeholderImg(size.w, size.h, i + 1),
      thumb: placeholderImg(size.w / 2, size.h / 2, i + 1),
      width: size.w,
      height: size.h,
      title: titles[i % titles.length],
    }
  })
}

onMounted(() => {
  photos.value = generatePhotos()
})

const activeFilters = ref<string[]>([])
const allTags = ['风景', '人像', '建筑', '静物', '街拍', '自然', '旅行', '生活']

const filteredPhotos = computed(() => {
  if (activeFilters.value.length === 0) return photos.value
  return photos.value.filter(p => activeFilters.value.includes(p.title))
})

const toggleFilter = (tag: string) => {
  const idx = activeFilters.value.indexOf(tag)
  if (idx === -1) {
    activeFilters.value.push(tag)
  } else {
    activeFilters.value.splice(idx, 1)
  }
}
</script>

<template>
  <div class="gallery">
    <div class="gallery__filters">
      <button
        v-for="tag in allTags"
        :key="tag"
        class="gallery__filter-btn"
        :class="{ active: activeFilters.includes(tag) }"
        @click="toggleFilter(tag)"
      >
        {{ tag }}
      </button>
    </div>

    <div class="gallery__masonry">
      <div
        v-for="photo in filteredPhotos"
        :key="photo.id"
        class="gallery__item"
        @click="$emit('photo-click', photo.id)"
      >
        <img
          :src="photo.src"
          :alt="photo.title"
          class="gallery__img"
          loading="lazy"
        />
        <div class="gallery__overlay">
          <span class="gallery__tag">{{ photo.title }}</span>
        </div>
      </div>
    </div>

    <div v-if="filteredPhotos.length === 0" class="gallery__empty">
      <p>暂无符合条件的照片</p>
    </div>
  </div>
</template>

<style scoped>
.gallery {
  min-height: 100vh;
  background: #111;
  padding: 24px;
}

.gallery__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 32px;
  justify-content: center;
}

.gallery__filter-btn {
  padding: 6px 16px;
  border-radius: 20px;
  border: 1px solid #334155;
  background: #1e293b;
  color: #94a3b8;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.gallery__filter-btn:hover {
  border-color: #3b82f6;
  color: #e2e8f0;
}

.gallery__filter-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.gallery__masonry {
  columns: 4 200px;
  column-gap: 16px;
}

.gallery__item {
  break-inside: avoid;
  margin-bottom: 16px;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.gallery__img {
  width: 100%;
  display: block;
  transition: transform 0.3s ease, filter 0.3s ease;
}

.gallery__item:hover .gallery__img {
  transform: scale(1.05);
  filter: brightness(1.1);
}

.gallery__overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32px 12px 12px;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  opacity: 0;
  transition: opacity 0.3s;
}

.gallery__item:hover .gallery__overlay {
  opacity: 1;
}

.gallery__tag {
  font-size: 12px;
  color: white;
}

.gallery__empty {
  text-align: center;
  padding: 80px;
  color: #64748b;
}
</style>
