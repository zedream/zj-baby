<script setup lang="ts">
const containerRef = ref<HTMLDivElement>()
const fpInstance = ref<any>(null)
let isMounted = true

onMounted(() => {
  isMounted = true
  // Immediately hide scrollbar on body and html before fullpage loads
  document.body.style.overflow = 'hidden'
  document.documentElement.style.overflow = 'hidden'
  
  // Delay init slightly to ensure DOM is ready
  setTimeout(() => {
    if (isMounted && containerRef.value) {
      initFullpage()
    }
  }, 50)
})

const initFullpage = async () => {
  if (!containerRef.value || !isMounted) return

  try {
    // Only import on client side
    const { default: fpModule } = await import('fullpage.js')

    if (!isMounted || !containerRef.value) return

    // Destroy existing instance if any
    if (fpInstance.value && fpInstance.value.destroy) {
      fpInstance.value.destroy('all')
    }
    fpInstance.value = null

    // Create new instance - fpModule() returns the instance
    const instance = fpModule(containerRef.value, {
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
    
    // Save the actual instance (which has destroy method)
    fpInstance.value = instance
  } catch (e) {
    console.error('Failed to init fullpage:', e)
  }
}

onBeforeUnmount(() => {
  isMounted = false
  
  // Destroy fullpage instance
  if (fpInstance.value && fpInstance.value.destroy) {
    try {
      fpInstance.value.destroy('all')
    } catch (e) {
      // Ignore destroy errors
    }
  }
  fpInstance.value = null
  
  // Force clean EVERYTHING fullpage might have added
  const body = document.body
  const html = document.documentElement
  
  // Clear all fullpage classes
  body.className = body.className.split(' ')
    .filter(c => !c.startsWith('fp-') && !c.startsWith('fp.'))
    .join(' ')
    .trim()
  
  html.className = html.className.split(' ')
    .filter(c => !c.startsWith('fp-') && !c.startsWith('fp.'))
    .join(' ')
    .trim()
  
  // Remove fullpage added styles
  body.style.overflow = ''
  body.style.position = ''
  body.style.top = ''
  body.style.width = ''
  body.style.height = ''
  body.removeAttribute('data-fp-extension')
  
  html.style.overflow = ''
  html.style.height = ''
  html.removeAttribute('data-fp-extension')
  
  // Remove ALL fullpage added elements
  document.querySelectorAll('.fp-nav, .fp-slidesNav, .fp-controlArrow, .fp-tooltip, .fullpage-section-slides, .fullpage-slides, .fullpage-slide, .fullpage-section, [data-fp-extension]').forEach(el => el.remove())
  
  // Reset html/body scroll
  window.scrollTo(0, 0)
  
  // Clean container
  if (containerRef.value) {
    containerRef.value.className = ''
    containerRef.value.removeAttribute('style')
  }
})
</script>

<template>
  <div ref="containerRef" id="fullpage">
    <slot />
  </div>
</template>

<style>
/* Hide scrollbar immediately when homepage loads */
html, body {
  overflow: hidden !important;
  scrollbar-width: none; /* Firefox */
}

html::-webkit-scrollbar, body::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

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
