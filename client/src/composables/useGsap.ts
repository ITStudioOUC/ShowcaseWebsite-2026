import { ref, onMounted, onUnmounted, type Ref } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useGsap() {
  const animateOnScroll = (target: string | Element, vars: gsap.TweenVars) => {
    return gsap.from(target, {
      ...vars,
      scrollTrigger: {
        trigger: target,
        start: 'top 92%',
        end: 'top 78%',
        scrub: 1,
      },
    });
  };

  const counterAnimate = (el: HTMLElement, target: number, duration = 2) => {
    gsap.to(el, {
      innerText: target,
      duration,
      snap: { innerText: 1 },
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        once: true,
      },
    });
  };

  const staggerFadeIn = (targets: string | Element[], vars?: gsap.TweenVars) => {
    return gsap.from(targets, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ...vars,
      scrollTrigger: {
        trigger: typeof targets === 'string' ? targets : targets[0],
        start: 'top 92%',
        ...vars?.scrollTrigger as any,
      },
    });
  };

  return { animateOnScroll, counterAnimate, staggerFadeIn };
}
