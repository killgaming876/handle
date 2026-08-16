'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line, MeshTransmissionMaterial, OrbitControls, RoundedBox } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const nodes = [
  { label: 'CUSTOMER', sub: 'WhatsApp / email', pos: [-1.8, 1.1, 0.2] as [number, number, number], color: '#ffffff' },
  { label: 'ACTION', sub: 'Calendar / CRM', pos: [1.7, 0.4, 0.8] as [number, number, number], color: '#d9d4c9' },
  { label: 'HEALTH', sub: '16 systems online', pos: [-0.9, -1.35, -0.4] as [number, number, number], color: '#b9ff72' },
];

function Node({ label, sub, pos, color, active }: (typeof nodes)[number] & { active: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * (active ? 0.14 : 0.04);
    ref.current.position.y = pos[1] + Math.sin(state.clock.elapsedTime * 1.25 + pos[0]) * 0.05;
  });
  return (
    <Float speed={active ? 2 : 1.1} rotationIntensity={active ? 0.32 : 0.12} floatIntensity={active ? 0.5 : 0.22}>
      <group ref={ref} position={pos}>
        <RoundedBox args={[2.25, 1.04, 0.18]} radius={0.08} smoothness={4}>
          <MeshTransmissionMaterial
            samples={3}
            resolution={256}
            transmission={0.92}
            thickness={0.22}
            roughness={0.2}
            chromaticAberration={0.04}
            anisotropy={0.3}
            ior={1.28}
            color={color}
          />
        </RoundedBox>
        <mesh position={[0, 0, 0.105]}>
          <planeGeometry args={[2.12, 0.9]} />
          <meshBasicMaterial color="#0f0f0d" transparent opacity={0.73} />
        </mesh>
      </group>
    </Float>
  );
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const array = new Float32Array(850 * 3);
    for (let i = 0; i < 850; i++) {
      const r = 5.5 + Math.random() * 7;
      const a = Math.random() * Math.PI * 2;
      array[i * 3] = Math.cos(a) * r;
      array[i * 3 + 1] = (Math.random() - 0.5) * 6;
      array[i * 3 + 2] = Math.sin(a) * r;
    }
    return array;
  }, []);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.035;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.18) * 0.035;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.018} color="#e9ffb8" transparent opacity={0.65} sizeAttenuation />
    </points>
  );
}

function Scene({ activeIndex }: { activeIndex: number }) {
  return (
    <>
      <color attach="background" args={['#0b0b09']} />
      <ambientLight intensity={1.1} />
      <directionalLight position={[2, 4, 5]} intensity={2.3} />
      <pointLight position={[-4, -3, 2]} intensity={22} distance={10} color="#efffae" />
      <pointLight position={[4, 2, -3]} intensity={18} distance={9} color="#ffffff" />
      <ParticleField />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, -1]}>
        <planeGeometry args={[22, 22, 24, 24]} />
        <meshStandardMaterial color="#11110e" wireframe transparent opacity={0.18} />
      </mesh>
      <mesh position={[0, 0, -1.5]}>
        <sphereGeometry args={[1.52, 48, 48]} />
        <meshPhysicalMaterial color="#f5f4ed" emissive="#8b9673" emissiveIntensity={0.18} metalness={0.72} roughness={0.18} clearcoat={1} />
      </mesh>
      <mesh position={[0, 0, -1.36]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.95, 0.025, 10, 120]} />
        <meshBasicMaterial color="#dfff91" transparent opacity={0.65} />
      </mesh>
      {nodes.map((node, i) => <Node key={node.label} {...node} active={activeIndex === i} />)}
      <Line points={[[0, 0.1, -1], nodes[0].pos, nodes[1].pos, [0, 0.1, -1], nodes[2].pos]} color="#efffc2" transparent opacity={0.45} lineWidth={1.1} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.18} maxPolarAngle={Math.PI * 0.68} minPolarAngle={Math.PI * 0.35} />
    </>
  );
}

export default function SystemMap3D({ activeIndex = 0 }: { activeIndex?: number }) {
  return (
    <div className="system-map-canvas" aria-hidden="true">
      <Canvas dpr={[1, 1.7]} camera={{ position: [0, 0, 8.2], fov: 43 }} gl={{ antialias: true, alpha: false }}>
        <Scene activeIndex={activeIndex} />
      </Canvas>
      <div className="system-map-overlay" />
    </div>
  );
}
