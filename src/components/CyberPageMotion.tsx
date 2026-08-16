'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function CyberPageMotion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = document.querySelector<HTMLElement>('.cyber-page');
    if (!root) return;

    const ctx = gsap.context(() => {
      const progress = root.querySelector<HTMLElement>('.cyber-page-progress');
      if (progress) {
        gsap.set(progress, { transformOrigin: 'left center', scaleX: 0 });
        gsap.to(progress, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 0.2, invalidateOnRefresh: true },
        });
      }

      // Never hide page content with JS. All sections are visible immediately.
      gsap.utils.toArray<HTMLElement>('.cyber-section').forEach((section, index) => {
        const header = section.querySelector<HTMLElement>('.cyber-section-header');
        const columns = section.querySelectorAll<HTMLElement>('.cyber-section-grid > *, .cyber-connector-grid, .cyber-flow-card, .cyber-architecture-card, .cyber-pricing-card');

        gsap.set(section, { opacity: 1, visibility: 'visible' });
        gsap.to(section, {
          y: index % 2 === 0 ? -10 : 10,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1.25, invalidateOnRefresh: true },
        });

        if (header) {
          gsap.set(header, { opacity: 1, visibility: 'visible', y: 0, rotateX: 0 });
          gsap.to(header, {
            y: -18,
            rotateX: 1.5,
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1, invalidateOnRefresh: true },
          });
        }

        if (columns.length) {
          gsap.set(columns, { opacity: 1, visibility: 'visible', y: 0, rotateY: 0 });
          gsap.fromTo(
            columns,
            { y: 20, rotateY: index % 2 ? 1.2 : -1.2 },
            { y: 0, rotateY: 0, stagger: 0.03, ease: 'power2.out', scrollTrigger: { trigger: section, start: 'top bottom', end: 'top 62%', scrub: 0.7, invalidateOnRefresh: true } },
          );
        }
      });

      gsap.utils.toArray<HTMLElement>('.cyber-flow-card').forEach((card, index) => {
        gsap.to(card, { y: index % 2 ? -22 : 16, rotateZ: index % 2 ? -0.7 : 0.7, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1.1, invalidateOnRefresh: true } });
      });

      gsap.utils.toArray<HTMLElement>('.cyber-architecture-card').forEach((card, index) => {
        gsap.to(card, { y: index % 3 === 0 ? -28 : index % 3 === 1 ? 12 : -10, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1.15, invalidateOnRefresh: true } });
      });

      gsap.utils.toArray<HTMLElement>('.cyber-pricing-card').forEach((card, index) => {
        gsap.to(card, { y: index === 1 ? -22 : 12, rotateY: index === 1 ? 0 : index === 0 ? -1.5 : 1.5, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1.1, invalidateOnRefresh: true } });
      });

      const connectorGrid = root.querySelector<HTMLElement>('.cyber-connector-grid');
      if (connectorGrid) {
        gsap.to(connectorGrid, { y: -26, rotate: -0.7, ease: 'none', scrollTrigger: { trigger: connectorGrid, start: 'top bottom', end: 'bottom top', scrub: 1.2, invalidateOnRefresh: true } });
      }

      gsap.utils.toArray<HTMLElement>('.cyber-kicker').forEach((kicker) => {
        gsap.to(kicker, { letterSpacing: '0.22em', ease: 'none', scrollTrigger: { trigger: kicker, start: 'top bottom', end: 'top 38%', scrub: 0.65, invalidateOnRefresh: true } });
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, root);

    return () => ctx.revert();
  }, []);

  return null;
}
