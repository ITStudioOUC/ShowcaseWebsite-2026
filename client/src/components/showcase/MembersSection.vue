<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useAppStore } from '@/stores/app';
import { useApi } from '@/composables/useApi';
import type { Member } from '@/types';

const store = useAppStore();
const api = useApi();
const currentYear = ref('');
const currentDept = ref('');
const allYears = ref<string[]>([]);
const yearOffset = ref(0);
const deptOffset = ref(0);
const YEARS_PER_PAGE = 3;
const DEPTS_PER_PAGE = 5;

const depts = computed(() => store.depts);

const visibleYears = computed(() => allYears.value.slice(yearOffset.value, yearOffset.value + YEARS_PER_PAGE));
const visibleDepts = computed(() => depts.value.slice(deptOffset.value, deptOffset.value + DEPTS_PER_PAGE));
const canYearPrev = computed(() => yearOffset.value > 0);
const canYearNext = computed(() => yearOffset.value + YEARS_PER_PAGE < allYears.value.length);
const canDeptPrev = computed(() => deptOffset.value > 0);
const canDeptNext = computed(() => deptOffset.value + DEPTS_PER_PAGE < depts.value.length);

function prevYears() { if (canYearPrev.value) yearOffset.value--; }
function nextYears() { if (canYearNext.value) yearOffset.value++; }
function prevDepts() { if (canDeptPrev.value) deptOffset.value--; }
function nextDepts() { if (canDeptNext.value) deptOffset.value++; }

function selectYear(y: string) {
  currentYear.value = y;
  const idx = allYears.value.indexOf(y);
  if (idx >= 0 && (idx < yearOffset.value || idx >= yearOffset.value + YEARS_PER_PAGE)) {
    yearOffset.value = Math.max(0, Math.min(idx, allYears.value.length - YEARS_PER_PAGE));
  }
}

function selectDept(d: string) {
  currentDept.value = d;
  const idx = depts.value.indexOf(d);
  if (idx >= 0 && (idx < deptOffset.value || idx >= deptOffset.value + DEPTS_PER_PAGE)) {
    deptOffset.value = Math.max(0, Math.min(idx, depts.value.length - DEPTS_PER_PAGE));
  }
}

onMounted(async () => {
  try {
    const grades = await api.get<{year:string}[]>('/grades');
    allYears.value = grades.map((g: {year:string}) => g.year);
    if (!allYears.value.length) allYears.value = [String(new Date().getFullYear())];
    currentYear.value = allYears.value[0];
  } catch { const y = String(new Date().getFullYear()); allYears.value = [y]; currentYear.value = y; }
  await store.fetchDepts();
  if (store.depts.length > 0) currentDept.value = store.depts[0];
  await store.fetchMembers(currentYear.value, currentDept.value);
});

watch(currentYear, async (year) => {
  if (!year) return;
  await store.fetchDepts(year);
  // 如果当前部门在新年份没成员, 切到第一个有成员的部门
  if (!store.depts.includes(currentDept.value)) {
    currentDept.value = store.depts[0] || '';
  }
  if (currentDept.value) await store.fetchMembers(year, currentDept.value);
});

watch(currentDept, async (dept) => {
  if (!currentYear.value || !dept) return;
  await store.fetchMembers(currentYear.value, dept);
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
        <button @click="prevYears" :disabled="!canYearPrev"
                class="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition"
                :class="canYearPrev ? 'text-brandCyan hover:bg-white/5' : 'text-gray-700 cursor-not-allowed'">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div class="flex bg-white/5 p-1 rounded-xl border border-white/10 font-mono text-xs">
          <button v-for="y in visibleYears" :key="y" @click="selectYear(y)"
                  :class="currentYear === y ? 'bg-brandBlue text-white font-bold' : 'text-gray-400 hover:text-white'"
                  class="px-3.5 py-1.5 rounded-lg transition">{{ y }}</button>
        </div>
        <button @click="nextYears" :disabled="!canYearNext"
                class="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition"
                :class="canYearNext ? 'text-brandCyan hover:bg-white/5' : 'text-gray-700 cursor-not-allowed'">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>

      <!-- 部门选择器 (右, 一次5个) -->
      <div class="flex items-center gap-1">
        <button @click="prevDepts" :disabled="!canDeptPrev"
                class="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition"
                :class="canDeptPrev ? 'text-brandEmerald hover:bg-white/5' : 'text-gray-700 cursor-not-allowed'">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div class="flex bg-white/5 p-1 rounded-xl border border-white/10 font-mono text-xs">
          <button v-for="d in visibleDepts" :key="d" @click="selectDept(d)"
                  :class="currentDept === d ? 'bg-brandEmerald text-white font-bold' : 'text-gray-400 hover:text-white'"
                  class="px-3 py-1.5 rounded-lg transition whitespace-nowrap">{{ d }}</button>
        </div>
        <button @click="nextDepts" :disabled="!canDeptNext"
                class="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition"
                :class="canDeptNext ? 'text-brandEmerald hover:bg-white/5' : 'text-gray-700 cursor-not-allowed'">
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
