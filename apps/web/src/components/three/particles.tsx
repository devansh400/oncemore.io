"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute float aScale;
  attribute float aSpeed;
  attribute float aOffset;
  varying float vAlpha;

  void main() {
    vec3 pos = position;
    float drift = mod(uTime * aSpeed + aOffset, 1.0);
    pos.y = mix(-6.5, 7.5, drift);
    pos.x += sin(uTime * 0.35 + aOffset * 6.2831) * 0.6;
    pos.z += cos(uTime * 0.28 + aOffset * 6.2831) * 0.4;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float twinkle = 0.55 + 0.45 * sin(uTime * 2.2 + aOffset * 12.0);
    vAlpha = twinkle * smoothstep(0.0, 0.18, drift) * smoothstep(1.0, 0.82, drift);

    gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / -mvPosition.z);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float glow = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor * (0.6 + glow * 1.6), glow * vAlpha * uOpacity);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

type EmbersProps = {
  count?: number;
  color?: string;
  size?: number;
  opacity?: number;
};

export function Embers({
  count = 900,
  color = "#ff6a3d",
  size = 110,
  opacity = 0.55,
}: EmbersProps) {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: size },
      uPixelRatio: { value: 1.5 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
    }),
    [color, size, opacity],
  );

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const speeds = new Float32Array(count);
    const offsets = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      const radius = 2.1 + Math.random() * 2.8;
      const angle = Math.random() * Math.PI * 2;

      positions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 1.6;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = Math.sin(angle) * radius * 0.7 + (Math.random() - 0.5) * 1.2;

      scales[i] = 0.25 + Math.random() * 0.9;
      speeds[i] = 0.02 + Math.random() * 0.06;
      offsets[i] = Math.random();
    }

    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    buffer.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    buffer.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    buffer.setAttribute("aOffset", new THREE.BufferAttribute(offsets, 1));
    return buffer;
  }, [count]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uPixelRatio.value = Math.min(state.gl.getPixelRatio(), 1.75);
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
