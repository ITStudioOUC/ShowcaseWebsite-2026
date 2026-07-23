<script setup lang="ts">
import { useAppStore } from '@/stores/app';

const store = useAppStore();
</script>

<template>
  <nav class="sticky top-0 w-full z-40 px-6 lg:px-12 py-4 flex justify-between items-center bg-transparent border-none">
    <div class="flex items-center gap-3.5 group cursor-pointer">
      <div class="w-10 h-10 group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_12px_rgba(0,242,254,0.3)]">
        <img src="@/assets/itlogo.svg" alt="爱特工作室" class="w-full h-full">
      </div>
      <div>
        <span class="text-lg font-black tracking-tight text-white block drop-shadow-md">爱特工作室</span>
        <span class="text-[10px] font-mono text-brandCyan block -mt-1 font-bold">IT STUDIO · OUC</span>
      </div>
    </div>

    <div class="hidden lg:flex items-center gap-8 font-mono text-xs text-gray-200 drop-shadow">
      <a href="#about" class="hover:text-brandCyan transition-colors">01. 关于爱特</a>
      <a href="#org" class="hover:text-brandCyan transition-colors">02. 组织架构</a>
      <a href="#members" class="hover:text-brandCyan transition-colors">03. 历年名录</a>
      <a href="#mentors" class="hover:text-brandCyan transition-colors">04. 导师团队</a>
      <a href="#achievements" class="hover:text-brandCyan transition-colors">05. 深度成果</a>
      <a href="#vibes" class="hover:text-brandCyan transition-colors">06. 时光风情</a>
      <a href="#qa" class="hover:text-brandCyan transition-colors">07. 纳新Q&A</a>
    </div>

    <div class="flex items-center gap-3">
      <a :href="`https://qm.qq.com/cgi-bin/qm/qr?k=QQ${store.stats.qq_group}`" target="_blank" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brandBlue to-brandPurple hover:from-brandPurple hover:to-brandBlue text-white font-mono text-xs font-bold transition-all shadow-xl shadow-brandBlue/30 hover:scale-105 flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
        招新QQ群: {{ store.stats.qq_group }}
      </a>
    </div>
  </nav>
</template>
