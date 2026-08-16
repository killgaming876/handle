'use client';

import { useEffect } from 'react';

export default function GlobalMotion() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const touch = window.matchMedia('(pointer: coarse)');
    if (reduced.matches) document.documentElement.dataset.motion = 'reduced';

    const root = document.documentElement;
    const layer = document.querySelector<HTMLElement>('.page-fade-layer');
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let raf = 0;
    let lastX = pointer.x;
    let lastY = pointer.y;
    let trailTarget = { x: pointer.x, y: pointer.y };

    const move = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      trailTarget = { x: event.clientX, y: event.clientY };
      root.style.setProperty('--pointer-x', `${event.clientX}px`);
      root.style.setProperty('--pointer-y', `${event.clientY}px`);

      document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
        if (touch.matches || reduced.matches) return;
        const r = el.getBoundingClientRect();
        const dx = event.clientX - (r.left + r.width / 2);
        const dy = event.clientY - (r.top + r.height / 2);
        const dist = Math.hypot(dx, dy);
        const range = Number(el.dataset.magnetic ?? 110);
        if (dist < range) {
          const strength = (1 - dist / range) * 0.28;
          el.style.setProperty('--mx', `${dx * strength}px`);
          el.style.setProperty('--my', `${dy * strength}px`);
        } else {
          el.style.setProperty('--mx', '0px');
          el.style.setProperty('--my', '0px');
        }
      });
    };

    const click = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const button = target.closest<HTMLElement>('button, a, [role="button"]');
      if (!button) return;

      const r = button.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'motion-ripple';
      ripple.style.left = `${event.clientX - r.left}px`;
      ripple.style.top = `${event.clientY - r.top}px`;
      button.appendChild(ripple);
      window.setTimeout(() => ripple.remove(), 650);

      const href = (button as HTMLAnchorElement).href;
      if (layer && href && !href.startsWith('javascript:') && href.includes(window.location.origin) && new URL(href).pathname !== window.location.pathname) {
        layer.classList.add('is-wiping');
      }

      if (button.matches('[data-like]')) {
        button.classList.toggle('is-liked');
        const burst = document.createElement('span');
        burst.className = 'like-burst';
        for (let i = 0; i < 8; i += 1) {
          const p = document.createElement('i');
          p.style.setProperty('--a', `${i * 45}deg`);
          burst.appendChild(p);
        }
        button.appendChild(burst);
        window.setTimeout(() => burst.remove(), 700);
      }

      if (button.matches('[data-submit-motion]')) {
        button.classList.add('is-processing');
        window.setTimeout(() => button.classList.remove('is-processing'), 1300);
      }
    };

    const hover = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest<HTMLElement>('[data-tooltip]');
      if (interactive && interactive.dataset.tooltip) {
        root.style.setProperty('--tooltip-x', `${event.clientX + 14}px`);
        root.style.setProperty('--tooltip-y', `${event.clientY + 14}px`);
      }
    };

    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      }),
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    const highlightObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      }),
      { threshold: 0.6 },
    );

    const registerVisuals = () => {
      document.querySelectorAll<HTMLElement>('section, .panel, .card, .editorial-card, .price-card, .stat-card, .connection-node, .workflow-story-step').forEach((el) => {
        if (!el.classList.contains('motion-reveal')) el.classList.add('motion-reveal');
        revealObserver.observe(el);
      });
      document.querySelectorAll<HTMLElement>('.lead-copy, .final-copy, [data-highlight]').forEach((el) => {
        el.classList.add('text-highlight');
        highlightObserver.observe(el);
      });
    };

    const tilt = (event: PointerEvent) => {
      if (touch.matches || reduced.matches) return;
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-tilt], .floating-card, .hero-board, .price-card, .editorial-card');
      if (!target) return;
      const r = target.getBoundingClientRect();
      const px = (event.clientX - r.left) / r.width - 0.5;
      const py = (event.clientY - r.top) / r.height - 0.5;
      target.style.setProperty('--tilt-x', `${(-py * 5).toFixed(2)}deg`);
      target.style.setProperty('--tilt-y', `${(px * 5).toFixed(2)}deg`);
    };

    const leave = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-tilt], .floating-card, .hero-board, .price-card, .editorial-card');
      if (!target) return;
      target.style.setProperty('--tilt-x', '0deg');
      target.style.setProperty('--tilt-y', '0deg');
    };

    const scroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const progress = scrollY / max;
      root.style.setProperty('--scroll-progress', `${progress}`);
      root.style.setProperty('--scroll-velocity', `${Math.min(1.8, Math.abs(scrollY - Number(root.dataset.lastScroll || scrollY)) / 20)}`);
      root.dataset.lastScroll = String(scrollY);
    };

    const setupInteractiveAttributes = () => {
      document.querySelectorAll<HTMLElement>('.btn, .google-button, .connection-node, .mobile-menu-toggle, .motion-fab > button, .side-link').forEach((el) => {
        if (!el.hasAttribute('data-magnetic')) el.setAttribute('data-magnetic', touch.matches ? '0' : '120');
      });
      document.querySelectorAll<HTMLElement>('.btn, .google-button').forEach((el) => {
        el.classList.add('liquid-button');
      });
      document.querySelectorAll<HTMLButtonElement>('button[type="submit"], .auth-submit').forEach((el) => {
        el.setAttribute('data-submit-motion', 'true');
      });
      document.querySelectorAll<HTMLElement>('.notification-count, .badge.live').forEach((el) => el.classList.add('notification-badge'));
    };

    const ensureMobileMenu = () => {
      const nav = document.querySelector('.nav');
      if (!nav || nav.querySelector('.mobile-menu-toggle')) return;
      const toggle = document.createElement('button');
      toggle.className = 'mobile-menu-toggle';
      toggle.setAttribute('aria-label', 'Open menu');
      toggle.innerHTML = '<span></span><span></span><span></span>';
      const panel = document.createElement('div');
      panel.className = 'mobile-menu-panel';
      panel.innerHTML = '<a href="#system">Product</a><a href="#demo">How it works</a><a href="#connections">Integrations</a><a href="#pricing">Pricing</a><a href="/login">Log in</a><a class="menu-cta" href="/signup">Start free</a>';
      nav.append(toggle, panel);
      toggle.addEventListener('click', () => {
        const open = nav.classList.toggle('menu-open');
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      });
      panel.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => nav.classList.remove('menu-open')));
    };

    const ensureFab = () => {
      if (document.querySelector('.motion-fab')) return;
      const fab = document.createElement('div');
      fab.className = 'motion-fab';
      fab.innerHTML = '<button aria-label="Quick actions">+</button><div class="fab-menu"><a href="#demo">TRY DEMO</a><a href="#connections">CONNECTORS</a><a href="/signup">START FREE</a></div>';
      document.body.appendChild(fab);
      const button = fab.querySelector('button');
      button?.addEventListener('click', () => fab.classList.toggle('open'));
    };

    const setupTooltips = () => {
      document.querySelectorAll<HTMLElement>('[title]:not([data-tooltip])').forEach((el) => {
        const value = el.getAttribute('title');
        if (!value) return;
        el.dataset.tooltip = value;
        el.removeAttribute('title');
      });
    };

    const canvas = document.createElement('canvas');
    canvas.className = 'ambient-motion-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const particles = Array.from({ length: touch.matches ? 22 : 52 }, (_, i) => ({
      x: (i * 73) % innerWidth,
      y: (i * 137) % innerHeight,
      vx: ((i % 3) - 1) * 0.12,
      vy: ((i % 5) - 2) * 0.08,
      r: i % 3 === 0 ? 1.8 : 1.1,
    }));

    const resize = () => {
      canvas.width = innerWidth * Math.min(1.5, devicePixelRatio || 1);
      canvas.height = innerHeight * Math.min(1.5, devicePixelRatio || 1);
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      ctx?.setTransform(canvas.width / innerWidth, 0, 0, canvas.height / innerHeight, 0, 0);
    };
    resize();

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      const desiredX = trailTarget.x;
      const desiredY = trailTarget.y;
      lastX += (desiredX - lastX) * 0.12;
      lastY += (desiredY - lastY) * 0.12;
      if (!reduced.matches && !touch.matches) {
        particles.forEach((p, idx) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -10) p.x = innerWidth + 10;
          if (p.x > innerWidth + 10) p.x = -10;
          if (p.y < -10) p.y = innerHeight + 10;
          if (p.y > innerHeight + 10) p.y = -10;
          const dx = p.x - lastX;
          const dy = p.y - lastY;
          const d = Math.max(45, Math.hypot(dx, dy));
          const alpha = Math.max(0, Math.min(0.22, 14 / d));
          ctx.fillStyle = `rgba(233,185,73,${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          if (idx % 9 === 0 && d < 240) {
            ctx.strokeStyle = `rgba(17,17,15,${0.025 + alpha * 0.4})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(lastX, lastY);
            ctx.stroke();
          }
        });
      }
      raf = requestAnimationFrame(animate);
    };
    animate();

    ensureMobileMenu();
    ensureFab();
    setupTooltips();
    setupInteractiveAttributes();
    registerVisuals();
    scroll();

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointermove', hover, { passive: true });
    window.addEventListener('pointermove', tilt, { passive: true });
    window.addEventListener('pointerout', leave, { passive: true });
    window.addEventListener('click', click);
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      revealObserver.disconnect();
      highlightObserver.disconnect();
      canvas.remove();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointermove', hover);
      window.removeEventListener('pointermove', tilt);
      window.removeEventListener('pointerout', leave);
      window.removeEventListener('click', click);
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('resize', resize);
      document.querySelector('.motion-fab')?.remove();
    };
  }, []);

  return <div className="page-fade-layer" aria-hidden="true" />;
}
