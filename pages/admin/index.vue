<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  title: '管理后台'
})

// Mock stats - in production would come from API
const stats = ref([
  { label: '相册', value: 12, icon: '📁', color: '#3b82f6' },
  { label: '照片', value: 186, icon: '🖼️', color: '#10b981' },
  { label: '用户', value: 5, icon: '👥', color: '#f59e0b' },
  { label: '收藏', value: 42, icon: '❤️', color: '#ef4444' },
])

const recentActivity = ref([
  { action: '上传了 5 张照片', time: '2小时前', type: 'photo' },
  { action: '创建了相册「旅行记录」', time: '1天前', type: 'album' },
  { action: '更新了相册「美食探店」', time: '3天前', type: 'album' },
  { action: '删除了 2 张照片', time: '1周前', type: 'photo' },
])
</script>

<template>
  <div class="px-6 py-8">
    <h1 class="text-2xl font-bold text-white mb-6">仪表盘</h1>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-[#1e293b] rounded-xl p-6 border border-[#334155]"
      >
        <div class="flex items-center gap-3 mb-2">
          <span class="text-2xl">{{ stat.icon }}</span>
          <span class="text-[#94a3b8] text-sm">{{ stat.label }}</span>
        </div>
        <div class="text-3xl font-bold text-white">{{ stat.value }}</div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-[#1e293b] rounded-xl p-6 border border-[#334155] mb-8">
      <h2 class="text-lg font-semibold text-white mb-4">快速操作</h2>
      <div class="flex flex-wrap gap-3">
        <NuxtLink
          to="/admin/albums"
          class="px-4 py-2 bg-[#3b82f6] text-white rounded-lg text-sm hover:bg-[#2563eb] transition-colors no-underline"
        >
          + 新建相册
        </NuxtLink>
        <NuxtLink
          to="/admin/photos"
          class="px-4 py-2 bg-[#1e293b] text-[#e2e8f0] border border-[#334155] rounded-lg text-sm hover:border-[#3b82f6] transition-colors no-underline"
        >
          上传照片
        </NuxtLink>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-[#1e293b] rounded-xl p-6 border border-[#334155]">
      <h2 class="text-lg font-semibold text-white mb-4">最近活动</h2>
      <div class="space-y-3">
        <div
          v-for="(item, i) in recentActivity"
          :key="i"
          class="flex items-center justify-between py-2 border-b border-[#334155] last:border-0"
        >
          <span class="text-[#e2e8f0]">{{ item.action }}</span>
          <span class="text-[#64748b] text-sm">{{ item.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
