<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  title: '相册管理'
})

// Mock data
const albums = ref([
  { id: '1', name: '旅行记录', description: '2024年各地旅行的照片集', visibility: 'public', photoCount: 24, createdAt: '2024-01-15' },
  { id: '2', name: '日常生活', description: '生活中的点滴记录', visibility: 'public', photoCount: 56, createdAt: '2024-02-20' },
  { id: '3', name: '美食探店', description: '各地美食打卡', visibility: 'public', photoCount: 18, createdAt: '2024-03-10' },
  { id: '4', name: '宠物时光', description: '家里小可爱的日常', visibility: 'private', photoCount: 42, createdAt: '2024-04-05' },
])

const showModal = ref(false)
const editingAlbum = ref<typeof albums.value[0] | null>(null)
const formData = ref({
  name: '',
  description: '',
  visibility: 'public' as 'public' | 'private',
})

const openCreate = () => {
  editingAlbum.value = null
  formData.value = { name: '', description: '', visibility: 'public' }
  showModal.value = true
}

const openEdit = (album: typeof albums.value[0]) => {
  editingAlbum.value = album
  formData.value = {
    name: album.name,
    description: album.description,
    visibility: album.visibility as 'public' | 'private',
  }
  showModal.value = true
}

const saveAlbum = () => {
  if (editingAlbum.value) {
    // Edit mode
    const idx = albums.value.findIndex(a => a.id === editingAlbum.value!.id)
    if (idx !== -1) {
      albums.value[idx] = {
        ...albums.value[idx],
        ...formData.value,
      }
    }
  } else {
    // Create mode
    albums.value.unshift({
      id: String(Date.now()),
      ...formData.value,
      photoCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    })
  }
  showModal.value = false
}

const deleteAlbum = (id: string) => {
  if (confirm('确定要删除这个相册吗？')) {
    albums.value = albums.value.filter(a => a.id !== id)
  }
}
</script>

<template>
  <div class="px-6 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-white">相册管理</h1>
      <button
        class="px-4 py-2 bg-[#3b82f6] text-white rounded-lg text-sm hover:bg-[#2563eb] transition-colors"
        @click="openCreate"
      >
        + 新建相册
      </button>
    </div>

    <!-- Albums Table -->
    <div class="bg-[#1e293b] rounded-xl border border-[#334155] overflow-hidden">
      <table class="w-full">
        <thead class="bg-[#0f172a]">
          <tr>
            <th class="text-left px-6 py-3 text-[#94a3b8] text-sm font-medium">名称</th>
            <th class="text-left px-6 py-3 text-[#94a3b8] text-sm font-medium">描述</th>
            <th class="text-left px-6 py-3 text-[#94a3b8] text-sm font-medium">可见性</th>
            <th class="text-left px-6 py-3 text-[#94a3b8] text-sm font-medium">照片数</th>
            <th class="text-left px-6 py-3 text-[#94a3b8] text-sm font-medium">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#334155]">
          <tr v-for="album in albums" :key="album.id" class="hover:bg-[#334155]/30 transition-colors">
            <td class="px-6 py-4 text-white font-medium">{{ album.name }}</td>
            <td class="px-6 py-4 text-[#94a3b8] text-sm">{{ album.description || '-' }}</td>
            <td class="px-6 py-4">
              <span
                :class="album.visibility === 'public' ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#f59e0b]/20 text-[#f59e0b]'"
                class="px-2 py-1 rounded text-xs"
              >
                {{ album.visibility === 'public' ? '公开' : '私密' }}
              </span>
            </td>
            <td class="px-6 py-4 text-[#94a3b8]">{{ album.photoCount }}</td>
            <td class="px-6 py-4">
              <div class="flex gap-2">
                <button
                  class="text-[#3b82f6] hover:text-[#60a5fa] text-sm"
                  @click="openEdit(album)"
                >
                  编辑
                </button>
                <NuxtLink
                  :to="`/album/${album.id}`"
                  class="text-[#94a3b8] hover:text-white text-sm"
                >
                  查看
                </NuxtLink>
                <button
                  class="text-[#ef4444] hover:text-[#f87171] text-sm"
                  @click="deleteAlbum(album.id)"
                >
                  删除
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="albums.length === 0" class="p-12 text-center text-[#64748b]">
        暂无相册，点击上方按钮创建
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        @click.self="showModal = false"
      >
        <div class="bg-[#1e293b] rounded-xl p-6 w-full max-w-md border border-[#334155]">
          <h2 class="text-lg font-semibold text-white mb-4">
            {{ editingAlbum ? '编辑相册' : '新建相册' }}
          </h2>

          <div class="space-y-4">
            <div>
              <label class="block text-[#94a3b8] text-sm mb-1">名称</label>
              <input
                v-model="formData.name"
                type="text"
                class="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:border-[#3b82f6] focus:outline-none"
                placeholder="相册名称"
              />
            </div>

            <div>
              <label class="block text-[#94a3b8] text-sm mb-1">描述</label>
              <textarea
                v-model="formData.description"
                rows="3"
                class="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:border-[#3b82f6] focus:outline-none resize-none"
                placeholder="相册描述（可选）"
              />
            </div>

            <div>
              <label class="block text-[#94a3b8] text-sm mb-1">可见性</label>
              <select
                v-model="formData.visibility"
                class="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:border-[#3b82f6] focus:outline-none"
              >
                <option value="public">公开</option>
                <option value="private">私密</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              class="px-4 py-2 text-[#94a3b8] hover:text-white text-sm"
              @click="showModal = false"
            >
              取消
            </button>
            <button
              class="px-4 py-2 bg-[#3b82f6] text-white rounded-lg text-sm hover:bg-[#2563eb]"
              @click="saveAlbum"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
