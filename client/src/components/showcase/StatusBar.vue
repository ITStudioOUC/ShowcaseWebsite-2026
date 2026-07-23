<script setup lang="ts">
import { useAppStore } from '@/stores/app';

const store = useAppStore();
</script>

<template>
  <div class="text-xs font-mono py-2.5 px-6 z-50 relative flex justify-between items-center text-gray-400">
    <div class="flex items-center gap-3 overflow-hidden">
      <span class="inline-flex items-center gap-1.5 text-brandEmerald font-bold bg-brandEmerald/10 px-2 py-0.5 rounded border border-brandEmerald/20">
        <span class="w-2 h-2 rounded-full bg-brandEmerald animate-ping"></span>
        LIVE STATUS
      </span>
      <span class="text-gray-600">|</span>
      <span class="truncate text-gray-300">{{ store.stats.live_status }}</span>
    </div>
    <div class="hidden md:flex gap-5 items-center font-sans text-gray-300">
      <a href="https://wiki.itstudio.club/" target="_blank" class="hover:text-brandCyan transition flex items-center gap-1.5">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
        Wiki 知识库
      </a>
      <span class="text-gray-700">|</span>
      <a href="https://github.com/ITStudioOUC" target="_blank" class="hover:text-brandCyan transition flex items-center gap-1.5">
        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
        GitHub 社区
      </a>
    </div>
  </div>
</template>
