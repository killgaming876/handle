'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useMotionStore } from '@/stores/motionStore';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollRuntime() {
  useEffect(() => {
    const motion = useMotionStore.getState();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const cores = navigator.hardwareConcurrency ?? 8;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const quality = reduce || memory <= 4 || cores <= 4 ? 'medium' : coarse ? 'high' : memory >= 12 && cores >= 8 ? 'ultra' : 'high';
    motion.setQuality(quality);

    const lenis = new Lenis({
      duration: reduce ? 0.01 : 1.05,
      smoothWheel: !reduce,
      syncTouch: true,
      touchMultiplier: 0.85,
      wheelMultiplier: 0.85,
    });

    let lastScroll = lenis.scroll;
    let lastTime = performance.now();

    const onScroll = ({ scroll, velocity, direction }: { scroll: number; limit: number; velocity: number; direction: number }) => {
      const nextDirection = Math.abs(velocity) < 0.015 ? 'idle' : direction >= 0 ? 'down' : 'up';
      const progress = Math.max(0, Math.min(1, scroll / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)));
      motion.setScroll(progress, velocity, nextDirection);
      document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(5));
      document.documentElement.style.setProperty('--scroll-velocity', Math.min(1, Math.abs(velocity) / 2.2).toFixed(5));
      document.documentElement.style.setProperty('--scroll-direction', nextDirection);
      lastScroll = scroll;
    };

    const onPointerMove = (event: PointerEvent) => {
      motion.setPointer(event.clientX / Math.max(1, window.innerWidth), event.clientY / Math.max(1, window.innerHeight));
    };

    lenis.on('scroll', onScroll);
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const ticker = (time: number) => {
      const delta = Math.max(0, time - lastTime);
      lastTime = time;
      lenis.raf(time * 1000);
      ScrollTrigger.update();

      if (delta > 48) {
        const velocity = (lenis.scroll - lastScroll) / Math.max(0.016, delta / 1000);
        const progress = Math.max(0, Math.min(1, lenis.scroll / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)));
        motion.setScroll(progress, velocity, velocity >= 0 ? 'down' : 'up');
        document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(5));
        document.documentElement.style.setProperty('--scroll-velocity', Math.min(1, Math.abs(velocity) / 2.2).toFixed(5));
      }
    };

    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(1000, 16);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('resize', refresh, { passive: true });
    window.addEventListener('orientationchange', refresh, { passive: true });

    const idleRefresh = window.setTimeout(refresh, 500);

    return () => {
      window.clearTimeout(idleRefresh);
      gsap.ticker.remove(ticker);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', refresh);
      window.removeEventListener('orientationchange', refresh);
      lenis.destroy();
      document.documentElement.style.removeProperty('--scroll-progress');
      document.documentElement.style.removeProperty('--scroll-velocity');
      document.documentElement.style.removeProperty('--scroll-direction');
    };
  }, []);

  return null;
}
