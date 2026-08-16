'use client';

import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef, useState } from 'react';

gsap.registerPlugin(ScrollTrigger);

type SeekState = {
  targetTime: number;
  requested: boolean;
};

const VIDEO_SRC = '/videos/handle-tunnel.mp4';
const SCRUB_FPS = 30;
const TRACK_HEIGHT_VH = 300;

function drawVideoCover(
  context: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  destinationWidth: number,
  destinationHeight: number,
) {
  if (!video.videoWidth || !video.videoHeight || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
    return;
  }

  const videoAspect = video.videoWidth / video.videoHeight;
  const canvasAspect = destinationWidth / destinationHeight;

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

  context.clearRect(0, 0, destinationWidth, destinationHeight);
  context.drawImage(
    video,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    destinationWidth,
    destinationHeight,
  );
}

export function VideoScrollHero() {
  const trackRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const seekRef = useRef<SeekState>({ targetTime: 0, requested: false });
  const lastPaintedTimeRef = useRef(-1);
  const resizeFrameRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    const canvas = canvasRef.current;
    if (!track || !viewport || !canvas) return;

    const context = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true,
    });

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
    video.style.position = 'absolute';
    video.style.width = '1px';
    video.style.height = '1px';
    video.style.opacity = '0';
    video.style.pointerEvents = 'none';
    video.style.zIndex = '-1';
    document.body.appendChild(video);
    videoRef.current = video;

    let duration = 10;
    let frameCount = Math.round(duration * SCRUB_FPS);

    const resizeCanvas = () => {
      const width = Math.max(1, viewport.clientWidth);
      const height = Math.max(1, viewport.clientHeight);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        drawVideoCover(context, video, width, height);
      }
    };

    const scheduleResize = () => {
      if (resizeFrameRef.current !== null) return;
      resizeFrameRef.current = requestAnimationFrame(() => {
        resizeFrameRef.current = null;
        resizeCanvas();
      });
    };

    const paintCurrentFrame = () => {
      const width = viewport.clientWidth;
      const height = viewport.clientHeight;
      drawVideoCover(context, video, width, height);
      lastPaintedTimeRef.current = video.currentTime;
    };

    const requestLatestSeek = () => {
      const target = seekRef.current.targetTime;
      if (!Number.isFinite(target)) return;
      if (Math.abs(video.currentTime - target) < 1 / SCRUB_FPS / 2) {
        paintCurrentFrame();
        seekRef.current.requested = false;
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

    const onSeeked = () => {
      seekRef.current.requested = false;
      paintCurrentFrame();
      if (Math.abs(video.currentTime - seekRef.current.targetTime) > 1 / SCRUB_FPS) {
        requestLatestSeek();
      }
    };

    const onLoadedMetadata = () => {
      duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 10;
      frameCount = Math.max(2, Math.round(duration * SCRUB_FPS));
      video.currentTime = 0;
      resizeCanvas();
    };

    const onCanPlay = () => {
      resizeCanvas();
      requestLatestSeek();
      setReady(true);
      setError(false);
    };

    const onError = () => {
      setError(true);
      setReady(false);
    };

    resizeCanvas();
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('error', onError);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-video-copy]',
        { y: 34, opacity: 0, filter: 'blur(12px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power3.out',
          stagger: 0.1,
          delay: 0.2,
        },
      );

      gsap.fromTo(
        '[data-video-card]',
        { y: 42, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.08,
          delay: 0.45,
        },
      );

      gsap.to('[data-video-title]', {
        scale: 0.74,
        x: '-18vw',
        y: '-15vh',
        opacity: 0.28,
        transformOrigin: 'left top',
        ease: 'power2.out',
        scrollTrigger: {
          trigger: track,
          start: 'top top',
          end: '+=120%',
          scrub: 1,
        },
      });

      gsap.to('[data-video-copy-cluster]', {
        yPercent: -12,
        opacity: 0.65,
        ease: 'none',
        scrollTrigger: {
          trigger: track,
          start: 'top top',
          end: '+=180%',
          scrub: 1.15,
        },
      });

      gsap.to('[data-video-card="1"]', {
        yPercent: -12,
        z: 80,
        rotateY: -7,
        scrollTrigger: {
          trigger: track,
          start: 'top top',
          end: '+=100%',
          scrub: 1,
        },
      });

      gsap.to('[data-video-card="2"]', {
        yPercent: -24,
        z: 120,
        rotateY: 8,
        scrollTrigger: {
          trigger: track,
          start: '+=30%',
          end: '+=170%',
          scrub: 1,
        },
      });

      gsap.to('[data-video-card="3"]', {
        yPercent: -34,
        z: 150,
        rotateY: -5,
        scrollTrigger: {
          trigger: track,
          start: '+=80%',
          end: '+=240%',
          scrub: 1,
        },
      });

      gsap.to('[data-video-card="4"]', {
        yPercent: -46,
        z: 180,
        rotateY: 5,
        scrollTrigger: {
          trigger: track,
          start: '+=120%',
          end: '+=300%',
          scrub: 1,
        },
      });

      ScrollTrigger.create({
        trigger: track,
        start: 'top top',
        end: '+=300%',
        scrub: 1,
        pin: viewport,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const nextProgress = Math.min(1, Math.max(0, self.progress));
          setProgress(nextProgress);

          const maxFrame = frameCount - 1;
          const frame = Math.round(nextProgress * maxFrame);
          const targetTime = Math.min(duration, Math.max(0, frame / SCRUB_FPS));
          seekRef.current.targetTime = targetTime;
          requestLatestSeek();
        },
      });
    }, track);

    const onResize = () => scheduleResize();
    window.addEventListener('resize', onResize, { passive: true });

    const cleanup = () => {
      ctx.revert();
      video.pause();
      video.removeAttribute('src');
      video.load();
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onError);
      video.remove();
      videoRef.current = null;
      window.removeEventListener('resize', onResize);

      if (resizeFrameRef.current !== null) {
        cancelAnimationFrame(resizeFrameRef.current);
        resizeFrameRef.current = null;
      }

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };

    return cleanup;
  }, []);

  return (
    <section ref={trackRef} className="video-scroll-track" style={{ height: `${TRACK_HEIGHT_VH}vh` }}>
      <div ref={viewportRef} className="video-scroll-viewport">
        <canvas ref={canvasRef} className="video-scroll-canvas" aria-hidden="true" />
        <div className="video-scroll-vignette" />
        <div className="video-scroll-grid" />
        <div className="video-scroll-noise" />

        <div className="video-scroll-ui">
          <div className="video-scroll-copy-cluster" data-video-copy-cluster>
            <div className="video-scroll-eyebrow" data-video-copy>HANDLE / DIGITAL OPERATING SYSTEM</div>
            <h1 className="video-scroll-title" data-video-title data-video-copy>
              WE <span>HANDLE</span><br />IT.
            </h1>
            <p className="video-scroll-sub" data-video-copy>
              Connect conversations, knowledge, workflows and the repetitive work that keeps your business busy.
            </p>
            <div className="video-scroll-actions" data-video-copy>
              <Link className="video-scroll-button video-scroll-button-primary" href="/signup">START FREE <span>↗</span></Link>
              <a className="video-scroll-button video-scroll-button-secondary" href="#loop">SEE THE LOOP <span>↓</span></a>
            </div>
          </div>

          <div className="video-scroll-status" data-video-copy>
            <span className="video-scroll-status-dot" />
            <span>{ready ? 'VIDEO MATRIX ONLINE' : error ? 'VIDEO ASSET OFFLINE' : 'LOADING VIDEO MATRIX'}</span>
          </div>

          <div className="video-scroll-stack">
            <div className="video-scroll-card video-scroll-card-1" data-video-card="1">
              <span>01 / CUSTOMER</span>
              <strong>Conversations enter the operating layer.</strong>
              <small>WhatsApp · Instagram · Gmail</small>
            </div>
            <div className="video-scroll-card video-scroll-card-2" data-video-card="2">
              <span>02 / CONTEXT</span>
              <strong>Knowledge becomes usable memory.</strong>
              <small>Policies · catalogues · history</small>
            </div>
            <div className="video-scroll-card video-scroll-card-3" data-video-card="3">
              <span>03 / DECISION</span>
              <strong>Business rules determine the next move.</strong>
              <small>Intent · confidence · approvals</small>
            </div>
            <div className="video-scroll-card video-scroll-card-4" data-video-card="4">
              <span>04 / ACTION</span>
              <strong>Calendar, CRM and commerce move together.</strong>
              <small>Execute · confirm · audit</small>
            </div>
          </div>

          <div className="video-scroll-meta" data-video-copy>
            <span>SCROLL TO TRAVEL</span>
            <span>{Math.round(progress * 100).toString().padStart(2, '0')}%</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VideoScrollHero;
