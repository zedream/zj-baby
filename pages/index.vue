<script setup lang="ts">
definePageMeta({ title: '首页' })

const placeholderImg = (seed = 1) => `https://picsum.photos/800/600?random=${seed}`
</script>

<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <h1 class="hero__title">📷 zj-baby</h1>
      <p class="hero__subtitle">个人照片展示站 · 作品集 · 家庭相册</p>
      <div class="hero__actions">
        <NuxtLink to="/gallery" class="hero__btn hero__btn--primary">浏览照片</NuxtLink>
        <NuxtLink to="/timeline" class="hero__btn hero__btn--secondary">时光轴</NuxtLink>
      </div>
      <p class="hero__note">⚡ 3D 首页效果即将上线</p>
    </section>

    <!-- Featured Photos -->
    <section class="featured">
      <h2 class="featured__title">精选照片</h2>
      <div class="featured__grid">
        <img
          v-for="i in 6"
          :key="i"
          :src="placeholderImg(i)"
          class="featured__img"
          loading="lazy"
        />
      </div>
    </section>

    <!-- Quick Links -->
    <section class="quick-links">
      <NuxtLink to="/gallery" class="quick-link">
        <span class="quick-link__icon">🖼️</span>
        <span class="quick-link__text">瀑布流</span>
        <span class="quick-link__desc">Pinterest 风格展示</span>
      </NuxtLink>
      <NuxtLink to="/timeline" class="quick-link">
        <span class="quick-link__icon">📅</span>
        <span class="quick-link__text">时间线</span>
        <span class="quick-link__desc">按时间轴记录</span>
      </NuxtLink>
    </section>
  </div>
</template>

<style scoped>
.home {
  background: #0f1117;
  min-height: 100vh;
}

.hero {
  text-align: center;
  padding: 100px 24px 80px;
}

.hero__title {
  font-size: 56px;
  font-weight: 800;
  color: #f8fafc;
  margin-bottom: 16px;
}

.hero__subtitle {
  font-size: 18px;
  color: #64748b;
  margin-bottom: 40px;
}

.hero__actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 32px;
}

.hero__btn {
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 15px;
  text-decoration: none;
  transition: all 0.2s;
}

.hero__btn--primary {
  background: #3b82f6;
  color: white;
}

.hero__btn--primary:hover {
  background: #2563eb;
}

.hero__btn--secondary {
  background: #1e293b;
  color: #e2e8f0;
  border: 1px solid #334155;
}

.hero__btn--secondary:hover {
  border-color: #3b82f6;
}

.hero__note {
  font-size: 13px;
  color: #475569;
}

.featured {
  padding: 0 24px 80px;
}

.featured__title {
  font-size: 20px;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 24px;
}

.featured__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.featured__img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: 12px;
  transition: transform 0.3s;
}

.featured__img:hover {
  transform: scale(1.03);
}

.quick-links {
  display: flex;
  gap: 16px;
  padding: 0 24px 80px;
  max-width: 600px;
  margin: 0 auto;
}

.quick-link {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px 24px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s;
}

.quick-link:hover {
  border-color: #3b82f6;
  transform: translateY(-4px);
}

.quick-link__icon {
  font-size: 32px;
}

.quick-link__text {
  font-size: 16px;
  font-weight: 600;
  color: #e2e8f0;
}

.quick-link__desc {
  font-size: 12px;
  color: #64748b;
}

@media (max-width: 640px) {
  .hero {
    padding: 60px 16px 40px;
  }

  .hero__title {
    font-size: 36px;
  }

  .hero__subtitle {
    font-size: 15px;
  }

  .hero__actions {
    flex-direction: column;
    align-items: center;
  }

  .featured__grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .quick-links {
    flex-direction: column;
    padding: 0 16px 60px;
  }
}
</style>
