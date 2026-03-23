<script setup lang="ts">
const route = useRoute()
const mobileMenuOpen = ref(false)
const toggleMenu = () => mobileMenuOpen.value = !mobileMenuOpen.value
const closeMenu = () => mobileMenuOpen.value = false
</script>

<template>
  <div class="min-h-screen bg-[#0f1117]">
    <!-- Nav -->
    <nav class="sticky top-0 z-100 flex items-center justify-between px-5 h-14 bg-[#0f1117]/95 backdrop-blur10 border-b border-[#1e293b]">
      <NuxtLink to="/" class="text-lg font-bold text-white no-underline" @click="closeMenu">
        📷 zj-baby
      </NuxtLink>

      <!-- Desktop links -->
      <div class="hidden sm:flex gap-2">
        <NuxtLink
          v-for="link in [
            { to: '/', label: '首页' },
            { to: '/gallery', label: '瀑布流' },
            { to: '/timeline', label: '时间线' },
          ]"
          :key="link.to"
          :to="link.to"
          class="px-4 py-1.5 rounded-full text-sm transition-all duration-200 no-underline"
          :class="route.path === link.to
            ? 'bg-[#3b82f6] text-white'
            : 'text-[#94a3b8] hover:text-white hover:bg-[#1e293b]'"
        >
          {{ link.label }}
        </NuxtLink>
      </div>

      <!-- Hamburger -->
      <button class="flex sm:hidden flex-col gap-1.5 bg-none border-none cursor-pointer p-2" @click="toggleMenu" aria-label="菜单">
        <span class="block w-5 h-0.5 bg-white rounded transition-all duration-300" :class="mobileMenuOpen ? 'rotate-45 translate-y-2' : ''" />
        <span class="block w-5 h-0.5 bg-white rounded transition-all duration-300" :class="mobileMenuOpen ? 'opacity-0' : ''" />
        <span class="block w-5 h-0.5 bg-white rounded transition-all duration-300" :class="mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''" />
      </button>
    </nav>

    <!-- Mobile menu -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="mobileMenuOpen" class="flex sm:hidden flex-col bg-[#0f1117]/98 border-b border-[#1e293b]">
        <NuxtLink
          v-for="link in [
            { to: '/', label: '首页' },
            { to: '/gallery', label: '瀑布流' },
            { to: '/timeline', label: '时间线' },
          ]"
          :key="link.to"
          :to="link.to"
          class="px-5 py-4 text-sm border-b border-[#1e293b] no-underline transition-all duration-200"
          :class="route.path === link.to ? 'text-white bg-[#1e293b]' : 'text-[#94a3b8]'"
          @click="closeMenu"
        >
          {{ link.label }}
        </NuxtLink>
      </div>
    </Transition>

    <slot />
  </div>
</template>
