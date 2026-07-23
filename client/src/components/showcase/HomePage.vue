<script setup lang="ts">
import { onMounted } from 'vue';
import BackgroundCanvas from '@/components/showcase/BackgroundCanvas.vue';
import GridOverlay from '@/components/showcase/GridOverlay.vue';
import StatusBar from '@/components/showcase/StatusBar.vue';
import NavBar from '@/components/showcase/NavBar.vue';
import HeroSection from '@/components/showcase/HeroSection.vue';
import AboutSection from '@/components/showcase/AboutSection.vue';
import OrgSection from '@/components/showcase/OrgSection.vue';
import MembersSection from '@/components/showcase/MembersSection.vue';
import MentorsSection from '@/components/showcase/MentorsSection.vue';
import AchievementsSection from '@/components/showcase/AchievementsSection.vue';
import VibesSection from '@/components/showcase/VibesSection.vue';
import ActivitiesSection from '@/components/showcase/ActivitiesSection.vue';
import FaqSection from '@/components/showcase/FaqSection.vue';
import FooterSection from '@/components/showcase/FooterSection.vue';
import { useAppStore } from '@/stores/app';

const appStore = useAppStore();

onMounted(() => {
  appStore.fetchAllData();
});
</script>

<template>
  <div class="relative min-h-screen">
    <BackgroundCanvas />
    <GridOverlay />
    <StatusBar />
    <NavBar />
    <main>
      <HeroSection />
      <AboutSection />
      <OrgSection />
      <MembersSection />
      <MentorsSection />
      <AchievementsSection />
      <VibesSection />
      <ActivitiesSection />
      <FaqSection />
    </main>
    <FooterSection />
  </div>
</template>
