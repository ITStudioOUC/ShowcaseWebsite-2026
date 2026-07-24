<script setup lang="ts">
import { useAppStore } from '@/stores/app';

const store = useAppStore();
</script>

<template>
  <section id="qa" class="py-24 px-6 lg:px-16 max-w-5xl mx-auto">
    <div class="mb-12">
      <span class="text-sm font-mono text-brandCyan tracking-[0.3em] uppercase font-bold">06 / FAQ</span>
      <h2 class="text-4xl lg:text-6xl font-black text-white mt-1">常见问题</h2>
    </div>

    <div class="space-y-10">
      <div v-for="faq in store.faqs" :key="faq.id">
        <!-- Q 行 -->
        <div class="grid grid-cols-[48px_1fr] gap-5 items-start">
          <div class="w-12 h-12 rounded-xl bg-[#88e1fa]/10 border border-[#88e1fa]/30 flex items-center justify-center flex-shrink-0">
            <span class="text-lg font-black text-[#88e1fa] font-mono">Q</span>
          </div>
          <h3 class="text-base font-bold text-white pt-3">{{ faq.question }}</h3>
        </div>
        <!-- A 行 -->
        <div class="grid grid-cols-[48px_1fr] gap-5 items-start mt-3">
          <div class="w-12 h-12 rounded-xl bg-[#c4b5fd]/10 border border-[#c4b5fd]/25 flex items-center justify-center flex-shrink-0">
            <span class="text-lg font-black text-[#c4b5fd] font-mono">A</span>
          </div>
          <p class="text-sm text-gray-400 leading-relaxed pt-3">{{ faq.answer }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
