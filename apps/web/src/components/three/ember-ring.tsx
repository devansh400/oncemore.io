"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type EmberRingProps = {
  count?: number;
  radius?: number;
  tube?: number;
  speed?: number;
  tilt?: [number, number, number];
  offset?: number;
};

const palette = ["#ff5b2e", "#b3121a", "#e3b25c", "#ff8a4d"];

export function EmberRing({
  count = 900,
  radius = 2.15,
  tube = 0.24,
  speed = 0.1,
  tilt = [0, 0, 0],
  offset = 0,
}: EmberRingProps) {
  const mesh = useRef<THREE.InstancedMesh>(null);

  const shards = useMemo(() => {
    return Array.from({ length: count }, (_, index) => {
      const angle = Math.random() * Math.PI * 2;
      const cross = Math.random() * Math.PI * 2;
      const ringRadius = radius + (Math.random() - 0.5) * 0.45;
      const tubeRadius = tube * (0.25 + Math.random() * 0.9);

      const x = (ringRadius + tubeRadius * Math.cos(cross)) * Math.cos(angle);
      const y = (ringRadius + tubeRadius * Math.cos(cross)) * Math.sin(angle) * 0.82;
      const z = tubeRadius * Math.sin(cross) + (Math.random() - 0.5) * 0.2;

      return {
        position: [x, y, z] as [number, number, number],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [
          number,
          number,
          number,
        ],
        scale: 0.018 + Math.random() * 0.055,
        color: palette[(index + offset) % palette.length] ?? palette[0]!,
      };
    });
  }, [count, radius, tube, offset]);

  useEffect(() => {
    const instance = mesh.current;
    if (!instance) return;

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    shards.forEach((shard, index) => {
      dummy.position.set(...shard.position);
      dummy.rotation.set(...shard.rotation);
      dummy.scale.setScalar(shard.scale);
      dummy.updateMatrix();
      instance.setMatrixAt(index, dummy.matrix);
      instance.setColorAt(index, color.set(shard.color));
    });

    instance.instanceMatrix.needsUpdate = true;
    if (instance.instanceColor) instance.instanceColor.needsUpdate = true;
  }, [shards]);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.z += delta * speed;
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, count]}
      rotation={tilt}
      frustumCulled={false}
    >
      <tetrahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#120504"
        emissive="#ff5b2e"
        emissiveIntensity={1.5}
        metalness={0.85}
        roughness={0.38}
        toneMapped={false}
      />
    </instancedMesh>
  );
}
