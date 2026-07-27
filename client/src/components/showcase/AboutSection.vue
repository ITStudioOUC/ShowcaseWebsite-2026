<script setup lang="ts">
const stats = [
  { value: '42%', label: '社内保研率', color: 'text-brandCyan' },
  { value: '20+', label: '高性能服务器', color: 'text-white' },
  { value: '6+', label: '校内公益服务', color: 'text-brandPurple' },
  { value: '160+', label: '现有成员数', color: 'text-brandEmerald' },
];
</script>

<template>
  <section id="about" class="py-24 px-6 lg:px-16 max-w-7xl mx-auto">
    <div class="grid lg:grid-cols-12 gap-10">
      <!-- 左侧: 标题 (绝对上浮) + 介绍 + 统计 -->
      <div class="lg:col-span-7 relative pt-16">
        <!-- 标题：向上偏移对齐右侧卡片顶部 -->
        <div class="absolute -top-12 left-0">
          <span class="text-sm font-mono text-brandCyan tracking-[0.3em] uppercase font-bold">01 / ABOUT</span>
          <h2 class="text-4xl lg:text-6xl font-black text-white mt-1">关于爱特</h2>
        </div>

        <!-- 介绍文字 -->
        <div class="text-base lg:text-xl leading-relaxed text-gray-100 space-y-5 drop-shadow-[0_0_8px_rgba(255,255,255,0.08)]">
          <p>
            爱特工作室成立于 <span class="text-white font-bold">2002</span> 年，是中国海洋大学信息科学与工程学部
            <span class="text-white font-semibold">最早、规模最大</span>的校级官方计算机科技社团。
          </p>
          <p>
            社团承载
            <span class="font-bold bg-gradient-to-r from-brandCyan to-brandSky bg-clip-text text-transparent">CCF 中国海洋大学学生分会</span>、
            <span class="font-bold bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">海大 OpenHarmony 开源鸿蒙开发者协会</span>
            两大官方组织。综合资源、硬件设施、竞赛成果稳居全校社团
            <span class="text-white font-bold border-b-2 border-brandCyan/50">顶尖梯队</span>。
          </p>
          <p>
            校内多个学院官网及小程序均由本工作室<span class="text-brandEmerald font-semibold">自主开发搭建</span>。
            近年来，多位成员成功保研至
            <span class="text-white font-bold underline decoration-brandPurple/50 decoration-2 underline-offset-4">C9 高校</span>，
            或入职
            <span class="text-white font-bold">腾讯、美团、字节跳动</span>等互联网大厂。
          </p>
          <p>
            工作室拥有校内<span class="text-brandCyan font-semibold">顶尖计算资源</span>与高速互联网，为海大师生提供多项公益服务。
          </p>
        </div>

        <!-- 统计数据 -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 mt-6 border-t border-white/10">
          <div v-for="s in stats" :key="s.label" class="text-center">
            <div :class="s.color" class="text-3xl lg:text-4xl font-black font-mono">{{ s.value }}</div>
            <div class="text-xs text-gray-400 mt-1.5">{{ s.label }}</div>
          </div>
        </div>
      </div>

      <!-- 右侧: 办公地点 + 机房 (简洁左侧色条风格) -->
      <div class="lg:col-span-5 space-y-6">
        <!-- 五八工坊 -->
        <div class="border-l-2 border-[#88e1fa] pl-5 py-4 pr-4 bg-black/15 rounded-r-lg">
          <div class="flex justify-between items-start mb-2">
            <span class="text-xs font-mono text-[#88e1fa] tracking-wider uppercase font-bold">办公地点</span>
            <span class="text-[10px] font-mono text-brandEmerald">800+ ㎡</span>
          </div>
          <h3 class="text-lg font-bold text-white mb-2">西海岸 五八创新创业工坊</h3>
          <p class="text-sm text-gray-300 leading-relaxed">
            空间超 800 平，设备齐全 — 贴片机、3D 打印机、单片机、VR 等。设有 VR 室、办公区、教室、会议室、健身房、仓库等，超多区域等你探索。
          </p>
        </div>

        <!-- 1号机房 -->
        <div class="border-l-2 border-[#c4b5fd] pl-5 py-4 pr-4 bg-black/15 rounded-r-lg">
          <div class="flex justify-between items-start mb-2">
            <span class="text-xs font-mono text-[#c4b5fd] tracking-wider uppercase font-bold">五八机房</span>
            <span class="text-[10px] font-mono text-brandCyan">自建</span>
          </div>
          <h3 class="text-lg font-bold text-white mb-2">58 工坊计算节点</h3>
          <p class="text-sm text-gray-300 leading-relaxed">
            工作室自建机房，部署高性能 Docker 容器环境与 GPU 算力。含鸿蒙、龙芯等国产信创平台，配备生产环境集群与学习测试集群。
          </p>
        </div>

        <!-- 学院机房 -->
        <div class="border-l-2 border-[#7dd3fc] pl-5 py-4 pr-4 bg-black/15 rounded-r-lg">
          <div class="flex justify-between items-start mb-2">
            <span class="text-xs font-mono text-[#7dd3fc] tracking-wider uppercase font-bold">学院机房</span>
            <span class="text-[10px] font-mono text-brandEmerald">99.99% SLA</span>
          </div>
          <h3 class="text-lg font-bold text-white mb-2">学院计算节点</h3>
          <p class="text-sm text-gray-300 leading-relaxed">
            依托学院共建，部署 K8s 集群作为中心存储节点，为师生提供公益线上服务，可用性达 99.99%。
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
