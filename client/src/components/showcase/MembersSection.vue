<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useAppStore } from '@/stores/app';
import type { Member } from '@/types';

const store = useAppStore();
const currentYear = ref('2026');
const currentDept = ref('全部');
const years = ref<string[]>(['2026', '2025', '2024']);
const depts = ref<string[]>(['全部', '委员会', 'FOSS部', '系统维护部', '宣传部', '程序部', 'Web部', '游戏部', 'APP部', 'iOS部', '鸿蒙部']);

onMounted(async () => {
  await store.fetchMembers(currentYear.value, currentDept.value);
});

watch([currentYear, currentDept], async ([year, dept]) => {
  await store.fetchMembers(year, dept);
});
</script>

<template>
  <section id="members" class="py-24 px-6 lg:px-16 max-w-7xl mx-auto">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
      <div>
        <span class="text-sm font-mono text-brandCyan tracking-[0.3em] uppercase font-bold">03 / MEMBER DIRECTORY</span>
        <h2 class="text-4xl lg:text-6xl font-black text-white mt-1">历年干部 & 成员名录</h2>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <div class="flex bg-white/5 p-1 rounded-xl border border-white/10 font-mono text-xs">
          <button v-for="year in years" :key="year" @click="currentYear = year"
                  :class="currentYear === year ? 'bg-brandBlue text-white font-bold' : 'text-gray-400 hover:text-white'"
                  class="px-3.5 py-1.5 rounded-lg transition">{{ year }} 级</button>
        </div>
        <select v-model="currentDept" class="bg-brandDark border border-white/10 rounded-xl text-xs font-mono px-3.5 py-2 text-gray-200 focus:outline-none focus:border-brandCyan">
          <option v-for="dept in depts" :key="dept" :value="dept">{{ dept }}</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 min-h-[320px]">
      <div v-for="member in store.members" :key="member.id"
           class="bento-card p-4 flex flex-col items-center text-center group" data-tilt>
        <div class="relative mb-3">
          <img :src="member.avatar" class="w-20 h-20 rounded-full object-cover border-2 border-white/10 group-hover:border-brandCyan transition duration-300">
          <span v-if="member.badge" class="absolute -bottom-1 -right-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-brandPurple text-white font-bold">{{ member.badge }}</span>
        </div>
        <span class="text-xs font-mono text-brandCyan font-bold mb-0.5">{{ member.title }}</span>
        <span class="text-sm font-bold text-white mb-2">{{ member.name }}</span>
        <span class="text-[10px] text-gray-400 font-mono bg-white/5 px-2 py-0.5 rounded-md w-full truncate">{{ member.dest || member.tech }}</span>
      </div>
    </div>
  </section>
</template>
