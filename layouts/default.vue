<script setup lang="ts">
const route = useRoute()
const mobileMenuOpen = ref(false)

const toggleMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMenu = () => {
  mobileMenuOpen.value = false
}
</script>

<template>
  <div class="layout">
    <nav class="nav">
      <NuxtLink to="/" class="nav__logo" @click="closeMenu">📷 zj-baby</NuxtLink>

      <!-- Desktop nav -->
      <div class="nav__links">
        <NuxtLink to="/" class="nav__link" :class="{ active: route.path === '/' }">首页</NuxtLink>
        <NuxtLink to="/gallery" class="nav__link" :class="{ active: route.path === '/gallery' }">瀑布流</NuxtLink>
        <NuxtLink to="/timeline" class="nav__link" :class="{ active: route.path === '/timeline' }">时间线</NuxtLink>
      </div>

      <!-- Mobile hamburger -->
      <button class="nav__hamburger" :class="{ open: mobileMenuOpen }" @click="toggleMenu" aria-label="菜单">
        <span /><span /><span />
      </button>
    </nav>

    <!-- Mobile menu -->
    <Transition name="slide">
      <div v-if="mobileMenuOpen" class="nav__mobile-menu">
        <NuxtLink to="/" class="nav__mobile-link" :class="{ active: route.path === '/' }" @click="closeMenu">首页</NuxtLink>
        <NuxtLink to="/gallery" class="nav__mobile-link" :class="{ active: route.path === '/gallery' }" @click="closeMenu">瀑布流</NuxtLink>
        <NuxtLink to="/timeline" class="nav__mobile-link" :class="{ active: route.path === '/timeline' }" @click="closeMenu">时间线</NuxtLink>
      </div>
    </Transition>

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
  padding: 0 20px;
  height: 56px;
  background: rgba(15, 17, 23, 0.95);
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

/* Hamburger */
.nav__hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.nav__hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: #e2e8f0;
  border-radius: 2px;
  transition: all 0.3s;
}

.nav__hamburger.open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.nav__hamburger.open span:nth-child(2) {
  opacity: 0;
}

.nav__hamburger.open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* Mobile menu */
.nav__mobile-menu {
  display: flex;
  flex-direction: column;
  background: rgba(15, 17, 23, 0.98);
  border-bottom: 1px solid #1e293b;
  z-index: 99;
}

.nav__mobile-link {
  padding: 16px 20px;
  font-size: 15px;
  color: #94a3b8;
  text-decoration: none;
  border-bottom: 1px solid #1e293b;
  transition: all 0.2s;
}

.nav__mobile-link:hover,
.nav__mobile-link.active {
  color: white;
  background: #1e293b;
}

/* Slide transition */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive */
@media (max-width: 640px) {
  .nav__links {
    display: none;
  }

  .nav__hamburger {
    display: flex;
  }
}
</style>
