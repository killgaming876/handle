'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useMotionStore } from '@/stores/motionStore';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollRuntime() {
  useEffect(() => {
    const setScroll = useMotionStore.getState().setScroll;
    const setPointer = useMotionStore.getState().setPointer;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      setScroll(progress, velocity, nextDirection);
      lastScroll = scroll;
    };

    const onPointerMove = (event: PointerEvent) => {
      setPointer(event.clientX / Math.max(1, window.innerWidth), event.clientY / Math.max(1, window.innerHeight));
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
        setScroll(Math.max(0, Math.min(1, lenis.scroll / Math.max(1, document.documentElement.scrollHeight - window.innerHeight))), velocity, velocity >= 0 ? 'down' : 'up');
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
    };
  }, []);

  return null;
}
