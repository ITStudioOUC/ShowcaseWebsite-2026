import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/components/showcase/HomePage.vue'),
    },
    {
      path: '/admin/login',
      name: 'login',
      component: () => import('@/components/admin/LoginPage.vue'),
    },
    {
      path: '/admin',
      redirect: '/admin/dashboard',
    },
    {
      path: '/admin/dashboard',
      name: 'dashboard',
      component: () => import('@/components/admin/DashboardPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/members',
      name: 'admin-members',
      component: () => import('@/components/admin/MembersManager.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/mentors',
      name: 'admin-mentors',
      component: () => import('@/components/admin/MentorsManager.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/achievements',
      name: 'admin-achievements',
      component: () => import('@/components/admin/AchievementsManager.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/faqs',
      name: 'admin-faqs',
      component: () => import('@/components/admin/FaqManager.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/friend-links',
      name: 'admin-friend-links',
      component: () => import('@/components/admin/FriendLinksManager.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/vibe-images',
      name: 'admin-vibe-images',
      component: () => import('@/components/admin/VibeImagesManager.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/settings',
      name: 'admin-settings',
      component: () => import('@/components/admin/SettingsManager.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

// 路由守卫
router.beforeEach(async (to, _from, next) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token');
    if (!token) {
      next('/admin/login');
      return;
    }
    // 简单验证 token 存在，详细验证在 API 层进行
    try {
      // 验证 token 有效性
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        localStorage.removeItem('token');
        next('/admin/login');
        return;
      }
    } catch {
      localStorage.removeItem('token');
      next('/admin/login');
      return;
    }
  }
  next();
});

export default router;
