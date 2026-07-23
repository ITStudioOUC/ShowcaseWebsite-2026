<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();
const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

async function handleLogin() {
  error.value = '';
  loading.value = true;
  try {
    await auth.login(username.value, password.value);
    router.push('/admin/dashboard');
  } catch (e: any) {
    error.value = e.message || '登录失败';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-brandDark flex items-center justify-center p-4">
    <div class="bento-card p-8 w-full max-w-md">
      <div class="text-center mb-8">
        <img src="@/assets/itlogo.svg" alt="爱特工作室" class="w-14 h-14 mx-auto mb-3 drop-shadow-[0_0_12px_rgba(0,242,254,0.3)]">
        <h1 class="text-xl font-bold text-white">爱特工作室 · 后台管理</h1>
        <p class="text-xs text-gray-400 mt-1">请登录以管理网站内容</p>
      </div>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <input v-model="username" type="text" placeholder="用户名" required
                 class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-brandCyan focus:outline-none text-sm">
        </div>
        <div>
          <input v-model="password" type="password" placeholder="密码" required
                 class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-brandCyan focus:outline-none text-sm">
        </div>
        <div v-if="error" class="text-red-400 text-xs">{{ error }}</div>
        <button type="submit" :disabled="loading"
                class="w-full py-3 rounded-xl bg-gradient-to-r from-brandBlue to-brandPurple text-white font-bold text-sm transition hover:from-brandPurple hover:to-brandBlue disabled:opacity-50">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
    </div>
  </div>
</template>
