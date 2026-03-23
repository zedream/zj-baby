<script setup lang="ts">
import * as THREE from 'three'

const container = ref<HTMLDivElement>()
let renderer: THREE.WebGLRenderer
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let animationId: number
const photos: THREE.Mesh[] = []
const photoCount = 8

// Drag state
let isDragging = false
let previousMouseX = 0
let rotationVelocity = 0
let currentRotation = 0
const autoRotateSpeed = 0.003
const dragDamping = 0.95
const minVelocity = 0.0001

const initThree = async () => {
  if (!container.value) return

  const THREE = await import('three')

  // Scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0f1117)

  // Camera
  camera = new THREE.PerspectiveCamera(
    60,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000
  )
  camera.position.set(0, 0, 8)

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.value.appendChild(renderer.domElement)

  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  // Directional light
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.4)
  dirLight.position.set(0, 5, 5)
  scene.add(dirLight)

  // Load photos in carousel wheel
  const textureLoader = new THREE.TextureLoader()
  const radius = 3.5

  for (let i = 0; i < photoCount; i++) {
    const angle = (i / photoCount) * Math.PI * 2
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius

    const geometry = new THREE.PlaneGeometry(1.6, 1.2) // 4:3
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(x, 0, z)

    photos.push(mesh)
    scene.add(mesh)

    // Load texture
    const seed = i + 9
    textureLoader.load(
      `https://picsum.photos/400/300?random=${seed}`,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace
        ;(material as THREE.MeshBasicMaterial).map = texture
        material.opacity = 1
        material.needsUpdate = true
      }
    )
  }

  // Animation
  const animate = () => {
    animationId = requestAnimationFrame(animate)

    // Apply rotation velocity
    currentRotation += rotationVelocity

    // Auto rotate when not dragging and velocity is low
    if (!isDragging && Math.abs(rotationVelocity) < minVelocity) {
      currentRotation += autoRotateSpeed
    }

    // Apply damping
    rotationVelocity *= dragDamping

    // Update photo positions and billboard effect
    photos.forEach((photo, i) => {
      const baseAngle = (i / photoCount) * Math.PI * 2
      const angle = baseAngle + currentRotation
      photo.position.x = Math.cos(angle) * radius
      photo.position.z = Math.sin(angle) * radius

      // Billboard: face camera
      photo.lookAt(camera.position)
    })

    renderer.render(scene, camera)
  }
  animate()

  // Event listeners
  container.value.addEventListener('mousedown', onMouseDown)
  container.value.addEventListener('mousemove', onMouseMove)
  container.value.addEventListener('mouseup', onMouseUp)
  container.value.addEventListener('mouseleave', onMouseUp)
  container.value.addEventListener('touchstart', onTouchStart, { passive: true })
  container.value.addEventListener('touchmove', onTouchMove, { passive: false })
  container.value.addEventListener('touchend', onTouchEnd)
  window.addEventListener('resize', onResize)
}

const onMouseDown = (e: MouseEvent) => {
  isDragging = true
  previousMouseX = e.clientX
}

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging) return
  const deltaX = e.clientX - previousMouseX
  rotationVelocity = deltaX * 0.001
  previousMouseX = e.clientX
}

const onMouseUp = () => {
  isDragging = false
}

const onTouchStart = (e: TouchEvent) => {
  if (e.touches.length === 1) {
    isDragging = true
    previousMouseX = e.touches[0].clientX
  }
}

const onTouchMove = (e: TouchEvent) => {
  if (!isDragging || e.touches.length !== 1) return
  e.preventDefault()
  const deltaX = e.touches[0].clientX - previousMouseX
  rotationVelocity = deltaX * 0.001
  previousMouseX = e.touches[0].clientX
}

const onTouchEnd = () => {
  isDragging = false
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
    container.value.removeEventListener('touchstart', onTouchStart)
    container.value.removeEventListener('touchmove', onTouchMove)
    container.value.removeEventListener('touchend', onTouchEnd)
  }
  window.removeEventListener('resize', onResize)
  if (animationId) cancelAnimationFrame(animationId)

  photos.forEach((photo) => {
    photo.geometry.dispose()
    const mat = photo.material as THREE.MeshBasicMaterial
    if (mat.map) mat.map.dispose()
    mat.dispose()
  })

  renderer?.dispose()
}

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
