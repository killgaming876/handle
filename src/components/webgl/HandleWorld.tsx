'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdditiveBlending, MathUtils } from 'three';
import type { Points, ShaderMaterial } from 'three';
import { useMemo, useRef } from 'react';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { useMotionStore } from '@/stores/motionStore';

function ParticleField() {
  const points = useRef<Points>(null);
  const material = useRef<ShaderMaterial>(null);
  const quality = useMotionStore((state) => state.quality);
  const count = quality === 'ultra' ? 900 : quality === 'high' ? 500 : quality === 'medium' ? 220 : quality === 'low' ? 90 : 0;

  const geometry = useMemo(() => {
    const safeCount = Math.max(1, count);
    const positions = new Float32Array(safeCount * 3);
    const seeds = new Float32Array(safeCount);
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
    uPointer: { value: [0.5, 0.5] as [number, number] },
  }), []);

  useFrame((_, delta) => {
    if (!points.current || !material.current || count === 0) return;
    const { normalizedVelocity, scrollProgress, pointerX, pointerY } = useMotionStore.getState();
    material.current.uniforms.uTime.value += delta;
    material.current.uniforms.uVelocity.value = MathUtils.damp(material.current.uniforms.uVelocity.value, normalizedVelocity, 6, delta);
    material.current.uniforms.uProgress.value = MathUtils.damp(material.current.uniforms.uProgress.value, scrollProgress, 4, delta);
    material.current.uniforms.uPointer.value[0] = MathUtils.damp(material.current.uniforms.uPointer.value[0], pointerX, 5, delta);
    material.current.uniforms.uPointer.value[1] = MathUtils.damp(material.current.uniforms.uPointer.value[1], pointerY, 5, delta);
    points.current.rotation.z += delta * (0.012 + normalizedVelocity * 0.09);
    points.current.rotation.y += delta * 0.008;
  });

  if (count === 0) return null;

  return <points ref={points} frustumCulled={false}>
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
          vec3 p=position;
          float wave=sin(uTime*(0.22+aSeed*0.4)+aSeed*18.0);
          p.x+=wave*0.16*(0.5+uVelocity*1.8);
          p.y+=cos(uTime*0.17+aSeed*14.0)*0.1;
          p.z+=sin(uProgress*5.0+aSeed*12.0)*0.75;
          vec4 mv=modelViewMatrix*vec4(p,1.0);
          gl_PointSize=(1.8+aSeed*2.2)*(1.0+uVelocity*1.6)*(50.0/max(8.0,-mv.z));
          gl_Position=projectionMatrix*mv;
          vEnergy=0.35+0.65*abs(sin(aSeed*13.0+uTime*0.32));
        }
      `}
      fragmentShader={`
        varying float vEnergy;
        void main(){
          vec2 uv=gl_PointCoord-0.5;
          float d=length(uv);
          float alpha=smoothstep(0.5,0.05,d)*vEnergy;
          vec3 color=mix(vec3(0.78,0.9,0.3),vec3(0.2,0.7,0.52),gl_FragCoord.x/max(1.0,gl_FragCoord.x+gl_FragCoord.y));
          gl_FragColor=vec4(color,alpha*0.65);
        }
      `}
    />
  </points>;
}

function CameraRig() {
  const { camera } = useThree();
  useFrame((_, delta) => {
    const { pointerX, pointerY, normalizedVelocity } = useMotionStore.getState();
    camera.position.x = MathUtils.damp(camera.position.x, (pointerX - 0.5) * 0.55, 4, delta);
    camera.position.y = MathUtils.damp(camera.position.y, (0.5 - pointerY) * 0.35, 4, delta);
    camera.position.z = MathUtils.damp(camera.position.z, 6.8 - normalizedVelocity * 0.55, 4, delta);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HandleWorld() {
  const quality = useMotionStore((state) => state.quality);
  const dpr = quality === 'ultra' ? [1, 1.35] as [number, number] : quality === 'high' ? [1, 1.15] as [number, number] : quality === 'medium' ? [0.8, 1] as [number, number] : [0.65, 0.85] as [number, number];
  const post = quality === 'ultra';

  return <div className="handle-world" aria-hidden="true">
    <Canvas dpr={dpr} camera={{ position: [0, 0, 6.8], fov: 45 }} gl={{ antialias: quality === 'ultra', powerPreference: 'high-performance', alpha: true }}>
      <color attach="background" args={['#050505']} />
      <CameraRig />
      <ParticleField />
      {post && <EffectComposer multisampling={0}>
        <Bloom luminanceThreshold={0.5} intensity={0.28} mipmapBlur />
        <Noise opacity={0.018} />
        <Vignette eskil={false} offset={0.22} darkness={0.45} />
      </EffectComposer>}
    </Canvas>
  </div>;
}
