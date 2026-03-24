<script setup lang="ts">
const containerRef = ref<HTMLDivElement>()
let fp: any = null

const initFullpage = async () => {
  if (!containerRef.value) return

  // Only import on client side
  const { default: fpModule } = await import('fullpage.js')

  fp = fpModule

  fp(containerRef.value, {
    licenseKey: 'OPEN-SOURCE-GPLV3-LICENSE',
    autoScrolling: true,
    scrollBar: false,
    navigation: true,
    navigationPosition: 'right',
    controlArrows: false,
    sectionsColor: ['#0f1117', '#0f1117'],
    afterLoad: (origin: any, destination: any) => {
      // Could add entrance animations here
    },
  })
}

onMounted(() => {
  initFullpage()
})

onUnmounted(() => {
  if (fp && fp.destroy) {
    fp.destroy('all')
  }
})
</script>

<template>
  <div ref="containerRef" id="fullpage">
    <slot />
  </div>
</template>

<style>
#fullpage {
  width: 100%;
  height: 100vh;
}

#fullpage .fp-section {
  width: 100%;
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

#fullpage .fp-nav {
  right: 20px;
}

#fullpage .fp-nav ul li {
  margin: 8px 0;
}

#fullpage .fp-nav ul li a {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

#fullpage .fp-nav ul li a.active,
#fullpage .fp-nav ul li a:hover {
  background: #3b82f6;
  transform: scale(1.2);
}
</style>
