<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  title: '照片管理'
})

// Mock albums for dropdown
const albums = ref([
  { id: '1', name: '旅行记录' },
  { id: '2', name: '日常生活' },
  { id: '3', name: '美食探店' },
])

// Mock photos
const photos = ref([
  { id: '1', albumId: '1', albumName: '旅行记录', filename: 'IMG_001.jpg', cdnUrl: 'https://picsum.photos/200/150?random=201', width: 1200, height: 900, createdAt: '2024-01-15' },
  { id: '2', albumId: '1', albumName: '旅行记录', filename: 'IMG_002.jpg', cdnUrl: 'https://picsum.photos/200/150?random=202', width: 1200, height: 900, createdAt: '2024-01-16' },
  { id: '3', albumId: '2', albumName: '日常生活', filename: 'IMG_003.jpg', cdnUrl: 'https://picsum.photos/200/150?random=203', width: 1200, height: 900, createdAt: '2024-02-20' },
  { id: '4', albumId: '2', albumName: '日常生活', filename: 'IMG_004.jpg', cdnUrl: 'https://picsum.photos/200/150?random=204', width: 1200, height: 900, createdAt: '2024-02-21' },
  { id: '5', albumId: '3', albumName: '美食探店', filename: 'IMG_005.jpg', cdnUrl: 'https://picsum.photos/200/150?random=205', width: 1200, height: 900, createdAt: '2024-03-10' },
])

const selectedAlbum = ref('')
const isUploading = ref(false)
const showUploadModal = ref(false)
const uploadForm = ref({
  albumId: '',
})

const filteredPhotos = computed(() => {
  if (!selectedAlbum.value) return photos.value
  return photos.value.filter(p => p.albumId === selectedAlbum.value)
})

const openUpload = () => {
  uploadForm.value.albumId = albums.value[0]?.id || ''
  showUploadModal.value = true
}

const handleUpload = async (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files?.length || !uploadForm.value.albumId) return

  isUploading.value = true

  // Simulate upload
  await new Promise(resolve => setTimeout(resolve, 1500))

  const album = albums.value.find(a => a.id === uploadForm.value.albumId)

  for (const file of Array.from(input.files)) {
    photos.value.unshift({
      id: String(Date.now() + Math.random()),
      albumId: uploadForm.value.albumId,
      albumName: album?.name || '',
      filename: file.name,
      cdnUrl: `https://picsum.photos/200/150?random=${Date.now()}`,
      width: 1200,
      height: 900,
      createdAt: new Date().toISOString().split('T')[0],
    })
  }

  isUploading.value = false
  showUploadModal.value = false
  input.value = ''
}

const deletePhoto = (id: string) => {
  if (confirm('确定要删除这张照片吗？')) {
    photos.value = photos.value.filter(p => p.id !== id)
  }
}
</script>

<template>
  <div class="px-6 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-white">照片管理</h1>
      <button
        class="px-4 py-2 bg-[#3b82f6] text-white rounded-lg text-sm hover:bg-[#2563eb] transition-colors"
        @click="openUpload"
      >
        ↑ 上传照片
      </button>
    </div>

    <!-- Filter -->
    <div class="flex gap-4 mb-6">
      <select
        v-model="selectedAlbum"
        class="px-4 py-2 bg-[#1e293b] border border-[#334155] rounded-lg text-white focus:border-[#3b82f6] focus:outline-none"
      >
        <option value="">所有相册</option>
        <option v-for="album in albums" :key="album.id" :value="album.id">
          {{ album.name }}
        </option>
      </select>
    </div>

    <!-- Photos Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <div
        v-for="photo in filteredPhotos"
        :key="photo.id"
        class="relative group aspect-square bg-[#1e293b] rounded-lg overflow-hidden"
      >
        <img
          :src="photo.cdnUrl"
          :alt="photo.filename"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
          <span class="text-white text-xs text-center px-2">{{ photo.filename }}</span>
          <button
            class="px-3 py-1 bg-[#ef4444] text-white rounded text-xs hover:bg-[#dc2626]"
            @click="deletePhoto(photo.id)"
          >
            删除
          </button>
        </div>
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
          <span class="text-white text-xs">{{ photo.albumName }}</span>
        </div>
      </div>
    </div>

    <div v-if="filteredPhotos.length === 0" class="p-12 text-center text-[#64748b]">
      暂无照片，点击上方按钮上传
    </div>

    <!-- Upload Modal -->
    <Teleport to="body">
      <div
        v-if="showUploadModal"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        @click.self="showUploadModal = false"
      >
        <div class="bg-[#1e293b] rounded-xl p-6 w-full max-w-md border border-[#334155]">
          <h2 class="text-lg font-semibold text-white mb-4">上传照片</h2>

          <div class="space-y-4">
            <div>
              <label class="block text-[#94a3b8] text-sm mb-1">选择相册</label>
              <select
                v-model="uploadForm.albumId"
                class="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:border-[#3b82f6] focus:outline-none"
              >
                <option v-for="album in albums" :key="album.id" :value="album.id">
                  {{ album.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-[#94a3b8] text-sm mb-1">选择照片</label>
              <div class="border-2 border-dashed border-[#334155] rounded-lg p-8 text-center hover:border-[#3b82f6] transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  class="hidden"
                  id="photo-upload"
                  @change="handleUpload"
                />
                <label for="photo-upload" class="cursor-pointer">
                  <div class="text-[#94a3b8] mb-2">
                    <span class="text-4xl">📷</span>
                  </div>
                  <div class="text-[#e2e8f0] text-sm">点击选择照片</div>
                  <div class="text-[#64748b] text-xs mt-1">支持 JPG、PNG、WebP</div>
                </label>
              </div>
            </div>

            <div v-if="isUploading" class="text-center text-[#94a3b8] text-sm">
              上传中...
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              class="px-4 py-2 text-[#94a3b8] hover:text-white text-sm"
              @click="showUploadModal = false"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
