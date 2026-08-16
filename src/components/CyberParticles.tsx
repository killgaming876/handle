'use client';

import { useEffect, useRef } from 'react';

type Particle = { x: number; y: number; vx: number; vy: number; size: number; alpha: number; sprite: HTMLCanvasElement };

function makeSprite(hue: number): HTMLCanvasElement {
  const size = 28;
  const sprite = document.createElement('canvas');
  sprite.width = size;
  sprite.height = size;
  const ctx = sprite.getContext('2d');
  if (!ctx) return sprite;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, `hsla(${hue}, 95%, 82%, 1)`);
  gradient.addColorStop(0.18, `hsla(${hue}, 95%, 72%, .8)`);
  gradient.addColorStop(0.52, `hsla(${hue}, 95%, 62%, .2)`);
  gradient.addColorStop(1, `hsla(${hue}, 95%, 55%, 0)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return sprite;
}

export default function CyberParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return;

    const mobile = window.matchMedia('(max-width: 767px)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const count = reduced ? 32 : mobile ? 70 : 120;
    const pointer = { x: -1000, y: -1000, active: false };
    const purpleSprite = makeSprite(272);
    const cyanSprite = makeSprite(188);
    const particles: Particle[] = [];
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
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
            vx: (Math.random() - 0.5) * 0.16,
            vy: (Math.random() - 0.5) * 0.1,
            size: Math.random() * 1.35 + 0.55,
            alpha: Math.random() * 0.48 + 0.12,
            sprite: Math.random() > 0.52 ? purpleSprite : cyanSprite,
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
            const distanceSquared = dx * dx + dy * dy;
            if (distanceSquared < 160 * 160 && distanceSquared > 1) {
              const distance = Math.sqrt(distanceSquared);
              const force = (160 - distance) / 160;
              particle.x += (dx / distance) * force * 1.1;
              particle.y += (dy / distance) * force * 1.1;
            }
          }

          if (particle.x < -20) particle.x = width + 20;
          if (particle.x > width + 20) particle.x = -20;
          if (particle.y < -20) particle.y = height + 20;
          if (particle.y > height + 20) particle.y = -20;
        }

        const drawSize = 22 * particle.size;
        context.globalAlpha = particle.alpha;
        context.drawImage(particle.sprite, particle.x - drawSize / 2, particle.y - drawSize / 2, drawSize, drawSize);
      }

      context.globalAlpha = 1;
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
