'use client';

import { useEffect } from 'react';
import { detectQuality, getManualQuality } from '@/lib/quality';

export default function AdaptiveQualityRuntime() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let active = true;
    let lastCheck = performance.now();
    let frameCount = 0;
    let slowFrames = 0;

    const apply = async () => {
      const tier = await detectQuality(reduced.matches);
      if (!active) return;
      document.documentElement.dataset.quality = tier;
      document.documentElement.style.setProperty('--quality-particles', String({ ultra: 220, high: 150, medium: 85, low: 36, fallback: 0 }[tier]));
      document.documentElement.style.setProperty('--quality-blur', String({ ultra: 1, high: 1, medium: 0.65, low: 0, fallback: 0 }[tier]));
    };

    apply();

    let last = performance.now();
    const sample = (now: number) => {
      const delta = now - last;
      last = now;
      frameCount += 1;
      if (delta > 34) slowFrames += 1;
      if (now - lastCheck > 4000) {
        if (!getManualQuality() && frameCount >= 60 && slowFrames / frameCount > 0.22) {
          const current = document.documentElement.dataset.quality;
          const downgrade = current === 'ultra' ? 'high' : current === 'high' ? 'medium' : current === 'medium' ? 'low' : current === 'low' ? 'fallback' : current;
          if (downgrade && downgrade !== current) {
            document.documentElement.dataset.quality = downgrade;
            document.documentElement.dataset.qualityDowngraded = 'true';
          }
        }
        frameCount = 0;
        slowFrames = 0;
        lastCheck = now;
      }
      requestAnimationFrame(sample);
    };
    const raf = requestAnimationFrame(sample);

    return () => {
      active = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
