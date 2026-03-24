<script setup lang="ts">
definePageMeta({ title: '时间线' })

const placeholderImg = (w: number, h: number, seed?: number) => {
  const s = seed ?? Math.floor(Math.random() * 1000)
  return `https://picsum.photos/${w}/${h}?random=${s}`
}

const timelineData = ref<Array<{
  year: string
  month: string
  day: string
  title: string
  src: string
  side: 'left' | 'right'
}>>([])

const generateTimeline = () => {
  const years = ['2024', '2023', '2022']
  const months = ['01', '02', '03', '04', '05', '06']
  const days = ['15', '20', '28']
  const titles = [
    '春节·大理', '周末·西湖', '旅行·厦门', '生日·上海',
    '秋游·北京', '聚会·广州', '徒步·黄山', '自驾·成都',
  ]

  let side: 'left' | 'right' = 'left'
  const items = []

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
        })
        side = side === 'left' ? 'right' : 'left'
      }
    }
  }

  return items
}

onMounted(() => {
  timelineData.value = generateTimeline()

  // Wait for DOM to render, then set up lazy loading
  nextTick(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            const src = img.dataset.src
            if (src) {
              img.src = src
              img.classList.add('loaded')
            }
            observer.unobserve(img)
          }
        })
      },
      {
        rootMargin: '200px',
        threshold: 0,
      }
    )

    document.querySelectorAll('.lazy-img').forEach((img) => {
      observer.observe(img)
    })
  })
})

const groupedByYear = computed(() => {
  const groups: Record<string, typeof timelineData.value> = {}
  for (const item of timelineData.value) {
    if (!groups[item.year]) groups[item.year] = []
    groups[item.year].push(item)
  }
  return groups
})
</script>

<template>
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
        :key="idx"
        class="timeline__item"
        :class="`timeline__item--${item.side}`"
      >
        <div class="timeline__dot" />
        <div class="timeline__date">{{ item.month }}.{{ item.day }}</div>

        <div class="timeline__card">
          <img
            ref="imgRefs"
            :data-src="item.src"
            :alt="item.title"
            class="timeline__img lazy-img"
            loading="lazy"
          />
          <div class="timeline__card-title">{{ item.title }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* UnoCSS 无法处理的复杂布局，保留在 style 中 */
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
  content-visibility: auto;
  contain-intrinsic-size: 0 600px;
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

.timeline__img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.4s ease;
  background: #1e293b;
}

.timeline__img.loaded {
  opacity: 1;
}

.timeline__card-title {
  padding: 12px 16px;
  font-size: 14px;
  color: #e2e8f0;
}

/* Mobile: collapse to single column */
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
