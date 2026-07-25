<script setup lang="ts">
import { useAppStore } from '@/stores/app';

const store = useAppStore();
const go = (url: string) => window.open(url, '_blank');
</script>

<template>
  <section id="mentors" class="py-24 px-6 lg:px-16 max-w-7xl mx-auto">
    <div class="mb-12">
      <span class="text-sm font-mono text-[#c4b5fd] tracking-[0.3em] uppercase font-bold">02 / ADVISORY TEAM</span>
      <h2 class="text-4xl lg:text-6xl font-black text-white mt-1">指导老师团队</h2>
    </div>

    <div class="grid md:grid-cols-3 gap-6">
      <div v-for="mentor in store.mentors" :key="mentor.id"
           class="flex items-start gap-4 p-5 border-t transition-all relative overflow-hidden rounded-md cursor-pointer hover:scale-[1.02] duration-300"
           :class="{
             'border-brandPurple/20 hover:border-brandPurple/40': mentor.title.includes('团委'),
             'border-brandCyan/20 hover:border-brandCyan/40': mentor.title.includes('技术'),
             'border-brandSky/20 hover:border-brandSky/40': mentor.title.includes('企业'),
           }"
           :style="{
             background: 'repeating-linear-gradient(-45deg, rgba(10,16,24,0.60), rgba(10,16,24,0.60) 3px, rgba(12,18,28,0.60) 3px, rgba(12,18,28,0.60) 6px)',
             boxShadow: mentor.title.includes('团委') ? '3px 3px 18px rgba(196,181,253,0.45), 0 0 30px rgba(196,181,253,0.15)' :
                        mentor.title.includes('技术') ? '3px 3px 18px rgba(136,225,250,0.45), 0 0 30px rgba(136,225,250,0.15)' :
                        '3px 3px 18px rgba(125,211,252,0.45), 0 0 30px rgba(125,211,252,0.15)',
           }"
           @click="mentor.link && go(mentor.link)"
      >
        <img :src="mentor.avatar" class="w-18 h-24 rounded object-cover flex-shrink-0" style="width:88px;height:118px" />
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-bold text-white">{{ mentor.name }}</h3>
          <p class="text-sm mt-0.5 mb-2 font-bold"
             :class="{
               'text-[#c4b5fd]': mentor.title.includes('团委'),
               'text-[#88e1fa]': mentor.title.includes('技术'),
               'text-[#7dd3fc]': mentor.title.includes('企业'),
             }">{{ mentor.title }} · {{ mentor.academic_title }}</p>
          <div class="space-y-1 text-sm">
            <div><span class="text-gray-500">学院: </span><span class="text-gray-300">{{ mentor.college }}</span></div>
            <div><span class="text-gray-500">邮箱: </span><span class="text-gray-300 break-all">{{ mentor.email }}</span></div>
            <div><span class="text-gray-500">办公室: </span><span class="text-gray-300">{{ mentor.office }}</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
