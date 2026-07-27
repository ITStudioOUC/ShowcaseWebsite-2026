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
    icp_number: '',
    gongan_number: '',
  });

  const members = ref<Member[]>([]);
  const depts = ref<string[]>([]);
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
      const res = await api.get<any>(`/members?${params.toString()}`);
      // API 返回 { members, total } 或直接数组
      members.value = Array.isArray(res) ? res : (res.members || []);
    } catch (e) {
      console.error('获取成员列表失败:', e);
    } finally {
      loading.value = false;
    }
  }

  const FALLBACK_DEPTS = ['委员会', '系统维护部', 'FOSS部', '宣传部', '程序部', 'Web部', '游戏部', 'APP部', 'iOS部', '鸿蒙部'];

  async function fetchDepts(year?: string) {
    try {
      const url = year ? `/depts?year=${encodeURIComponent(year)}` : '/depts';
      depts.value = await api.get<string[]>(url);
    } catch (e) {
      console.error('获取部门列表失败，使用默认列表:', e);
      depts.value = FALLBACK_DEPTS;
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
      fetchAchievements(),
      fetchFaqs(),
      fetchOrgLeaders(),
      fetchMentors(),
      fetchVibeImages(),
    ]);
  }

  return {
    stats, members, depts, achievements, faqs, orgLeaders, mentors, vibeImages, loading,
    fetchStats, fetchMembers, fetchDepts, fetchAchievements, fetchFaqs, fetchVibeImages,
    fetchOrgLeaders, fetchMentors, fetchAllData,
  };
});
