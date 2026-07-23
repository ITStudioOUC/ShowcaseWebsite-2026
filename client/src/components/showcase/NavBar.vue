<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const sections = [
  { id: 'about',        label: '关于爱特',   num: '01' },
  { id: 'members',      label: '历年名录',   num: '02' },
  { id: 'mentors',      label: '导师团队',   num: '03' },
  { id: 'achievements', label: '深度成果',   num: '04' },
  { id: 'vibes',        label: '时光风情',   num: '05' },
  { id: 'qa',           label: '纳新Q&A',    num: '06' },
];

const activeIndex = ref(-1);
const visible = ref(false);
// 游标位置 + 各节点实际位置 (按 section 真实高度比例)
const cursorPos = ref(0);
const dotPositions = ref<number[]>([]); // 每个 section 对应的 %

const HERO_THRESHOLD = 300;

// 获取元素在文档中的绝对 Y 位置 (不受 CSS transform 影响)
function getAbsoluteTop(el: HTMLElement): number {
  let top = 0;
  let current: HTMLElement | null = el;
  while (current) {
    top += current.offsetTop;
    current = current.offsetParent as HTMLElement;
  }
  return top;
}

function calcPositions(sy: number) {
  const docH = document.body.scrollHeight - window.innerHeight;

  const positions: { top: number; bottom: number }[] = [];
  for (const s of sections) {
    const el = document.getElementById(s.id);
    if (el) {
      const top = getAbsoluteTop(el);
      positions.push({ top, bottom: top + el.offsetHeight });
    } else {
      positions.push({ top: 0, bottom: 0 });
    }
  }

  const startY = positions[0].top;
  const endY = Math.max(positions[positions.length - 1].bottom, docH + window.innerHeight);
  const range = endY - startY;

  if (range > 0) {
    cursorPos.value = Math.max(0, Math.min(100, ((sy - startY) / range) * 100));
    // 导航点标记 section 顶部 (与 scrollTo 目标一致)
    dotPositions.value = positions.map(p => {
      return Math.max(0, Math.min(100, ((p.top - startY) / range) * 100));
    });
  }
}

function onScroll() {
  const lenis = (window as any).__lenis;
  const sy = lenis ? lenis.scroll : window.scrollY;

  visible.value = sy > HERO_THRESHOLD;

  const vh = window.innerHeight;
  const midScreen = sy + vh * 0.35;

  // --- 当前 section 检测 (以 section 顶部为准) ---
  let found = -1;
  for (let i = sections.length - 1; i >= 0; i--) {
    const el = document.getElementById(sections[i].id);
    if (el) {
      const top = getAbsoluteTop(el);
      if (top <= sy + 60) { found = i; break; }
    }
  }
  activeIndex.value = found;

  // 更新 URL hash
  if (found >= 0 && sections[found]) {
    const newHash = '#' + sections[found].id;
    if (window.location.hash !== newHash) {
      history.replaceState(null, '', newHash);
    }
  }

  // --- 连续位置 ---
  calcPositions(sy);
}

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as any).__lenis;
  if (lenis) {
    lenis.scrollTo(el, { offset: -60, duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>

<template>
  <nav
    class="fixed left-6 lg:left-10 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center transition-opacity duration-500"
    :class="visible ? 'opacity-100' : 'opacity-0 pointer-events-none'"
  >
    <!-- 竖线轨道 -->
    <div class="relative flex flex-col items-center" style="height: 320px">
      <!-- 灰色背景线 -->
      <div class="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />
      <!-- 已走过线段 (青色) -->
      <div class="absolute left-1/2 top-0 w-px bg-brandCyan/60 -translate-x-1/2" :style="{ height: cursorPos + '%' }" />

      <!-- 游标：沿竖线滑动的发光点 -->
      <div
        class="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-brandCyan shadow-[0_0_14px_rgba(0,242,254,0.8),0_0_28px_rgba(0,242,254,0.3)]"
        :style="{ top: cursorPos + '%' }"
      />

      <!-- 各 section 节点 (绝对分布) -->
      <button
        v-for="(s, idx) in sections"
        :key="s.id"
        @click="scrollTo(s.id)"
        class="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 group flex items-center"
        :style="{ top: (dotPositions[idx] != null ? dotPositions[idx] : (idx / (sections.length - 1)) * 100) + '%' }"
        :aria-label="s.label"
      >
        <!-- 节点圆点 -->
        <span
          class="block rounded-full cursor-pointer"
          :class="idx <= activeIndex
            ? 'w-2 h-2 bg-brandCyan/60'
            : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'"
        />
        <!-- 标签 -->
        <span
          class="absolute left-4 text-xs font-mono whitespace-nowrap transition-all duration-300"
          :class="idx === activeIndex
            ? 'text-brandCyan opacity-100 translate-x-0'
            : 'text-gray-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-gray-400'"
        >
          <span class="text-brandCyan/70 mr-1.5">{{ s.num }}.</span>{{ s.label }}
        </span>
      </button>
    </div>
  </nav>
</template>
