<script setup lang="ts">
import { onMounted } from 'vue';
import AdminLayout from './AdminLayout.vue';
import { useAppStore } from '@/stores/app';

const store = useAppStore();

onMounted(() => {
  store.fetchAllData();
});
</script>

<template>
  <AdminLayout>
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-white">仪表盘</h1>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bento-card p-5">
          <div class="text-xs font-mono text-gray-400 mb-1">成员总数</div>
          <div class="text-3xl font-black text-brandCyan">{{ store.members.length }}</div>
        </div>
        <div class="bento-card p-5">
          <div class="text-xs font-mono text-gray-400 mb-1">成果数量</div>
          <div class="text-3xl font-black text-brandPurple">{{ store.achievements.length }}</div>
        </div>
        <div class="bento-card p-5">
          <div class="text-xs font-mono text-gray-400 mb-1">FAQ 数量</div>
          <div class="text-3xl font-black text-brandEmerald">{{ store.faqs.length }}</div>
        </div>
        <div class="bento-card p-5">
          <div class="text-xs font-mono text-gray-400 mb-1">风情图片</div>
          <div class="text-3xl font-black text-brandSky">{{ store.vibeImages.length }}</div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
