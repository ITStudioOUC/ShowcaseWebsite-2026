<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/stores/app';
import type { OrgLeader } from '@/types';

const store = useAppStore();

const committeeMembers = computed(() =>
  store.orgLeaders.filter((l: OrgLeader) => l.dept === '委员会')
);

const independentDepts = ['FOSS部', '系统维护部', '宣传部'];
const teachingDepts = ['程序部', 'Web部', '游戏部', 'APP部', 'iOS部', '鸿蒙部'];

function getLeaders(dept: string): OrgLeader[] {
  return store.orgLeaders.filter((l: OrgLeader) => l.dept === dept);
}

const deptSubtext: Record<string, string> = {
  'FOSS部': '开源软件文化推广 / Linux / 自由软件',
  '系统维护部': '服务器集群运维 / 网络安全 / 硬件',
  '宣传部': '海报设计 / 视觉传达 / 微信公众号运营',
};

const techStackTag: Record<string, string> = {
  '程序部': 'Java/Go/Python',
  'Web部': 'React/Next.js/Vue',
  '游戏部': 'Unity/C#/Graphics',
  'APP部': 'Flutter/Android',
  'iOS部': 'Swift/SwiftUI',
  '鸿蒙部': 'HarmonyOS/ArkTS',
};
</script>

<template>
  <section id="org" class="py-20 px-6 lg:px-16 max-w-7xl mx-auto">
    <div class="text-center mb-16 space-y-2">
      <span class="text-xs font-mono text-brandCyan tracking-widest uppercase font-bold">02 / ORGANIZATIONAL TREE</span>
      <h2 class="text-3xl lg:text-5xl font-black text-white">组织架构拓扑</h2>
      <p class="text-sm text-gray-400 max-w-xl mx-auto">
        点击对应部门卡片，可浮现该部门的详细介绍、技术栈与招新考核要求。
      </p>
    </div>

    <div class="relative flex flex-col items-center">
      <!-- SVG 连接线 -->
      <svg class="absolute inset-0 w-full h-full pointer-events-none z-0 hidden md:block">
        <line x1="50%" y1="120" x2="50%" y2="240" class="pulse-path" />
        <line x1="20%" y1="240" x2="80%" y2="240" class="pulse-path" />
        <line x1="20%" y1="240" x2="20%" y2="300" class="pulse-path" />
        <line x1="50%" y1="240" x2="50%" y2="300" class="pulse-path" />
        <line x1="80%" y1="240" x2="80%" y2="300" class="pulse-path" />
      </svg>

      <!-- 委员会 -->
      <div class="bento-card p-8 w-full lg:w-3/4 border-brandBlue/50 relative z-10 mb-16 bg-brandDark/90" data-tilt>
        <div class="flex flex-col md:flex-row justify-between items-center mb-6 pb-4 border-b border-white/10 gap-2">
          <div>
            <h3 class="text-2xl font-black text-white flex items-center gap-2">
              爱特工作室委员会
              <span class="text-xs font-mono font-normal px-2.5 py-0.5 rounded bg-brandBlue/30 text-brandCyan border border-brandBlue/50">Top Governance</span>
            </h3>
            <p class="text-xs text-gray-400 mt-1">负责工作室整体战略方向、项目统筹、财物管理与外部对接</p>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          <div v-for="leader in committeeMembers" :key="leader.id"
               class="flex flex-col items-center text-center p-3 rounded-xl bg-white/5 border border-white/5 hover:border-brandCyan/40 transition group cursor-pointer">
            <img :src="leader.avatar" class="w-16 h-16 rounded-full object-cover border-2 border-brandBlue mb-2.5 group-hover:scale-105 transition">
            <span class="text-xs font-mono text-brandCyan font-bold">{{ leader.title }}</span>
            <span class="text-sm font-bold text-white mt-0.5">{{ leader.name }}</span>
            <span class="text-[10px] text-gray-400 font-mono mt-1 px-1.5 py-0.5 rounded bg-black/40">{{ leader.tag }}</span>
          </div>
        </div>
      </div>

      <!-- 中层 & 基础部门 -->
      <div class="grid lg:grid-cols-12 gap-8 w-full relative z-10">
        <!-- 独立部门 -->
        <div class="lg:col-span-5 space-y-6">
          <div class="text-xs font-mono text-brandCyan font-bold uppercase tracking-wider flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-brandCyan"></span> 独立职能部门 (部长 / 副部长)
          </div>
          <div v-for="dept in independentDepts" :key="dept"
               class="bento-card p-6 cursor-pointer hover:border-brandCyan transition group" data-tilt>
            <div class="flex justify-between items-center mb-4">
              <div>
                <h4 class="text-lg font-bold text-white group-hover:text-brandCyan transition">{{ dept }}</h4>
                <span class="text-xs text-gray-400 font-mono">{{ deptSubtext[dept] || '官方直属核心团队' }}</span>
              </div>
              <span class="text-xs font-mono text-brandCyan px-2.5 py-1 rounded bg-brandCyan/10 border border-brandCyan/20">查看详情</span>
            </div>
            <div class="flex items-center gap-4">
              <div v-for="leader in getLeaders(dept)" :key="leader.id"
                   class="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/5">
                <img :src="leader.avatar" class="w-10 h-10 rounded-full object-cover border border-white/20">
                <div class="flex flex-col">
                  <span class="text-[11px] font-mono text-brandCyan font-bold">{{ leader.title }}</span>
                  <span class="text-xs font-bold text-white">{{ leader.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 基础教学部门 -->
        <div class="lg:col-span-7 space-y-6">
          <div class="text-xs font-mono text-brandPurple font-bold uppercase tracking-wider flex items-center justify-between">
            <span class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-brandPurple"></span> 基础教学部门 (站长 / 副站长分管)
            </span>
            <span class="text-[10px] text-gray-400">下设六大技术方向</span>
          </div>
          <div class="bento-card p-6 border-brandPurple/30 bg-brandPurple/5" data-tilt>
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="dept in teachingDepts" :key="dept"
                   class="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-brandPurple transition cursor-pointer group">
                <div class="flex justify-between items-center mb-2">
                  <h5 class="text-sm font-bold text-white group-hover:text-brandPurple transition">{{ dept }}</h5>
                  <span class="text-[10px] font-mono text-gray-400">{{ techStackTag[dept] || 'Tech Stack' }}</span>
                </div>
                <div v-for="leader in getLeaders(dept)" :key="leader.id"
                     class="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                  <img :src="leader.avatar" class="w-8 h-8 rounded-full object-cover">
                  <div class="flex flex-col">
                    <span class="text-[10px] font-mono text-brandPurple font-bold">{{ leader.title }}</span>
                    <span class="text-xs font-bold text-gray-200">{{ leader.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
