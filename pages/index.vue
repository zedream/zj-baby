<script setup lang="ts">
definePageMeta({ title: '首页' })
</script>

<template>
  <div class="bg-[#0f1117] min-h-screen">
    <HomeViewer>
      <!-- Screen 1: 3D Photo Orbit -->
      <section class="section">
        <div class="w-full h-full">
          <ClientOnly>
            <HomeOrbit />
            <template #fallback>
              <div class="w-full h-full flex items-center justify-center">
                <span class="text-[#64748b]">加载中...</span>
              </div>
            </template>
          </ClientOnly>
        </div>
        <!-- Overlay text -->
        <div class="absolute bottom-20 left-0 right-0 text-center pointer-events-none">
          <h2 class="text-3xl md:text-2xl font-bold text-white mb-2">📷 zj-baby</h2>
          <p class="text-base text-[#64748b]">拖拽旋转 · 滚轮缩放 · 感受 3D 轨道展示</p>
        </div>
      </section>

      <!-- Screen 2: 3D Carousel -->
      <section class="section">
        <div class="w-full h-full">
          <ClientOnly>
            <HomeCarousel />
            <template #fallback>
              <div class="w-full h-full flex items-center justify-center">
                <span class="text-[#64748b]">加载中...</span>
              </div>
            </template>
          </ClientOnly>
        </div>
        <!-- Overlay text -->
        <div class="absolute bottom-20 left-0 right-0 text-center pointer-events-none">
          <h2 class="text-3xl md:text-2xl font-bold text-white mb-2">🎠 3D 轮播</h2>
          <p class="text-base text-[#64748b]">左右滑动 · 拖拽旋转 · 探索照片集</p>
        </div>
      </section>

      <!-- Screen 3: Quick Links -->
      <section class="section">
        <div class="max-w-4xl mx-auto px-6 flex flex-col items-center justify-center">
          <h2 class="text-3xl md:text-2xl font-bold text-white mb-8">开始探索</h2>
          <div class="flex flex-col sm:flex-row gap-6 mb-12">
            <NuxtLink
              to="/gallery"
              class="flex-1 flex flex-col items-center gap-3 p-8 bg-[#1e293b] border border-[#334155] rounded-2xl no-underline transition-all duration-300 hover:border-[#3b82f6] hover:-translate-y-2 hover:shadow-lg hover:shadow-[#3b82f6]/20"
            >
              <span class="text-5xl">🖼️</span>
              <span class="text-xl font-semibold text-[#e2e8f0]">瀑布流</span>
              <span class="text-sm text-[#64748b]">Pinterest 风格展示</span>
            </NuxtLink>
            <NuxtLink
              to="/timeline"
              class="flex-1 flex flex-col items-center gap-3 p-8 bg-[#1e293b] border border-[#334155] rounded-2xl no-underline transition-all duration-300 hover:border-[#3b82f6] hover:-translate-y-2 hover:shadow-lg hover:shadow-[#3b82f6]/20"
            >
              <span class="text-5xl">📅</span>
              <span class="text-xl font-semibold text-[#e2e8f0]">时间线</span>
              <span class="text-sm text-[#64748b]">按时间轴记录</span>
            </NuxtLink>
          </div>
          <p class="text-sm text-[#475569]">滚动继续探索更多</p>
        </div>
      </section>
    </HomeViewer>
  </div>
</template>

<style scoped>
.section {
  width: 100%;
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
