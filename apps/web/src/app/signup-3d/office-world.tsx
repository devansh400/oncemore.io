"use client";

import { Component, useRef, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { MathUtils, type Group } from "three";
import type { OfficeStep } from "./signup-experience";

type Vec = [number, number, number];
const angle = Math.atan2(5.2, 18);
// Project scene anchors onto the same 1200 × 800 stage as the original controls.
function point(x: number, y: number, z = 0): Vec {
  return [(x - 600) / 60, ((400 - y) / 60 + Math.sin(angle) * z) / Math.cos(angle), z];
}
function At({ x, y, z = 0, children }: { x: number; y: number; z?: number; children: ReactNode }) {
  return <group position={point(x, y, z)}>{children}</group>;
}
function Block({
  size,
  color,
  position = [0, 0, 0],
  radius = 0.06,
  rotation = [0, 0, 0],
}: {
  size: Vec;
  color: string;
  position?: Vec;
  radius?: number;
  rotation?: Vec;
}) {
  return (
    <RoundedBox
      args={size}
      position={position}
      rotation={rotation}
      radius={radius}
      smoothness={3}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color={color} roughness={0.65} />
    </RoundedBox>
  );
}
function Orb({
  color,
  position = [0, 0, 0],
  scale = [1, 1, 1],
}: {
  color: string;
  position?: Vec;
  scale?: Vec;
}) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <sphereGeometry args={[1, 24, 16]} />
      <meshStandardMaterial color={color} roughness={0.6} />
    </mesh>
  );
}
function Cylinder({
  color,
  radius,
  height,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  metalness = 0,
}: {
  color: string;
  radius: number;
  height: number;
  position?: Vec;
  rotation?: Vec;
  metalness?: number;
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius * 0.95, height, 24]} />
      <meshStandardMaterial color={color} roughness={0.4} metalness={metalness} />
    </mesh>
  );
}
function Tree({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <At x={x} y={y} z={-0.5}>
      <group scale={scale}>
        <Cylinder color="#86643d" radius={0.1} height={1.4} position={[0, -0.2, 0]} />
        <Orb color="#00a86b" position={[0, 0.7, 0]} scale={[0.65, 0.85, 0.58]} />
        <Orb color="#55c928" position={[-0.24, 1.08, 0.07]} scale={[0.43, 0.63, 0.45]} />
        <Orb color="#80d936" position={[-0.2, 1.4, 0.05]} scale={[0.25, 0.39, 0.28]} />
      </group>
    </At>
  );
}
function Clouds({ reduced }: { reduced: boolean }) {
  const group = useRef<Group>(null);
  const time = useRef(0);
  useFrame((_, delta) => {
    if (!reduced && group.current) {
      time.current += Math.min(delta, 0.05);
      group.current.position.x = Math.sin(time.current * 0.14) * 0.22;
    }
  });
  return (
    <group ref={group}>
      {[
        [147, 120, 1],
        [1030, 130, 1.25],
        [300, 215, 0.45],
      ].map(([x, y, s], i) => (
        <At key={i} x={x} y={y} z={-4}>
          <group scale={s}>
            <Orb color="#ffffff" position={[-0.65, 0, 0]} scale={[0.65, 0.25, 0.32]} />
            <Orb color="#ffffff" position={[0, 0.12, 0]} scale={[0.7, 0.4, 0.38]} />
            <Orb color="#ffffff" position={[0.65, -0.03, 0]} scale={[0.65, 0.27, 0.31]} />
          </group>
        </At>
      ))}
    </group>
  );
}
function Pip({ step, reduced }: { step: OfficeStep; reduced: boolean }) {
  const body = useRef<Group>(null),
    head = useRef<Group>(null),
    eyes = useRef<Group>(null),
    left = useRef<Group>(null),
    right = useRef<Group>(null);
  const time = useRef(0);
  const sleeping = step === "welcome",
    calling = step === "calling",
    happy = step === "success" || step === "profile";
  useFrame((state, delta) => {
    time.current += Math.min(delta, 0.05);
    const t = time.current,
      ease = reduced ? 1 : 1 - Math.exp(-Math.min(delta, 0.05) * 8);
    if (body.current) {
      body.current.position.y = reduced
        ? 0
        : happy
          ? Math.abs(Math.sin(t * 5)) * 0.12
          : Math.sin(t * 2) * 0.015;
      body.current.rotation.z = reduced
        ? 0
        : Math.sin(t * (happy ? 5 : 1.5)) * (happy ? 0.035 : 0.012);
    }
    if (head.current) {
      head.current.rotation.x = MathUtils.lerp(
        head.current.rotation.x,
        sleeping ? 0.22 : -0.08,
        ease,
      );
      head.current.rotation.z = MathUtils.lerp(
        head.current.rotation.z,
        sleeping ? -0.14 : calling ? -0.1 : 0,
        ease,
      );
      head.current.rotation.y = MathUtils.lerp(
        head.current.rotation.y,
        sleeping || reduced ? 0 : state.pointer.x * 0.1,
        ease,
      );
    }
    if (left.current)
      left.current.rotation.z = MathUtils.lerp(
        left.current.rotation.z,
        happy ? -2.3 : calling ? -2.7 : -0.3,
        ease,
      );
    if (right.current)
      right.current.rotation.z = MathUtils.lerp(right.current.rotation.z, happy ? 2.3 : 0.3, ease);
    if (eyes.current) eyes.current.scale.y = sleeping ? 0.12 : !reduced && t % 5 > 4.83 ? 0.08 : 1;
  });
  return (
    <At x={600} y={384} z={0.2}>
      <group ref={body}>
        <Block position={[0, -0.07, -0.3]} size={[1.32, 1.5, 0.3]} color="#00896f" radius={0.15} />
        <Orb position={[0, -0.05, 0]} scale={[0.5, 0.6, 0.35]} color="#00c8ae" />
        <Block
          position={[0, 0.25, 0.32]}
          size={[0.25, 0.2, 0.07]}
          color="#ffffff"
          rotation={[0, 0, Math.PI / 4]}
          radius={0.02}
        />
        <Block position={[0, -0.01, 0.35]} size={[0.1, 0.35, 0.04]} color="#0878e8" radius={0.02} />
        <group ref={left} position={[-0.43, 0.27, 0]}>
          <Orb position={[0, -0.23, 0]} scale={[0.14, 0.33, 0.15]} color="#00c8ae" />
          <Orb position={[0, -0.48, 0.02]} scale={[0.145, 0.15, 0.145]} color="#ffc857" />
          {calling && (
            <group position={[0, -0.51, 0.15]}>
              <Block size={[0.13, 0.55, 0.14]} color="#153c70" />
              <Orb position={[0, 0.24, 0.04]} scale={[0.13, 0.12, 0.14]} color="#153c70" />
              <Orb position={[0, -0.24, 0.04]} scale={[0.13, 0.12, 0.14]} color="#153c70" />
            </group>
          )}
        </group>
        <group ref={right} position={[0.43, 0.27, 0]}>
          <Orb position={[0, -0.23, 0]} scale={[0.14, 0.33, 0.15]} color="#00c8ae" />
          <Orb position={[0, -0.48, 0.02]} scale={[0.145, 0.15, 0.145]} color="#ffc857" />
        </group>
        <group ref={head} position={[0, 0.87, 0]}>
          <Orb scale={[0.55, 0.59, 0.46]} color="#ffcc68" />
          <Orb position={[-0.53, -0.03, 0]} scale={[0.12, 0.17, 0.12]} color="#f7b95b" />
          <Orb position={[0.53, -0.03, 0]} scale={[0.12, 0.17, 0.12]} color="#f7b95b" />
          <Orb position={[-0.26, 0.43, -0.035]} scale={[0.33, 0.25, 0.39]} color="#153c70" />
          <Orb position={[0.04, 0.5, -0.05]} scale={[0.28, 0.23, 0.38]} color="#153c70" />
          <Orb position={[0.3, 0.42, -0.08]} scale={[0.25, 0.23, 0.33]} color="#153c70" />
          <group ref={eyes} position={[0, 0.02, 0.44]}>
            <Orb position={[-0.2, 0, 0]} scale={[0.045, 0.065, 0.025]} color="#071a38" />
            <Orb position={[0.2, 0, 0]} scale={[0.045, 0.065, 0.025]} color="#071a38" />
            <Orb position={[-0.21, 0.02, 0.022]} scale={[0.012, 0.018, 0.01]} color="white" />
            <Orb position={[0.19, 0.02, 0.022]} scale={[0.012, 0.018, 0.01]} color="white" />
          </group>
          <Orb position={[0, -0.08, 0.46]} scale={[0.07, 0.08, 0.07]} color="#f3b955" />
          <Orb position={[-0.32, -0.13, 0.35]} scale={[0.09, 0.045, 0.03]} color="#f1a363" />
          <Orb position={[0.32, -0.13, 0.35]} scale={[0.09, 0.045, 0.03]} color="#f1a363" />
          <mesh position={[0, -0.21, 0.43]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[happy ? 0.11 : 0.065, 0.018, 8, 24, Math.PI]} />
            <meshStandardMaterial color="#a76b2a" />
          </mesh>
          {happy && (
            <group position={[0, 0.68, 0]}>
              <Cylinder radius={0.38} height={0.16} color="#ffc857" />
              {[-0.25, 0, 0.25].map((x) => (
                <mesh key={x} position={[x, 0.17, 0]}>
                  <coneGeometry args={[0.115, 0.27, 12]} />
                  <meshStandardMaterial color="#ffc857" metalness={0.3} roughness={0.3} />
                </mesh>
              ))}
              <Orb position={[0, 0.03, 0.38]} scale={[0.045, 0.045, 0.02]} color="#00bdeb" />
            </group>
          )}
        </group>
      </group>
    </At>
  );
}
function Fern() {
  return (
    <At x={862} y={536} z={1.1}>
      <mesh castShadow>
        <cylinderGeometry args={[0.28, 0.2, 0.55, 32]} />
        <meshStandardMaterial color="#ffc857" roughness={0.5} />
      </mesh>
      <Cylinder position={[0, 0.65, 0]} radius={0.025} height={1.1} color="#008c56" />
      {Array.from({ length: 8 }, (_, i) => (
        <group key={i} position={[0, 0.3 + i * 0.1, 0]} rotation={[0, i * 2.4, 0.45]}>
          <Orb
            position={[0.14, 0.16, 0]}
            scale={[0.13, 0.31, 0.045]}
            color={i % 2 ? "#55c928" : "#00a86b"}
          />
        </group>
      ))}
    </At>
  );
}
function Telephone({ step, reduced }: { step: OfficeStep; reduced: boolean }) {
  const ref = useRef<Group>(null),
    time = useRef(0);
  useFrame((_, delta) => {
    time.current += Math.min(delta, 0.05);
    if (ref.current)
      ref.current.rotation.z =
        !reduced && step === "calling" ? Math.sin(time.current * 30) * 0.035 : 0;
  });
  return (
    <At x={803} y={538} z={1.4}>
      <group ref={ref}>
        <Block size={[0.85, 0.25, 0.64]} color="#00a86b" radius={0.11} />
        <mesh position={[0, 0.145, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.16, 0.03, 10, 24]} />
          <meshStandardMaterial color="#d5f3df" />
        </mesh>
        {step !== "calling" && (
          <group position={[0, 0.23, -0.13]}>
            <Block size={[0.92, 0.12, 0.15]} color="#153c70" radius={0.06} />
            <Orb position={[-0.35, 0, 0.04]} scale={[0.17, 0.1, 0.17]} color="#153c70" />
            <Orb position={[0.35, 0, 0.04]} scale={[0.17, 0.1, 0.17]} color="#153c70" />
          </group>
        )}
      </group>
    </At>
  );
}
function Island() {
  return (
    <>
      <At x={600} y={670} z={-1.5}>
        <Block size={[13.2, 0.55, 5.7]} color="#153c70" radius={0.7} />
      </At>
      <At x={600} y={647} z={-1.5}>
        <Block size={[13.7, 0.55, 5.9]} color="#00a86b" radius={0.65} />
      </At>
      <At x={600} y={622} z={-1.5}>
        <Block size={[14, 0.4, 6]} color="#55c928" radius={0.55} />
      </At>
      <At x={600} y={609} z={-1.5}>
        <Block size={[13.7, 0.12, 5.7]} color="#a4e84b" radius={0.35} />
      </At>
      <At x={600} y={582} z={-0.2}>
        <Block size={[9.7, 0.18, 4.7]} color="#b5e9d7" radius={0.1} />
      </At>
      {Array.from({ length: 10 }, (_, x) =>
        Array.from({ length: 4 }, (_, z) => (
          <At key={`${x}-${z}`} x={330 + x * 60} y={573 - z * 8} z={1.9 - z * 0.85}>
            <Block
              size={[0.97, 0.025, 0.83]}
              color={(x + z) % 2 ? "#dcf4e8" : "#bae3da"}
              radius={0.01}
            />
          </At>
        )),
      )}
      <Tree x={247} y={506} scale={1.15} />
      <Tree x={957} y={510} scale={1.4} />
      <Tree x={1000} y={550} scale={0.7} />
      {[
        [281, 592],
        [930, 581],
        [900, 618],
      ].map(([x, y], i) => (
        <At key={i} x={x} y={y} z={1}>
          <Cylinder color="#008c56" radius={0.015} height={0.22} />
          <group position={[0, 0.12, 0]}>
            {[0, 1, 2, 3, 4].map((n) => (
              <Orb
                key={n}
                position={[
                  Math.cos(n * Math.PI * 0.4) * 0.09,
                  0,
                  Math.sin(n * Math.PI * 0.4) * 0.09,
                ]}
                scale={[0.075, 0.035, 0.075]}
                color="white"
              />
            ))}
            <Orb scale={[0.045, 0.04, 0.045]} color="#ffc857" />
          </group>
        </At>
      ))}
    </>
  );
}
function Room() {
  return (
    <>
      <At x={600} y={426} z={-1.8}>
        <Block size={[9.8, 5.3, 0.3]} color="#dff9f7" radius={0.12} />
      </At>
      <At x={316} y={428} z={-0.7}>
        <Block size={[0.25, 5.35, 2.8]} color="#00a9b5" radius={0.08} />
      </At>
      <At x={884} y={428} z={-0.7}>
        <Block size={[0.25, 5.35, 2.8]} color="#00a9b5" radius={0.08} />
      </At>
      <At x={600} y={244} z={-1}>
        <Block size={[10.4, 0.58, 1.7]} color="#153c70" radius={0.15} />
        <Block position={[0, 0.24, 0]} size={[10.25, 0.12, 1.65]} color="#0878e8" radius={0.05} />
      </At>
      <At x={600} y={235} z={0.05}>
        <Block size={[2.9, 0.52, 0.07]} color="#153c70" radius={0.05} />
      </At>
      <At x={395} y={348} z={-1.5}>
        <Block size={[1.75, 2.1, 0.17]} color="#ffffff" radius={0.06} />
        <Block position={[0, 0, 0.1]} size={[1.5, 1.85, 0.04]} color="#00bdeb" radius={0.02} />
        <Orb position={[0.35, 0.5, 0.13]} scale={[0.2, 0.2, 0.03]} color="#ffc857" />
        <Orb position={[-0.35, -0.8, 0.13]} scale={[0.65, 0.4, 0.04]} color="#55c928" />
        <Orb position={[0.5, -0.75, 0.13]} scale={[0.7, 0.4, 0.04]} color="#00a86b" />
        <Block position={[0, 0, 0.2]} size={[0.07, 1.9, 0.07]} color="#ffffff" radius={0.01} />
        <Block position={[0, 0, 0.2]} size={[1.53, 0.07, 0.07]} color="#ffffff" radius={0.01} />
        <Block position={[0, -1.1, 0.18]} size={[1.95, 0.1, 0.43]} color="#ffffff" radius={0.03} />
      </At>
      <At x={812} y={352} z={-1.5}>
        <Block size={[1.25, 1.7, 0.12]} color="#153c70" radius={0.06} />
        <Block position={[0, 0, 0.075]} size={[1.1, 1.55, 0.05]} color="#00a86b" radius={0.03} />
        <Block position={[0, 0.13, 0.13]} size={[0.75, 0.93, 0.03]} color="#ffffff" radius={0.02} />
        {[-0.13, 0, 0.13].map((y) => (
          <Block
            key={y}
            position={[0, y + 0.2, 0.16]}
            size={[0.5, 0.045, 0.02]}
            color="#55c928"
            radius={0.01}
          />
        ))}
        <Block position={[0, -0.6, 0.15]} size={[0.44, 0.1, 0.03]} color="#ffc857" radius={0.01} />
      </At>
      <At x={835} y={275} z={-1.3}>
        <Cylinder color="#153c70" radius={0.35} height={0.11} rotation={[Math.PI / 2, 0, 0]} />
        <Cylinder color="#ffffff" radius={0.29} height={0.12} rotation={[Math.PI / 2, 0, 0]} />
        <Block
          position={[0, 0.08, 0.07]}
          size={[0.025, 0.18, 0.02]}
          color="#153c70"
          radius={0.005}
        />
        <Block
          position={[0.08, 0, 0.08]}
          size={[0.17, 0.025, 0.02]}
          color="#153c70"
          radius={0.005}
        />
      </At>
      <At x={386} y={501} z={-0.5}>
        <Block size={[1.3, 1.55, 0.9]} color="#00a86b" radius={0.08} />
        {[-0.47, 0, 0.47].map((y) => (
          <group key={y}>
            <Block
              position={[0, y, 0.47]}
              size={[1.16, 0.4, 0.035]}
              color="#00bc8d"
              radius={0.025}
            />
            <Block
              position={[0, y, 0.51]}
              size={[0.29, 0.05, 0.04]}
              color="#a4e84b"
              radius={0.015}
            />
          </group>
        ))}
        <Block position={[-0.25, 0.83, 0]} size={[0.5, 0.1, 0.6]} color="#ffc857" />
        <Block position={[0.2, 0.83, 0]} size={[0.17, 0.3, 0.54]} color="#0878e8" />
        <Block position={[0.42, 0.84, 0]} size={[0.15, 0.25, 0.5]} color="#00d5c0" />
      </At>
      <At x={600} y={567} z={1.2}>
        <Block size={[7.6, 0.23, 1.8]} color="#ffc857" radius={0.08} />
        <Block position={[0, -0.16, 0]} size={[7.3, 0.15, 1.6]} color="#dba544" radius={0.03} />
        {[-3.3, 3.3].map((x) => (
          <Block
            key={x}
            position={[x, -0.62, 0.35]}
            size={[0.17, 1.1, 0.17]}
            color="#153c70"
            radius={0.03}
          />
        ))}
      </At>
      {/* The HTML terminal sits flush in the modeled CRT's front face. */}
      <At x={600} y={472} z={1.5}>
        <Block size={[6, 2.7, 1]} color="#bfecdf" radius={0.2} />
        <Block position={[0, 0, 0.5]} size={[5.5, 2.25, 0.055]} color="#527e8b" radius={0.12} />
      </At>
      <At x={600} y={550} z={1.2}>
        <Block size={[0.55, 0.35, 0.45]} color="#6f9b9c" radius={0.04} />
      </At>
      <At x={600} y={558} z={1.4}>
        <Block size={[1.7, 0.09, 0.7]} color="#b8e4d9" radius={0.04} />
      </At>
      <At x={600} y={559} z={2.1}>
        <Block size={[2.8, 0.08, 0.48]} color="#abd7ce" radius={0.035} />
        {Array.from({ length: 24 }, (_, i) => (
          <Block
            key={i}
            position={[-1.22 + (i % 12) * 0.22, 0.055, -0.12 + Math.floor(i / 12) * 0.19]}
            size={[0.16, 0.04, 0.13]}
            color="#edf9e8"
            radius={0.01}
          />
        ))}
      </At>
      <At x={600} y={604} z={2.2}>
        <Cylinder radius={0.43} height={0.09} color="#153c70" />
        <Cylinder
          position={[0, 0.08, 0]}
          radius={0.36}
          height={0.05}
          color="#ffc857"
          metalness={0.4}
        />
        <mesh position={[0, 0.1, 0]} castShadow>
          <sphereGeometry args={[0.3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#ffc857" roughness={0.25} metalness={0.35} />
        </mesh>
        <Cylinder position={[0, 0.42, 0]} radius={0.055} height={0.07} color="#153c70" />
        <Cylinder
          position={[0, 0.47, 0]}
          radius={0.09}
          height={0.04}
          color="#ffc857"
          metalness={0.4}
        />
      </At>
      <At x={423} y={539} z={1.5}>
        <Cylinder radius={0.19} height={0.4} color="white" />
        <Cylinder position={[0, 0.205, 0]} radius={0.15} height={0.01} color="#543e25" />
        <mesh position={[0.2, 0, 0]}>
          <torusGeometry args={[0.13, 0.035, 10, 24]} />
          <meshStandardMaterial color="white" />
        </mesh>
      </At>
      <Fern />
    </>
  );
}
function Landscape() {
  return (
    <>
      {[
        [70, 480, 2.7],
        [180, 500, 2],
        [1030, 490, 2.6],
        [1140, 510, 2.7],
      ].map(([x, y, s], i) => (
        <At key={i} x={x} y={y} z={-6}>
          <Orb color={i % 2 ? "#00b8b4" : "#29c1df"} scale={[s, s * 1.2, s]} />
        </At>
      ))}
      <At x={600} y={716} z={-5}>
        <Block size={[30, 0.08, 15]} color="#00c8c9" radius={0.02} />
      </At>
      {Array.from({ length: 15 }, (_, i) => (
        <At key={i} x={i % 2 ? 1060 + ((i * 13) % 110) : 25 + ((i * 17) % 110)} y={610 + ((i * 43) % 178)} z={3}>
          <Block size={[0.45 + (i % 3) * 0.35, 0.018, 0.018]} color="#9af2e5" radius={0.008} />
        </At>
      ))}
    </>
  );
}
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="scene-loading" role="status">
        Pip’s 3D office couldn’t load. The signup still works.
      </div>
    ) : (
      this.props.children
    );
  }
}
export default function OfficeWorld({ step, reduced }: { step: OfficeStep; reduced: boolean }) {
  return (
    <div
      className="three-office-canvas"
      role="img"
      aria-label="A three-dimensional miniature island office with Pip, his computer, telephone, and manager Fern."
    >
      <SceneBoundary>
        <Canvas
          orthographic
          camera={{ position: [0, 5.2, 18], zoom: 60, near: 0.1, far: 80 }}
          shadows="percentage"
          dpr={[1, 1.5]}
          frameloop={reduced ? "demand" : "always"}
          gl={{ antialias: true, alpha: true }}
          fallback={
            <span className="scene-loading">
              Pip’s office needs WebGL. You can still finish signing up.
            </span>
          }
        >
          <ambientLight intensity={0.9} />
          <hemisphereLight args={["#d8f5ff", "#65a599", 1.2]} />
          <directionalLight
            position={[-5, 10, 8]}
            intensity={2.3}
            color="#fff5dc"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-12}
            shadow-camera-right={12}
            shadow-camera-top={9}
            shadow-camera-bottom={-9}
            shadow-camera-far={40}
            shadow-normalBias={0.035}
            shadow-bias={-0.0001}
          />
          <directionalLight position={[7, 4, 4]} intensity={0.7} color="#bcefff" />
          <Landscape />
          <Clouds reduced={reduced} />
          <Island />
          <Room />
          <Pip step={step} reduced={reduced} />
          <Telephone step={step} reduced={reduced} />
        </Canvas>
      </SceneBoundary>
    </div>
  );
}
