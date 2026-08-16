'use client';

import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef, useState } from 'react';

const VIDEO_SRC = '/videos/handle-tunnel.mp4';
const SCRUB_FPS = 30;
const TRACK_HEIGHT_VH = 300;

type SeekState = { targetTime: number; requested: boolean };

function drawCover(context: CanvasRenderingContext2D, video: HTMLVideoElement, width: number, height: number): void {
  if (!video.videoWidth || !video.videoHeight || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
  const videoAspect = video.videoWidth / video.videoHeight;
  const canvasAspect = width / height;
  let sourceWidth = video.videoWidth;
  let sourceHeight = video.videoHeight;
  let sourceX = 0;
  let sourceY = 0;

  if (videoAspect > canvasAspect) {
    sourceWidth = video.videoHeight * canvasAspect;
    sourceX = (video.videoWidth - sourceWidth) / 2;
  } else {
    sourceHeight = video.videoWidth / canvasAspect;
    sourceY = (video.videoHeight - sourceHeight) / 2;
  }

  context.clearRect(0, 0, width, height);
  context.drawImage(video, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);
}

function MagneticLink({ href, children, primary = false }: { href: string; children: React.ReactNode; primary?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  return (
    <Link
      ref={ref}
      href={href}
      className={`cyber-hero-btn ${primary ? 'cyber-hero-btn-primary' : 'cyber-hero-btn-secondary'}`}
      onPointerMove={(event) => {
        const node = ref.current;
        if (!node || window.matchMedia('(pointer: coarse)').matches) return;
        const rect = node.getBoundingClientRect();
        const x = event.clientX - (rect.left + rect.width / 2);
        const y = event.clientY - (rect.top + rect.height / 2);
        gsap.to(node, { x: x * 0.18, y: y * 0.18, duration: 0.3, ease: 'power3.out', overwrite: true });
        node.style.setProperty('--mx', `${event.clientX - rect.left}px`);
        node.style.setProperty('--my', `${event.clientY - rect.top}px`);
      }}
      onPointerLeave={() => gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, .55)', overwrite: true })}
    >
      <span>{children}</span>
    </Link>
  );
}

export function VideoScrollHero() {
  const trackRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const seekRef = useRef<SeekState>({ targetTime: 0, requested: false });
  const resizeRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    const canvas = canvasRef.current;
    if (!track || !viewport || !canvas) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!context) {
      setError(true);
      return;
    }

    const video = document.createElement('video');
    video.preload = 'auto';
    video.playsInline = true;
    video.muted = true;
    video.loop = false;
    video.crossOrigin = 'anonymous';
    video.setAttribute('aria-hidden', 'true');
    video.src = VIDEO_SRC;
    video.style.cssText = 'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;left:-100px;top:-100px;';
    document.body.appendChild(video);

    let duration = 10;
    let frameCount = 300;
    let mounted = true;

    const resizeCanvas = () => {
      const width = Math.max(1, viewport.clientWidth);
      const height = Math.max(1, viewport.clientHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawCover(context, video, width, height);
    };

    const scheduleResize = () => {
      if (resizeRef.current !== null) return;
      resizeRef.current = requestAnimationFrame(() => {
        resizeRef.current = null;
        resizeCanvas();
      });
    };

    const paint = () => drawCover(context, video, viewport.clientWidth, viewport.clientHeight);

    const seekLatest = () => {
      if (!mounted) return;
      const target = seekRef.current.targetTime;
      if (!Number.isFinite(target)) return;
      if (Math.abs(video.currentTime - target) < 1 / SCRUB_FPS / 2) {
        seekRef.current.requested = false;
        paint();
        return;
      }
      if (seekRef.current.requested) return;
      seekRef.current.requested = true;
      try {
        video.currentTime = target;
      } catch {
        seekRef.current.requested = false;
      }
    };

    const onLoadedMetadata = () => {
      duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 10;
      frameCount = Math.max(2, Math.round(duration * SCRUB_FPS));
      video.currentTime = 0;
      resizeCanvas();
    };

    const onCanPlay = () => {
      if (!mounted) return;
      resizeCanvas();
      setReady(true);
      setError(false);
      seekLatest();
    };

    const onSeeked = () => {
      seekRef.current.requested = false;
      paint();
      seekLatest();
    };

    const onVideoError = () => {
      if (!mounted) return;
      setError(true);
      setReady(false);
    };

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('error', onVideoError);
    resizeCanvas();

    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro.fromTo('[data-cyber-copy]', { y: 34, opacity: 0, filter: 'blur(12px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9, stagger: 0.09 });
      intro.fromTo('[data-cyber-card]', { y: 50, opacity: 0, scale: 0.94, rotateX: 12 }, { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 1, stagger: 0.1 }, '-=0.6');

      gsap.to('[data-cyber-title]', {
        scale: 0.68,
        x: '-13vw',
        y: '-13vh',
        opacity: 0.2,
        ease: 'power2.out',
        scrollTrigger: { trigger: track, start: 'top top', end: '+=125%', scrub: 1 },
      });

      gsap.to('[data-cyber-copy-cluster]', {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: { trigger: track, start: 'top top', end: '+=180%', scrub: 1.1 },
      });

      const matrix = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: 'top top',
          end: '+=300%',
          scrub: 1,
          pin: viewport,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = Math.min(1, Math.max(0, self.progress));
            setProgress(p);
            const frame = Math.round(p * (frameCount - 1));
            seekRef.current.targetTime = Math.min(duration, Math.max(0, frame / SCRUB_FPS));
            seekLatest();
          },
        },
      });

      matrix.fromTo('[data-cyber-card="1"]', { y: 80, z: -80, opacity: 0.1, filter: 'blur(14px)', scale: 0.93 }, { y: -6, z: 90, opacity: 1, filter: 'blur(0px)', scale: 1, rotateY: -5, duration: 1 / 3, ease: 'power2.out' }, 0);
      matrix.to('[data-cyber-card="1"]', { y: -44, z: -70, opacity: 0.34, filter: 'blur(2px)', scale: 0.96, duration: 1 / 3, ease: 'power2.inOut' }, 1 / 3);
      matrix.fromTo('[data-cyber-card="2"]', { y: 120, z: -120, opacity: 0.1, filter: 'blur(14px)', scale: 0.92 }, { y: 0, z: 110, opacity: 1, filter: 'blur(0px)', scale: 1, rotateY: 4, duration: 1 / 3, ease: 'power2.out' }, 1 / 3);
      matrix.to('[data-cyber-card="2"]', { y: -48, z: -80, opacity: 0.34, filter: 'blur(2px)', scale: 0.96, duration: 1 / 3, ease: 'power2.inOut' }, 2 / 3);
      matrix.fromTo('[data-cyber-card="3"]', { y: 130, z: -140, opacity: 0.1, filter: 'blur(14px)', scale: 0.92 }, { y: 0, z: 120, opacity: 1, filter: 'blur(0px)', scale: 1, rotateY: -4, duration: 1 / 3, ease: 'power2.out' }, 2 / 3);
    }, track);

    const handleResize = () => scheduleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      mounted = false;
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === track || trigger.vars.trigger === viewport) trigger.kill();
      });
      window.removeEventListener('resize', handleResize);
      if (resizeRef.current !== null) {
        cancelAnimationFrame(resizeRef.current);
        resizeRef.current = null;
      }
      video.pause();
      video.removeAttribute('src');
      video.load();
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onVideoError);
      video.remove();
    };
  }, []);

  return (
    <section ref={trackRef} className="cyber-hero-track">
      <div ref={viewportRef} className="cyber-hero-viewport">
        <canvas ref={canvasRef} className="cyber-hero-canvas" aria-hidden="true" />
        <div className="cyber-hero-vignette" />
        <div className="cyber-hero-grid" />
        <div className="cyber-hero-noise" />
        <div className="cyber-hero-ui">
          <div className="cyber-hero-copy-cluster" data-cyber-copy-cluster>
            <div className="cyber-hero-eyebrow" data-cyber-copy>HANDLE / DIGITAL OPERATING SYSTEM</div>
            <h1 className="cyber-hero-title" data-cyber-copy data-cyber-title>
              WE <span>HANDLE</span><br />IT.
            </h1>
            <p className="cyber-hero-sub" data-cyber-copy>Connect conversations, knowledge, workflows and the repetitive work that keeps your business busy.</p>
            <div className="cyber-hero-actions" data-cyber-copy>
              <MagneticLink href="/signup" primary>START FREE ↗</MagneticLink>
              <a className="cyber-hero-btn cyber-hero-btn-secondary" href="#loop">SEE THE LOOP ↓</a>
            </div>
            <div className="cyber-hero-status" data-cyber-copy><span /> {ready ? 'VIDEO MATRIX ONLINE' : error ? 'VIDEO ASSET OFFLINE' : 'LOADING VIDEO MATRIX'}</div>
          </div>

          <div className="cyber-card-stack">
            <article className="cyber-card" data-cyber-card="1"><span>01 / CUSTOMER</span><strong>Conversations enter the operating layer.</strong><small>WhatsApp · Instagram · Gmail</small><i /></article>
            <article className="cyber-card" data-cyber-card="2"><span>02 / KNOWLEDGE</span><strong>Business memory becomes instantly usable.</strong><small>Policies · products · customer history</small><i /></article>
            <article className="cyber-card" data-cyber-card="3"><span>03 / DECISION</span><strong>Rules turn intent into the right next move.</strong><small>Confidence · approval · execution</small><i /></article>
          </div>

          <div className="cyber-hero-progress">{String(Math.round(progress * 100)).padStart(2, '0')}% <span /> SCROLL MATRIX</div>
          <div className="cyber-hero-scanline" />
        </div>

        {loginOpen && (
          <div className="cyber-login-backdrop" role="dialog" aria-modal="true" aria-label="HANDLE login" onMouseDown={(event) => { if (event.target === event.currentTarget) setLoginOpen(false); }}>
            <div className="cyber-login-modal">
              <button className="cyber-login-close" type="button" onClick={() => setLoginOpen(false)} aria-label="Close login">×</button>
              <span className="cyber-hero-eyebrow">HANDLE / SECURE ACCESS</span>
              <h2>ENTER<br /><em>THE SYSTEM.</em></h2>
              <p>Sign in to your operating workspace.</p>
              <button className="cyber-login-primary" type="button">CONTINUE WITH GOOGLE</button>
              <div className="cyber-login-or"><span /> OR <span /></div>
              <input className="cyber-login-input" type="email" placeholder="you@business.com" aria-label="Email address" />
              <button className="cyber-login-primary" type="button">CONTINUE ↗</button>
            </div>
          </div>
        )}
      </div>

      <div className="cyber-hero-nav">
        <Link href="/" className="cyber-brand">HANDLE<span>◼</span></Link>
        <div className="cyber-nav-links">
          <a href="#system">Product</a>
          <a href="#loop">How it works</a>
          <a href="#connections">Integrations</a>
          <a href="#pricing">Pricing</a>
        </div>
        <div className="cyber-nav-actions">
          <button className="cyber-login-trigger" type="button" onClick={() => setLoginOpen(true)}>
            <span>LOG IN</span><span aria-hidden="true">ACCESS</span>
          </button>
          <MagneticLink href="/signup" primary>START FREE ↗</MagneticLink>
        </div>
      </div>
    </section>
  );
}

export default VideoScrollHero;
