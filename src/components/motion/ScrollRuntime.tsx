'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useMotionStore } from '@/stores/motionStore';
import { detectQuality } from '@/lib/quality';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollRuntime() {
  useEffect(() => {
    let destroyed = false;
    const motion = useMotionStore.getState();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    detectQuality(reduce).then((quality) => {
      if (!destroyed) motion.setQuality(quality);
    });

    const lenis = new Lenis({
      duration: reduce ? 0.01 : 0.72,
      smoothWheel: !reduce,
      syncTouch: false,
      touchMultiplier: 0.9,
      wheelMultiplier: 0.92,
    });

    const triggers: ScrollTrigger[] = [];
    const onScroll = ({ scroll, velocity, direction }: { scroll: number; limit: number; velocity: number; direction: number }) => {
      const nextDirection = Math.abs(velocity) < 0.015 ? 'idle' : direction >= 0 ? 'down' : 'up';
      const progress = Math.max(0, Math.min(1, scroll / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)));
      motion.setScroll(progress, velocity, nextDirection);
      document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(5));
      document.documentElement.style.setProperty('--scroll-velocity', Math.min(1, Math.abs(velocity) / 2.2).toFixed(5));
      document.documentElement.style.setProperty('--scroll-direction', nextDirection);
    };

    const onPointerMove = (event: PointerEvent) => {
      motion.setPointer(event.clientX / Math.max(1, window.innerWidth), event.clientY / Math.max(1, window.innerHeight));
    };

    lenis.on('scroll', onScroll);
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
      ScrollTrigger.update();
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(500, 16);

    gsap.utils.toArray<HTMLElement>('[data-section]').forEach((section) => {
      const name = section.dataset.section ?? 'unknown';
      triggers.push(ScrollTrigger.create({
        trigger: section,
        start: 'top 72%',
        end: 'bottom 28%',
        onEnter: (self) => motion.setSection(name, self.progress),
        onEnterBack: (self) => motion.setSection(name, self.progress),
        onUpdate: (self) => motion.setSection(name, self.progress),
      }));
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('resize', refresh, { passive: true });
    window.addEventListener('orientationchange', refresh, { passive: true });
    const refreshTimer = window.setTimeout(refresh, 250);

    return () => {
      destroyed = true;
      window.clearTimeout(refreshTimer);
      triggers.forEach((trigger) => trigger.kill());
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
