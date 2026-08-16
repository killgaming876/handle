'use client';

import { useEffect, useRef } from 'react';

export default function CyberParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return;

    const mobile = window.matchMedia('(max-width: 767px)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const count = reduced ? 40 : mobile ? 85 : 150;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pointer = { x: -1000, y: -1000, active: false };
    let animationFrame = 0;
    let width = 0;
    let height = 0;

    type Particle = { x: number; y: number; vx: number; vy: number; size: number; alpha: number; hue: number };
    const particles: Particle[] = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (particles.length === 0) {
        for (let i = 0; i < count; i += 1) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.18,
            vy: (Math.random() - 0.5) * 0.12,
            size: Math.random() * 1.7 + 0.45,
            alpha: Math.random() * 0.55 + 0.14,
            hue: Math.random() > 0.5 ? 272 : 188,
          });
        }
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };
    const onPointerLeave = () => { pointer.active = false; };

    const render = () => {
      context.clearRect(0, 0, width, height);

      for (const particle of particles) {
        if (!reduced) {
          particle.x += particle.vx;
          particle.y += particle.vy;

          if (pointer.active) {
            const dx = particle.x - pointer.x;
            const dy = particle.y - pointer.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 140 && distance > 1) {
              const force = (140 - distance) / 140;
              particle.x += (dx / distance) * force * 1.25;
              particle.y += (dy / distance) * force * 1.25;
            }
          }

          if (particle.x < -10) particle.x = width + 10;
          if (particle.x > width + 10) particle.x = -10;
          if (particle.y < -10) particle.y = height + 10;
          if (particle.y > height + 10) particle.y = -10;
        }

        const gradient = context.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size * 5);
        gradient.addColorStop(0, `hsla(${particle.hue}, 90%, 72%, ${particle.alpha})`);
        gradient.addColorStop(1, `hsla(${particle.hue}, 90%, 72%, 0)`);
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
        context.fill();
      }

      if (!reduced) animationFrame = requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="cyber-particles" aria-hidden="true" />;
}
