<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div class="layout">
    <nav class="nav">
      <NuxtLink to="/" class="nav__logo">📷 zj-baby</NuxtLink>
      <div class="nav__links">
        <NuxtLink to="/" class="nav__link" :class="{ active: route.path === '/' }">首页</NuxtLink>
        <NuxtLink to="/gallery" class="nav__link" :class="{ active: route.path === '/gallery' }">瀑布流</NuxtLink>
        <NuxtLink to="/timeline" class="nav__link" :class="{ active: route.path === '/timeline' }">时间线</NuxtLink>
      </div>
    </nav>
    <slot />
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  height: 56px;
  background: rgba(15, 17, 23, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #1e293b;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav__logo {
  font-size: 18px;
  font-weight: 700;
  color: #f8fafc;
  text-decoration: none;
}

.nav__links {
  display: flex;
  gap: 8px;
}

.nav__link {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  color: #94a3b8;
  text-decoration: none;
  transition: all 0.2s;
}

.nav__link:hover {
  color: #e2e8f0;
  background: #1e293b;
}

.nav__link.active {
  color: white;
  background: #3b82f6;
}
</style>
