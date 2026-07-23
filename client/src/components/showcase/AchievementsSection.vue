<script setup lang="ts">
import { useAppStore } from '@/stores/app';

const store = useAppStore();
</script>

<template>
  <section id="achievements" class="py-20 px-6 lg:px-16 max-w-7xl mx-auto border-t border-white/10">
    <div class="mb-16 text-center">
      <span class="text-xs font-mono text-brandCyan tracking-widest uppercase font-bold">05 / OCEAN DEPTH LOGS</span>
      <h2 class="text-3xl lg:text-5xl font-black text-white mt-1">我们的成果与深海里程碑</h2>
      <p class="text-sm text-gray-400 mt-2">沿海洋深度标逐级下潜，探索爱特团队二十四载项目积淀</p>
    </div>

    <div class="relative border-l-2 border-brandBlue/50 ml-4 lg:ml-1/2 pl-6 lg:pl-12 space-y-16">
      <div v-for="item in store.achievements" :key="item.id" class="relative group">
        <div class="absolute -left-[31px] lg:-left-[55px] top-1.5 w-4 h-4 rounded-full bg-brandCyan border-4 border-brandDark shadow-[0_0_20px_#00f2fe]"></div>
        <div class="bento-card p-6 lg:p-8 space-y-4" data-tilt>
          <div class="flex flex-wrap justify-between items-center gap-2 border-b border-white/10 pb-3">
            <span class="text-2xl font-black text-white font-mono">{{ item.year }}年</span>
            <span class="text-xs font-mono px-3 py-1 rounded-md bg-brandBlue/30 text-brandCyan border border-brandBlue/50">深度: {{ item.depth }}</span>
          </div>
          <div class="grid lg:grid-cols-12 gap-6 items-center">
            <div class="lg:col-span-7 space-y-3">
              <h3 class="text-xl font-bold text-white group-hover:text-brandCyan transition">{{ item.title }}</h3>
              <p class="text-sm text-gray-300 leading-relaxed">{{ item.desc }}</p>
              <div class="flex flex-wrap gap-2 text-xs font-mono text-gray-400">
                <span v-for="tag in item.tags" :key="tag" class="px-2 py-0.5 rounded bg-white/5 border border-white/10">{{ tag }}</span>
              </div>
              <div v-if="item.link" class="pt-2">
                <a :href="item.link" target="_blank" class="inline-flex items-center gap-1.5 text-xs font-mono text-brandCyan hover:underline font-bold">
                  访问线上服务 / 开源仓库
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </a>
              </div>
            </div>
            <div class="lg:col-span-5 h-44 rounded-xl overflow-hidden border border-white/10 relative">
              <img :src="item.img" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
