<script setup lang="ts">
definePageMeta({ title: '时间线' })

const placeholderImg = (w: number, h: number, seed?: number) => {
  return `https://picsum.photos/${w}/${h}?random=${seed}`
}

interface TimelineItem {
  year: string
  month: string
  day: string
  title: string
  src: string
  side: 'left' | 'right'
  loaded: boolean
}

const timelineData = ref<TimelineItem[]>([])

// 分页配置
const BATCH_SIZE = 9 // 每次加载9条
const visibleCount = ref(BATCH_SIZE)
const isLoading = ref(false)
const allLoaded = ref(false)

// 禁止滚动
const scrollLocked = ref(false)

const visibleItems = computed(() => timelineData.value.slice(0, visibleCount.value))

// 生成所有数据
const generateAll = () => {
  const years = ['2024', '2023', '2022']
  const months = ['01', '02', '03', '04', '05', '06']
  const days = ['15', '20', '28']
  const titles = [
    '春节·大理', '周末·西湖', '旅行·厦门', '生日·上海',
    '秋游·北京', '聚会·广州', '徒步·黄山', '自驾·成都',
  ]

  let side: 'left' | 'right' = 'left'
  const items: TimelineItem[] = []

  for (const year of years) {
    for (const month of months) {
      for (let d = 0; d < 3; d++) {
        const day = days[d]
        const title = titles[items.length % titles.length]
        items.push({
          year,
          month,
          day,
          title,
          src: placeholderImg(400, 300, items.length + 10),
          side,
          loaded: false,
        })
        side = side === 'left' ? 'right' : 'left'
      }
    }
  }

  return items
}

// 图片加载完成
const onImgLoad = (index: number) => {
  timelineData.value[index].loaded = true

  // 检查是否全部可见图片都加载完了
  const visible = timelineData.value.slice(0, visibleCount.value)
  if (visible.every(item => item.loaded) && !isLoading.value) {
    scrollLocked.value = false
  }
}

// 加载更多
const loadMore = () => {
  if (isLoading.value || allLoaded.value || scrollLocked.value) return
  if (visibleCount.value >= timelineData.value.length) return

  scrollLocked.value = true
  isLoading.value = true

  // 模拟网络延迟
  setTimeout(() => {
    const nextCount = Math.min(visibleCount.value + BATCH_SIZE, timelineData.value.length)
    visibleCount.value = nextCount

    if (nextCount >= timelineData.value.length) {
      allLoaded.value = true
    }

    isLoading.value = false
    // 等待图片加载完成后才解锁滚动
  }, 300)
}

// 监听滚动
const handleScroll = () => {
  if (scrollLocked.value || isLoading.value) return

  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight
  const winHeight = window.innerHeight

  // 滚动到距离底部 200px 时触发加载
  if (scrollTop + winHeight >= docHeight - 200) {
    loadMore()
  }
}

onMounted(() => {
  timelineData.value = generateAll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 当可见项变化时，检查是否需要解锁滚动
watch(visibleCount, () => {
  // 等到下一帧检查图片加载状态
  setTimeout(() => {
    const visible = timelineData.value.slice(0, visibleCount.value)
    if (visible.length > 0 && visible.every(item => item.loaded)) {
      scrollLocked.value = false
    }
  }, 100)
})

const groupedByYear = computed(() => {
  const groups: Record<string, TimelineItem[]> = {}
  for (const item of visibleItems.value) {
    if (!groups[item.year]) groups[item.year] = []
    groups[item.year].push(item)
  }
  return groups
})

const isItemLoaded = (item: TimelineItem) => item.loaded
</script>

<template>
  <!-- 禁止滚动时给 body 加这个 class -->
  <div :class="{ 'overflow-hidden': scrollLocked }">
    <div class="timeline">
      <h1 class="timeline__title">时光轴</h1>

      <div class="timeline__center-line" />

      <div
        v-for="(items, year) in groupedByYear"
        :key="year"
        class="timeline__year-group"
      >
        <div class="timeline__year-label">{{ year }}</div>

        <div
          v-for="(item, idx) in items"
          :key="`${item.year}-${item.month}-${item.day}-${idx}`"
          class="timeline__item"
          :class="`timeline__item--${item.side}`"
        >
          <div class="timeline__dot" />
          <div class="timeline__date">{{ item.month }}.{{ item.day }}</div>

          <div class="timeline__card">
            <div class="timeline__img-wrapper">
              <img
                :src="item.src"
                :alt="item.title"
                class="timeline__img"
                :class="{ 'is-loaded': isItemLoaded(item) }"
                @load="onImgLoad(visibleItems.indexOf(item))"
              />
              <div v-if="!isItemLoaded(item)" class="timeline__img-skeleton" />
            </div>
            <div class="timeline__card-title">{{ item.title }}</div>
          </div>
        </div>
      </div>

      <!-- 加载中 -->
      <div v-if="isLoading" class="timeline__loading">
        <div class="loading-spinner" />
        <span>加载中...</span>
      </div>

      <!-- 全部加载完 -->
      <div v-if="allLoaded" class="timeline__end">
        <span>— 已加载全部 {{ timelineData.length }} 条 —</span>
      </div>

      <!-- 提示滚动解锁 -->
      <div v-if="scrollLocked && !isLoading && !allLoaded" class="timeline__hint">
        图片加载中，请稍候...
      </div>
    </div>
  </div>
</template>

<style scoped>
.overflow-hidden {
  height: 100vh;
  overflow: hidden;
}

.timeline {
  min-height: 100vh;
  background: #0f1117;
  padding: 60px 24px;
  position: relative;
}

.timeline__title {
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 80px;
}

.timeline__center-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, transparent, #3b82f6 10%, #3b82f6 90%, transparent);
  transform: translateX(-50%);
}

.timeline__year-group {
  margin-bottom: 60px;
}

.timeline__year-label {
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 40px;
}

.timeline__item {
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  position: relative;
}

.timeline__item--left {
  flex-direction: row;
  padding-right: calc(50% + 40px);
  justify-content: flex-end;
}

.timeline__item--right {
  flex-direction: row-reverse;
  padding-left: calc(50% + 40px);
  justify-content: flex-end;
}

.timeline__dot {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #3b82f6;
  border: 3px solid #0f1117;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
  z-index: 1;
}

.timeline__date {
  position: absolute;
  top: 50%;
  font-size: 13px;
  color: #64748b;
  transform: translateY(-50%);
}

.timeline__item--left .timeline__date {
  right: calc(50% + 20px);
}

.timeline__item--right .timeline__date {
  left: calc(50% + 20px);
}

.timeline__card {
  background: #1e293b;
  border-radius: 12px;
  overflow: hidden;
  max-width: 360px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.timeline__card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(59, 130, 246, 0.15);
}

.timeline__img-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  background: #1e293b;
}

.timeline__img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.timeline__img.is-loaded {
  opacity: 1;
}

.timeline__img-skeleton {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.timeline__card-title {
  padding: 12px 16px;
  font-size: 14px;
  color: #e2e8f0;
}

.timeline__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
  color: #64748b;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #334155;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.timeline__end {
  text-align: center;
  padding: 40px;
  color: #64748b;
  font-size: 14px;
}

.timeline__hint {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(59, 130, 246, 0.9);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  z-index: 100;
}

/* Mobile */
@media (max-width: 768px) {
  .timeline {
    padding: 40px 16px;
  }

  .timeline__title {
    font-size: 24px;
  }

  .timeline__center-line {
    left: 20px;
  }

  .timeline__item {
    padding-left: 56px !important;
    padding-right: 0 !important;
    flex-direction: column !important;
    align-items: flex-start;
  }

  .timeline__item--left,
  .timeline__item--right {
    justify-content: flex-start;
  }

  .timeline__dot {
    left: 20px;
    top: 20px;
    transform: translate(-50%, 0);
  }

  .timeline__date {
    position: static;
    transform: none;
    margin-bottom: 8px;
    margin-left: 36px;
  }

  .timeline__card {
    max-width: 100%;
    width: 100%;
  }
}
</style>
