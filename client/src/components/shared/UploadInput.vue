<script setup lang="ts">
import { useUpload } from '@/composables/useUpload';

const model = defineModel<string>();
const { uploadFile, uploading } = useUpload();

async function handleUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const url = await uploadFile(file);
  model.value = url;
  (e.target as HTMLInputElement).value = '';
}
</script>

<template>
  <div class="flex gap-2">
    <input
      :value="model"
      @input="model = ($event.target as HTMLInputElement).value"
      :placeholder="'图片 URL'"
      class="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none"
    />
    <label class="px-3 py-2 rounded-lg bg-brandCyan/10 text-brandCyan text-xs font-bold border border-brandCyan/20 hover:bg-brandCyan/20 transition cursor-pointer whitespace-nowrap">
      {{ uploading ? '上传中...' : '上传文件' }}
      <input type="file" accept="image/*" class="hidden" @change="handleUpload" />
    </label>
  </div>
</template>
