<script setup lang="ts">
const container = ref<HTMLDivElement>()
let renderer: any
let scene: any
let camera: any
let controls: any
let animationId: number
const photoCount = 8
const photos: any[] = []

const initThree = async () => {
  if (!container.value) return

  const THREE = await import('three')
  const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js')

  // Scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0f1117)

  // Camera - position to see the full ring
  camera = new THREE.PerspectiveCamera(
    50,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000
  )
  camera.position.set(0, 0, 10)
  camera.lookAt(0, 0, 0)

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
  controls.autoRotateSpeed = 0.8
  controls.minDistance = 5
  controls.maxDistance = 20
  controls.target.set(0, 0, 0)

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
  scene.add(ambientLight)

  const pointLight = new THREE.PointLight(0xffffff, 1, 50)
  pointLight.position.set(0, 5, 5)
  scene.add(pointLight)

  // Load photos in orbital ring - tilted ellipse for better view
  const textureLoader = new THREE.TextureLoader()
  const radius = 5

  for (let i = 0; i < photoCount; i++) {
    const angle = (i / photoCount) * Math.PI * 2
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius

    const geometry = new THREE.PlaneGeometry(2, 1.5)
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(x, 0, z)
    // Tilt the photos slightly toward camera for better visibility
    mesh.rotation.y = -angle
    mesh.rotation.x = -0.2

    photos.push(mesh)
    scene.add(mesh)

    // Load texture
    const seed = i + 1
    textureLoader.load(
      `https://picsum.photos/400/300?random=${seed}`,
      (texture: any) => {
        texture.colorSpace = THREE.SRGBColorSpace
        material.map = texture
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

  photos.forEach((photo: any) => {
    photo.geometry.dispose()
    const mat = photo.material
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
