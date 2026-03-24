<script setup lang="ts">
interface Props {
  coverPhoto?: string
  albumName: string
  description?: string
  photoCount: number
}

defineProps<Props>()

const flipped = ref(false)

const toggleFlip = () => {
  flipped.value = !flipped.value
}
</script>

<template>
  <div class="flip-card" @click="toggleFlip">
    <div :class="['flip-card-inner', { 'is-flipped': flipped }]">
      <!-- Front -->
      <div class="flip-card-front">
        <img
          v-if="coverPhoto"
          :src="coverPhoto"
          :alt="albumName"
          class="flip-card-img"
        />
        <div v-else class="flip-card-placeholder">
          <span class="text-4xl">📷</span>
        </div>
        <div class="flip-card-hint">点击翻转</div>
      </div>

      <!-- Back -->
      <div class="flip-card-back">
        <div class="flip-card-content">
          <h3 class="flip-card-title">{{ albumName }}</h3>
          <p v-if="description" class="flip-card-desc">{{ description }}</p>
          <div class="flip-card-meta">
            <span>{{ photoCount }} 张照片</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flip-card {
  perspective: 1000px;
  cursor: pointer;
  width: 100%;
  height: 100%;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.flip-card-inner.is-flipped {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 1rem;
  overflow: hidden;
}

.flip-card-front {
  background: #1e293b;
}

.flip-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.flip-card-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}

.flip-card-hint {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.75rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
  text-align: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.flip-card:hover .flip-card-hint {
  opacity: 1;
}

.flip-card-back {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  transform: rotateY(180deg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.flip-card-content {
  padding: 1.5rem;
  text-align: center;
  color: #e2e8f0;
}

.flip-card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.flip-card-desc {
  font-size: 0.875rem;
  color: #94a3b8;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.flip-card-meta {
  font-size: 0.75rem;
  color: #64748b;
}
</style>
