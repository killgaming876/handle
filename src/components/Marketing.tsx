'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { VideoScrollHero } from '@/components/VideoScrollHero';
import { ImmersiveModules } from '@/components/ImmersiveModules';

gsap.registerPlugin(ScrollTrigger);

const connectors = ['WhatsApp', 'Instagram', 'Messenger', 'Gmail', 'Outlook', 'Calendar', 'Calendly', 'Shopify', 'WooCommerce', 'Stripe', 'Razorpay', 'HubSpot', 'Salesforce', 'Zoho', 'Drive', 'Website'];
const architecture = [
  ['01', 'INBOX', 'Every conversation enters one surface.'],
  ['02', 'KNOWLEDGE', 'Policies, products and history stay available.'],
  ['03', 'DECISION ENGINE', 'Business rules determine the next move.'],
  ['04', 'WORKFLOWS', 'Connected tools execute the repetitive work.'],
  ['05', 'HUMAN HANDOFF', 'Important moments stay supervised.'],
  ['06', 'AUDIT', 'Every decision remains explainable.'],
];
const pricing = [
  ['STARTER', '$9', 'One business · essential automation'],
  ['GROWTH', '$29', 'Growing operations · deeper workflows'],
  ['PRO', '$79', 'Advanced operations · scale'],
];

export function Marketing() {
  const pageRef = useRef<HTMLElement>(null);
  const [activeTool, setActiveTool] = useState('WhatsApp');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.lux-progress span', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.handle-lux-page', start: 'top top', end: 'bottom bottom', scrub: 0.25 } });
      gsap.to('.lux-grid-drift', { y: 180, x: -90, ease: 'none', scrollTrigger: { trigger: '.lux-architecture', start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
      gsap.utils.toArray<HTMLElement>('.lux-reveal').forEach((el, i) => {
        gsap.fromTo(el, { y: 60, opacity: 0, rotateX: 10 }, { y: 0, opacity: 1, rotateX: 0, duration: 0.9, delay: i * 0.03, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 84%', once: true } });
      });
      gsap.to('.lux-marquee-track', { xPercent: -28, ease: 'none', scrollTrigger: { trigger: '.lux-marquee', start: 'top bottom', end: 'bottom top', scrub: 1 } });
      gsap.to('.lux-ring', { rotation: 360, ease: 'none', scrollTrigger: { trigger: '.lux-connections', start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
      gsap.utils.toArray<HTMLElement>('.lux-price-card').forEach((card, i) => {
        gsap.fromTo(card, { y: 100, rotateX: 12, opacity: 0 }, { y: 0, rotateX: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: i * 0.12, scrollTrigger: { trigger: card, start: 'top 86%', once: true } });
      });
      const runway = document.querySelector('.lux-runway');
      const panels = runway?.querySelector<HTMLElement>('.lux-runway-track');
      if (runway && panels) {
        gsap.to(panels, { xPercent: -62, ease: 'none', scrollTrigger: { trigger: runway, start: 'top top', end: '+=180%', scrub: 1.1, pin: true, anticipatePin: 1 } });
      }
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={pageRef} className="handle-lux-page cyber-page">
      <div className="lux-progress"><span /></div>
      <VideoScrollHero />

      <section id="system" className="lux-section lux-dark lux-system">
        <div className="lux-grid-drift" />
        <div className="lux-shell lux-two-col">
          <div className="lux-reveal"><span className="lux-kicker">01 / OPERATING LAYER</span><h2>TOO MANY<br /><em>SYSTEMS.</em></h2></div>
          <div className="lux-copy lux-reveal"><p>Your customer journey is already one thing. Your software split it into fragments. HANDLE becomes the layer that connects the fragments and keeps the work moving.</p><div className="lux-mini-grid"><div><b>CONTEXT</b><span>One memory.</span></div><div><b>CONTROL</b><span>Human in the loop.</span></div><div><b>EXECUTION</b><span>Tools act together.</span></div><div><b>AUDIT</b><span>Decisions stay clear.</span></div></div></div>
        </div>
      </section>

      <section id="loop" className="lux-section lux-loop">
        <div className="lux-shell">
          <div className="lux-reveal"><span className="lux-kicker">02 / HOW IT WORKS</span><h2>CONVERSATIONS →<br /><em>WORKFLOWS.</em></h2></div>
          <ImmersiveModules />
        </div>
      </section>

      <section className="lux-marquee" aria-label="Connected tools">
        <div className="lux-marquee-track">WHATSAPP · GMAIL · INSTAGRAM · CALENDAR · SHOPIFY · HUBSPOT · SALESFORCE · RAZORPAY · </div>
      </section>

      <section id="connections" className="lux-section lux-connections lux-stone">
        <div className="lux-shell lux-two-col">
          <div className="lux-reveal"><span className="lux-kicker">03 / CONNECTION LAYER</span><h2>ONE HANDLE.<br /><em>MANY SYSTEMS.</em></h2><p className="lux-copy-text">A connected operating surface across the tools your business already uses.</p></div>
          <div className="lux-connection-stage lux-reveal">
            <div className="lux-ring ring-a" /><div className="lux-ring ring-b" /><div className="lux-ring ring-c" />
            <div className="lux-core">HANDLE<span>CONNECTED OPERATING LAYER</span></div>
            {connectors.map((tool, i) => <button key={tool} className={'lux-tool lux-tool-' + (i % 10) + (activeTool === tool ? ' active' : '')} onMouseEnter={() => setActiveTool(tool)} onFocus={() => setActiveTool(tool)} onClick={() => setActiveTool(tool)}>{tool}<small>{activeTool === tool ? 'LIVE' : 'READY'}</small></button>)}
          </div>
        </div>
      </section>

      <section className="lux-section lux-dark lux-architecture">
        <div className="lux-grid-drift" />
        <div className="lux-shell"><div className="lux-reveal"><span className="lux-kicker">04 / ARCHITECTURE</span><h2>ONE SYSTEM.<br /><em>DEEPER CONTROL.</em></h2></div><div className="lux-architecture-grid">{architecture.map(([n, t, d]) => <article className="lux-arch-card lux-reveal" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><i /></article>)}</div></div>
      </section>

      <section id="pricing" className="lux-section lux-pricing">
        <div className="lux-shell"><div className="lux-reveal"><span className="lux-kicker">05 / PRICING</span><h2>SERIOUS AUTOMATION.<br /><em>SANE PRICING.</em></h2></div><div className="lux-price-grid">{pricing.map(([name, price, copy], i) => <article key={name} className={'lux-price-card lux-reveal ' + (i === 1 ? 'popular' : '')}><span className="lux-kicker">{name}</span><strong>{price}<small>/mo</small></strong><p>{copy}</p><div className="lux-price-list"><span>✓ Inbox</span><span>✓ Knowledge</span><span>✓ Workflow engine</span><span>✓ Human handoff</span></div><Link href="/signup" className="lux-price-btn">START FREE ↗</Link></article>)}</div></div>
      </section>

      <section className="lux-runway lux-dark">
        <div className="lux-runway-caption"><span>06 / THE OPERATING RUNWAY</span><strong>SCAN THE WHOLE BUSINESS.</strong></div>
        <div className="lux-runway-track">
          <article><span>INBOX</span><b>Capture</b><p>Every customer thread in one place.</p></article>
          <article><span>KNOWLEDGE</span><b>Remember</b><p>Policies, prices and context.</p></article>
          <article><span>DECISION ENGINE</span><b>Decide</b><p>Rules before action.</p></article>
          <article><span>WORKFLOWS</span><b>Execute</b><p>CRM, calendar, commerce.</p></article>
          <article><span>HUMAN HANDOFF</span><b>Escalate</b><p>Control for important moments.</p></article>
          <article><span>PRO</span><b>Scale</b><p>A complete operating surface.</p></article>
        </div>
      </section>

      <section className="lux-final lux-dark">
        <div className="lux-final-grid" />
        <div className="lux-final-content lux-reveal"><span className="lux-kicker">07 / HANDLE</span><h2>WE <em>HANDLE</em> IT.</h2><p>Less chasing. Less copy-paste. More business moving.</p><div><Link href="/signup" className="lux-pill">START FREE ↗</Link><Link href="/login" className="lux-outline">LOG IN →</Link></div></div>
      </section>
      <footer className="lux-footer"><span>HANDLE © 2026</span><span>WORK IN MOTION.</span></footer>
    </main>
  );
}
