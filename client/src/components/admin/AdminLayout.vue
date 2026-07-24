<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

function logout() {
  auth.logout();
  router.push('/admin/login');
}

const navItems = [
  { path: '/admin/dashboard', label: '仪表盘', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { path: '/admin/members', label: '成员管理', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { path: '/admin/mentors', label: '导师管理', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { path: '/admin/achievements', label: '成果管理', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { path: '/admin/faqs', label: 'FAQ管理', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { path: '/admin/activities', label: '活动管理', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { path: '/admin/articles', label: '文章管理', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { path: '/admin/settings', label: '站点设置', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
];
</script>

<template>
  <div class="min-h-screen bg-brandDark flex">
    <!-- Sidebar -->
    <aside class="w-64 min-h-screen bg-white/5 border-r border-white/10 p-4 flex flex-col">
      <div class="flex items-center gap-2 mb-8 px-2 pt-2" @click="router.push('/')" style="cursor:pointer">
        <img src="@/assets/itlogo.svg" alt="爱特工作室" class="w-8 h-8">
        <span class="text-sm font-bold text-white">后台管理</span>
      </div>

      <nav class="flex-1 space-y-1">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path"
                     :class="route.path === item.path ? 'bg-brandBlue/20 text-brandCyan border-brandBlue/30' : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'"
                     class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono border transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon"></path></svg>
          {{ item.label }}
        </router-link>
      </nav>

      <div class="pt-4 border-t border-white/10">
        <button @click="logout" class="w-full text-left px-3 py-2 rounded-lg text-xs font-mono text-gray-400 hover:text-red-400 transition flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          退出登录
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 p-8 overflow-auto">
      <slot />
    </main>
  </div>
</template>
