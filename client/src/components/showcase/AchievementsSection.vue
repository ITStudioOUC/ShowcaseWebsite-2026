<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAppStore } from '@/stores/app';
import type { Achievement } from '@/types';

const store = useAppStore();

const lightbox = ref<Achievement | null>(null);

// 按年份分组并排序(年份降序)

const groupedByYear = computed(() => {
  const map: Record<string, Achievement[]> = {};
  for (const a of store.achievements) {
    if (!map[a.year]) map[a.year] = [];
    map[a.year].push(a);
  }
  return Object.entries(map).sort((a, b) => Number(b[0]) - Number(a[0]));
});
</script>

<template>
  <section id="achievements" class="py-24 px-6 lg:px-16 max-w-7xl mx-auto">
    <div class="mb-14">
      <span class="text-sm font-mono text-brandCyan tracking-[0.3em] uppercase font-bold">04 / ACHIEVEMENTS</span>
      <h2 class="text-4xl lg:text-6xl font-black text-white mt-1">我们的成果</h2>
    </div>

    <!-- 时间线 -->
    <div class="relative">
      <!-- 竖线 -->
      <div class="absolute left-4 lg:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-brandCyan/40 via-brandBlue/30 to-brandCyan/10" />

      <div class="space-y-20">
        <div v-for="[year, items] in groupedByYear" :key="year" class="relative">
          <!-- 年份节点 -->
          <div class="flex items-center gap-4 lg:gap-8 mb-8">
            <!-- 节点圆 -->
            <div class="relative z-10 flex-shrink-0 w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-brandDark border-2 border-brandCyan flex items-center justify-center shadow-[0_0_20px_rgba(0,242,254,0.3)]">
              <div class="w-2.5 h-2.5 lg:w-3.5 lg:h-3.5 rounded-full bg-brandCyan" />
            </div>
            <!-- 年份标题 -->
            <div>
              <h3 class="text-2xl lg:text-3xl font-black text-white font-mono">{{ year }}</h3>
              <p class="text-xs text-gray-500 mt-0.5">{{ items.length }} 项成果</p>
            </div>
          </div>

          <!-- 该年份成果卡片 (每行2个) -->
          <div class="grid md:grid-cols-2 gap-4 ml-12 lg:ml-20">
            <div v-for="item in items" :key="item.id"
                 class="group rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-brandCyan/20 p-5 transition-all cursor-pointer"
                 @click="lightbox = item">
              <!-- 图片 -->
              <div v-if="item.img" class="w-full h-40 rounded-lg overflow-hidden mb-4 border border-white/5">
                <img :src="item.img" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
              </div>
              <!-- 内容 -->
              <h4 class="text-base font-bold text-white group-hover:text-brandCyan transition">{{ item.title }}</h4>
              <p class="text-xs text-gray-400 leading-relaxed mt-2">{{ item.desc }}</p>
              <!-- 标签 -->
              <div class="flex flex-wrap gap-1.5 mt-3">
                <span v-for="tag in item.tags" :key="tag"
                      class="text-[10px] font-mono text-brandCyan/70 px-2 py-0.5 rounded bg-brandCyan/5 border border-brandCyan/10">{{ tag }}</span>
              </div>
              <!-- 链接 -->
              <a v-if="item.link" :href="item.link" target="_blank"
                 class="inline-flex items-center gap-1.5 mt-3 text-xs font-mono text-brandCyan hover:underline font-bold"
                 @click.stop>
                {{ item.link_text || '访问详情' }}
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 详情灯箱 -->
    <Teleport to="body">
      <div v-if="lightbox" class="fixed inset-0 z-[9000] flex flex-col items-center justify-center p-6 lg:p-12"
           style="background: rgba(3,7,18,0.88); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);"
           @click="lightbox = null">
        <img v-if="lightbox.img" :src="lightbox.img" :alt="lightbox.title"
             class="max-w-[90vw] max-h-[55vh] object-contain rounded-xl shadow-2xl border border-white/10"
             @click.stop />
        <div class="mt-6 max-w-2xl text-center" @click.stop>
          <p class="text-xs font-mono text-gray-500 mb-1">{{ lightbox.year }}</p>
          <h3 class="text-2xl lg:text-3xl font-black text-white">{{ lightbox.title }}</h3>
          <p class="text-sm text-gray-300 leading-relaxed mt-4">{{ lightbox.desc }}</p>
          <div class="flex flex-wrap justify-center gap-1.5 mt-4">
            <span v-for="tag in lightbox.tags" :key="tag"
                  class="text-[10px] font-mono text-brandCyan/70 px-2 py-0.5 rounded bg-brandCyan/5 border border-brandCyan/10">{{ tag }}</span>
          </div>
          <a v-if="lightbox.link" :href="lightbox.link" target="_blank"
             class="inline-flex items-center gap-1.5 mt-5 text-sm font-mono text-brandCyan hover:underline font-bold">
            {{ lightbox.link_text || '访问详情' }}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          </a>
        </div>
        <p class="mt-6 text-xs text-gray-500">点击任意空白处关闭</p>
      </div>
    </Teleport>
  </section>
</template>
