<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AdminLayout from './AdminLayout.vue';
import { useApi } from '@/composables/useApi';

interface FriendLink { id: number; title: string; url: string; sort_order: number; }
const api = useApi();
const links = ref<FriendLink[]>([]);
const showForm = ref(false);
const form = ref<Partial<FriendLink>>({});

onMounted(() => fetchLinks());
async function fetchLinks() { links.value = await api.get<FriendLink[]>('/friend-links'); }

function createNew() { form.value = { title: '', url: '', sort_order: 0 }; showForm.value = true; }
function edit(l: FriendLink) { form.value = { ...l }; showForm.value = true; }

async function save() {
  if (!form.value.title || !form.value.url) return;
  if (form.value.id) {
    await api.put(`/friend-links/${form.value.id}`, form.value);
  } else {
    await api.post('/friend-links', form.value);
  }
  showForm.value = false; fetchLinks();
}

async function remove(id: number) {
  if (!confirm('确认删除？')) return;
  await api.delete(`/friend-links/${id}`); fetchLinks();
}
</script>

<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-white">友情链接管理</h1>
        <button @click="createNew" class="px-4 py-2 rounded-lg bg-brandCyan text-black text-xs font-bold hover:bg-brandCyan/80 transition">+ 新增链接</button>
      </div>

      <div class="bento-card overflow-x-auto">
        <table class="w-full text-xs text-gray-300">
          <thead>
            <tr class="border-b border-white/10 text-left text-gray-400 font-mono">
              <th class="p-3">标题</th><th class="p-3">链接</th><th class="p-3">排序</th><th class="p-3">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="l in links" :key="l.id" class="border-b border-white/5 hover:bg-white/5">
              <td class="p-3 font-bold text-white">{{ l.title }}</td>
              <td class="p-3 text-brandCyan truncate max-w-[200px]">{{ l.url }}</td>
              <td class="p-3">{{ l.sort_order }}</td>
              <td class="p-3 flex gap-2">
                <button @click="edit(l)" class="text-brandCyan hover:underline">编辑</button>
                <button @click="remove(l.id)" class="text-red-400 hover:underline">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="showForm" class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" @click.self="showForm = false">
        <div class="bento-card p-6 w-full max-w-md bg-brandDark/95">
          <h2 class="text-lg font-bold text-white mb-4">{{ form.id ? '编辑' : '新增' }}链接</h2>
          <div class="space-y-3">
            <input v-model="form.title" placeholder="标题 *" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
            <input v-model="form.url" placeholder="链接 URL *" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
            <input v-model.number="form.sort_order" type="number" placeholder="排序" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
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
