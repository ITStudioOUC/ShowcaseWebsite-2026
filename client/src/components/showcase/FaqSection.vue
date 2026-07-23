<script setup lang="ts">
import { ref } from 'vue';
import { useAppStore } from '@/stores/app';

const store = useAppStore();
const activeFaq = ref(-1);

function toggle(idx: number) {
  activeFaq.value = activeFaq.value === idx ? -1 : idx;
}
</script>

<template>
  <section id="qa" class="py-20 px-6 lg:px-16 max-w-7xl mx-auto border-t border-white/10">
    <div class="grid lg:grid-cols-12 gap-12 items-start">
      <div class="lg:col-span-5 space-y-4">
        <span class="text-xs font-mono text-brandCyan tracking-widest uppercase font-bold">08 / FREQUENTLY ASKED QUESTIONS</span>
        <h2 class="text-3xl lg:text-4xl font-black text-white">加入爱特 · 常见解答</h2>
        <p class="text-sm text-gray-400 leading-relaxed">
          零基础可以加入吗？考核流程是怎样的？这里解答你对爱特工作室的一切好奇。
        </p>
        <div class="p-4 rounded-xl bg-brandBlue/10 border border-brandBlue/30 text-xs font-mono text-gray-300">
          招新咨询 QQ 群：<span class="text-brandCyan font-bold">{{ store.stats.qq_group }}</span><br>
          线下机房地址：西海岸校区 58 创新创业工坊
        </div>
      </div>

      <div class="lg:col-span-7 space-y-4">
        <div v-for="(faq, idx) in store.faqs" :key="faq.id"
             class="bento-card p-6 cursor-pointer" @click="toggle(idx)">
          <div class="flex justify-between items-center">
            <h3 class="text-base font-bold text-white flex items-center gap-2">
              <span class="text-xs font-mono px-2 py-0.5 rounded bg-brandCyan/20 text-brandCyan">Q</span>
              {{ faq.question }}
            </h3>
            <svg class="w-4 h-4 text-brandCyan transition-transform duration-300"
                 :class="activeFaq === idx ? 'rotate-180' : ''"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
          <div v-show="activeFaq === idx" class="mt-3 pt-3 border-t border-white/10">
            <p class="text-xs text-gray-300 leading-relaxed pl-7">{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
