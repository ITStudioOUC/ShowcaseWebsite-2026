<script setup lang="ts">
import { onMounted } from 'vue';
import Lenis from '@studio-freight/lenis';
import CustomCursor from '@/components/shared/CustomCursor.vue';

onMounted(() => {
  const lenis = new Lenis({
    duration: 2.8,
    easing: (t: number) => Math.min(1, 1 - Math.pow(1 - t, 4)),
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 2,
  });

  // 覆盖原生滚动，由 Lenis 统一驱动
  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // 暴露到 window 供 canvas 读取当前平滑滚动值
  (window as any).__lenis = lenis;
});
</script>

<template>
  <router-view />
  <CustomCursor />
</template>
