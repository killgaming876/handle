'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdditiveBlending, Color, MathUtils } from 'three';
import { useMemo, useRef } from 'react';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { useMotionStore } from '@/stores/motionStore';

function ParticleField() {
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const { quality, normalizedVelocity, scrollProgress, pointerX, pointerY } = useMotionStore();
  const count = quality === 'ultra' ? 1800 : quality === 'high' ? 1200 : quality === 'medium' ? 650 : 300;

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      const radius = Math.pow(Math.random(), 0.65) * 18;
      const angle = Math.random() * Math.PI * 2;
      const z = (Math.random() - 0.5) * 18;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius * 0.64;
      positions[i * 3 + 2] = z;
      seeds[i] = Math.random();
    }
    return { positions, seeds };
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uVelocity: { value: 0 },
    uProgress: { value: 0 },
    uPointer: { value: [0.5, 0.5] },
  }), []);

  useFrame((state, delta) => {
    if (!points.current || !material.current) return;
    material.current.uniforms.uTime.value += delta;
    material.current.uniforms.uVelocity.value = MathUtils.damp(material.current.uniforms.uVelocity.value, normalizedVelocity, 5, delta);
    material.current.uniforms.uProgress.value = MathUtils.damp(material.current.uniforms.uProgress.value, scrollProgress, 4, delta);
    material.current.uniforms.uPointer.value[0] = MathUtils.damp(material.current.uniforms.uPointer.value[0], pointerX, 4, delta);
    material.current.uniforms.uPointer.value[1] = MathUtils.damp(material.current.uniforms.uPointer.value[1], pointerY, 4, delta);
    points.current.rotation.z += delta * (0.015 + normalizedVelocity * 0.11);
    points.current.rotation.y += delta * 0.01;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[geometry.positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[geometry.seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        vertexShader={`
          uniform float uTime;
          uniform float uVelocity;
          uniform float uProgress;
          attribute float aSeed;
          varying float vEnergy;
          void main(){
            vec3 p = position;
            float wave = sin(uTime * (0.25 + aSeed * 0.45) + aSeed * 18.0);
            p.x += wave * 0.18 * (0.5 + uVelocity * 2.0);
            p.y += cos(uTime * 0.18 + aSeed * 14.0) * 0.12;
            p.z += sin(uProgress * 5.2 + aSeed * 12.0) * 0.9;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = (2.0 + aSeed * 2.6) * (1.0 + uVelocity * 1.8) * (55.0 / max(8.0, -mv.z));
            gl_Position = projectionMatrix * mv;
            vEnergy = 0.35 + 0.65 * abs(sin(aSeed * 13.0 + uTime * 0.35));
          }
        `}
        fragmentShader={`
          varying float vEnergy;
          void main(){
            vec2 uv = gl_PointCoord - 0.5;
            float d = length(uv);
            float alpha = smoothstep(0.5, 0.05, d) * vEnergy;
            vec3 color = mix(vec3(0.66,0.33,1.0), vec3(0.04,0.72,0.86), gl_FragCoord.x / max(1.0, gl_FragCoord.x + gl_FragCoord.y));
            gl_FragColor = vec4(color, alpha * 0.8);
          }
        `}
      />
    </points>
  );
}

function CameraRig() {
  const { camera } = useThree();
  const { pointerX, pointerY, normalizedVelocity } = useMotionStore();
  useFrame((_, delta) => {
    camera.position.x = MathUtils.damp(camera.position.x, (pointerX - 0.5) * 0.7, 4, delta);
    camera.position.y = MathUtils.damp(camera.position.y, (0.5 - pointerY) * 0.45, 4, delta);
    camera.position.z = MathUtils.damp(camera.position.z, 6.8 - normalizedVelocity * 0.65, 4, delta);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HandleWorld() {
  return (
    <div className="handle-world" aria-hidden="true">
      <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 6.8], fov: 45 }} gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}>
        <color attach="background" args={['#05020b']} />
        <CameraRig />
        <ParticleField />
        <EffectComposer multisampling={0}>
          <Bloom luminanceThreshold={0.32} intensity={0.55} mipmapBlur />
          <Noise opacity={0.055} />
          <Vignette eskil={false} offset={0.22} darkness={0.6} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
