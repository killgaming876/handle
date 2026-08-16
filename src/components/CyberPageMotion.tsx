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
            scrub: 0.25,
          },
        });
      }

      gsap.utils.toArray<HTMLElement>('.cyber-section').forEach((section, index) => {
        const header = section.querySelector<HTMLElement>('.cyber-section-header');
        const columns = section.querySelectorAll<HTMLElement>('.cyber-section-grid > *, .cyber-connector-grid, .cyber-flow-card, .cyber-architecture-card, .cyber-pricing-card');

        gsap.fromTo(
          section,
          { opacity: 0.45 },
          {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 84%',
              end: 'center 46%',
              scrub: 0.7,
            },
          },
        );

        gsap.fromTo(
          section,
          { y: 30 },
          {
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.1,
            },
          },
        );

        if (header) {
          gsap.fromTo(
            header,
            { y: 70, opacity: 0, rotateX: 8 },
            {
              y: 0,
              opacity: 1,
              rotateX: 0,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 82%',
                end: 'top 52%',
                scrub: 0.8,
              },
            },
          );
        }

        if (columns.length) {
          gsap.fromTo(
            columns,
            { y: 80, opacity: 0, rotateY: (index % 2 ? 5 : -5) },
            {
              y: 0,
              opacity: 1,
              rotateY: 0,
              stagger: 0.08,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 76%',
                end: 'center 56%',
                scrub: 0.9,
              },
            },
          );
        }
      });

      gsap.utils.toArray<HTMLElement>('.cyber-flow-card').forEach((card, index) => {
        gsap.to(card, {
          y: index % 2 ? -34 : 24,
          rotateZ: index % 2 ? -1.5 : 1.5,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>('.cyber-architecture-card').forEach((card, index) => {
        gsap.to(card, {
          y: index % 3 === 0 ? -44 : index % 3 === 1 ? 18 : -16,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.25,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>('.cyber-pricing-card').forEach((card, index) => {
        gsap.to(card, {
          y: index === 1 ? -34 : 18,
          rotateY: index === 1 ? 0 : index === 0 ? -3 : 3,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.15,
          },
        });
      });

      const connectorGrid = root.querySelector<HTMLElement>('.cyber-connector-grid');
      if (connectorGrid) {
        gsap.to(connectorGrid, {
          y: -45,
          rotate: -1.5,
          ease: 'none',
          scrollTrigger: {
            trigger: connectorGrid,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.3,
          },
        });
      }

      gsap.utils.toArray<HTMLElement>('.cyber-kicker').forEach((kicker) => {
        gsap.to(kicker, {
          letterSpacing: '0.24em',
          ease: 'none',
          scrollTrigger: {
            trigger: kicker,
            start: 'top 82%',
            end: 'top 35%',
            scrub: 0.7,
          },
        });
      });

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, []);

  return null;
}
