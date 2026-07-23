<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const props = defineProps<{
  target: number;
  decimals?: number;
}>();

const counterRef = ref<HTMLSpanElement>();

let trigger: ScrollTrigger | null = null;

onMounted(() => {
  if (!counterRef.value) return;
  const obj = { value: 0 };
  trigger = ScrollTrigger.create({
    trigger: counterRef.value,
    start: 'top 90%',
    once: true,
    onEnter: () => {
      gsap.to(obj, {
        value: props.target,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => {
          if (counterRef.value) {
            counterRef.value.textContent = props.decimals !== undefined
              ? obj.value.toFixed(props.decimals)
              : Math.floor(obj.value).toString();
          }
        },
      });
    },
  });
});

onUnmounted(() => {
  trigger?.kill();
});
</script>

<template>
  <span ref="counterRef">0</span>
</template>
