<script setup lang="ts">
import { useAppStore } from '@/stores/app';

const store = useAppStore();
</script>

<template>
  <section class="py-20 px-6 lg:px-16 max-w-7xl mx-auto">
    <div class="mb-12">
      <span class="text-xs font-mono text-brandEmerald tracking-widest uppercase font-bold">07 / ACTIVITIES & EVENTS</span>
      <h2 class="text-3xl lg:text-4xl font-black text-white mt-1">近期社团活动与体验</h2>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <a v-for="act in store.activities" :key="act.id"
         :href="act.link" target="_blank" class="bento-card p-6 block hover:border-brandCyan transition group" data-tilt>
        <div class="w-10 h-10 rounded-xl bg-brandCyan/10 text-brandCyan flex items-center justify-center mb-4 border border-brandCyan/20 group-hover:scale-110 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="act.svg_d"></path></svg>
        </div>
        <h3 class="text-lg font-bold text-white mb-2 group-hover:text-brandCyan transition">{{ act.title }}</h3>
        <p class="text-xs text-gray-400 leading-relaxed mb-4">{{ act.desc }}</p>
        <span class="text-xs font-mono text-brandCyan flex items-center gap-1 font-bold">
          跳转相关链接
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7-7 7"></path></svg>
        </span>
      </a>
    </div>
  </section>
</template>
