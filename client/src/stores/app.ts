import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApi } from '@/composables/useApi';
import type { Member, Achievement, Faq, OrgLeader, Mentor, SiteStats } from '@/types';

const api = useApi();

export const useAppStore = defineStore('app', () => {
  const stats = ref<SiteStats>({
    founded_year: '2002',
    member_count: '500',
    placement_rate: '98.2',
    project_count: '50',
    live_status: '加载中...',
    qq_group: '589598653',
    email: 'contact@itstudio.club',
    address: '山东省青岛市古镇口核心区三沙路2000号 西海岸校区',
  });

  const members = ref<Member[]>([]);
  const achievements = ref<Achievement[]>([]);
  const faqs = ref<Faq[]>([]);
  const orgLeaders = ref<OrgLeader[]>([]);
  const mentors = ref<Mentor[]>([]);
  const vibeImages = ref<any[]>([]);

  const loading = ref(false);

  async function fetchStats() {
    try {
      const data = await api.get<SiteStats>('/stats');
      stats.value = { ...stats.value, ...data };
    } catch (e) {
      console.error('获取统计数据失败:', e);
    }
  }

  async function fetchMembers(year?: string, dept?: string) {
    loading.value = true;
    try {
      const params = new URLSearchParams();
      if (year) params.set('year', year);
      if (dept) params.set('dept', dept);
      members.value = await api.get<Member[]>(`/members?${params.toString()}`);
    } catch (e) {
      console.error('获取成员列表失败:', e);
    } finally {
      loading.value = false;
    }
  }

  async function fetchAchievements() {
    try {
      achievements.value = await api.get<Achievement[]>('/achievements');
    } catch (e) {
      console.error('获取成果列表失败:', e);
    }
  }

  async function fetchFaqs() {
    try {
      faqs.value = await api.get<Faq[]>('/faqs');
    } catch (e) {
      console.error('获取FAQ失败:', e);
    }
  }

  async function fetchOrgLeaders(dept?: string) {
    try {
      const params = dept ? `?dept=${encodeURIComponent(dept)}` : '';
      orgLeaders.value = await api.get<OrgLeader[]>(`/org-leaders${params}`);
    } catch (e) {
      console.error('获取组织架构失败:', e);
    }
  }

  async function fetchMentors() {
    try {
      mentors.value = await api.get<Mentor[]>('/mentors');
    } catch (e) {
      console.error('获取导师列表失败:', e);
    }
  }

  async function fetchVibeImages() {
    try {
      vibeImages.value = await api.get<any[]>('/vibe-images');
    } catch (e) { console.error('获取风情图片失败:', e); }
  }

  async function fetchAllData() {
    await Promise.all([
      fetchStats(),
      fetchMembers(),
      fetchAchievements(),
      fetchFaqs(),
      fetchOrgLeaders(),
      fetchMentors(),
      fetchVibeImages(),
    ]);
  }

  return {
    stats, members, achievements, faqs, orgLeaders, mentors, vibeImages, loading,
    fetchOrgLeaders, fetchMentors, fetchAllData,
  };
});
