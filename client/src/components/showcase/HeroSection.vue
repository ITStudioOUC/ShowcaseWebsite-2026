<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';

const emit = defineEmits<{ introDone: [] }>();

const logoRef = ref<HTMLImageElement>();
const logoWrapRef = ref<HTMLDivElement>();
const textRef = ref<HTMLDivElement>();
const containerRef = ref<HTMLDivElement>();
const scrollHintRef = ref<HTMLDivElement>();
const hintOpacity = ref(1);
const showHint = ref(false);

function updateHintOpacity() {
  const lenis = (window as any).__lenis;
  const sy = lenis ? lenis.scroll : window.scrollY;
  hintOpacity.value = Math.max(0, Math.min(1, 1 - sy / 80));
}

onMounted(() => {
  const lenis = (window as any).__lenis;
  if (lenis) lenis.stop();
  window.addEventListener('scroll', updateHintOpacity, { passive: true });

  // 等一帧让 DOM 渲染完毕, 读取实际宽度
  requestAnimationFrame(() => {
    const textImg = textRef.value?.querySelector('img') as HTMLImageElement;
    const textW = textImg?.offsetWidth || 400;
    const logoW = logoWrapRef.value?.offsetWidth || 200;
    const gap = 8; // mask padding-left
    // Logo 需要向左移动, 使最终整体居中
    const logoShift = -(textW + gap) / 2;

    const tl = gsap.timeline();
    tl.fromTo(logoRef.value!, { opacity: 0, scale: 0.6 }, {
      opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.3)',
    })
    .addLabel('slide', '-=0.15')
    // Logo 向左独立移动
    .to(logoWrapRef.value!, {
      x: logoShift, duration: 0.9, ease: 'power2.inOut',
    }, 'slide')
    // 文字从蒙版左侧(-100vw)向右滑出, 慢-快-慢
    .to(textRef.value!, {
      x: 0, duration: 0.9, ease: 'power2.inOut',
    }, 'slide')
    .to({}, { duration: 0.4 })
    .call(() => { emit('introDone'); showHint.value = true; })
    .fromTo(scrollHintRef.value!,
      { y: 20 }, { y: 0, duration: 0.6, ease: 'power3.out' },
    );
  });
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateHintOpacity);
});
</script>

<template>
  <section class="min-h-screen flex flex-col items-center justify-center relative pb-20">
    <!-- 居中容器 -->
    <div ref="containerRef" class="relative flex items-center justify-center">
      <!-- Logo -->
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
          style="opacity:0"
        />

        <!-- 蒙版: overflow-hidden 裁掉左侧, 文字从右边界滑出 -->
        <div
          ref="maskRef"
          class="absolute top-0 bottom-0 overflow-hidden"
          style="left: 100%; width: 100vw; padding-left: 8px;"
        >
          <div ref="textRef" style="height: 100%; display: flex; align-items: center; transform: translateX(-100vw)">
            <img
              src="@/assets/itword.svg"
              alt="爱特工作室"
              class="w-auto"
              style="height: 70vh;"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 下滑提示 -->
    <div ref="scrollHintRef" v-show="showHint" class="absolute bottom-12 flex flex-col items-center gap-2" :style="{ opacity: hintOpacity }">
      <span class="text-xs font-mono text-gray-500 tracking-widest">下滑以开始</span>
      <svg class="w-4 h-4 text-gray-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  </section>
</template>
