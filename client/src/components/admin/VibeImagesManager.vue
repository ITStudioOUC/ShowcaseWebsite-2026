<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AdminLayout from './AdminLayout.vue';
import { useApi } from '@/composables/useApi';

import UploadInput from '@/components/shared/UploadInput.vue'; interface VibeImage { id: number; url: string; title: string; width: number; height: number; sort_order: number; }
const api = useApi();
const images = ref<VibeImage[]>([]);
const showForm = ref(false);
const form = ref<Partial<VibeImage>>({});

onMounted(() => fetchImages());
async function fetchImages() { images.value = await api.get<VibeImage[]>('/vibe-images'); }

function createNew() {
  form.value = { url: '', title: '', width: 0, height: 0, sort_order: 0 };
  showForm.value = true;
}
async function detectSize() {
  if (!form.value.url) return;
  const img = new Image();
  img.onload = () => {
    form.value.width = img.naturalWidth;
    form.value.height = img.naturalHeight;
  };
  img.src = form.value.url;
}
function edit(img: VibeImage) { form.value = { ...img }; showForm.value = true; }

async function save() {
  if (!form.value.url) return;
  if (form.value.id) {
    await api.put(`/vibe-images/${form.value.id}`, form.value);
  } else {
    await api.post('/vibe-images', form.value);
  }
  showForm.value = false;
  fetchImages();
}

async function remove(id: number) {
  if (!confirm('确认删除？')) return;
  await api.delete(`/vibe-images/${id}`);
  fetchImages();
}
</script>

<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-white">风情图片管理</h1>
        <button @click="createNew" class="px-4 py-2 rounded-lg bg-brandCyan text-black text-xs font-bold hover:bg-brandCyan/80 transition">+ 新增图片</button>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="img in images" :key="img.id" class="bento-card p-3 group">
          <img :src="img.url" class="w-full h-32 object-cover rounded-lg mb-2" />
          <p class="text-xs text-white truncate">{{ img.title || '无标题' }}</p>
          <p class="text-[10px] text-gray-500">{{ img.width }}×{{ img.height }}</p>
          <div class="flex gap-2 mt-2">
            <button @click="edit(img)" class="text-xs text-brandCyan hover:underline">编辑</button>
            <button @click="remove(img.id)" class="text-xs text-red-400 hover:underline">删除</button>
          </div>
        </div>
      </div>

      <div v-if="showForm" class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" @click.self="showForm = false">
        <div class="bento-card p-6 w-full max-w-lg bg-brandDark/95">
          <h2 class="text-lg font-bold text-white mb-4">{{ form.id ? '编辑' : '新增' }}图片</h2>
          <div class="space-y-3">
            <div class="flex gap-2 items-end">
              <div class="flex-1"><UploadInput v-model="form.url" @blur="detectSize" /></div>
              <button type="button" @click="detectSize" class="px-3 py-2 rounded-lg bg-white/5 text-gray-400 text-xs hover:text-white transition">识别尺寸</button>
            </div>
            <input v-model="form.title" placeholder="标题" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
            <div class="flex gap-2 text-xs text-gray-500">
              <span v-if="form.width && form.height">{{ form.width }} × {{ form.height }} (自动识别)</span>
              <span v-else>输入 URL 后自动识别尺寸</span>
            </div>
            <div class="flex justify-end gap-3 pt-2">
              <button @click="showForm = false" class="px-4 py-2 rounded-lg bg-white/10 text-white text-xs">取消</button>
              <button @click="save" class="px-4 py-2 rounded-lg bg-brandCyan text-black text-xs font-bold">保存</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
