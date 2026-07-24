<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAppStore } from '@/stores/app';
import { useApi } from '@/composables/useApi';
import gsap from 'gsap';

const store = useAppStore();
const api = useApi();
const currentYear = new Date().getFullYear();

interface FriendLink { id: number; title: string; url: string; }
interface FooterContact { id: number; text: string; }
const friendLinks = ref<FriendLink[]>([]);
const footerContacts = ref<FooterContact[]>([]);

// 解析 markdown 链接 [text](url)
function parseMarkdownLinks(text: string): string {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="hover:text-brandCyan transition">$1</a>');
}

onMounted(async () => {
  try { friendLinks.value = await api.get<FriendLink[]>('/friend-links'); } catch {}
  try { footerContacts.value = await api.get<FooterContact[]>('/footer-contacts'); } catch {}
});

// 分两列, 每列最多4个
const linksCol1 = computed(() => friendLinks.value.slice(0, 4));
const linksCol2 = computed(() => friendLinks.value.slice(4, 8));

const fufuRevealed = ref(false);
function revealFufu(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement;
  gsap.to(el, { y: window.innerHeight, duration: 0.8, ease: 'power2.in', onComplete: () => { fufuRevealed.value = true; } });
}


</script>

<template>
  <footer class="py-10 px-6 lg:px-16 text-xs text-gray-400 font-mono relative" style="background: linear-gradient(to bottom, rgba(10,16,30,0.95), rgba(6,12,22,0.98));">
    <!-- 校徽 + logo -->
    <div class="absolute right-6 lg:right-8 top-0 -translate-y-full flex items-center gap-4">
      <img src="@/assets/itstudio.png" alt="爱特工作室" class="h-12 w-auto" />
      <img src="@/assets/ouc.png" alt="中国海洋大学" class="h-14 w-auto" />
    </div>

    <div class="max-w-7xl mx-auto grid md:grid-cols-3 gap-5 mb-8">
      <!-- 友情链接 (两列) -->
      <div>
        <h4 class="text-white font-bold mb-3">友情链接</h4>
        <div class="flex gap-8">
          <ul class="space-y-2 text-[11px]">
            <li v-for="l in linksCol1" :key="l.id">
              <a :href="l.url" target="_blank" class="hover:text-brandCyan transition">{{ l.title }}</a>
            </li>
          </ul>
          <ul class="space-y-2 text-[11px]">
            <li v-for="l in linksCol2" :key="l.id">
              <a :href="l.url" target="_blank" class="hover:text-brandCyan transition">{{ l.title }}</a>
            </li>
          </ul>
        </div>
      </div>

      <!-- 联系方式 -->
      <div>
        <h4 class="text-white font-bold mb-3">联系方式与地址</h4>
        <ul class="space-y-2 text-[11px]">
          <li v-for="c in footerContacts" :key="c.id" v-html="parseMarkdownLinks(c.text)"></li>
        </ul>
      </div>

      <!-- 二维码 -->
      <div>
        <h4 class="text-white font-bold mb-3">扫码加入我们</h4>
        <div class="flex gap-4">
          <div class="text-center">
            <img src="@/assets/QQgroup.jpg" alt="招新群" class="w-28 h-28 rounded-lg object-cover border border-white/10" />
            <p class="text-[10px] text-gray-500 mt-1.5">招新群</p>
          </div>
          <div class="text-center">
            <img src="@/assets/QQChannel.jpg" alt="爱特社区" class="w-28 h-28 rounded-lg object-cover border border-white/10" />
            <p class="text-[10px] text-gray-500 mt-1.5">爱特社区</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 版权 (横线上方, 居中) -->
    <div class="max-w-7xl mx-auto text-center text-[11px] text-gray-500 mb-2">
      © 2002 - {{ currentYear }} 中国海洋大学爱特工作室 (IT Studio). All Rights Reserved.
    </div>
    <!-- 横线 -->
    <div class="max-w-7xl mx-auto border-t border-white/10"></div>
    <!-- 备案号 (横线下方, 居中) -->
    <div class="max-w-7xl mx-auto text-center text-[11px] text-gray-500 mt-2">
      <a href="https://beian.miit.gov.cn/" target="_blank" class="hover:text-brandCyan transition">{{ store.stats.icp_number || '鲁ICP备XXXXXXX号' }}</a> | <a href="https://beian.mps.gov.cn/#/query/webSearch" target="_blank" class="hover:text-brandCyan transition">{{ store.stats.gongan_number || '鲁公网安备 XXXXXXX号' }}</a>
    </div>
    <!-- 右下角彩蛋 -->
    <div class="absolute right-0 bottom-0 flex flex-col items-center">
      <img src="@/assets/fufu.JPG" alt="fufu" class="w-28 h-auto" />
      <p class="text-[9px] text-gray-600">啊啊啊雪雪被发现了</p>
      <!-- 黑色遮罩, 点击后马里奥掉落 -->
      <div v-if="!fufuRevealed" class="absolute inset-0 cursor-pointer" style="background: linear-gradient(to bottom, #0a101e, #060c16);" @click="revealFufu"></div>
    </div>
  </footer>
</template>
