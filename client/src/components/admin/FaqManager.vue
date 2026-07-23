<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AdminLayout from './AdminLayout.vue';
import { useAppStore } from '@/stores/app';
import { useApi } from '@/composables/useApi';
import type { Faq } from '@/types';

const store = useAppStore();
const api = useApi();
const showForm = ref(false);
const form = ref<Partial<Faq>>({ question: '', answer: '' });

onMounted(() => store.fetchFaqs());

function createNew() { form.value = { question: '', answer: '', sort_order: 0 }; showForm.value = true; }
function edit(f: Faq) { form.value = { ...f }; showForm.value = true; }

async function save() {
  if (!form.value.question || !form.value.answer) return;
  if (form.value.id) {
    await api.put(`/faqs/${form.value.id}`, form.value);
  } else {
    await api.post('/faqs', form.value);
  }
  showForm.value = false;
  store.fetchFaqs();
}

async function remove(id: number) {
  if (!confirm('确认删除？')) return;
  await api.delete(`/faqs/${id}`);
  store.fetchFaqs();
}
</script>

<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-white">FAQ 管理</h1>
        <button @click="createNew" class="px-4 py-2 rounded-lg bg-brandCyan text-black text-xs font-bold hover:bg-brandCyan/80 transition">+ 新增</button>
      </div>
      <div class="space-y-3">
        <div v-for="f in store.faqs" :key="f.id" class="bento-card p-4">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-sm font-bold text-white">Q: {{ f.question }}</h3>
            <div class="flex gap-2">
              <button @click="edit(f)" class="text-xs text-brandCyan hover:underline">编辑</button>
              <button @click="remove(f.id)" class="text-xs text-red-400 hover:underline">删除</button>
            </div>
          </div>
          <p class="text-xs text-gray-400">A: {{ f.answer }}</p>
        </div>
      </div>

      <div v-if="showForm" class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" @click.self="showForm = false">
        <div class="bento-card p-6 w-full max-w-lg bg-brandDark/95">
          <h2 class="text-lg font-bold text-white mb-4">{{ form.id ? '编辑' : '新增' }} FAQ</h2>
          <div class="space-y-3">
            <input v-model="form.question" placeholder="问题 *" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
            <textarea v-model="form.answer" placeholder="回答 *" rows="4" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none"></textarea>
            <div class="flex justify-end gap-3">
              <button @click="showForm = false" class="px-4 py-2 rounded-lg bg-white/10 text-white text-xs">取消</button>
              <button @click="save" class="px-4 py-2 rounded-lg bg-brandCyan text-black text-xs font-bold">保存</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
