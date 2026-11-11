"use client";

import { AdaptiveDpr, Environment, Lightformer, Preload } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useRef } from "react";
import * as THREE from "three";

import { Core } from "./core";
import { EmberRing } from "./ember-ring";
import { Embers } from "./particles";

type SceneProps = {
  progress: React.RefObject<number>;
  frameloop?: "always" | "demand" | "never";
};

function Rig({ progress }: SceneProps) {
  const root = useRef<THREE.Group>(null);
  const camera = useThree((state) => state.camera);
  const pointer = useThree((state) => state.pointer);
  const size = useThree((state) => state.size);

  useFrame((_, delta) => {
    const group = root.current;
    if (!group) return;

    const p = THREE.MathUtils.clamp(progress.current ?? 0, 0, 1);
    const targetScale = size.width < 768 ? 0.62 : 1;

    group.scale.setScalar(THREE.MathUtils.damp(group.scale.x, targetScale, 4, delta));
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 8.5 - p * 5.8, 5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, p * 0.9, 4, delta);

    group.rotation.y += delta * 0.05;
    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, pointer.y * 0.12, 4, delta);
    group.rotation.z = THREE.MathUtils.damp(group.rotation.z, -pointer.x * 0.08, 4, delta);
  });

  return (
    <group ref={root}>
      <Core />
      <EmberRing count={900} radius={2.15} tube={0.24} speed={0.1} />
      <EmberRing
        count={600}
        radius={2.45}
        tube={0.2}
        speed={-0.07}
        tilt={[0.42, 0.18, 0]}
        offset={2}
      />
      <Embers count={900} />
    </group>
  );
}

export default function Scene({ progress, frameloop = "always" }: SceneProps) {
  return (
    <Canvas
      aria-hidden
      frameloop={frameloop}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 8.5], fov: 42, near: 0.1, far: 50 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1;
      }}
    >
      <color attach="background" args={["#070606"]} />
      <fog attach="fog" args={["#070606", 8, 26]} />

      <ambientLight intensity={0.22} />
      <pointLight color="#b3121a" intensity={120} distance={22} position={[-4.5, 1.5, 3]} />
      <pointLight color="#ff5b2e" intensity={90} distance={18} position={[4, -1.5, 2]} />
      <pointLight color="#e3b25c" intensity={50} distance={16} position={[0, 4, -2]} />

      <Environment resolution={256}>
        <Lightformer
          form="rect"
          intensity={1.4}
          color="#ff7a45"
          position={[0, 3, 4]}
          scale={[8, 2, 1]}
        />
        <Lightformer
          form="rect"
          intensity={0.8}
          color="#b3121a"
          position={[-4, 0, 3]}
          scale={[5, 3, 1]}
        />
        <Lightformer form="circle" intensity={1} color="#e3b25c" position={[3, -2, 2]} scale={3} />
      </Environment>

      <Rig progress={progress} />
      <Preload all />

      <EffectComposer multisampling={0}>
        <Bloom intensity={0.7} luminanceThreshold={0.35} luminanceSmoothing={0.5} mipmapBlur />
        <ChromaticAberration offset={[0.00035, 0.00035]} />
        <Noise opacity={0.03} blendFunction={BlendFunction.SOFT_LIGHT} />
        <Vignette offset={0.16} darkness={0.92} />
      </EffectComposer>

      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
