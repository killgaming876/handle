'use client';

import Link from 'next/link';
import { useState } from 'react';
import SystemMap3D from '@/components/SystemMap3D';

const connectors = ['WhatsApp', 'Instagram', 'Messenger', 'Gmail', 'Outlook', 'Calendar', 'Calendly', 'Shopify', 'WooCommerce', 'Stripe', 'Razorpay', 'HubSpot', 'Salesforce', 'Zoho', 'Drive', 'Website'];
const loop = [
  ['01', 'CAPTURE', 'Every conversation lands in one operating layer.'],
  ['02', 'UNDERSTAND', 'HANDLE reads intent, context and your business rules.'],
  ['03', 'DECIDE', 'The system selects the correct next action.'],
  ['04', 'ACT', 'Calendar, CRM, commerce and messaging move together.'],
  ['05', 'CONFIRM', 'The customer gets a human-quality response.'],
];
const heroLetters = 'WE HANDLE IT.'.split('').map((char, index) => ({ char: char === ' ' ? '\u00a0' : char, index }));

export function Marketing() {
  const [activeNode, setActiveNode] = useState(0);
  const [demoInput, setDemoInput] = useState('Can you book me tomorrow at 4:30?');
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(4);
  const [connector, setConnector] = useState('WhatsApp');

  const runDemo = () => {
    if (running) return;
    setRunning(true);
    setStep(0);
    let current = 0;
    const timer = window.setInterval(() => {
      current += 1;
      setStep(current);
      if (current >= loop.length - 1) {
        window.clearInterval(timer);
        setRunning(false);
      }
    }, 620);
  };

  return (
    <main className="handle-site">
      <div className="reading-rail"><span /></div>
      <div className="aurora aurora-a" /><div className="aurora aurora-b" /><div className="noise-layer" />
      <nav className="nav ultra-nav">
        <Link href="/" className="wordmark magnetic" data-magnetic="85">HANDLE<span className="wordmark-dot">◼</span></Link>
        <div className="navlinks">
          <a href="#system" className="navlink">Product</a><a href="#loop" className="navlink">How it works</a><a href="#connections" className="navlink">Integrations</a><a href="#pricing" className="navlink">Pricing</a>
        </div>
        <div className="navactions"><Link href="/login" className="navlink">Log in</Link><Link href="/signup" className="btn dark magnetic" data-magnetic="125">Start free<span className="btn-arrow">↗</span></Link></div>
      </nav>

      <section className="hero ultra-hero">
        <div className="hero-grid-lines" aria-hidden="true" />
        <div className="container hero-layout">
          <div className="hero-copy" data-reveal>
            <div className="eyebrow reveal-line">BUSINESS OPERATING SYSTEM / 2026</div>
            <h1 className="display kinetic-hero" aria-label="WE HANDLE IT.">{heroLetters.map(({ char, index }) => <span key={index} className={'kinetic-letter ' + (char === 'H' || char === 'A' ? 'serif-letter' : '')}>{char}</span>)}</h1>
            <p className="hero-sub text-highlight">Connect conversations, knowledge, workflows and the tools behind your business. HANDLE turns repetitive work into a system that keeps moving.</p>
            <div className="hero-actions"><Link href="/signup" className="btn dark magnetic liquid-button" data-magnetic="130">START FREE <span>↗</span></Link><a href="#loop" className="btn ghost magnetic" data-magnetic="95">SEE THE LOOP <span>↓</span></a></div>
            <div className="hero-proof"><span className="proof-dot" /> Demo-ready. Human approval stays built in.</div>
            <div className="hero-rail-copy"><span>01</span><span>OPERATE</span><i /></div>
          </div>

          <div className="hero-stage" data-depth="-18" data-scroll-scale>
            <div className="stage-hud top"><span>HANDLE LOOP</span><span>LIVE SYSTEM MAP · 16 CONNECTIONS</span></div>
            <SystemMap3D activeIndex={activeNode} />
            <div className="stage-card stage-card-a"><span className="eyebrow">CUSTOMER</span><strong>“Can you book me tomorrow?”</strong><small><i /> intent detected</small></div>
            <div className="stage-card stage-card-b"><span className="eyebrow">ACTION</span><strong>Calendar → 4:30 PM</strong><small>business rule cleared</small></div>
            <div className="stage-card stage-card-c"><span className="eyebrow">SYSTEM HEALTH</span><strong>Everything connected.</strong><small>knowledge · inbox · CRM</small></div>
            <div className="stage-hud bottom"><span>INPUT</span><i /> <span>UNDERSTAND</span><i /> <span>ACT</span><i /> <span>CONFIRM</span></div>
          </div>
        </div>
        <div className="hero-marquee"><div className="marquee-track">HANDLE IT. · HANDLE IT. · HANDLE IT. · HANDLE IT. · HANDLE IT. · </div></div>
      </section>

      <section id="system" className="section section-dark system-section"><div className="container"><div className="section-head split-head" data-reveal><div><div className="eyebrow">THE BUSINESS OS</div><h2 className="section-title">TOO MANY<br/><span className="serif">SYSTEMS.</span></h2></div><p className="lead-copy">Your customer journey is already one thing. Your software just broke it into pieces. HANDLE restores the operating layer between the pieces.</p></div><div className="system-bento" data-reveal><div className="bento-large bento-dark"><div className="bento-top"><span>OPERATING LAYER</span><span>01 / 05</span></div><div className="bento-giant">CONVERSATION<br/><span>→</span> ACTION</div><div className="bento-wire"><div /><div /><div /></div></div><div className="bento-small bento-dark hover-lift"><span className="eyebrow">CONTEXT</span><strong>One memory.</strong><p>Policies, prices, products, FAQs and customer history live together.</p></div><div className="bento-small bento-acid hover-lift"><span className="eyebrow">CONTROL</span><strong>Human in the loop.</strong><p>Approve, pause or take over when a decision matters.</p></div></div></div></section>

      <section id="loop" className="section loop-section"><div className="container"><div className="eyebrow">THE HANDLE LOOP</div><div className="loop-title-row"><h2 className="section-title">FROM MESSAGE<br/><span className="serif">TO MOMENTUM.</span></h2><span className="loop-stamp">SCROLL / WATCH THE SYSTEM MOVE</span></div><div className="loop-track">{loop.map(([n, title, text], index) => <article key={n} className={'loop-card ' + (index === step ? 'active' : '')} data-reveal data-depth={String(index % 2 ? 26 : -22)}><div className="loop-no">{n}</div><div><span className="eyebrow">{title}</span><h3>{text}</h3></div><div className="loop-orbit"><span /></div></article>)}</div></div></section>

      <section className="section demo-section"><div className="container"><div className="eyebrow">THE LIVE DEMO</div><div className="demo-layout"><div className="demo-window" data-reveal><div className="window-bar"><span className="window-dots">● ● ●</span><strong>HANDLE / CUSTOMER SIMULATION</strong><span>DEMO</span></div><div className="demo-body"><div className="demo-thread"><div className="chat customer">{demoInput}</div><div className="chat handle">I’ll check the rules, availability and customer context.</div><div className="chat handle">Tomorrow at 4:30 PM is available.</div><div className="chat customer">Perfect. Book it.</div></div><div className="demo-input"><input value={demoInput} onChange={(e) => setDemoInput(e.target.value)} aria-label="Customer simulation"/><button className="btn dark" onClick={runDemo}>{running ? 'RUNNING…' : 'RUN HANDLE'}</button></div></div></div><div className="timeline-panel" data-reveal><div className="eyebrow">ACTION TIMELINE</div>{loop.map(([n, title, text], index) => <div className={'timeline-step ' + (index <= step ? 'active' : '')} key={n}><span>{n}</span><div><strong>{title}</strong><p>{text}</p></div><i /></div>)}</div></div></div></section>

      <section id="connections" className="section connections-section section-stone"><div className="container"><div className="eyebrow">THE CONNECTION LAYER</div><div className="section-head split-head"><h2 className="section-title">ONE HANDLE.<br/><span className="serif">MANY SYSTEMS.</span></h2><p className="lead-copy dark-text">Meet the stack without rebuilding your business around another silo.</p></div><div className="connection-constellation" data-reveal><div className="constellation-core"><span>HANDLE</span><small>CONNECTED OPERATING LAYER</small></div>{connectors.map((item, index) => <button key={item} className={'connection-node node-' + (index % 8) + (connector === item ? ' selected' : '')} onMouseEnter={() => { setConnector(item); setActiveNode(index % 3); }} onFocus={() => setConnector(item)} onClick={() => setConnector(item)}><strong>{item}</strong><small>{connector === item ? 'CONNECTED · LIVE' : 'READY'}</small></button>)}</div></div></section>

      <section className="section architecture-section section-dark"><div className="container"><div className="eyebrow">THE ARCHITECTURE</div><div className="architecture-grid">{['INBOX', 'KNOWLEDGE', 'DECISION ENGINE', 'WORKFLOWS', 'HUMAN HANDOFF', 'AUDIT'].map((item, index) => <div key={item} className="architecture-cell" data-depth={String(index % 2 ? -18 : 20)} data-reveal><span>0{index + 1}</span><strong>{item}</strong><p>{['Capture every thread.', 'Give the system memory.', 'Apply business rules.', 'Move work across tools.', 'Escalate with context.', 'Keep actions explainable.'][index]}</p></div>)}</div></div></section>

      <section id="pricing" className="section pricing-section"><div className="container"><div className="eyebrow">PRICING</div><div className="section-head split-head"><h2 className="section-title">SERIOUS AUTOMATION.<br/><span className="serif">SANE PRICING.</span></h2><p className="lead-copy dark-text">Start with a real operating layer, not a maze of enterprise setup screens.</p></div><div className="pricing-grid">{[['STARTER', '$9', 'For one business and the first 10 workflows'], ['GROWTH', '$29', 'For growing teams with deeper automation'], ['PRO', '$79', 'For advanced operations and scale']].map(([name, price, desc], index) => <article className={'price-card ' + (index === 1 ? 'featured' : '')} key={name} data-reveal><div className="eyebrow">{name}</div><div className="price">{price}<span>/mo</span></div><p>{desc}</p><div className="price-list"><span>✓ Inbox</span><span>✓ Knowledge</span><span>✓ Workflow engine</span><span>✓ Human handoff</span></div><Link href="/signup" className="btn dark magnetic" data-magnetic="100">START FREE <span>↗</span></Link></article>)}</div></div></section>

      <section className="final-cta section-dark"><div className="final-grid" /><div className="container final-inner" data-reveal><div className="eyebrow">THE LAST SCREEN</div><h2 className="display">WE <span className="serif">HANDLE</span> IT.</h2><p>Less chasing. Less copy-paste. More business actually moving.</p><div className="hero-actions"><Link href="/signup" className="btn acid magnetic" data-magnetic="130">START FREE <span>↗</span></Link><Link href="/login" className="btn light-outline magnetic" data-magnetic="95">LOG IN <span>→</span></Link></div></div></section>

      <footer className="footer"><div className="container"><div className="footer-main"><div><div className="display footer-logo">HANDLE<span className="wordmark-dot">◼</span></div><p>Business has better things to do.</p></div><div className="footer-links"><div><div className="eyebrow">PRODUCT</div><Link href="#loop">Loop</Link><Link href="#connections">Connections</Link><Link href="#pricing">Pricing</Link></div><div><div className="eyebrow">ACCOUNT</div><Link href="/login">Log in</Link><Link href="/signup">Start free</Link><a href="#system">Security</a></div></div></div><div className="footer-bottom"><span>© 2026 HANDLE</span><span>WORK IN MOTION.</span></div></div></footer>
    </main>
  );
}
