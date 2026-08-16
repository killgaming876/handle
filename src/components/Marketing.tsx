'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ImmersiveModules } from '@/components/ImmersiveModules';
import { HeroExperience } from '@/components/HeroExperience';

const connectors = ['WhatsApp', 'Instagram', 'Messenger', 'Gmail', 'Outlook', 'Calendar', 'Calendly', 'Shopify', 'WooCommerce', 'Stripe', 'Razorpay', 'HubSpot', 'Salesforce', 'Zoho', 'Drive', 'Website'];
const loop = [
  ['01', 'CAPTURE', 'Every conversation lands in one operating layer.'],
  ['02', 'UNDERSTAND', 'HANDLE reads intent, context and your business rules.'],
  ['03', 'DECIDE', 'The system selects the correct next action.'],
  ['04', 'ACT', 'Calendar, CRM, commerce and messaging move together.'],
  ['05', 'CONFIRM', 'The customer gets a human-quality response.'],
];

export function Marketing() {
  const [activeNode, setActiveNode] = useState(0);
  const [connector, setConnector] = useState('WhatsApp');

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

      <HeroExperience />

      <section id="system" className="section section-dark system-section"><div className="container"><div className="section-head split-head" data-reveal><div><div className="eyebrow">THE BUSINESS OS</div><h2 className="section-title">TOO MANY<br/><span className="serif">SYSTEMS.</span></h2></div><p className="lead-copy">Your customer journey is already one thing. Your software just broke it into pieces. HANDLE restores the operating layer between the pieces.</p></div><div className="system-bento" data-reveal><div className="bento-large bento-dark"><div className="bento-top"><span>OPERATING LAYER</span><span>01 / 05</span></div><div className="bento-giant">CONVERSATION<br/><span>→</span> ACTION</div><div className="bento-wire"><div /><div /><div /></div></div><div className="bento-small bento-dark hover-lift"><span className="eyebrow">CONTEXT</span><strong>One memory.</strong><p>Policies, prices, products, FAQs and customer history live together.</p></div><div className="bento-small bento-acid hover-lift"><span className="eyebrow">CONTROL</span><strong>Human in the loop.</strong><p>Approve, pause or take over when a decision matters.</p></div></div></div></section>

      <section id="loop" className="section loop-section"><div className="container"><div className="eyebrow">THE HANDLE LOOP</div><div className="loop-title-row"><h2 className="section-title">FROM MESSAGE<br/><span className="serif">TO MOMENTUM.</span></h2><span className="loop-stamp">SCROLL / WATCH THE SYSTEM MOVE</span></div><div className="loop-track">{loop.map(([n, title, text], index) => <article key={n} className={'loop-card ' + (index === activeNode ? 'active' : '')} data-reveal data-depth={String(index % 2 ? 26 : -22)}><div className="loop-no">{n}</div><div><span className="eyebrow">{title}</span><h3>{text}</h3></div><div className="loop-orbit"><span /></div></article>)}</div></div></section>

      <ImmersiveModules />

      <section id="connections" className="section connections-section section-stone"><div className="container"><div className="eyebrow">THE CONNECTION LAYER</div><div className="section-head split-head"><h2 className="section-title">ONE HANDLE.<br/><span className="serif">MANY SYSTEMS.</span></h2><p className="lead-copy dark-text">Meet the stack without rebuilding your business around another silo.</p></div><div className="connection-constellation" data-reveal><div className="constellation-core"><span>HANDLE</span><small>CONNECTED OPERATING LAYER</small></div>{connectors.map((item, index) => <button key={item} className={'connection-node node-' + (index % 8) + (connector === item ? ' selected' : '')} onMouseEnter={() => { setConnector(item); setActiveNode(index % 3); }} onFocus={() => setConnector(item)} onClick={() => setConnector(item)}><strong>{item}</strong><small>{connector === item ? 'CONNECTED · LIVE' : 'READY'}</small></button>)}</div></div></section>

      <section className="section architecture-section section-dark"><div className="container"><div className="eyebrow">THE ARCHITECTURE</div><div className="architecture-grid">{['INBOX', 'KNOWLEDGE', 'DECISION ENGINE', 'WORKFLOWS', 'HUMAN HANDOFF', 'AUDIT'].map((item, index) => <div key={item} className="architecture-cell" data-depth={String(index % 2 ? -18 : 20)} data-reveal><span>0{index + 1}</span><strong>{item}</strong><p>{['Capture every thread.', 'Give the system memory.', 'Apply business rules.', 'Move work across tools.', 'Escalate with context.', 'Keep actions explainable.'][index]}</p></div>)}</div></div></section>

      <section className="final-cta section-dark"><div className="final-grid" /><div className="container final-inner" data-reveal><div className="eyebrow">THE LAST SCREEN</div><h2 className="display">WE <span className="serif">HANDLE</span> IT.</h2><p>Less chasing. Less copy-paste. More business actually moving.</p><div className="hero-actions"><Link href="/signup" className="btn acid magnetic" data-magnetic="130">START FREE <span>↗</span></Link><Link href="/login" className="btn light-outline magnetic" data-magnetic="95">LOG IN <span>→</span></Link></div></div></section>

      <footer className="footer"><div className="container"><div className="footer-main"><div><div className="display footer-logo">HANDLE<span className="wordmark-dot">◼</span></div><p>Business has better things to do.</p></div><div className="footer-links"><div><div className="eyebrow">PRODUCT</div><Link href="#loop">Loop</Link><Link href="#connections">Connections</Link><Link href="#pricing">Pricing</Link></div><div><div className="eyebrow">ACCOUNT</div><Link href="/login">Log in</Link><Link href="/signup">Start free</Link><a href="#system">Security</a></div></div></div><div className="footer-bottom"><span>© 2026 HANDLE</span><span>WORK IN MOTION.</span></div></div></footer>
    </main>
  );
}
