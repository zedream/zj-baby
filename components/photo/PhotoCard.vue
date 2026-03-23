<script setup lang="ts">
interface Props {
  src: string
  alt?: string
  width?: number
  height?: number
  aspectRatio?: string
  loading?: 'lazy' | 'eager'
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  width: 300,
  height: 200,
  loading: 'lazy'
})

const aspectStyle = computed(() => {
  if (props.aspectRatio) {
    return { aspectRatio: props.aspectRatio }
  }
  return { paddingBottom: `${(props.height / props.width) * 100}%` }
})
</script>

<template>
  <div class="photo-card" :style="aspectStyle">
    <img
      :src="src"
      :alt="alt"
      :loading="loading"
      class="photo-card__img"
      @click="$emit('click')"
    />
  </div>
</template>

<style scoped>
.photo-card {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
  background: #1e293b;
  cursor: pointer;
}

.photo-card__img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease, filter 0.3s ease;
}

.photo-card:hover .photo-card__img {
  transform: scale(1.05);
  filter: brightness(1.1);
}
</style>
