<script setup lang="ts">
import { useAppStore } from '@/stores/app';

const store = useAppStore();
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="py-16 px-6 lg:px-16 text-xs text-gray-400 font-mono border-t border-white/10">
    <div class="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 mb-12">
      <div class="space-y-3 md:col-span-1">
        <div class="flex items-center gap-2 text-white font-bold text-base">
          <img src="@/assets/itlogo.svg" alt="爱特工作室" class="w-6 h-6">
          <img src="@/assets/itword.svg" alt="爱特工作室" class="h-6 w-auto" style="filter: invert(0.85)" />
        </div>
        <p class="text-[11px] leading-relaxed text-gray-500 font-sans">
          中国海洋大学信息科学与工程学部领导下的技术性团体，发现人才、培养人才、输送人才。
        </p>
      </div>

      <div>
        <h4 class="text-white font-bold mb-3">官方归属与协会</h4>
        <ul class="space-y-2 text-[11px]">
          <li>CCF 中国海洋大学学生分会</li>
          <li>海大 OpenHarmony 开源鸿蒙开发者协会</li>
          <li>信息科学与工程学部 58 工坊</li>
        </ul>
      </div>

      <div>
        <h4 class="text-white font-bold mb-3">联系方式与地址</h4>
        <ul class="space-y-2 text-[11px]">
          <li>招新QQ群：{{ store.stats.qq_group }}</li>
          <li>邮箱：{{ store.stats.email }}</li>
          <li>地址：{{ store.stats.address }}</li>
        </ul>
      </div>

      <div>
        <h4 class="text-white font-bold mb-3">开源与文档</h4>
        <ul class="space-y-2 text-[11px]">
          <li><a href="https://wiki.itstudio.club/" target="_blank" class="hover:text-brandCyan">ITStudio-Wiki 知识库</a></li>
          <li><a href="https://github.com/ITStudioOUC" target="_blank" class="hover:text-brandCyan">GitHub 开源组织</a></li>
        </ul>
      </div>
    </div>

    <div class="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-gray-500">
      <p>© 2002 - {{ currentYear }} 中国海洋大学爱特工作室 (IT Studio). All Rights Reserved.</p>
      <p>鲁ICP备XXXXXXX号 | 鲁公网安备 XXXXXXX号</p>
    </div>
  </footer>
</template>
