<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useAppStore } from '@/stores/app';
import { useApi } from '@/composables/useApi';
import type { Member } from '@/types';

const store = useAppStore();
const api = useApi();
const currentYear = ref('');
const currentDept = ref('委员会');
const depts = ref<string[]>(['委员会', 'FOSS部', '系统维护部', '宣传部', '程序部', 'Web部', '游戏部', 'APP部', 'iOS部', '鸿蒙部']);
const allYears = ref<string[]>([]);
const yearOffset = ref(0);
const deptOffset = ref(0);
const YEARS_PER_PAGE = 3;
const DEPTS_PER_PAGE = 4;

const visibleYears = computed(() => allYears.value.slice(yearOffset.value, yearOffset.value + YEARS_PER_PAGE));
const visibleDepts = computed(() => depts.value.slice(deptOffset.value, deptOffset.value + DEPTS_PER_PAGE));
const canPrev = computed(() => yearOffset.value > 0);
const canNext = computed(() => yearOffset.value + YEARS_PER_PAGE < allYears.value.length);

function prevYears() { if (canPrev.value) yearOffset.value--; }
function nextYears() { if (canNext.value) yearOffset.value++; }

function selectYear(y: string) {
  currentYear.value = y;
  // 确保选中的年份可见
  const idx = allYears.value.indexOf(y);
  if (idx >= 0 && (idx < yearOffset.value || idx >= yearOffset.value + YEARS_PER_PAGE)) {
    yearOffset.value = Math.max(0, Math.min(idx, allYears.value.length - YEARS_PER_PAGE));
  }
}

onMounted(async () => {
  try {
    const grades = await api.get<{year:string}[]>('/grades');
    allYears.value = grades.map((g: {year:string}) => g.year);
    if (!allYears.value.length) allYears.value = [String(new Date().getFullYear())];
    currentYear.value = allYears.value[0];
  } catch { const y = String(new Date().getFullYear()); allYears.value = [y]; currentYear.value = y; }
  await store.fetchMembers(currentYear.value, currentDept.value);
});

watch([currentYear, currentDept], async ([year, dept]) => {
  await store.fetchMembers(year, dept);
});
</script>

<template>
  <section id="members" class="py-24 px-6 lg:px-16 max-w-7xl mx-auto">
    <div class="mb-12">
      <span class="text-sm font-mono text-brandCyan tracking-[0.3em] uppercase font-bold">03 / MEMBERS</span>
      <h2 class="text-4xl lg:text-6xl font-black text-white mt-1">历年成员</h2>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-4 mb-10">
      <!-- 年级选择器 (左) -->
      <div class="flex items-center gap-1">
        <button @click="prevYears" :disabled="!canPrev"
                class="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition"
                :class="canPrev ? 'text-brandCyan hover:bg-white/5' : 'text-gray-700 cursor-not-allowed'">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div class="flex bg-white/5 p-1 rounded-xl border border-white/10 font-mono text-xs">
          <button v-for="y in visibleYears" :key="y" @click="selectYear(y)"
                  :class="currentYear === y ? 'bg-brandBlue text-white font-bold' : 'text-gray-400 hover:text-white'"
                  class="px-3.5 py-1.5 rounded-lg transition">{{ y }}</button>
        </div>
        <button @click="nextYears" :disabled="!canNext"
                class="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition"
                :class="canNext ? 'text-brandCyan hover:bg-white/5' : 'text-gray-700 cursor-not-allowed'">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>

      <!-- 部门选择器 (右, 一次4个) -->
      <div class="flex items-center gap-1">
        <button @click="deptOffset = Math.max(0, deptOffset - 1)" :disabled="deptOffset === 0"
                class="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition"
                :class="deptOffset > 0 ? 'text-brandPurple hover:bg-white/5' : 'text-gray-700 cursor-not-allowed'">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div class="flex bg-white/5 p-1 rounded-xl border border-white/10 font-mono text-xs">
          <button v-for="d in visibleDepts" :key="d" @click="currentDept = d"
                  :class="currentDept === d ? 'bg-brandPurple text-white font-bold' : 'text-gray-400 hover:text-white'"
                  class="px-3 py-1.5 rounded-lg transition whitespace-nowrap">{{ d }}</button>
        </div>
        <button @click="deptOffset = Math.min(depts.length - 4, deptOffset + 1)" :disabled="deptOffset >= depts.length - 4"
                class="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition"
                :class="deptOffset < depts.length - 4 ? 'text-brandPurple hover:bg-white/5' : 'text-gray-700 cursor-not-allowed'">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      <div v-for="member in store.members" :key="member.id"
           class="flex flex-col items-center text-center p-7 pb-8 rounded-md bg-white/[0.03] border-t border-white/[0.06] hover:border-brandCyan/30 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,242,254,0.15),0_0_40px_rgba(0,242,254,0.05)] transition-all duration-300">
        <img :src="member.avatar" class="w-28 h-28 rounded-full object-cover border-2 border-white/10 mb-4">
        <span class="text-base font-mono text-brandCyan font-bold">{{ member.title }}</span>
        <span class="text-lg font-bold text-white mt-1">{{ member.name }}</span>
        <span class="text-sm text-gray-400 mt-2.5 italic">{{ member.dest || '—' }}</span>
      </div>
    </div>
  </section>
</template>
