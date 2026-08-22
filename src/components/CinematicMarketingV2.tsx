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
    let timer = 0;
    const activate = () => setReady(true);
    if ('requestIdleCallback' in window) {
      const idle = (window as Window & { requestIdleCallback: (cb: () => void, options?: { timeout: number }) => number }).requestIdleCallback(activate, { timeout: 700 });
      return () => (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(idle);
    }
    timer = window.setTimeout(activate, 180);
    return () => window.clearTimeout(timer);
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

    <section className="hx-section hx-signature" data-section="signature">
      <StickyStage height="240vh"><div className="hx-sticky">
        <div className="hx-chat"><small>NEW CUSTOMER MESSAGE</small><strong>“Can I book Friday at 4?”</strong><div className="hx-chat-line" /><span>HANDLE understands intent</span></div>
        <div className="hx-route"><span>MESSAGE</span><i /><span>CALENDAR</span><i /><span>CONFIRMED</span></div>
        <div className="hx-result"><small>RESULT</small><strong>FRIDAY · 4:00 PM</strong><span>Confirmation sent.</span></div>
      </div></StickyStage>
    </section>

    <section id="workflow" className="hx-section hx-workflow" data-section="workflow">
      <div className="hx-section-head"><span>03 / WORKFLOW ENGINE</span><h2>A BUSINESS<br /><em>IN MOTION.</em></h2></div>
      <SpiralScroll className="hx-spiral">{workflow.map((step, i) => <article key={step} data-spiral-item className="hx-work-card"><small>0{i + 1}</small><strong>{step}</strong><span>HANDLE EVENT</span></article>)}</SpiralScroll>
    </section>

    <HorizontalScroll className="hx-horizontal" travel={-72}>
      <div data-horizontal-track className="hx-horizontal-track">{signals.map((signal, i) => <article key={signal} className="hx-h-card"><small>0{i + 1}</small><strong>{signal}</strong><p>Connected context. Shared state. One operating layer.</p><div className="hx-scan" /></article>)}</div>
    </HorizontalScroll>

    <section id="connections" className="hx-section hx-product" data-section="product">
      <div className="hx-section-head"><span>05 / ACTUAL PRODUCT</span><h2>THE ABSTRACT<br /><em>BECOMES REAL.</em></h2></div>
      <div className="hx-app-window">
        <aside><b>HANDLE</b><span className="active">Overview</span><span>Inbox</span><span>Knowledge</span><span>Workflows</span><span>Connections</span><span>Analytics</span></aside>
        <div className="hx-app-main"><div className="hx-app-bar"><span>WORKSPACE / OVERVIEW</span><i>HANDLE ONLINE</i></div><div className="hx-metrics">{[['1,842','CONVERSATIONS'],['87%','AUTO-RESOLVED'],['32h','TIME SAVED'],['214','LEADS']].map(([n,l]) => <div key={l}><strong>{n}</strong><span>{l}</span></div>)}</div><div className="hx-live-card"><small>LIVE WORKFLOW</small><div>{workflow.map((s, i) => <span key={s}><b>{s}</b>{i < workflow.length - 1 && <i />}</span>)}</div></div></div>
      </div>
    </section>

    <section id="pricing" className="hx-section hx-pricing" data-section="pricing">
      <div className="hx-section-head"><span>06 / PRICING</span><h2>START SMALL.<br /><em>HANDLE MORE.</em></h2></div>
      <div className="hx-price-grid">{[['STARTER','$9'],['GROWTH','$29'],['PRO','$79']].map(([name, price], i) => <article key={name} className={i === 1 ? 'featured' : ''}><span>{name}</span><strong>{price}<small>/mo</small></strong><p>Inbox · Knowledge · Workflows · Human handoff</p><Link href="/signup">START FREE ↗</Link></article>)}</div>
    </section>

    <section className="hx-final" data-section="final">
      <motion.div className="hx-final-inner" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: [0.16,1,0.3,1] }}>
        <span>HANDLE / READY</span><h2>WE <em>HANDLE</em> IT.</h2><p>Your business has better things to do.</p><div className="hx-actions"><MagneticLink href="/signup">START FREE ↗</MagneticLink><MagneticLink href="/login">LOG IN →</MagneticLink></div>
      </motion.div>
    </section>
    <footer className="hx-footer"><span>HANDLE © 2026</span><span>FAST BY DEFAULT. CINEMATIC BY CHOICE.</span><Link href="/security">SECURITY</Link></footer>
  </main>;
}
