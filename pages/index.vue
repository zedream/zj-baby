<script setup lang="ts">
definePageMeta({ title: '首页' })

const placeholderImg = (seed = 1) => `https://picsum.photos/800/600?random=${seed}`
</script>

<template>
  <div class="bg-[#0f1117] min-h-screen">
    <!-- Hero -->
    <section class="text-center px-6 py-24 md:py-16">
      <h1 class="text-5xl md:text-4xl font-extrabold text-white mb-4">📷 zj-baby</h1>
      <p class="text-lg md:text-base text-[#64748b] mb-10">个人照片展示站 · 作品集 · 家庭相册</p>
      <div class="flex gap-4 justify-center mb-8 flex-col sm:flex-row">
        <NuxtLink
          to="/gallery"
          class="px-8 py-3 rounded-lg bg-[#3b82f6] text-white text-base no-underline transition-colors hover:bg-[#2563eb]"
        >
          浏览照片
        </NuxtLink>
        <NuxtLink
          to="/timeline"
          class="px-8 py-3 rounded-lg bg-[#1e293b] text-[#e2e8f0] text-base border border-[#334155] no-underline transition-colors hover:border-[#3b82f6]"
        >
          时光轴
        </NuxtLink>
      </div>
      <p class="text-sm text-[#475569]">⚡ 3D 首页效果即将上线</p>
    </section>

    <!-- Featured -->
    <section class="px-6 pb-20 max-w-4xl mx-auto">
      <h2 class="text-xl font-semibold text-[#e2e8f0] mb-6">精选照片</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <img
          v-for="i in 6"
          :key="i"
          :src="placeholderImg(i)"
          class="w-full aspect-[4/3] object-cover rounded-xl transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </div>
    </section>

    <!-- Quick Links -->
    <section class="px-6 pb-20 max-w-md mx-auto flex flex-col sm:flex-row gap-4">
      <NuxtLink
        to="/gallery"
        class="flex-1 flex flex-col items-center gap-2 p-8 bg-[#1e293b] border border-[#334155] rounded-xl no-underline transition-all duration-200 hover:border-[#3b82f6] hover:-translate-y-1"
      >
        <span class="text-3xl">🖼️</span>
        <span class="text-base font-semibold text-[#e2e8f0]">瀑布流</span>
        <span class="text-xs text-[#64748b]">Pinterest 风格展示</span>
      </NuxtLink>
      <NuxtLink
        to="/timeline"
        class="flex-1 flex flex-col items-center gap-2 p-8 bg-[#1e293b] border border-[#334155] rounded-xl no-underline transition-all duration-200 hover:border-[#3b82f6] hover:-translate-y-1"
      >
        <span class="text-3xl">📅</span>
        <span class="text-base font-semibold text-[#e2e8f0]">时间线</span>
        <span class="text-xs text-[#64748b]">按时间轴记录</span>
      </NuxtLink>
    </section>
  </div>
</template>
