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
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.2,
            invalidateOnRefresh: true,
          },
        });
      }

      gsap.utils.toArray<HTMLElement>('.cyber-section').forEach((section, index) => {
        const header = section.querySelector<HTMLElement>('.cyber-section-header');
        const columns = section.querySelectorAll<HTMLElement>(
          '.cyber-section-grid > *, .cyber-connector-grid, .cyber-flow-card, .cyber-architecture-card, .cyber-pricing-card',
        );

        // Content is always rendered immediately. Scroll only enhances its presentation.
        gsap.set(section, { opacity: 1, y: 0, clearProps: 'filter' });
        gsap.fromTo(
          section,
          { y: 18 },
          {
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom+=18%',
              end: 'bottom top-=10%',
              scrub: 1.1,
              invalidateOnRefresh: true,
            },
          },
        );

        if (header) {
          gsap.set(header, { opacity: 1, y: 0, rotateX: 0 });
          gsap.fromTo(
            header,
            { y: 28, opacity: 0.92, rotateX: 2 },
            {
              y: 0,
              opacity: 1,
              rotateX: 0,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 96%',
                end: 'top 62%',
                scrub: 0.65,
                invalidateOnRefresh: true,
              },
            },
          );
        }

        if (columns.length) {
          gsap.set(columns, { opacity: 1, y: 0, rotateY: 0 });
          gsap.fromTo(
            columns,
            { y: 34, opacity: 0.96, rotateY: index % 2 ? 2 : -2 },
            {
              y: 0,
              opacity: 1,
              rotateY: 0,
              stagger: 0.05,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 94%',
                end: 'top 58%',
                scrub: 0.75,
                invalidateOnRefresh: true,
              },
            },
          );
        }
      });

      gsap.utils.toArray<HTMLElement>('.cyber-flow-card').forEach((card, index) => {
        gsap.to(card, {
          y: index % 2 ? -26 : 18,
          rotateZ: index % 2 ? -1 : 1,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top 108%',
            end: 'bottom -8%',
            scrub: 1.1,
            invalidateOnRefresh: true,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>('.cyber-architecture-card').forEach((card, index) => {
        gsap.to(card, {
          y: index % 3 === 0 ? -34 : index % 3 === 1 ? 14 : -12,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top 108%',
            end: 'bottom -8%',
            scrub: 1.15,
            invalidateOnRefresh: true,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>('.cyber-pricing-card').forEach((card, index) => {
        gsap.to(card, {
          y: index === 1 ? -26 : 14,
          rotateY: index === 1 ? 0 : index === 0 ? -2 : 2,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top 108%',
            end: 'bottom -8%',
            scrub: 1.1,
            invalidateOnRefresh: true,
          },
        });
      });

      const connectorGrid = root.querySelector<HTMLElement>('.cyber-connector-grid');
      if (connectorGrid) {
        gsap.to(connectorGrid, {
          y: -34,
          rotate: -1,
          ease: 'none',
          scrollTrigger: {
            trigger: connectorGrid,
            start: 'top 108%',
            end: 'bottom -8%',
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });
      }

      gsap.utils.toArray<HTMLElement>('.cyber-kicker').forEach((kicker) => {
        gsap.to(kicker, {
          letterSpacing: '0.23em',
          ease: 'none',
          scrollTrigger: {
            trigger: kicker,
            start: 'top 96%',
            end: 'top 40%',
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        });
      });

      // Refresh after layout is painted so triggers calculate from the final dimensions.
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, root);

    return () => ctx.revert();
  }, []);

  return null;
}
