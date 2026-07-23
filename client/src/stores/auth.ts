import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApi } from '@/composables/useApi';

const api = useApi();

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '');
  const username = ref('');

  const isLoggedIn = () => !!token.value;

  async function login(user: string, pass: string) {
    const res = await api.post<{ token: string; username: string }>('/auth/login', {
      username: user,
      password: pass,
    });
    token.value = res.token;
    username.value = res.username;
    localStorage.setItem('token', res.token);
    return res;
  }

  function logout() {
    token.value = '';
    username.value = '';
    localStorage.removeItem('token');
  }

  async function checkAuth(): Promise<boolean> {
    if (!token.value) return false;
    try {
      const res = await api.get<{ id: number; username: string }>('/auth/me');
      username.value = res.username;
      return true;
    } catch {
      logout();
      return false;
    }
  }

  return { token, username, isLoggedIn, login, logout, checkAuth };
});
