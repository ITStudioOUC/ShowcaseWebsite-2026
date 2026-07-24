<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import gsap from 'gsap';
import BackgroundCanvas from '@/components/showcase/BackgroundCanvas.vue';
import GridOverlay from '@/components/showcase/GridOverlay.vue';
import StatusBar from '@/components/showcase/StatusBar.vue';
import NavBar from '@/components/showcase/NavBar.vue';
import HeroSection from '@/components/showcase/HeroSection.vue';
import AboutSection from '@/components/showcase/AboutSection.vue';
import MembersSection from '@/components/showcase/MembersSection.vue';
import MentorsSection from '@/components/showcase/MentorsSection.vue';
import AchievementsSection from '@/components/showcase/AchievementsSection.vue';
import VibesSection from '@/components/showcase/VibesSection.vue';
import ActivitiesSection from '@/components/showcase/ActivitiesSection.vue';
import FaqSection from '@/components/showcase/FaqSection.vue';
import FooterSection from '@/components/showcase/FooterSection.vue';
import { useAppStore } from '@/stores/app';

const appStore = useAppStore();
const introDone = ref(false);

onMounted(() => {
  appStore.fetchAllData();
});

async function onIntroDone() {
  introDone.value = true;
  const lenis = (window as any).__lenis;
  if (lenis) lenis.start();
  await nextTick();
  gsap.fromTo('.header-item',
    { y: -80, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.7, stagger: 0.05, ease: 'power3.out' },
  );
}
</script>

<template>
  <div class="relative">
    <BackgroundCanvas />
    <GridOverlay />

    <!-- 顶部状态栏 (初始隐藏) -->
    <div style="opacity:0" class="header-item sticky top-0 z-50">
      <StatusBar />
    </div>

    <!-- 左侧导航点 (NavBar 独立, 滑动后出现) -->
    <NavBar />

    <main>
      <!-- -mt 拉回 header 高度，hero 真正铺满视口 -->
      <div class="-mt-[36px]">
        <HeroSection class="h-screen" @intro-done="onIntroDone" />
      </div>
      <AboutSection />
      <MentorsSection />
      <MembersSection />
      <AchievementsSection />
      <VibesSection />
      <ActivitiesSection />
      <FaqSection />
    </main>
    <FooterSection />
  </div>
</template>
