<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAppStore } from '@/stores/app';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const store = useAppStore();

onMounted(() => {
  // Hero 文字动画
  gsap.from('.hero-badge', { opacity: 0, y: -15, duration: 0.8, delay: 0.3 });
  gsap.from('.hero-word', { opacity: 0, y: 35, rotateX: -30, duration: 1, stagger: 0.12, delay: 0.5 });
  gsap.from('.hero-desc', { opacity: 0, y: 20, duration: 0.8, delay: 1.0 });
  gsap.from('.counter-box', { opacity: 0, y: 20, duration: 0.8, stagger: 0.1, delay: 1.2 });
});
</script>

<template>
  <section class="min-h-[85vh] flex flex-col justify-center px-6 lg:px-16 pt-10 pb-16 relative">
    <div class="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-7 space-y-7">
        <div class="hero-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-brandCyan backdrop-blur-md">
          <svg class="w-3.5 h-3.5 text-brandEmerald" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          中国海洋大学信息科学与工程学部官方技术社团
        </div>

        <h1 class="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.15] text-white">
          <span class="hero-word inline-block">发现人才</span> ·
          <span class="hero-word inline-block">培养人才</span><br>
          <span class="hero-word inline-block bg-gradient-to-r from-brandCyan via-white to-brandPurple bg-clip-text text-transparent">输送人才的极客基地</span>
        </h1>

        <p class="hero-desc text-gray-300 text-base lg:text-lg leading-relaxed max-w-2xl font-normal">
          爱特工作室成立于 {{ store.stats.founded_year }} 年，承载 <span class="text-white font-bold underline decoration-brandCyan decoration-2">CCF 中国海洋大学学生分会</span> 与 <span class="text-white font-bold underline decoration-brandPurple decoration-2">海大 OpenHarmony 开源鸿蒙开发者协会</span> 两个官方组织。二十四载传承，稳居全校科技社团顶尖梯队。
        </p>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10 font-mono">
          <div class="counter-box">
            <div class="text-3xl font-black text-brandCyan">
              <CounterNum :target="parseInt(store.stats.founded_year)" /><span class="text-xs text-gray-400 font-normal">年</span>
            </div>
            <div class="text-[11px] text-gray-400 mt-1">立足海大 {{ (new Date()).getFullYear() - parseInt(store.stats.founded_year) }} 年</div>
          </div>
          <div class="counter-box">
            <div class="text-3xl font-black text-white">
              <CounterNum :target="parseInt(store.stats.member_count)" /><span class="text-xs text-brandEmerald font-normal">+</span>
            </div>
            <div class="text-[11px] text-gray-400 mt-1">历届技术骨干</div>
          </div>
          <div class="counter-box">
            <div class="text-3xl font-black text-brandPurple">
              <CounterNum :target="parseFloat(store.stats.placement_rate)" :decimals="1" /><span class="text-xs text-gray-400 font-normal">%</span>
            </div>
            <div class="text-[11px] text-gray-400 mt-1">C9保研/大厂率</div>
          </div>
          <div class="counter-box">
            <div class="text-3xl font-black text-brandEmerald">
              <CounterNum :target="parseInt(store.stats.project_count)" /><span class="text-xs text-gray-400 font-normal">+</span>
            </div>
            <div class="text-[11px] text-gray-400 mt-1">上线校园系统</div>
          </div>
        </div>
      </div>

      <!-- 右侧 Bento 模块 -->
      <div class="lg:col-span-5 space-y-4">
        <div class="bento-card p-6 border-brandBlue/40 bg-brandBlue/10 relative overflow-hidden" data-tilt>
          <div class="flex justify-between items-start mb-4">
            <span class="text-xs font-mono text-brandCyan tracking-wider uppercase font-bold">● HARDWARE INFRASTRUCTURE</span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-brandEmerald/20 text-brandEmerald">独立服务器集群</span>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">西海岸校区 58 工坊计算节点</h3>
          <p class="text-xs text-gray-300 leading-relaxed mb-4">
            工作室拥有独立机房服务器机柜，部署高性能 Docker/Kubernetes 容器环境与 GPU 算力节点，为社团项目提供 24×7 不间断物理计算支持。
          </p>
          <div class="flex flex-wrap gap-2 text-[11px] font-mono">
            <span class="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300">NVIDIA CUDA GPU</span>
            <span class="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300">Ubuntu Server 24.04</span>
            <span class="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300">OpenHarmony SDK</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bento-card p-5" data-tilt>
            <div class="text-xs font-mono text-brandPurple mb-1 font-bold">CCF 海大学生分会</div>
            <div class="text-sm font-bold text-white mb-2">青岛首个 CSP 认证点</div>
            <div class="text-[11px] text-gray-400 leading-normal">定期举办学术讲座、CCF 走进海大与专家面对面。</div>
          </div>
          <div class="bento-card p-5" data-tilt>
            <div class="text-xs font-mono text-brandCyan mb-1 font-bold">开发全栈生态</div>
            <div class="text-sm font-bold text-white mb-2">六大方向齐头并进</div>
            <div class="text-[11px] text-gray-400 leading-normal">UI/Web/程序/游戏/APP/鸿蒙开发全覆盖。</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
