<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import AdminLayout from './AdminLayout.vue';
import { useAppStore } from '@/stores/app';
import { useApi } from '@/composables/useApi';
import UploadInput from '@/components/shared/UploadInput.vue'; import type { Achievement } from '@/types';

const store = useAppStore();
const api = useApi();
const showForm = ref(false);
const thisYear = String(new Date().getFullYear());
const form = ref<Partial<Achievement>>({ year: thisYear, title: '', desc: '', tags: [], link: '', img: '' });
const tagsInput = ref('');

onMounted(() => store.fetchAchievements());

// 按年份分组
const grouped = computed(() => {
  const map: Record<string, Achievement[]> = {};
  for (const a of store.achievements) {
    if (!map[a.year]) map[a.year] = [];
    map[a.year].push(a);
  }
  return Object.entries(map).sort((a, b) => Number(b[0]) - Number(a[0]));
});

function createNew() {
  form.value = { year: thisYear, title: '', desc: '', tags: [], link: '', img: '', sort_order: 0 };
  tagsInput.value = '';
  showForm.value = true;
}
function edit(a: Achievement) {
  const tags = typeof a.tags === 'string' ? JSON.parse(a.tags as any) : (a.tags || []);
  form.value = { ...a, tags };
  tagsInput.value = tags.join(', ');
  showForm.value = true;
}

async function save() {
  if (!form.value.title || !form.value.year) return;
  form.value.tags = tagsInput.value.split(',').map((t: string) => t.trim()).filter(Boolean);
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

      <!-- 按年份分组显示 -->
      <template v-for="[year, items] in grouped" :key="year">
        <div class="mb-2">
          <span class="text-lg font-black text-white font-mono">{{ year }} 年</span>
          <span class="text-xs text-gray-500 ml-2">{{ items.length }} 项成果</span>
        </div>
        <div class="space-y-2 mb-6">
          <div v-for="a in items" :key="a.id" class="bento-card p-4 flex justify-between items-center">
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-bold text-white truncate">{{ a.title }}</h3>
              <p class="text-xs text-gray-400 truncate mt-0.5">{{ a.desc }}</p>
              <div class="flex gap-1.5 mt-1">
                <span v-for="t in (typeof a.tags === 'string' ? JSON.parse(a.tags as any) : (a.tags || []))" :key="t" class="text-[10px] text-brandCyan bg-brandCyan/10 px-1.5 py-0.5 rounded">{{ t }}</span>
              </div>
            </div>
            <div class="flex gap-2 ml-4 flex-shrink-0">
              <button @click="edit(a)" class="text-xs text-brandCyan hover:underline">编辑</button>
              <button @click="remove(a.id)" class="text-xs text-red-400 hover:underline">删除</button>
            </div>
          </div>
        </div>
      </template>

      <!-- 编辑弹窗 -->
      <div v-if="showForm" class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" @click.self="showForm = false">
        <div class="bento-card p-6 w-full max-w-lg bg-brandDark/95">
          <h2 class="text-lg font-bold text-white mb-4">{{ form.id ? '编辑' : '新增' }}成果</h2>
          <div class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <input v-model="form.year" placeholder="年份 *" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
              <input v-model="form.title" placeholder="标题 *" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
            </div>
            <textarea v-model="form.desc" placeholder="描述" rows="3" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none"></textarea>
            <input v-model="tagsInput" placeholder="标签 (逗号分隔)" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
            <div class="grid grid-cols-2 gap-3">
              <input v-model="form.link" placeholder="链接 URL" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
              <input v-model="form.link_text" placeholder="链接文字 (如: 访问详情)" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
            </div>
            <UploadInput v-model="form.img" />
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
