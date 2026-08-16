'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function UltraEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const root = document.documentElement;
    let raf = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const updatePointer = (x: number, y: number) => {
      root.style.setProperty('--ux', `${x / Math.max(1, width)}`);
      root.style.setProperty('--uy', `${y / Math.max(1, height)}`);
      root.style.setProperty('--pointer-x', `${x}px`);
      root.style.setProperty('--pointer-y', `${y}px`);
    };

    const onPointer = (event: PointerEvent) => updatePointer(event.clientX, event.clientY);
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - height);
      root.style.setProperty('--scroll-progress', `${window.scrollY / max}`);
      root.dataset.scrolling = window.scrollY > 12 ? 'true' : 'false';
    };

    updatePointer(width * 0.5, height * 0.42);
    onScroll();
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    const ctx = canvasRef.current?.getContext('2d');
    const canvas = canvasRef.current;
    const points = Array.from({ length: coarse ? 42 : 110 }, (_, i) => ({
      x: (i * 127) % width,
      y: (i * 211) % height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.18,
      size: 0.55 + Math.random() * 1.25,
    }));

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      if (!canvas || !ctx) return;
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const draw = () => {
      if (!ctx || !canvas || reduce) return;
      ctx.clearRect(0, 0, width, height);
      const px = parseFloat(root.style.getPropertyValue('--pointer-x') || `${width / 2}`);
      const py = parseFloat(root.style.getPropertyValue('--pointer-y') || `${height / 2}`);
      points.forEach((p, i) => {
        const dx = p.x - px;
        const dy = p.y - py;
        const dist = Math.max(60, Math.hypot(dx, dy));
        const repel = Math.max(0, 1 - dist / 230);
        p.vx += (dx / dist) * repel * 0.022;
        p.vy += (dy / dist) * repel * 0.022;
        p.vx *= 0.987;
        p.vy *= 0.987;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;
        const alpha = 0.05 + repel * 0.12;
        ctx.fillStyle = `rgba(218,255,146,${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (i % 7 === 0 ? 1.8 : 1), 0, Math.PI * 2);
        ctx.fill();
        if (i % 13 === 0 && dist < 260) {
          ctx.strokeStyle = `rgba(242,241,233,${0.04 + repel * 0.08})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(px, py);
          ctx.stroke();
        }
      });
      raf = requestAnimationFrame(draw);
    };
    if (!reduce) draw();

    const magnetic = (event: PointerEvent) => {
      if (reduce || coarse) return;
      document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
        const r = el.getBoundingClientRect();
        const dx = event.clientX - (r.left + r.width / 2);
        const dy = event.clientY - (r.top + r.height / 2);
        const radius = Number(el.dataset.magnetic || 90);
        const d = Math.hypot(dx, dy);
        if (d < radius) {
          const power = (1 - d / radius) * 0.28;
          el.style.setProperty('--mag-x', `${dx * power}px`);
          el.style.setProperty('--mag-y', `${dy * power}px`);
        } else {
          el.style.setProperty('--mag-x', '0px');
          el.style.setProperty('--mag-y', '0px');
        }
      });
    };
    window.addEventListener('pointermove', magnetic, { passive: true });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-inview');
      });
    }, { threshold: 0.18 });

    document.querySelectorAll<HTMLElement>('[data-reveal], .section').forEach((el) => observer.observe(el));

    const heroLetters = document.querySelectorAll<HTMLElement>('.kinetic-letter');
    if (!reduce && heroLetters.length) {
      gsap.fromTo(heroLetters,
        { yPercent: 120, opacity: 0, rotateX: -85, z: -120 },
        { yPercent: 0, opacity: 1, rotateX: 0, z: 0, duration: 1.15, ease: 'power4.out', stagger: 0.055, delay: 0.18 },
      );
    }

    const triggers: ScrollTrigger[] = [];
    if (!reduce) {
      document.querySelectorAll<HTMLElement>('[data-depth]').forEach((el) => {
        const amount = Number(el.dataset.depth || 40);
        triggers.push(gsap.to(el, {
          y: amount,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.3 },
        }).scrollTrigger as ScrollTrigger);
      });
      document.querySelectorAll<HTMLElement>('[data-scroll-scale]').forEach((el) => {
        triggers.push(gsap.fromTo(el, { scale: 0.94, opacity: 0.35 }, {
          scale: 1, opacity: 1, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 35%', scrub: 1.1 },
        }).scrollTrigger as ScrollTrigger);
      });
    }

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      triggers.forEach((trigger) => trigger?.kill());
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointermove', magnetic);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return <canvas ref={canvasRef} className="ultra-particle-canvas" aria-hidden="true" />;
}
