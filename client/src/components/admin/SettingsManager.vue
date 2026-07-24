<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AdminLayout from './AdminLayout.vue';
import { useAppStore } from '@/stores/app';
import { useApi } from '@/composables/useApi';

const store = useAppStore();
const api = useApi();
const form = ref<Record<string, string>>({});
const saved = ref(false);

onMounted(async () => {
  await store.fetchStats();
  form.value = { ...store.stats };
});

async function save() {
  await api.put('/stats', form.value);
  saved.value = true;
  setTimeout(() => saved.value = false, 2000);
}

// 页脚联系方式
interface FooterContact { id: number; text: string; }
const contacts = ref<FooterContact[]>([]);
async function fetchContacts() {
  try { contacts.value = await api.get<FooterContact[]>('/footer-contacts'); if (!contacts.value.length) contacts.value = [{ text: '' } as any]; } catch {}
}
async function saveContact(c: FooterContact) {
  if (!c.text) return;
  if (c.id) await api.put('/footer-contacts/' + c.id, { text: c.text });
  else await api.post('/footer-contacts', { text: c.text });
  fetchContacts();
}
async function delContact(id: number) { await api.delete('/footer-contacts/' + id); fetchContacts(); }
function addContact() { contacts.value.push({ text: '' } as any); }
onMounted(() => { fetchContacts(); });
</script>

<template>
  <AdminLayout>
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-white">站点设置</h1>
      <div class="bento-card p-6 space-y-4 max-w-2xl">
        <div>
          <label class="text-xs font-mono text-gray-400 block mb-1">状态栏文字</label>
          <input v-model="form.live_status" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
        </div>
        <div>
          <label class="text-xs font-mono text-gray-400 block mb-1">ICP 备案号</label>
          <input v-model="form.icp_number" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
        </div>
        <div>
          <label class="text-xs font-mono text-gray-400 block mb-1">公安备案号</label>
          <input v-model="form.gongan_number" class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none">
        </div>
        <div class="flex items-center gap-3">
          <button @click="save" class="px-4 py-2 rounded-lg bg-brandCyan text-black text-xs font-bold">保存设置</button>
          <span v-if="saved" class="text-xs text-brandEmerald">✓ 已保存</span>
        </div>
      </div>

      <!-- 页脚联系方式 -->
      <div class="bento-card p-6 space-y-4 max-w-2xl">
        <h2 class="text-lg font-bold text-white">页脚联系方式 (最多4行)</h2>
        <p class="text-xs text-gray-500">支持 Markdown 链接: [文字](URL)</p>
        <div v-for="(c, i) in contacts" :key="c.id ?? i" class="flex gap-2 items-center">
          <input v-model="c.text" class="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-brandCyan focus:outline-none" :placeholder="'第'+(i+1)+'行'">
          <button @click="saveContact(c)" class="px-3 py-2 rounded-lg bg-brandCyan/20 text-brandCyan text-xs font-bold">保存</button>
          <button @click="delContact(c.id)" class="px-3 py-2 rounded-lg bg-red-400/20 text-red-400 text-xs" v-if="c.id">删</button>
        </div>
        <button v-if="contacts.length < 4" @click="addContact" class="px-4 py-2 rounded-lg bg-white/5 text-gray-400 text-xs hover:text-white transition">+ 添加一行</button>
      </div>
    </div>
  </AdminLayout>
</template>
