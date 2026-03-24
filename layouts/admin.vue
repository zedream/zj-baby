<script setup lang="ts">
const route = useRoute()

const adminLinks = [
  { to: '/admin', label: '仪表盘', icon: '📊' },
  { to: '/admin/albums', label: '相册管理', icon: '📁' },
  { to: '/admin/photos', label: '照片管理', icon: '🖼️' },
]
</script>

<template>
  <div class="min-h-screen bg-[#0f1117]">
    <!-- Admin Nav -->
    <nav class="sticky top-0 z-100 flex items-center justify-between px-5 h-14 bg-[#0f1117]/95 backdrop-blur10 border-b border-[#1e293b]">
      <div class="flex items-center gap-6">
        <NuxtLink to="/" class="text-lg font-bold text-white no-underline">
          📷 zj-baby
        </NuxtLink>
        <span class="text-[#64748b] text-sm">管理后台</span>
      </div>

      <div class="flex gap-2">
        <NuxtLink
          v-for="link in adminLinks"
          :key="link.to"
          :to="link.to"
          class="px-4 py-1.5 rounded-full text-sm transition-all duration-200 no-underline"
          :class="route.path === link.to
            ? 'bg-[#3b82f6] text-white'
            : 'text-[#94a3b8] hover:text-white hover:bg-[#1e293b]'"
        >
          <span class="mr-1">{{ link.icon }}</span>
          {{ link.label }}
        </NuxtLink>
      </div>
    </nav>

    <slot />
  </div>
</template>
