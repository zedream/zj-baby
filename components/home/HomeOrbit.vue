<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const container = ref<HTMLDivElement>()
let renderer: THREE.WebGLRenderer
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let controls: OrbitControls
let animationId: number
const photoCount = 8
const photos: THREE.Mesh[] = []

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
  camera.position.set(0, 2, 8)

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.value.appendChild(renderer.domElement)

  // Controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.5
  controls.minDistance = 4
  controls.maxDistance = 15

  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  // Directional light
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.4)
  dirLight.position.set(5, 5, 5)
  scene.add(dirLight)

  // Load photos in orbital ring
  const textureLoader = new THREE.TextureLoader()
  const radius = 4

  for (let i = 0; i < photoCount; i++) {
    const angle = (i / photoCount) * Math.PI * 2
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius

    const geometry = new THREE.PlaneGeometry(1.8, 1.35) // 4:3 aspect ratio
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(x, 0, z)
    mesh.rotation.y = -angle

    photos.push(mesh)
    scene.add(mesh)

    // Load texture
    const seed = i + 1
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
    controls.update()
    renderer.render(scene, camera)
  }
  animate()

  // Resize handler
  window.addEventListener('resize', onResize)
}

const onResize = () => {
  if (!container.value) return
  camera.aspect = container.value.clientWidth / container.value.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
}

const cleanup = () => {
  window.removeEventListener('resize', onResize)
  if (animationId) cancelAnimationFrame(animationId)

  photos.forEach((photo) => {
    photo.geometry.dispose()
    const mat = photo.material as THREE.MeshBasicMaterial
    if (mat.map) mat.map.dispose()
    mat.dispose()
  })

  renderer?.dispose()
  controls?.dispose()
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
