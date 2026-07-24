import { ref } from 'vue';

export function useUpload() {
  const uploading = ref(false);

  async function uploadFile(file: File): Promise<string> {
    uploading.value = true;
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const data = await res.json();
    uploading.value = false;
    return data.url;
  }

  return { uploadFile, uploading };
}
