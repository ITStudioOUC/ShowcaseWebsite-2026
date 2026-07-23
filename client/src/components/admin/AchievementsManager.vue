<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AdminLayout from './AdminLayout.vue';
import { useAppStore } from '@/stores/app';
import { useApi } from '@/composables/useApi';
import type { Achievement } from '@/types';

const store = useAppStore();
const api = useApi();
const showForm = ref(false);
const form = ref<Partial<Achievement>>({ year: '2026', depth: '100m', title: '', desc: '', tags: [], link: '', img: '' });

onMounted(() => store.fetchAchievements());

function createNew() {
  form.value = { year: '2026', depth: '100m', title: '', desc: '', tags: [], link: '', img: '', sort_order: 0 };
  showForm.value = true;
}
function edit(a: Achievement) { form.value = { ...a, tags: typeof a.tags === 'string' ? JSON.parse(a.tags as any) : a.tags }; showForm.value = true; }

async function save() {
  if (!form.value.title) return;
  if (form.value.id) {
    await api.put(`/achievements/${form.value.id}`, form.value);
  } else {
    await api.post('/achievements', form.value);
  }
  showForm.value = false;
  store.fetchAchievements();
}

async function remove(id: number) {
  if (!confirm('确认删除？')) return;
  await api.delete(`/achievements/${id}`);
  store.fetchAchievements();
}
</script>

<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-white">成果管理</h1>
        <button @click="createNew" class="px-4 py-2 rounded-lg bg-brandCyan text-black text-xs font-bold hover:bg-brandCyan/80 transition">+ 新增成果</button>
      </div>
      <div class="space-y-3">
        <div v-for="a in store.achievements" :key="a.id" class="bento-card p-4 flex justify-between items-center">
          <div>
            <span class="text-xs font-mono text-brandCyan">{{ a.year }} · {{ a.depth }}</span>
            <h3 class="text-sm font-bold text-white">{{ a.title }}</h3>
          </div>
          <div class="flex gap-2">
            <button @click="edit(a)" class="text-xs text-brandCyan hover:underline">编辑</button>
            <button @click="remove(a.id)" class="text-xs text-red-400 hover:underline">删除</button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
