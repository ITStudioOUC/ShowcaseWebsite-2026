<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useAppStore } from '@/stores/app';

const store = useAppStore();
interface VibeImage { id: number; url: string; title: string; width: number; height: number; }
const pool = computed(() => store.vibeImages as VibeImage[]);

function shuffled<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const images = ref<VibeImage[]>([]);
function rebuild() {
  if (pool.value.length === 0) return;
  let result: VibeImage[] = [];
  while (result.length < 40) {
    const batch = shuffled(pool.value);
    if (result.length > 0 && batch[0]?.id === result[result.length - 1]?.id) batch.push(batch.shift()!);
    result = result.concat(batch);
  }
  images.value = result.slice(0, 40);
}
onMounted(() => { if (pool.value.length) rebuild(); });
// 数据首次到达时构建, 后续不重建(避免弹跳)
const built = ref(false);
watch(pool, (v) => { if (v.length && !built.value) { rebuild(); built.value = true; } });


const lightbox = ref<{ img: VibeImage } | null>(null);
</script>

<template>
  <section id="vibes" class="py-24 px-6 lg:px-16 max-w-7xl mx-auto">
    <div class="mb-10">
      <span class="text-sm font-mono text-brandCyan tracking-[0.3em] uppercase font-bold">05 / STUDIO VIBES</span>
      <h2 class="text-4xl lg:text-6xl font-black text-white mt-1">工作室风情</h2>
    </div>

    <!-- 双行图片廊, 自动左右滚动 -->
    <div class="space-y-3">
      <div v-for="(rowImgs, ri) in [images.slice(0, 20), images.slice(20, 40)]" :key="ri"
           class="gallery-row" :style="{ '--speed': (ri === 0 ? '60s' : '70s'), '--dir': ri === 0 ? 'normal' : 'reverse' }">
        <div class="gallery-track" v-for="dup in 2" :key="dup">
          <div
            v-for="(img, idx) in rowImgs" :key="dup + '-' + idx"
            class="gallery-item group cursor-pointer flex-shrink-0"
            @click="lightbox = { img }"
          >
            <img :src="img.url" :alt="img.title"
                 class="w-auto h-40 lg:h-52 object-cover rounded-lg border border-white/5 group-hover:border-brandCyan/30 transition-all duration-300"
                 loading="lazy"
            />
            <div class="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                 style="background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%);" />
            <span class="absolute bottom-2 left-3 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">{{ img.title }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 灯箱 -->
    <Teleport to="body">
      <div v-if="lightbox" class="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-8"
           style="background: rgba(3,7,18,0.85); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);"
           @click="lightbox = null">
        <img :src="lightbox.img.url" :alt="lightbox.img.title"
             class="max-w-[85vw] max-h-[75vh] object-contain rounded-xl shadow-2xl border border-white/10"
             @click.stop />
        <p class="mt-5 text-lg font-bold text-white">{{ lightbox.img.title }}</p>
        <p class="text-xs text-gray-400 mt-1.5">点击任意处关闭</p>
      </div>
    </Teleport>
  </section>
</template>

<style scoped>
.gallery-row {
  display: flex;
  overflow: hidden;
  padding: 12px 0;
  margin: -12px 0;
  mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
}
.gallery-track {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
  animation: scrollX var(--speed, 60s) linear infinite;
  animation-direction: var(--dir, normal);
  transform: translateZ(0);
}
.gallery-item:last-child { margin-right: 0; }
.gallery-item {
  position: relative;
  transition: transform 0.3s ease;
}
.gallery-item:hover { transform: scale(1.03); z-index: 10; }

@keyframes scrollX {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>
