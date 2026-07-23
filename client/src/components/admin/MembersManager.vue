<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AdminLayout from './AdminLayout.vue';
import { useAppStore } from '@/stores/app';
import { useApi } from '@/composables/useApi';
import type { Member } from '@/types';

const store = useAppStore();
const api = useApi();
const editing = ref<Partial<Member> | null>(null);
const showForm = ref(false);

const form = ref<Partial<Member>>({
  year: '2026', dept: 'Web部', title: '', name: '',
  avatar: '', dest: '', badge: '', tech: '', sort_order: 0,
});

onMounted(() => {
  store.fetchMembers();
});

function createNew() {
  form.value = { year: '2026', dept: 'Web部', title: '成员', name: '', avatar: '', dest: '', badge: '', tech: '', sort_order: 0 };
  showForm.value = true;
}

function edit(member: Member) {
  form.value = { ...member };
  showForm.value = true;
}

async function save() {
  if (!form.value.name || !form.value.dept) return;
  if (form.value.id) {
    await api.put(`/members/${form.value.id}`, form.value);
  } else {
    await api.post('/members', form.value);
  }
  showForm.value = false;
  store.fetchMembers();
}

async function remove(id: number) {
  if (!confirm('确认删除？')) return;
  await api.delete(`/members/${id}`);
  store.fetchMembers();
}
</script>

<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-white">成员管理</h1>
        <button @click="createNew" class="px-4 py-2 rounded-lg bg-brandCyan text-black text-xs font-bold hover:bg-brandCyan/80 transition">+ 新增成员</button>
      </div>

      <!-- 简单表格 -->
      <div class="bento-card overflow-x-auto">
        <table class="w-full text-xs text-gray-300">
          <thead>
            <tr class="border-b border-white/10 text-left text-gray-400 font-mono">
              <th class="p-3">姓名</th>
              <th class="p-3">部门</th>
              <th class="p-3">职务</th>
              <th class="p-3">年级</th>
              <th class="p-3">去向/标签</th>
              <th class="p-3">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="m in store.members" :key="m.id" class="border-b border-white/5 hover:bg-white/5">
              <td class="p-3 font-bold text-white">{{ m.name }}</td>
              <td class="p-3">{{ m.dept }}</td>
              <td class="p-3">{{ m.title }}</td>
              <td class="p-3">{{ m.year }}</td>
              <td class="p-3">{{ m.dest || m.badge }}</td>
              <td class="p-3 flex gap-2">
                <button @click="edit(m)" class="text-brandCyan hover:underline">编辑</button>
                <button @click="remove(m.id)" class="text-red-400 hover:underline">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 编辑弹窗 -->
      <div v-if="showForm" class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" @click.self="showForm = false">
        <div class="bento-card p-6 w-full max-w-lg bg-brandDark/95">
          <h2 class="text-lg font-bold text-white mb-4">{{ form.id ? '编辑' : '新增' }}成员</h2>
          <div class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <input v-model="form.name" placeholder="姓名 *" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
              <input v-model="form.title" placeholder="职务" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
            </div>
            <div class="grid grid-cols-2 gap-3">
              <select v-model="form.dept" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
                <option v-for="d in ['委员会','FOSS部','系统维护部','宣传部','程序部','Web部','游戏部','APP部','iOS部','鸿蒙部']" :key="d" :value="d">{{ d }}</option>
              </select>
              <select v-model="form.year" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
                <option v-for="y in ['2026','2025','2024','2023']" :key="y" :value="y">{{ y }} 级</option>
              </select>
            </div>
            <input v-model="form.avatar" placeholder="头像 URL" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
            <input v-model="form.dest" placeholder="去向描述" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
            <input v-model="form.badge" placeholder="徽章 (如: 保研C9)" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
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
