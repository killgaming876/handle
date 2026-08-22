'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ScrollRuntime from '@/components/motion/ScrollRuntime';
import { LayeredParallax, ScrollTextReveal, StickyStage, SpiralScroll, HorizontalScroll } from '@/components/motion/MotionPrimitives';

const HandleWorld = dynamic(() => import('@/components/webgl/HandleWorld'), { ssr: false, loading: () => <div className="handle-world-fallback" aria-hidden="true" /> });

const signals = ['MESSAGING', 'CRM', 'CALENDAR', 'PAYMENTS', 'SHOP', 'KNOWLEDGE'];
const workflow = ['MESSAGE', 'UNDERSTAND', 'DECIDE', 'ACT', 'CONFIRM'];

function DeferredWorld() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    const activate = () => setReady(true);

    if ('requestIdleCallback' in window) {
      const idle = (window as Window & {
        requestIdleCallback: (cb: () => void, options?: { timeout: number }) => number;
        cancelIdleCallback?: (id: number) => void;
      }).requestIdleCallback(activate, { timeout: 700 });
      cleanup = () => (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(idle);
    } else {
      const timer = window.setTimeout(activate, 180);
      cleanup = () => window.clearTimeout(timer);
    }

    return () => cleanup?.();
  }, []);
  return ready ? <HandleWorld /> : <div className="handle-world-fallback" aria-hidden="true" />;
}

function MagneticLink({ href, children }: { href: string; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  return <Link ref={ref} href={href} className="hx-cta" onPointerMove={(e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate3d(${(e.clientX - r.left - r.width / 2) * 0.08}px, ${(e.clientY - r.top - r.height / 2) * 0.08}px,0)`;
  }} onPointerLeave={() => { if (ref.current) ref.current.style.transform = 'translate3d(0,0,0)'; }}>{children}</Link>;
}

export default function CinematicMarketingV2() {
  return <main className="hx-site">
    <ScrollRuntime />
    <DeferredWorld />
    <div className="hx-noise" aria-hidden="true" />
    <nav className="hx-nav">
      <Link href="/" className="hx-logo">HANDLE<span>•</span></Link>
      <div className="hx-nav-links">
        <a href="#system">Product</a><a href="#workflow">Workflows</a><a href="#connections">Integrations</a><a href="#pricing">Pricing</a>
      </div>
      <div className="hx-nav-actions"><Link href="/login" className="hx-login">LOG IN</Link><MagneticLink href="/signup">START FREE ↗</MagneticLink></div>
    </nav>

    <section className="hx-hero" data-section="hero">
      <LayeredParallax className="hx-depth">
        <div data-depth="0.2" className="hx-grid" />
        <div data-depth="0.6" className="hx-orbit hx-orbit-a" />
        <div data-depth="1.2" className="hx-orbit hx-orbit-b" />
      </LayeredParallax>
      <div className="hx-hero-copy">
        <div className="hx-eyebrow">HANDLE / BUSINESS OPERATING SYSTEM</div>
        <ScrollTextReveal mode="line" className="hx-title">WE <em>HANDLE</em> IT.</ScrollTextReveal>
        <p>Customer conversations, repetitive work and everyday operations in one intelligent operating layer.</p>
        <div className="hx-actions"><MagneticLink href="/signup">START FREE ↗</MagneticLink><MagneticLink href="/demo">TRY HANDLE →</MagneticLink></div>
        <div className="hx-status"><i /> LIVE SYSTEM <span>SCROLL TO ENTER</span></div>
      </div>
      <div className="hx-hero-panel" aria-hidden="true">
        <span>REAL-TIME</span><strong>01</strong><b>BUSINESS ACTIVITY</b>
        {signals.slice(0, 4).map((s, i) => <div key={s} className="hx-signal" style={{ '--i': i } as React.CSSProperties}><i />{s}<small>ACTIVE</small></div>)}
      </div>
    </section>

    <section id="system" className="hx-section hx-convergence" data-section="system">
      <div className="hx-section-head"><span>01 / THE PROBLEM</span><h2>TOO MANY<br /><em>TOOLS.</em></h2></div>
      <div className="hx-convergence-stage">
        {signals.map((signal, i) => <div key={signal} className="hx-node" style={{ '--i': i } as React.CSSProperties}><span>{signal}</span><i /></div>)}
        <div className="hx-core">HANDLE<span>ONE SYSTEM</span></div>
      </div>
      <p className="hx-lead">HANDLE sits between the customer and the tools, turning scattered activity into one coherent operating flow.</p>
    </section>