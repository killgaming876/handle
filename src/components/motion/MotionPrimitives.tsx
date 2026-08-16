'use client';

import { ReactNode, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionStore } from '@/stores/motionStore';

gsap.registerPlugin(ScrollTrigger);

type BaseProps = { children: ReactNode; className?: string; id?: string };

type TextRevealProps = BaseProps & { mode?: 'word' | 'line' | 'character' };
export function ScrollTextReveal({ children, className = '', mode = 'word', id }: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const spans = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal-item]'));
    const ctx = gsap.context(() => {
      gsap.fromTo(spans, { yPercent: 110, opacity: 0.12, filter: 'blur(7px)' }, { yPercent: 0, opacity: 1, filter: 'blur(0px)', stagger: mode === 'character' ? 0.018 : 0.055, ease: 'power3.out', scrollTrigger: { trigger: root, start: 'top 92%', end: 'top 40%', scrub: 0.65 } });
    }, root);
    return () => ctx.revert();
  }, [mode]);

  const text = typeof children === 'string' ? children : '';
  const parts = mode === 'character' ? Array.from(text) : text.split(mode === 'line' ? '\n' : ' ');
  return (
    <div ref={ref} id={id} className={className} aria-label={text}>
      {text ? parts.map((part, index) => (
        <span key={`${part}-${index}`} data-reveal-item className={mode === 'line' ? 'reveal-line' : 'reveal-word'}>
          {part}{mode === 'character' || mode === 'line' ? '' : index < parts.length - 1 ? ' ' : ''}
        </span>
      )) : children}
    </div>
  );
}

export function ScrollZoom({ children, className = '' }: BaseProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(root, { scale: 0.72, opacity: 0.52, z: -160, filter: 'blur(7px)' }, { scale: 1, opacity: 1, z: 0, filter: 'blur(0px)', ease: 'none', scrollTrigger: { trigger: root, start: 'top 88%', end: 'center 42%', scrub: 1 } });
    }, root);
    return () => ctx.revert();
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}

export function StickyStage({ children, className = '', height = '280vh' }: BaseProps & { height?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('[data-sticky-item]');
      gsap.fromTo(items, { y: 70, opacity: 0.2, filter: 'blur(8px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: root, start: 'top 85%', end: 'top 45%', scrub: 0.8 } });
      items.forEach((item, index) => gsap.to(item, { y: index % 2 ? -26 : 24, rotateZ: index % 2 ? -1.2 : 1.2, scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 1.2 } }));
    }, root);
    return () => ctx.revert();
  }, []);
  return <section ref={ref} className={className} style={{ minHeight: height }}><div className="sticky-stage-viewport">{children}</div></section>;
}

export function ScrollTicker({ children, className = '' }: BaseProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const track = root.querySelector<HTMLElement>('[data-ticker-track]');
    if (!track) return;
    const base = gsap.quickTo(track, 'xPercent', { duration: 0.7, ease: 'power3.out' });
    const velocity = () => Math.min(36, useMotionStore.getState().normalizedVelocity * 18);
    const update = () => base(-22 - velocity());
    const ctx = gsap.context(() => {
      gsap.to(track, { xPercent: -12, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 1.1, onUpdate: update } });
    }, root);
    return () => ctx.revert();
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}

export function ScrollRotation({ children, className = '' }: BaseProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const ctx = gsap.context(() => gsap.to(root, { rotation: 360, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 1.3 } }), root);
    return () => ctx.revert();
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}

export function SpiralScroll({ children, className = '' }: BaseProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const cards = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('[data-spiral-item]'));
    const ctx = gsap.context(() => {
      cards.forEach((card, index) => {
        const angle = (index - (cards.length - 1) / 2) * 18;
        gsap.fromTo(card, { x: Math.sin(angle * Math.PI / 180) * 260, y: index * 34 - 70, z: -240 + index * 70, rotateY: angle, opacity: 0.22, filter: 'blur(11px)' }, { x: Math.sin(angle * Math.PI / 180) * 90, y: index * 16 - 26, z: 70 + index * 24, rotateY: angle * 0.3, opacity: 1, filter: 'blur(0px)', scrollTrigger: { trigger: root, start: 'top 80%', end: 'bottom 30%', scrub: 1.1 } });
      });
      gsap.to(root, { rotateY: 10, rotateZ: -1.5, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 1.1 } });
    }, root);
    return () => ctx.revert();
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}

export function HorizontalScroll({ children, className = '', travel = -72 }: BaseProps & { travel?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const track = root.querySelector<HTMLElement>('[data-horizontal-track]');
    if (!track) return;
    const ctx = gsap.context(() => gsap.to(track, { xPercent: travel, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: '+=220%', scrub: 1.1, pin: true, anticipatePin: 1 } }), root);
    return () => ctx.revert();
  }, [travel]);
  return <section ref={ref} className={className}><div className="horizontal-scroll-viewport">{children}</div></section>;
}

export function LayeredParallax({ children, className = '' }: BaseProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const layers = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('[data-depth]'));
    const ctx = gsap.context(() => layers.forEach((layer) => {
      const depth = Number(layer.dataset.depth || 1);
      gsap.to(layer, { y: -70 * depth, scale: 1 + depth * 0.015, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 1.25 } });
    }), root);
    return () => ctx.revert();
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}

export function VelocityBlur({ children, className = '' }: BaseProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { normalizedVelocity } = useMotionStore();
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const blur = Math.min(9, normalizedVelocity * 8);
    root.style.setProperty('--velocity-blur', `${blur}px`);
  }, [normalizedVelocity]);
  return <div ref={ref} className={`velocity-blur ${className}`}>{children}</div>;
}

export function SceneTransition({ children, className = '' }: BaseProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const ctx = gsap.context(() => gsap.fromTo(root, { clipPath: 'inset(10% 10% 10% 10% round 28px)', filter: 'blur(10px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', filter: 'blur(0px)', ease: 'power3.out', scrollTrigger: { trigger: root, start: 'top 92%', end: 'top 48%', scrub: 0.75 } }), root);
    return () => ctx.revert();
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}
