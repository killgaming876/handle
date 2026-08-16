'use client';

import Link from 'next/link';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

const cards = [
  { id: '01', label: 'CUSTOMER', title: 'Can you book me tomorrow?', meta: 'intent detected' },
  { id: '02', label: 'ACTION', title: 'Calendar → 4:30 PM', meta: 'business rule cleared' },
  { id: '03', label: 'SYSTEM HEALTH', title: 'Everything connected.', meta: '16 systems online' },
];

function AuroraScene({ pointer }: { pointer: { x: number; y: number } }) {
  const group = useRef<THREE.Group>(null);
  const stars = useRef<THREE.Points>(null);
  const shader = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const positions = useMemo(() => {
    const values = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i += 1) {
      const radius = 3.8 + Math.random() * 7;
      const angle = Math.random() * Math.PI * 2;
      values[i * 3] = Math.cos(angle) * radius;
      values[i * 3 + 1] = (Math.random() - 0.5) * 8;
      values[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return values;
  }, []);

  useFrame((state, delta) => {
    if (shader.current) shader.current.uniforms.uTime.value = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y += delta * 0.018;
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, pointer.y * 0.07, 3.5, delta);
      group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, pointer.x * -0.035, 3.5, delta);
    }
    if (stars.current) {
      stars.current.rotation.y += delta * 0.008;
      stars.current.position.x = THREE.MathUtils.damp(stars.current.position.x, pointer.x * viewport.width * 0.015, 2.2, delta);
      stars.current.position.y = THREE.MathUtils.damp(stars.current.position.y, -pointer.y * viewport.height * 0.012, 2.2, delta);
    }
  });

  return (
    <group ref={group}>
      <mesh position={[0, 0, -2.6]} scale={[5.4, 3.7, 1]}>
        <planeGeometry args={[2.2, 2.2]} />
        <shaderMaterial
          ref={shader}
          transparent
          depthWrite={false}
          uniforms={{ uTime: { value: 0 } }}
          vertexShader={`varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`}
          fragmentShader={`varying vec2 vUv; uniform float uTime; void main(){ vec2 p=vUv-.5; float d=length(p); float flow=sin((p.x+p.y)*7.0+uTime*.55)+sin((p.x*1.7-p.y*.8)*6.0-uTime*.35); float glow=smoothstep(.85,.05,d)*.22; vec3 a=vec3(.15,.22,.08); vec3 b=vec3(.03,.05,.03); vec3 c=vec3(.42,.6,.16); float mixv=(flow+2.0)/4.0; vec3 col=mix(b,a,mixv)+c*glow; gl_FragColor=vec4(col,.95);}`}
        />
      </mesh>
      <points ref={stars} position={[0, 0, -1.8]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#dfff91" size={0.018} transparent opacity={0.58} sizeAttenuation />
      </points>
      <Float speed={1.2} rotationIntensity={0.18} floatIntensity={0.25}>
        <mesh position={[0, 0.05, -1]}>
          <icosahedronGeometry args={[1.15, 5]} />
          <meshPhysicalMaterial color="#171a13" emissive="#87a94c" emissiveIntensity={0.24} metalness={0.65} roughness={0.2} clearcoat={1} />
        </mesh>
      </Float>
      <mesh position={[0, 0.05, -0.9]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.6, 0.018, 10, 160]} />
        <meshBasicMaterial color="#dfff91" transparent opacity={0.62} />
      </mesh>
      <Sparkles count={90} scale={[9, 6, 8]} size={1.4} speed={0.22} color="#efffc2" opacity={0.24} />
    </group>
  );
}

function CircuitLine({ progress }: { progress: number }) {
  const path = 'M 0 74 C 70 74, 70 152, 140 152 S 220 230, 300 230';
  return (
    <svg className="hero-circuit" viewBox="0 0 300 300" preserveAspectRatio="none" aria-hidden="true">
      <path d={path} fill="none" stroke="rgba(223,255,145,.13)" strokeWidth="1.2" />
      <path d={path} fill="none" stroke="#dfff91" strokeWidth="2.2" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - progress} style={{ filter: 'drop-shadow(0 0 7px rgba(223,255,145,.65))' }} />
      <circle cx={progress * 300} cy={74 + Math.sin(progress * Math.PI) * 78} r="3.5" fill="#dfff91" style={{ filter: 'drop-shadow(0 0 10px rgba(223,255,145,.95))' }} />
    </svg>
  );
}

export function HeroExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    const left = leftRef.current;
    const heading = headingRef.current;
    if (!section || !left || !heading) return;

    const letters = heading.querySelectorAll<HTMLElement>('[data-letter]');
    const copy = left.querySelectorAll<HTMLElement>('[data-hero-stagger]');
    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
    intro.fromTo(letters, { yPercent: 110, rotateX: -75, opacity: 0 }, { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.05, stagger: 0.045 });
    intro.fromTo(copy, { y: 28, opacity: 0, filter: 'blur(10px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.72, stagger: 0.12 }, '-=0.58');

    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=230%',
          scrub: 1.05,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => setPhase(self.progress),
        },
      })
        .to(letters, { x: -28, scale: 0.82, opacity: 0.35, transformOrigin: 'left center', stagger: 0.018 }, 0.16)
        .to(left, { yPercent: -7, opacity: 0.92 }, 0.18)
        .to('.hero-card-customer', { y: -28, scale: 1.04, opacity: 1, filter: 'blur(0px)' }, 0.06)
        .to('.hero-circuit-wrap', { opacity: 1 }, 0.24)
        .to('.hero-card-action', { z: 30, y: -8, scale: 1.03, opacity: 1, filter: 'blur(0px)' }, 0.42)
        .to('.hero-card-customer', { z: -60, y: -8, scale: 0.93, opacity: 0.58 }, 0.48)
        .to('.hero-card-health', { z: 30, y: -4, scale: 1.02, opacity: 1, filter: 'blur(0px)' }, 0.7)
        .to('.hero-divider-bar', { scaleY: 1.8, rotate: 3, boxShadow: '0 0 34px rgba(223,255,145,.7)' }, 0.74)
        .to('.hero-footer-glow', { opacity: 1, scale: 1.22 }, 0.78)
        .to('.hero-right-hud', { opacity: 1, y: -6 }, 0.62);
    }, section);

    return () => { intro.kill(); ctx.revert(); };
  }, []);

  const magnetic = (event: React.PointerEvent<HTMLAnchorElement>) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    gsap.to(target, { x: x * 0.18, y: y * 0.18, duration: 0.35, ease: 'power3.out', overwrite: true });
  };
  const magnetReset = (event: React.PointerEvent<HTMLAnchorElement>) => gsap.to(event.currentTarget, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, .55)' });

  return (
    <section ref={sectionRef} className="hero-pro-max" aria-label="HANDLE cinematic hero">
      <div className="hero-pro-left" ref={leftRef}>
        <div className="hero-pro-noise" />
        <div className="hero-pro-kicker" data-hero-stagger>BUSINESS OPERATING SYSTEM / 2026</div>
        <div className="hero-pro-left-inner">
          <h1 ref={headingRef} className="hero-pro-title" aria-label="WE HANDLE IT.">{'WE HANDLE IT.'.split('').map((char, index) => <span key={index} data-letter className={char === 'H' || char === 'A' ? 'hero-pro-serif' : ''}>{char === ' ' ? '\u00a0' : char}</span>)}</h1>
          <p className="hero-pro-sub" data-hero-stagger>Connect conversations, knowledge, workflows and the tools behind your business. HANDLE turns repetitive work into a system that keeps moving.</p>
          <div className="hero-pro-actions" data-hero-stagger>
            <Link href="/signup" className="hero-pro-btn primary" onPointerMove={magnetic} onPointerLeave={magnetReset}>START FREE <span>↗</span></Link>
            <Link href="#loop" className="hero-pro-btn secondary" onPointerMove={magnetic} onPointerLeave={magnetReset}>SEE THE LOOP <span>↓</span></Link>
          </div>
          <div className="hero-pro-proof" data-hero-stagger><span /> Demo-ready · human approval stays built in.</div>
        </div>
        <div className="hero-pro-footer" data-hero-stagger><span>HANDLE / 001</span><span>SCROLL TO OPERATE</span></div>
      </div>

      <div className="hero-pro-right" onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setPointer({ x: ((event.clientX - rect.left) / rect.width - 0.5) * 2, y: ((event.clientY - rect.top) / rect.height - 0.5) * 2 });
      }}>
        <Canvas dpr={[1, 1.65]} camera={{ position: [0, 0, 7], fov: 46 }} gl={{ antialias: true, alpha: false }}>
          <color attach="background" args={['#080907']} />
          <ambientLight intensity={0.55} />
          <pointLight position={[3, 2, 3]} intensity={12} color="#dfff91" />
          <pointLight position={[-3, -2, 1]} intensity={8} color="#ffffff" />
          <AuroraScene pointer={pointer} />
        </Canvas>
        <div className="hero-pro-vignette" />
        <div className="hero-right-hud"><span>HANDLE LOOP</span><span>LIVE SYSTEM MAP / 16 CONNECTIONS</span></div>
        <div className="hero-card hero-card-customer" style={{ transformOrigin: 'center center' }}><div className="hero-card-index">01</div><div><span>CUSTOMER</span><strong>{cards[0].title}</strong><small><i /> {cards[0].meta}</small></div></div>
        <div className="hero-circuit-wrap"><CircuitLine progress={phase < 0.4 ? 0 : Math.min(1, (phase - 0.4) * 2.7)} /></div>
        <div className="hero-card hero-card-action"><div className="hero-card-index">02</div><div><span>ACTION</span><strong>{cards[1].title}</strong><small>{cards[1].meta}</small></div></div>
        <div className="hero-card hero-card-health"><div className="hero-card-index">03</div><div><span>SYSTEM HEALTH</span><strong>{cards[2].title}</strong><small>{cards[2].meta}</small></div></div>
        <div className="hero-footer-glow" />
        <div className="hero-pro-right-footer"><span>INPUT</span><i /> <span>UNDERSTAND</span><i /> <span>ACT</span><i /> <span>CONFIRM</span></div>
      </div>
      <div className="hero-divider-bar" aria-hidden="true" />
    </section>
  );
}
