<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AdminLayout from './AdminLayout.vue';
import { useAppStore } from '@/stores/app';
import { useApi } from '@/composables/useApi';

const store = useAppStore();
const api = useApi();
const form = ref<Record<string, string>>({});
const saved = ref(false);

onMounted(async () => {
  await store.fetchStats();
  form.value = { ...store.stats };
});

async function save() {
  await api.put('/stats', form.value);
  saved.value = true;
  setTimeout(() => saved.value = false, 2000);
}
</script>

<template>
  <AdminLayout>
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-white">站点设置</h1>
      <div class="bento-card p-6 space-y-4 max-w-2xl">
        <div>
          <label class="text-xs font-mono text-gray-400 block mb-1">QQ群号</label>
          <input v-model="form.qq_group" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
        </div>
        <div>
          <label class="text-xs font-mono text-gray-400 block mb-1">联系邮箱</label>
          <input v-model="form.email" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
        </div>
        <div>
          <label class="text-xs font-mono text-gray-400 block mb-1">地址</label>
          <input v-model="form.address" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
        </div>
        <div>
          <label class="text-xs font-mono text-gray-400 block mb-1">状态栏文字</label>
          <input v-model="form.live_status" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
        </div>
        <div class="flex items-center gap-3">
          <button @click="save" class="px-4 py-2 rounded-lg bg-brandCyan text-black text-xs font-bold">保存设置</button>
          <span v-if="saved" class="text-xs text-brandEmerald">✓ 已保存</span>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
