'use client';

import { useEffect, useState } from 'react';
import { getManualQuality, setManualQuality, type QualityTier } from '@/lib/quality';

const tiers: QualityTier[] = ['ultra', 'high', 'medium', 'low', 'fallback'];
const descriptions: Record<QualityTier, string> = {
  ultra: 'Full cinematic particles, blur and WebGL treatment.',
  high: 'Rich motion with lighter postprocessing.',
  medium: 'Balanced effects for sustained scrolling performance.',
  low: 'Minimal effects for older or thermally constrained hardware.',
  fallback: 'CSS-first experience with WebGL and particles disabled.',
};

export function QualitySettings() {
  const [tier, setTier] = useState<QualityTier>('high');
  const [reduced, setReduced] = useState(false);
  const [detected, setDetected] = useState('detecting');

  useEffect(() => {
    setTier(getManualQuality() ?? ((document.documentElement.dataset.quality as QualityTier) || 'high'));
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    setDetected(document.documentElement.dataset.quality || 'detecting');
  }, []);

  function choose(next: QualityTier) {
    setManualQuality(next);
    setTier(next);
    document.documentElement.dataset.quality = next;
  }

  function reset() {
    setManualQuality(null);
    setDetected(document.documentElement.dataset.quality || 'high');
  }

  return <section className="panel" aria-labelledby="graphics-title">
    <div className="panel-head"><div><div className="panel-title" id="graphics-title">Graphics & motion</div><div className="muted" style={{fontSize:12}}>Adaptive by default. Override it when you need to.</div></div><span className="badge live">DETECTED: {detected.toUpperCase()}</span></div>
    <div className="page-grid">
      <div>
        <div className="muted" style={{fontSize:12,marginBottom:10}}>Quality tier</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(5,minmax(0,1fr))',gap:8}}>
          {tiers.map((value) => <button type="button" key={value} className={`btn ${tier === value ? 'dark' : ''}`} onClick={() => choose(value)} aria-pressed={tier === value}>{value.toUpperCase()}</button>)}
        </div>
        <p className="muted" style={{marginTop:14}}>{descriptions[tier]}</p>
        <button type="button" className="text-button" onClick={reset}>Return to automatic detection</button>
      </div>
      <div className="panel" style={{margin:0}}>
        <div className="panel-title">Reduced motion</div>
        <p className="muted" style={{marginTop:8}}>OS-level reduced motion is always respected and overrides graphics richness.</p>
        <span className="badge" style={{marginTop:12}}>{reduced ? 'ENABLED BY SYSTEM' : 'NOT REQUESTED'}</span>
      </div>
    </div>
  </section>;
}
