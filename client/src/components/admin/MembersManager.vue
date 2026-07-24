<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import AdminLayout from './AdminLayout.vue';
import { useAppStore } from '@/stores/app';
import { useApi } from '@/composables/useApi';
import type { Member } from '@/types';

const store = useAppStore();
const api = useApi();
const grades = ref<string[]>([]);
const selectedGrade = ref('');
const newGrade = ref('');
const showForm = ref(false);
const form = ref<Partial<Member>>({});

const depts = ['委员会','FOSS部','系统维护部','宣传部','程序部','Web部','游戏部','APP部','iOS部','鸿蒙部'];

const filteredMembers = computed(() =>
  store.members.filter((m: Member) => m.year === selectedGrade.value)
);

async function fetchGrades() {
  const list = await api.get<{year:string}[]>('/grades');
  grades.value = list.map((g: {year:string}) => g.year);
}

async function addGrade() {
  if (!newGrade.value) return;
  await api.post('/grades', { year: newGrade.value });
  newGrade.value = '';
  fetchGrades();
}
async function deleteGrade(year: string) {
  if (!confirm(`删除 ${year} 级及其所有成员？`)) return;
  const list = await api.get<{id:number;year:string}[]>('/grades');
  const found = list.find((x: {id:number;year:string}) => x.year === year);
  if (found) { await api.delete(`/grades/${found.id}`); fetchGrades(); store.fetchMembers(); }
}

function selectGrade(year: string) {
  selectedGrade.value = year;
  store.fetchMembers(year, '全部');
}

function createNew() {
  form.value = { year: selectedGrade.value, dept: 'Web部', title: '成员', name: '', avatar: '', dest: '', tech: '', sort_order: 0 };
  showForm.value = true;
}
function edit(m: Member) { form.value = { ...m }; showForm.value = true; }

async function save() {
  if (!form.value.name || !form.value.dept || !form.value.year) return;
  if (form.value.id) {
    await api.put(`/members/${form.value.id}`, form.value);
  } else {
    await api.post('/members', form.value);
  }
  showForm.value = false;
  store.fetchMembers(selectedGrade.value);
}

async function remove(id: number) {
  if (!confirm('确认删除？')) return;
  await api.delete(`/members/${id}`);
  store.fetchMembers(selectedGrade.value);
}

async function exportMembers() {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/members/export?year=${selectedGrade.value}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `members_${selectedGrade.value}.xlsx`; a.click();
  URL.revokeObjectURL(url);
}

async function handleImport(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const XLSX = await import('xlsx');
  const data = await file.arrayBuffer();
  const wb = XLSX.read(data);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);
  if (!rows.length) { alert('无数据'); return; }
  const token = localStorage.getItem('token');
  const res = await fetch('/api/members/import', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ year: selectedGrade.value, data: rows }),
  });
  const result = await res.json();
  alert(`导入完成: ${result.imported} 条`);
  store.fetchMembers(selectedGrade.value);
  (e.target as HTMLInputElement).value = '';
}

onMounted(() => { fetchGrades(); });
</script>

<template>
  <AdminLayout>
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-white">成员管理</h1>

      <!-- 年级管理区 -->
      <div class="flex items-center gap-3">
        <span class="text-xs font-mono text-gray-400">年级:</span>
        <div class="flex flex-wrap items-center gap-2">
          <button v-for="y in grades" :key="y" @click="selectGrade(y)"
                  :class="selectedGrade === y ? 'bg-brandBlue text-white font-bold border-brandBlue/50' : 'text-gray-400 hover:text-white bg-white/5 border-white/10'"
                  class="px-4 py-1.5 rounded-lg text-xs font-mono border transition">
            {{ y }} 级
          </button>
        </div>
        <div class="flex items-center gap-1.5 ml-2">
          <input v-model="newGrade" placeholder="新年级" class="w-24 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
          <button @click="addGrade" class="px-2.5 py-1.5 rounded-lg bg-brandCyan/20 text-brandCyan text-xs font-bold border border-brandCyan/20 hover:bg-brandCyan/30 transition">+</button>
        </div>
      </div>

      <!-- 成员区 (仅选中年级后显示) -->
      <template v-if="selectedGrade">
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-400">{{ selectedGrade }} 级 · {{ filteredMembers.length }} 名成员</span>
          <div class="flex gap-2">
            <button @click="deleteGrade(selectedGrade)" class="px-3 py-1.5 rounded-lg bg-red-400/10 text-red-400 text-xs border border-red-400/20 hover:bg-red-400/20 transition">删除该年级</button>
            <button @click="exportMembers" class="px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 text-xs border border-white/10 hover:bg-white/10 transition">导出 Excel</button>
            <label class="px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 text-xs border border-white/10 hover:bg-white/10 transition cursor-pointer">
              导入 Excel
              <input type="file" accept=".xlsx,.xls,.csv" class="hidden" @change="handleImport">
            </label>
            <button @click="createNew" class="px-4 py-2 rounded-lg bg-brandCyan text-black text-xs font-bold hover:bg-brandCyan/80 transition">+ 新增成员</button>
          </div>
        </div>

        <div class="bento-card overflow-x-auto">
          <table class="w-full text-xs text-gray-300">
            <thead>
              <tr class="border-b border-white/10 text-left text-gray-400 font-mono">
                <th class="p-3">姓名</th><th class="p-3">部门</th><th class="p-3">职务</th><th class="p-3">座右铭</th><th class="p-3">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in filteredMembers" :key="m.id" class="border-b border-white/5 hover:bg-white/5">
                <td class="p-3 font-bold text-white">{{ m.name }}</td>
                <td class="p-3">{{ m.dept }}</td>
                <td class="p-3">{{ m.title }}</td>
                <td class="p-3">{{ m.dest }}</td>
                <td class="p-3 flex gap-2">
                  <button @click="edit(m)" class="text-brandCyan hover:underline">编辑</button>
                  <button @click="remove(m.id)" class="text-red-400 hover:underline">删除</button>
                </td>
              </tr>
              <tr v-if="!filteredMembers.length">
                <td colspan="5" class="p-6 text-center text-gray-500">暂无成员</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <div v-else class="text-center py-16 text-gray-500 text-sm">请先选择一个年级</div>

      <!-- 编辑弹窗 -->
      <div v-if="showForm" class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" @click.self="showForm = false">
        <div class="bento-card p-6 w-full max-w-lg bg-brandDark/95">
          <h2 class="text-lg font-bold text-white mb-4">{{ form.id ? '编辑' : '新增' }}成员 ({{ selectedGrade }} 级)</h2>
          <div class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <input v-model="form.name" placeholder="姓名 *" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
              <input v-model="form.title" placeholder="职务" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
            </div>
            <select v-model="form.dept" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
              <option value="">选择部门</option>
              <option v-for="d in depts" :key="d" :value="d">{{ d }}</option>
            </select>
            <input v-model="form.avatar" placeholder="头像 URL" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
            <input v-model="form.dest" placeholder="座右铭" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
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
