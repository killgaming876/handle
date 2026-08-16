'use client';

import Link from 'next/link';
import { VideoScrollHero } from '@/components/VideoScrollHero';
import CyberPageMotion from '@/components/CyberPageMotion';
import CyberParticles from '@/components/CyberParticles';

const connectors = ['WhatsApp', 'Instagram', 'Messenger', 'Gmail', 'Outlook', 'Calendar', 'Calendly', 'Shopify', 'WooCommerce', 'Stripe', 'Razorpay', 'HubSpot'];
const architecture = [
  ['01', 'CAPTURE', 'Every conversation lands in one operating layer.'],
  ['02', 'UNDERSTAND', 'Context and knowledge become immediately usable.'],
  ['03', 'DECIDE', 'Rules choose the next business-safe action.'],
  ['04', 'ACT', 'Connected systems execute the repetitive work.'],
  ['05', 'CONFIRM', 'Customers receive clear, human-quality outcomes.'],
];

export function Marketing() {
  return (
    <main className="cyber-page">
      <CyberParticles />
      <div className="cyber-page-progress" aria-hidden="true" />
      <CyberPageMotion />
      <VideoScrollHero />

      <section id="system" className="cyber-section">
        <div className="cyber-section-grid">
          <div>
            <span className="cyber-kicker">01 / OPERATING LAYER</span>
            <h2>ONE LAYER.<br /><em>LESS FRICTION.</em></h2>
          </div>
          <div className="cyber-copy-block">
            <p>HANDLE sits between the conversations customers start and the tools your business uses to finish the job.</p>
            <div className="cyber-stat-grid">
              <article><b>CONTEXT</b><span>One memory</span></article>
              <article><b>CONTROL</b><span>Human approval</span></article>
              <article><b>EXECUTION</b><span>Connected tools</span></article>
              <article><b>AUDIT</b><span>Clear decisions</span></article>
            </div>
          </div>
        </div>
      </section>

      <section id="loop" className="cyber-section cyber-section-alt">
        <div className="cyber-section-header">
          <span className="cyber-kicker">02 / HOW IT WORKS</span>
          <h2>CONVERSATIONS → <em>WORKFLOWS.</em></h2>
        </div>
        <div className="cyber-flow-grid">
          {architecture.map(([number, title, description]) => (
            <article key={number} className="cyber-flow-card">
              <span>{number}</span>
              <b>{title}</b>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="connections" className="cyber-section">
        <div className="cyber-section-grid">
          <div>
            <span className="cyber-kicker">03 / CONNECTION LAYER</span>
            <h2>ONE HANDLE.<br /><em>MANY SYSTEMS.</em></h2>
            <p className="cyber-muted">Connect the stack you already use instead of rebuilding your business around another silo.</p>
          </div>
          <div className="cyber-connector-grid">
            {connectors.map((tool) => <span key={tool}>{tool}</span>)}
          </div>
        </div>
      </section>

      <section className="cyber-section cyber-section-alt">
        <div className="cyber-section-header">
          <span className="cyber-kicker">04 / ARCHITECTURE</span>
          <h2>ONE SYSTEM.<br /><em>DEEPER CONTROL.</em></h2>
        </div>
        <div className="cyber-architecture-grid">
          {architecture.map(([number, title, description]) => (
            <article key={number} className="cyber-architecture-card">
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <i />
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className="cyber-section cyber-pricing">
        <div className="cyber-section-header">
          <span className="cyber-kicker">05 / PRICING</span>
          <h2>SERIOUS AUTOMATION.<br /><em>SANE PRICING.</em></h2>
        </div>
        <div className="cyber-pricing-grid">
          {[
            ['STARTER', '$9', 'Essential automation for one business.'],
            ['GROWTH', '$29', 'Deeper workflows for growing teams.'],
            ['PRO', '$79', 'Advanced operating control at scale.'],
          ].map(([name, price, description], index) => (
            <article key={name} className={`cyber-pricing-card ${index === 1 ? 'is-popular' : ''}`}>
              <span className="cyber-kicker">{name}</span>
              <strong>{price}<small>/mo</small></strong>
              <p>{description}</p>
              <div><span>✓ Inbox</span><span>✓ Knowledge</span><span>✓ Workflows</span><span>✓ Handoff</span></div>
              <Link href="/signup" className="cyber-pricing-button">START FREE ↗</Link>
            </article>
          ))}
        </div>
      </section>

      <footer className="cyber-footer">
        <span>HANDLE © 2026</span>
        <strong>WORK IN MOTION.</strong>
        <Link href="/login">LOG IN →</Link>
      </footer>
    </main>
  );
}
