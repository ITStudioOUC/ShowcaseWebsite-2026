<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const cursorX = ref(0);
const cursorY = ref(0);
const hue = ref(180);
const isInteractive = ref(false);
const trails: { x: number; y: number; hue: number; r: number; opacity: number }[] = [];
let animId = 0;
let mouseX = 0, mouseY = 0;

const SELECTOR = 'a, button, input, select, textarea, [role="button"], [data-tilt], .cursor-pointer, .bento-card';

function onMouseMove(e: MouseEvent) {
  mouseX = e.clientX;
  mouseY = e.clientY;
  hue.value = (hue.value + 0.35) % 360;
  cursorX.value = mouseX;
  cursorY.value = mouseY;
  const el = document.elementFromPoint(mouseX, mouseY);
  isInteractive.value = el ? !!el.closest(SELECTOR) : false;
  trails.push({ x: mouseX, y: mouseY, hue: hue.value, r: 5, opacity: 0.8 });
  if (trails.length > 30) trails.splice(0, trails.length - 30);
}

function animate() {
  for (let i = trails.length - 1; i >= 0; i--) {
    trails[i].r *= 0.92;
    trails[i].opacity *= 0.90;
    if (trails[i].opacity < 0.01) trails.splice(i, 1);
  }
  animId = requestAnimationFrame(animate);
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove, { passive: true });
  animId = requestAnimationFrame(animate);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove);
  cancelAnimationFrame(animId);
});
</script>

<template>
  <!-- 拖尾 -->
  <div v-for="(t, i) in trails" :key="i"
       class="fixed pointer-events-none rounded-full"
       :style="{
         left: t.x + 'px', top: t.y + 'px',
         width: t.r + 'px', height: t.r + 'px',
         transform: 'translate(-50%, -50%)',
         background: `hsla(${t.hue}, 80%, 70%, ${t.opacity.toFixed(3)})`,
         boxShadow: `0 0 ${t.r * 3}px hsla(${t.hue}, 80%, 65%, ${(t.opacity * 0.5).toFixed(3)})`,
         zIndex: 9998,
       }"
  />
  <!-- 光标主体 -->
  <div class="fixed pointer-events-none" :style="{ left: cursorX + 'px', top: cursorY + 'px', transform: 'translate(-50%, -50%)', zIndex: 9999 }">
    <div v-if="!isInteractive" :style="{
      width: '7px', height: '7px', borderRadius: '50%',
      background: `hsl(${hue}, 90%, 75%)`,
      boxShadow: `0 0 7px hsl(${hue}, 90%, 70%), 0 0 14px hsl(${hue}, 80%, 65%)`,
    }" />
    <svg v-else width="16" height="18" viewBox="0 0 16 18"
         :style="{ filter: `drop-shadow(0 0 3px hsl(${hue}, 80%, 70%))` }">
      <path d="M0,0 L0,16 L5,11 L9,17 L11,16 L7,10 L15,7 Z"
            :fill="`hsl(${hue}, 85%, 70%)`"
            :stroke="`hsl(${hue}, 95%, 85%)`" stroke-width="0.8" stroke-linejoin="round" />
    </svg>
  </div>
</template>
