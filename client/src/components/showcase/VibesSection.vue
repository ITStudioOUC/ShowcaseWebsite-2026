<script setup lang="ts">
const vibeImages = [
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80',
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&q=80',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80',
];
</script>

<template>
  <section id="vibes" class="py-20 border-t border-white/10 overflow-hidden relative">
    <div class="max-w-7xl mx-auto px-6 lg:px-16 mb-8 flex justify-between items-end">
      <div>
        <span class="text-xs font-mono text-brandCyan tracking-widest uppercase font-bold">06 / STUDIO VIBES</span>
        <h2 class="text-3xl lg:text-4xl font-black text-white mt-1">工作室风情与洋流记忆</h2>
      </div>
      <p class="text-xs font-mono text-gray-400 hidden md:block">鼠标悬停可使洋流暂停并放大 1.8 倍</p>
    </div>

    <div class="river-wrapper">
      <div class="river-track">
        <!-- 双份图像实现无缝循环 -->
        <div v-for="i in 2" :key="i" class="flex gap-6 items-center">
          <img v-for="(img, idx) in vibeImages" :key="`${i}-${idx}`"
               :src="img" class="river-leaf w-72 h-48 object-cover border border-white/20 shadow-2xl">
        </div>
      </div>
    </div>
  </section>
</template>
