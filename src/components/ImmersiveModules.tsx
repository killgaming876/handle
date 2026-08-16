'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { PointerEvent, ReactNode } from 'react';

const loop = [
  ['01', 'CAPTURE', 'Every conversation lands in one operating layer.'],
  ['02', 'UNDERSTAND', 'HANDLE reads intent, context and your business rules.'],
  ['03', 'DECIDE', 'The system selects the correct next action.'],
  ['04', 'ACT', 'Calendar, CRM, commerce and messaging move together.'],
  ['05', 'CONFIRM', 'The customer gets a human-quality response.'],
] as const;

const plans = [
  ['STARTER', '$9', 'For one business and the first 10 workflows'],
  ['GROWTH', '$29', 'For growing teams with deeper automation'],
  ['PRO', '$79', 'For advanced operations and scale'],
] as const;

function usePanelGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    element.style.setProperty('--glow-x', `${event.clientX - rect.left}px`);
    element.style.setProperty('--glow-y', `${event.clientY - rect.top}px`);
  };
  return { ref, onPointerMove };
}

export function ImmersiveModules() {
  const simulatorRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const [demoInput, setDemoInput] = useState('Can you book me tomorrow at 4:30?');
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [activePlan, setActivePlan] = useState(1);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const section = simulatorRef.current;
    if (!section) return;

    const syncFromScroll = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      const next = Math.min(loop.length - 1, Math.floor(progress * loop.length));
      setStep((current) => current === next ? current : next);
    };

    syncFromScroll();
    window.addEventListener('scroll', syncFromScroll, { passive: true });
    window.addEventListener('resize', syncFromScroll);
    return () => {
      window.removeEventListener('scroll', syncFromScroll);
      window.removeEventListener('resize', syncFromScroll);
    };
  }, []);

  useEffect(() => {
    const root = pricingRef.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.immersive-price-card'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cards.forEach((card) => card.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const card = entry.target as HTMLElement;
        if (entry.isIntersecting) card.classList.add('is-visible');
        if (entry.intersectionRatio > 0.62) {
          const index = Number(card.dataset.planIndex ?? 0);
          setActivePlan(index);
        }
      });
    }, { threshold: [0.15, 0.62] });

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
  }, []);

  const runDemo = () => {
    if (running) return;
    setRunning(true);
    setStep(0);
    let current = 0;
    timerRef.current = window.setInterval(() => {
      current += 1;
      setStep(current);
      if (current >= loop.length - 1) {
        if (timerRef.current) window.clearInterval(timerRef.current);
        timerRef.current = null;
        setRunning(false);
      }
    }, 680);
  };

  return (
    <>
      <section ref={simulatorRef} className="section immersive-simulator" aria-label="HANDLE simulator and architecture timeline">
        <div className="container">
          <div className="eyebrow">THE LIVE SIMULATOR</div>
          <div className="section-head split-head">
            <h2 className="section-title">MESSAGE IN.<br /><span className="serif">SYSTEM IN MOTION.</span></h2>
            <p className="lead-copy dark-text">Scroll through the loop, or run it manually. The chat and architecture track stay locked to the same operating state.</p>
          </div>

          <div className="immersive-stage-grid">
            <GlowPanel className="sim-chat-panel">
              <div className="window-bar"><span className="window-dots">● ● ●</span><strong>HANDLE / CUSTOMER SIMULATION</strong><span>DEMO</span></div>
              <div className="sim-chat-body">
                <div className="chat-progress-label"><span>ACTIVE STATE</span><b>{loop[step][1]}</b></div>
                <div className="chat-stack" aria-live="polite">
                  {[
                    demoInput,
                    'I’ll check the rules, availability and customer context.',
                    'Tomorrow at 4:30 PM is available.',
                    'Perfect. Book it.',
                    'Done. Your appointment is confirmed for tomorrow at 4:30 PM.',
                  ].map((text, index) => (
                    <div key={`${index}-${text}`} className={`chat immersive-chat ${index % 2 === 0 ? 'customer' : 'handle'} ${index <= step ? 'revealed' : ''}`}>
                      {text}
                    </div>
                  ))}
                </div>
                <div className="demo-input">
                  <input value={demoInput} onChange={(event) => setDemoInput(event.target.value)} aria-label="Customer simulation" />
                  <TraceButton onClick={runDemo}>{running ? 'RUNNING…' : 'RUN HANDLE'}</TraceButton>
                </div>
              </div>
            </GlowPanel>

            <GlowPanel className="architecture-timeline-panel">
              <div className="timeline-head"><span className="eyebrow">ACTION TIMELINE</span><span className="timeline-counter">0{step + 1} / 05</span></div>
              <div className="timeline-rail"><div className="timeline-fill" style={{ height: `${((step + 1) / loop.length) * 100}%` }} /></div>
              <div className="architecture-steps">
                {loop.map(([number, title, description], index) => (
                  <button key={number} className={`architecture-step ${index === step ? 'is-current' : ''} ${index < step ? 'is-complete' : ''}`} onClick={() => setStep(index)} aria-label={`Set simulator to ${title}`}>
                    <span className="architecture-node"><span>{number}</span></span>
                    <span className="architecture-copy"><strong>{title}</strong><small>{description}</small></span>
                    <span className="architecture-state">{index < step ? 'DONE' : index === step ? 'LIVE' : 'WAIT'}</span>
                  </button>
                ))}
              </div>
              <div className="timeline-status"><span className="status-dot" /> HANDLE {loop[step][1].toLowerCase()} · synced with simulator</div>
            </GlowPanel>
          </div>
        </div>
      </section>

      <section id="pricing" className="section pricing-section immersive-pricing">
        <div className="container">
          <div className="eyebrow">PRICING</div>
          <div className="section-head split-head">
            <h2 className="section-title">SERIOUS AUTOMATION.<br /><span className="serif">SANE PRICING.</span></h2>
            <p className="lead-copy dark-text">Three clean operating tiers. The active card lifts, glows and stays visually anchored while you move through the section.</p>
          </div>
          <div ref={pricingRef} className="pricing-grid immersive-pricing-grid">
            {plans.map(([name, price, description], index) => (
              <article key={name} data-plan-index={index} className={`price-card immersive-price-card ${index === activePlan ? 'is-focus' : ''} ${index === 1 ? 'featured' : ''}`}>
                <div className="price-card-shine" />
                <div className="eyebrow">{name}</div>
                <div className="price">{price}<span>/mo</span></div>
                <p>{description}</p>
                <div className="price-list"><span>✓ Inbox</span><span>✓ Knowledge</span><span>✓ Workflow engine</span><span>✓ Human handoff</span></div>
                <TraceButton href="/signup">START FREE <span>↗</span></TraceButton>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function GlowPanel({ children, className }: { children: ReactNode; className: string }) {
  const glow = usePanelGlow();
  return <div ref={glow.ref} onPointerMove={glow.onPointerMove} className={`glow-panel ${className}`}>{children}</div>;
}

function TraceButton({ children, onClick, href }: { children: ReactNode; onClick?: () => void; href?: string }) {
  const className = 'btn dark magnetic trace-button';
  if (href) return <Link href={href} className={className} data-magnetic="110">{children}<i className="trace-orbit" aria-hidden="true" /></Link>;
  return <button type="button" className={className} onClick={onClick}>{children}<i className="trace-orbit" aria-hidden="true" /></button>;
}
