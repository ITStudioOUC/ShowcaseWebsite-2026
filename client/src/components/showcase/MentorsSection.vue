<script setup lang="ts">
import { useAppStore } from '@/stores/app';

const store = useAppStore();
</script>

<template>
  <section id="mentors" class="py-20 px-6 lg:px-16 max-w-7xl mx-auto border-t border-white/10">
    <div class="mb-12">
      <span class="text-xs font-mono text-brandPurple tracking-widest uppercase font-bold">04 / ADVISORY TEAM</span>
      <h2 class="text-3xl lg:text-4xl font-black text-white mt-1">指导老师团队</h2>
    </div>

    <div class="grid md:grid-cols-3 gap-8">
      <div v-for="mentor in store.mentors" :key="mentor.id"
           class="bento-card p-6 flex items-start gap-4" data-tilt>
        <img :src="mentor.avatar" class="w-20 h-20 rounded-2xl object-cover border-2 border-brandPurple/40">
        <div class="space-y-1.5">
          <span class="text-xs font-mono text-brandPurple font-bold px-2.5 py-0.5 rounded-md bg-brandPurple/10 border border-brandPurple/30 inline-block">{{ mentor.title }}</span>
          <h3 class="text-lg font-bold text-white">{{ mentor.name }}</h3>
          <p class="text-xs text-gray-400 font-mono">{{ mentor.research }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
