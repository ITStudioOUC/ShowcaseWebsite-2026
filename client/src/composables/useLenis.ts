import { ref, onMounted, onUnmounted } from 'vue';
import Lenis from '@studio-freight/lenis';

// 全局共享的 Lenis 实例和当前平滑滚动值
const lenisScrollY = ref(0);
const lenisProgress = ref(0);
let lenis: Lenis | null = null;

export function useLenis() {
  onMounted(() => {
    if (lenis) return; // 已经初始化

    lenis = new Lenis({
      duration: 1.6,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.2,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis!.raf(time);
      lenisScrollY.value = lenis!.scroll;
      const docH = document.body.scrollHeight - window.innerHeight;
      lenisProgress.value = docH > 0 ? lenis!.scroll / docH : 0;
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  });

  onUnmounted(() => {
    // 不销毁，因为是全局单例
  });

  return { lenisScrollY, lenisProgress };
}

// 也可直接导出供非组件代码使用
export { lenisScrollY, lenisProgress, lenis };
