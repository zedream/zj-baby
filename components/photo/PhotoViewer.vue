<script setup lang="ts">
const props = defineProps<{
  src: string
  alt?: string
}>()

const emit = defineEmits<{
  close: []
  prev: []
  next: []
}>()

const container = ref<HTMLDivElement>()
let renderer: any
let scene: any
let camera: any
let photoMesh: any
let animationId: number

// 3D transform state
let isDragging = false
let previousMouseX = 0
let previousMouseY = 0
let rotationX = 0
let rotationY = 0
let targetRotationX = 0
let targetRotationY = 0
let targetScale = 1
let currentScale = 1

const minScale = 0.5
const maxScale = 3
const rotationSensitivity = 0.005
const zoomSensitivity = 0.001
const damping = 0.1

const initThree = async () => {
  if (!container.value) return

  const THREE = await import('three')

  // Scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0a0a)

  // Camera
  camera = new THREE.PerspectiveCamera(
    50,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000
  )
  camera.position.z = 5

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.value.appendChild(renderer.domElement)

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  const pointLight = new THREE.PointLight(0xffffff, 0.8, 50)
  pointLight.position.set(0, 0, 5)
  scene.add(pointLight)

  // Create photo plane with shadow
  const textureLoader = new THREE.TextureLoader()
  const geometry = new THREE.PlaneGeometry(4, 3)

  // Add shadow effect with custom material
  const material = new THREE.MeshStandardMaterial({
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
  })

  photoMesh = new THREE.Mesh(geometry, material)

  // Add slight tilt for 3D perspective effect
  photoMesh.rotation.x = -0.1

  // Add shadow plane behind
  const shadowGeometry = new THREE.PlaneGeometry(4.2, 3.2)
  const shadowMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.3,
  })
  const shadowPlane = new THREE.Mesh(shadowGeometry, shadowMaterial)
  shadowPlane.position.z = -0.1
  shadowPlane.position.y = -0.05
  scene.add(shadowPlane)

  scene.add(photoMesh)

  // Load texture
  textureLoader.load(
    props.src,
    (texture: any) => {
      texture.colorSpace = THREE.SRGBColorSpace
      material.map = texture
      material.opacity = 1
      material.needsUpdate = true
    },
    undefined,
    () => {
      // Fallback on error
      material.opacity = 1
    }
  )

  // Animation loop
  const animate = () => {
    animationId = requestAnimationFrame(animate)

    // Smooth interpolation
    rotationX += (targetRotationX - rotationX) * damping
    rotationY += (targetRotationY - rotationY) * damping
    currentScale += (targetScale - currentScale) * damping

    photoMesh.rotation.x = rotationX - 0.1
    photoMesh.rotation.y = rotationY
    photoMesh.scale.set(currentScale, currentScale, 1)

    renderer.render(scene, camera)
  }
  animate()

  // Event listeners
  container.value.addEventListener('mousedown', onMouseDown)
  container.value.addEventListener('mousemove', onMouseMove)
  container.value.addEventListener('mouseup', onMouseUp)
  container.value.addEventListener('mouseleave', onMouseUp)
  container.value.addEventListener('wheel', onWheel, { passive: false })
  container.value.addEventListener('touchstart', onTouchStart, { passive: true })
  container.value.addEventListener('touchmove', onTouchMove, { passive: false })
  container.value.addEventListener('touchend', onTouchEnd)
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('resize', onResize)
}

const onMouseDown = (e: MouseEvent) => {
  if (e.button !== 0) return
  isDragging = true
  previousMouseX = e.clientX
  previousMouseY = e.clientY
}

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging) return

  const deltaX = e.clientX - previousMouseX
  const deltaY = e.clientY - previousMouseY

  targetRotationY += deltaX * rotationSensitivity
  targetRotationX += deltaY * rotationSensitivity

  // Clamp vertical rotation
  targetRotationX = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, targetRotationX))

  previousMouseX = e.clientX
  previousMouseY = e.clientY
}

const onMouseUp = () => {
  isDragging = false
}

const onWheel = (e: WheelEvent) => {
  e.preventDefault()
  targetScale -= e.deltaY * zoomSensitivity
  targetScale = Math.max(minScale, Math.min(maxScale, targetScale))
}

const onTouchStart = (e: TouchEvent) => {
  if (e.touches.length === 1) {
    isDragging = true
    previousMouseX = e.touches[0].clientX
    previousMouseY = e.touches[0].clientY
  }
}

const onTouchMove = (e: TouchEvent) => {
  if (!isDragging || e.touches.length !== 1) return
  e.preventDefault()

  const deltaX = e.touches[0].clientX - previousMouseX
  const deltaY = e.touches[0].clientY - previousMouseY

  targetRotationY += deltaX * rotationSensitivity
  targetRotationX += deltaY * rotationSensitivity
  targetRotationX = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, targetRotationX))

  previousMouseX = e.touches[0].clientX
  previousMouseY = e.touches[0].clientY
}

const onTouchEnd = () => {
  isDragging = false
}

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    emit('close')
  } else if (e.key === 'ArrowLeft') {
    emit('prev')
  } else if (e.key === 'ArrowRight') {
    emit('next')
  }
}

const onResize = () => {
  if (!container.value) return
  camera.aspect = container.value.clientWidth / container.value.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
}

const cleanup = () => {
  if (container.value) {
    container.value.removeEventListener('mousedown', onMouseDown)
    container.value.removeEventListener('mousemove', onMouseMove)
    container.value.removeEventListener('mouseup', onMouseUp)
    container.value.removeEventListener('mouseleave', onMouseUp)
    container.value.removeEventListener('wheel', onWheel)
    container.value.removeEventListener('touchstart', onTouchStart)
    container.value.removeEventListener('touchmove', onTouchMove)
    container.value.removeEventListener('touchend', onTouchEnd)
  }
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('resize', onResize)

  if (animationId) cancelAnimationFrame(animationId)
  if (photoMesh) {
    photoMesh.geometry.dispose()
    if (photoMesh.material.map) photoMesh.material.map.dispose()
    photoMesh.material.dispose()
  }
  renderer?.dispose()
}

watch(() => props.src, () => {
  if (!photoMesh) return
  const THREE = window.THREE
  if (THREE && photoMesh.material.map) {
    photoMesh.material.map.dispose()
  }
})

onMounted(() => {
  initThree()
})

onUnmounted(() => {
  cleanup()
})
</script>

<template>
  <div ref="container" class="w-full h-full" />
</template>
