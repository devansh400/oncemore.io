"use client";

import { MeshDistortMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export function Core() {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.09;
    group.current.rotation.x += delta * 0.02;
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.45, 32]} />
        <MeshDistortMaterial
          color="#0a0706"
          roughness={0.16}
          metalness={1}
          distort={0.34}
          speed={1.1}
          envMapIntensity={1.6}
        />
      </mesh>

      <mesh scale={1.055}>
        <icosahedronGeometry args={[1.45, 3]} />
        <meshBasicMaterial
          color="#ff5b2e"
          wireframe
          transparent
          opacity={0.12}
          toneMapped={false}
        />
      </mesh>

      <mesh scale={1.02}>
        <sphereGeometry args={[1.45, 48, 48]} />
        <meshBasicMaterial
          color="#b3121a"
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
