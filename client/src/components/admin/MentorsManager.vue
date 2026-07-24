<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AdminLayout from './AdminLayout.vue';
import { useApi } from '@/composables/useApi';
import UploadInput from '@/components/shared/UploadInput.vue'; import type { Mentor } from '@/types';

const api = useApi();
const mentors = ref<Mentor[]>([]);
const showForm = ref(false);
const form = ref<Partial<Mentor>>({});

onMounted(() => fetchMentors());

async function fetchMentors() {
  mentors.value = await api.get<Mentor[]>('/mentors');
}

function createNew() {
  form.value = { title: '', name: '', avatar: '', college: '', email: '', office: '', academic_title: '', research: '', sort_order: 0 };
  showForm.value = true;
}
function edit(m: Mentor) { form.value = { ...m }; showForm.value = true; }

async function save() {
  if (!form.value.name) return;
  if (form.value.id) {
    await api.put(`/mentors/${form.value.id}`, form.value);
  } else {
    await api.post('/mentors', form.value);
  }
  showForm.value = false;
  fetchMentors();
}

async function remove(id: number) {
  if (!confirm('确认删除？')) return;
  await api.delete(`/mentors/${id}`);
  fetchMentors();
}
</script>

<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-white">导师管理</h1>
        <button @click="createNew" class="px-4 py-2 rounded-lg bg-brandCyan text-black text-xs font-bold hover:bg-brandCyan/80 transition">+ 新增导师</button>
      </div>
      <div class="bento-card overflow-x-auto">
        <table class="w-full text-xs text-gray-300">
          <thead>
            <tr class="border-b border-white/10 text-left text-gray-400 font-mono">
              <th class="p-3">姓名</th><th class="p-3">角色</th><th class="p-3">职称</th><th class="p-3">学院</th><th class="p-3">邮箱</th><th class="p-3">办公室</th><th class="p-3">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="m in mentors" :key="m.id" class="border-b border-white/5 hover:bg-white/5">
              <td class="p-3 font-bold text-white">{{ m.name }}</td>
              <td class="p-3">{{ m.title }}</td>
              <td class="p-3">{{ m.academic_title }}</td>
              <td class="p-3">{{ m.college }}</td>
              <td class="p-3">{{ m.email }}</td>
              <td class="p-3">{{ m.office }}</td>
              <td class="p-3 flex gap-2">
                <button @click="edit(m)" class="text-brandCyan hover:underline">编辑</button>
                <button @click="remove(m.id)" class="text-red-400 hover:underline">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="showForm" class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" @click.self="showForm = false">
        <div class="bento-card p-6 w-full max-w-lg bg-brandDark/95">
          <h2 class="text-lg font-bold text-white mb-4">{{ form.id ? '编辑' : '新增' }}导师</h2>
          <div class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <input v-model="form.name" placeholder="姓名 *" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
              <select v-model="form.title" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
                <option value="">选择老师类型</option>
                <option value="团委指导老师">团委指导老师</option>
                <option value="技术指导老师">技术指导老师</option>
                <option value="企业指导老师">企业指导老师</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <input v-model="form.academic_title" placeholder="职称 (如: 教授)" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
              <input v-model="form.college" placeholder="学院" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
            </div>
            <div class="grid grid-cols-2 gap-3">
              <input v-model="form.email" placeholder="邮箱" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
              <input v-model="form.office" placeholder="办公室" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
            </div>
            <UploadInput v-model="form.avatar" />
            <input v-model="form.link" placeholder="跳转链接 (可选)" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
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
