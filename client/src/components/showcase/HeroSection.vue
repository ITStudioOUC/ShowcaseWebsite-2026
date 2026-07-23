<script setup lang="ts">
import { ref, onMounted } from 'vue';
import gsap from 'gsap';

const emit = defineEmits<{ introDone: [] }>();

const logoRef = ref<HTMLImageElement>();
const textRef = ref<HTMLDivElement>();
const logoWrapRef = ref<HTMLDivElement>();
const maskRef = ref<HTMLDivElement>();
const scrollHintRef = ref<HTMLDivElement>();

onMounted(() => {
  const lenis = (window as any).__lenis;
  if (lenis) lenis.stop();

  const tl = gsap.timeline();

  // Logo 本身已经在 DOM 中可见（有初始透明度），加一个浮现动画
  tl.fromTo(logoRef.value, { opacity: 0, scale: 0.6 }, {
    opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.3)',
  })
  // 文字 + Logo 同时独立运动 (从 logo 浮现的末尾开始)
  .addLabel('slide', '-=0.15')
  .fromTo(textRef.value,
    { opacity: 0, x: () => -(textRef.value?.offsetWidth || 400) },
    { opacity: 1, x: 0, duration: 0.9, ease: 'power2.out' },
    'slide',
  )
  .fromTo(logoWrapRef.value,
    { x: 0 },
    { x: () => -( (textRef.value?.offsetWidth || 400) / 2 + 14 ) },
    { duration: 0.9, ease: 'power2.out' },
    'slide',
  )
  // 给一点停顿
  .to({}, { duration: 0.4 })
  // 触发 header 降下和滚动提示
  .call(() => {
    emit('introDone');
  })
  // 滚动提示弹出
  .fromTo(scrollHintRef.value,
    { opacity: 0, y: 20 },
    { opacity: 0.7, y: 0, duration: 0.6, ease: 'power3.out' },
  );
});
</script>

<template>
  <section class="min-h-screen flex flex-col items-center justify-center relative pb-20">
    <!-- Logo 独自居中 -->
    <div class="flex items-center justify-center">
      <div ref="logoWrapRef" class="relative flex-shrink-0 z-10">
        <!-- 浮光 -->
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div class="w-[45vh] h-[45vh] max-w-96 max-h-96 rounded-full bg-[#00f2fe] opacity-[0.05] blur-[80px]" />
          <div class="absolute w-[35vh] h-[35vh] max-w-72 max-h-72 rounded-full bg-[#4f92d6] opacity-[0.06] blur-[60px] translate-x-6" />
          <div class="absolute w-[24vh] h-[24vh] max-w-52 max-h-52 rounded-full bg-[#7028e4] opacity-[0.05] blur-[45px] -translate-x-4" />
          <div class="absolute w-[16vh] h-[16vh] max-w-36 max-h-36 rounded-full bg-[#88e1fa] opacity-[0.08] blur-[30px]" />
        </div>
        <img
          ref="logoRef"
          src="@/assets/itlogo.svg"
          alt="IT Studio"
          class="w-[30vh] h-[30vh] max-w-72 max-h-72 relative drop-shadow-[0_0_30px_rgba(79,146,214,0.7)]"
        />

        <!-- 蒙版: 从 logo 右边界开始向右露出文字, 左侧被 overflow 裁剪 -->
        <div ref="maskRef"
             class="absolute top-1/2 -translate-y-1/2 overflow-hidden py-2"
             style="left: 100%; margin-left: 28px;">
          <div ref="textRef" class="whitespace-nowrap opacity-0" style="line-height: 1">
            <span class="text-[16vh] font-black tracking-wider leading-none bg-gradient-to-r from-[#88e1fa] via-white to-[#4f92d6] bg-clip-text text-transparent drop-shadow-lg">
              爱特工作室
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 下滑提示 -->
    <div ref="scrollHintRef" class="absolute bottom-12 flex flex-col items-center gap-2 opacity-0">
      <span class="text-xs font-mono text-gray-500 tracking-widest">下滑以开始</span>
      <svg class="w-4 h-4 text-gray-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  </section>
</template>
