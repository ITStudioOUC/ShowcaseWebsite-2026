const BASE_URL = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 对于非 GET 请求且 body 是对象的，设置 Content-Type
  if (options?.body && typeof options.body === 'string') {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    localStorage.removeItem('token');
    // 如果是后台页面，跳转到登录页
    if (window.location.pathname.startsWith('/admin') && !url.includes('/auth/')) {
      window.location.href = '/admin/login';
    }
    throw new Error('未授权');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: '请求失败' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export function useApi() {
  return {
    get: <T>(url: string) => request<T>(url),
    post: <T>(url: string, data?: any) =>
      request<T>(url, {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      }),
    put: <T>(url: string, data?: any) =>
      request<T>(url, {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      }),
    delete: <T>(url: string) => request<T>(url, { method: 'DELETE' }),
    upload: async (file: File): Promise<{ url: string }> => {
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      return res.json();
    },
  };
}
