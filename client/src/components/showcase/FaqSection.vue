<script setup lang="ts">
import { useAppStore } from '@/stores/app';

const store = useAppStore();
</script>

<template>
  <section id="qa" class="pt-24 pb-32 lg:pb-36 px-6 lg:px-16 max-w-5xl mx-auto">
    <div class="mb-12">
      <span class="text-sm font-mono text-brandCyan tracking-[0.3em] uppercase font-bold">06 / FAQ</span>
      <h2 class="text-4xl lg:text-6xl font-black text-white mt-1">常见问题</h2>
    </div>

    <div class="faq-list">
      <div v-for="faq in store.faqs" :key="faq.id" class="faq-item">
        <!-- Q 行 -->
        <div class="flex items-start gap-3 lg:gap-5">
          <div class="w-9 h-9 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-[#88e1fa]/10 border border-[#88e1fa]/30 flex items-center justify-center flex-shrink-0">
            <span class="text-base lg:text-lg font-black text-[#88e1fa] font-mono">Q</span>
          </div>
          <h3 class="text-[15px] lg:text-base font-bold text-white leading-relaxed pt-[7px] lg:pt-3">{{ faq.question }}</h3>
        </div>
        <!-- A 行 -->
        <div class="flex items-start gap-3 lg:gap-5 mt-3 lg:mt-4">
          <div class="w-9 h-9 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-[#c4b5fd]/10 border border-[#c4b5fd]/25 flex items-center justify-center flex-shrink-0">
            <span class="text-base lg:text-lg font-black text-[#c4b5fd] font-mono">A</span>
          </div>
          <p class="text-[13px] lg:text-sm text-gray-400 leading-relaxed lg:leading-loose pt-[7px] lg:pt-3">{{ faq.answer }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}
.faq-item {
  padding-bottom: 2.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.faq-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}
@media (max-width: 768px) {
  .faq-list {
    gap: 1.75rem;
  }
  .faq-item {
    padding-bottom: 1.75rem;
  }
  .faq-item p {
    overflow-wrap: break-word;
    word-break: break-word;
  }
}
</style>
