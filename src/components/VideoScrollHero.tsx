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
      className={`cyber-fixed-btn ${primary ? 'cyber-fixed-btn-primary' : 'cyber-fixed-btn-secondary'}`}
      onPointerMove={(event) => {
        if (window.matchMedia('(pointer: coarse)').matches) return;
        const node = ref.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const x = event.clientX - (rect.left + rect.width / 2);
        const y = event.clientY - (rect.top + rect.height / 2);
        gsap.to(node, { x: x * 0.18, y: y * 0.18, duration: 0.28, ease: 'power3.out', overwrite: true });
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
    video.src = VIDEO_SRC;
    video.setAttribute('aria-hidden', 'true');
    video.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;';
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

    const requestLatestSeek = () => {
      if (!mounted) return;
      const target = seekRef.current.targetTime;
      if (!Number.isFinite(target)) return;
      if (Math.abs(video.currentTime - target) <= 1 / SCRUB_FPS / 2) {
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
      requestLatestSeek();
    };

    const onSeeked = () => {
      if (!mounted) return;
      seekRef.current.requested = false;
      paint();
      if (Math.abs(video.currentTime - seekRef.current.targetTime) > 1 / SCRUB_FPS) requestLatestSeek();
    };

    const onVideoError = () => {
      if (!mounted) return;
      setReady(false);
      setError(true);
    };

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('error', onVideoError);
    resizeCanvas();

    const ctx = gsap.context(() => {
      const master = gsap.timeline({
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
            requestLatestSeek();
          },
        },
      });

      master.fromTo('[data-fixed-copy]',
        { y: 34, opacity: 0, filter: 'blur(10px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.18, stagger: 0.035, ease: 'power3.out' },
        0,
      );

      master.fromTo('[data-fixed-title]',
        { scale: 1.06 },
        { scale: 0.88, x: '-5vw', y: '-8vh', opacity: 0.42, transformOrigin: 'left top', ease: 'power2.out', duration: 0.3 },
        0.18,
      );

      master.fromTo('[data-fixed-card="1"]',
        { y: 44, scale: 0.94, opacity: 0, filter: 'blur(14px)' },
        { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.18, ease: 'power3.out' },
        0.02,
      );
      master.to('[data-fixed-card="1"]',
        { y: -12, scale: 0.93, opacity: 0.34, filter: 'blur(2px)', duration: 0.13, ease: 'power2.inOut' },
        0.28,
      );

      master.fromTo('[data-fixed-card="2"]',
        { y: 44, scale: 0.94, opacity: 0, filter: 'blur(14px)' },
        { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.18, ease: 'power3.out' },
        0.36,
      );
      master.to('[data-fixed-card="2"]',
        { y: -12, scale: 0.93, opacity: 0.34, filter: 'blur(2px)', duration: 0.13, ease: 'power2.inOut' },
        0.66,
      );

      master.fromTo('[data-fixed-card="3"]',
        { y: 44, scale: 0.94, opacity: 0, filter: 'blur(14px)' },
        { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.18, ease: 'power3.out' },
        0.72,
      );

      master.fromTo('[data-fixed-login]',
        { opacity: 0, y: 18, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: 'power3.out' },
        0.42,
      );
    }, track);

    const onResize = () => scheduleResize();
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      mounted = false;
      ctx.revert();
      window.removeEventListener('resize', onResize);
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
    <section ref={trackRef} className="cyber-fixed-track">
      <div ref={viewportRef} className="cyber-fixed-viewport">
        <canvas ref={canvasRef} className="cyber-fixed-canvas" aria-hidden="true" />
        <div className="cyber-fixed-vignette" aria-hidden="true" />
        <div className="cyber-fixed-grid" aria-hidden="true" />

        <header className="cyber-fixed-nav">
          <Link href="/" className="cyber-fixed-brand">HANDLE<span>◼</span></Link>
          <nav className="cyber-fixed-links" aria-label="Primary navigation">
            <a href="#system">Product</a>
            <a href="#loop">How it works</a>
            <a href="#connections">Integrations</a>
            <a href="#pricing">Pricing</a>
          </nav>
          <div className="cyber-fixed-nav-actions">
            <button type="button" className="cyber-fixed-login" onClick={() => setLoginOpen(true)}>
              <span>LOG IN</span><span>ACCESS</span>
            </button>
            <MagneticLink href="/signup" primary>START FREE ↗</MagneticLink>
          </div>
        </header>

        <div className="cyber-fixed-bg-word" aria-hidden="true">WE HANDLE</div>

        <div className="cyber-fixed-content">
          <div className="cyber-fixed-left">
            <div className="cyber-fixed-eyebrow" data-fixed-copy>HANDLE / DIGITAL OPERATING SYSTEM</div>
            <h1 className="cyber-fixed-title" data-fixed-copy data-fixed-title>WE <span>HANDLE</span><br />IT.</h1>
            <p className="cyber-fixed-sub" data-fixed-copy>Connect conversations, knowledge, workflows and the repetitive work that keeps your business busy.</p>
            <div className="cyber-fixed-actions" data-fixed-copy>
              <MagneticLink href="/signup" primary>START FREE ↗</MagneticLink>
              <a className="cyber-fixed-btn cyber-fixed-btn-secondary" href="#loop"><span>SEE THE LOOP ↓</span></a>
            </div>
            <div className="cyber-fixed-status" data-fixed-copy><span /> {ready ? 'VIDEO MATRIX ONLINE' : error ? 'VIDEO ASSET OFFLINE' : 'LOADING VIDEO MATRIX'}</div>
          </div>

          <div className="cyber-fixed-right" aria-label="HANDLE operating pipeline">
            <article className="cyber-fixed-card" data-fixed-card="1">
              <div><span>01 / CUSTOMER</span><strong>Conversations enter the operating layer.</strong><small>WhatsApp · Instagram · Gmail</small></div><i />
            </article>
            <article className="cyber-fixed-card" data-fixed-card="2">
              <div><span>02 / KNOWLEDGE</span><strong>Business memory becomes instantly usable.</strong><small>Policies · products · customer history</small></div><i />
            </article>
            <article className="cyber-fixed-card" data-fixed-card="3">
              <div><span>03 / DECISION</span><strong>Rules turn intent into the right next move.</strong><small>Confidence · approval · execution</small></div><i />
            </article>
            <div className="cyber-fixed-pipeline" data-fixed-login><span /> <b /> <span /> <b /> <span /></div>
          </div>
        </div>

        <div className="cyber-fixed-readout"><span>{String(Math.round(progress * 100)).padStart(2, '0')}%</span> SCROLL MATRIX <i /></div>

        {loginOpen && (
          <div className="cyber-fixed-modal" role="dialog" aria-modal="true" aria-label="HANDLE login" onMouseDown={(event) => { if (event.target === event.currentTarget) setLoginOpen(false); }}>
            <div className="cyber-fixed-modal-card">
              <button type="button" className="cyber-fixed-modal-close" onClick={() => setLoginOpen(false)} aria-label="Close login">×</button>
              <span className="cyber-fixed-eyebrow">HANDLE / SECURE ACCESS</span>
              <h2>ENTER <em>THE SYSTEM.</em></h2>
              <p>Sign in to your operating workspace.</p>
              <button type="button" className="cyber-fixed-modal-btn">CONTINUE WITH GOOGLE</button>
              <div className="cyber-fixed-or"><span /> OR <span /></div>
              <input className="cyber-fixed-input" type="email" placeholder="you@business.com" aria-label="Email address" />
              <button type="button" className="cyber-fixed-modal-btn">CONTINUE ↗</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default VideoScrollHero;
