"use client";

import { Environment, Lightformer, Preload, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useEffect, useRef } from "react";
import * as THREE from "three";

import { Embers } from "@/components/three/particles";
import { clamp01 } from "@/lib/motion";
import type { KatanaFrameSink } from "./katana-frame";

import { BASE, GUARD_T, PIVOT as PIVOT_VALUES, TIP } from "./katana-path";

const MODEL_PATH = "/models/katana.glb";

// The asset contains two katanas and two scabbards. We keep one sword
// (Circle004) and hide everything else, including a stray handle cap that
// was grouped with the first sword.
const HIDDEN_NODES = ["Circle008", "Cube002", "Cube006", "Cube008"];

const TIP_LOCAL = new THREE.Vector3(...TIP);
const BASE_LOCAL = new THREE.Vector3(...BASE);
const PIVOT = new THREE.Vector3(...PIVOT_VALUES);

// Build a rotation that stands the blade upright, tip up, with its wide face
// pointing toward +Z (the camera) and its length running down -Y.
const DOWN = BASE_LOCAL.clone().sub(TIP_LOCAL).normalize();
const WIDTH = new THREE.Vector3(1, 0, 0);
const WIDTH_PERP = WIDTH.clone().addScaledVector(DOWN, -WIDTH.dot(DOWN)).normalize();
const FACE = new THREE.Vector3().crossVectors(DOWN, WIDTH_PERP).normalize();

const MODEL_ROTATION = new THREE.Quaternion().setFromRotationMatrix(
  new THREE.Matrix4()
    .makeBasis(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, -1, 0))
    .multiply(new THREE.Matrix4().makeBasis(WIDTH_PERP, FACE, DOWN).transpose()),
);

const TIP_WORLD = TIP_LOCAL.clone().sub(PIVOT).applyQuaternion(MODEL_ROTATION);
const BASE_WORLD = BASE_LOCAL.clone().sub(PIVOT).applyQuaternion(MODEL_ROTATION);

const TOP_Y = TIP_WORLD.y;
const BOTTOM_Y = BASE_WORLD.y;
const BLADE_LENGTH = TOP_Y - BOTTOM_Y;

// Camera path: start with the tip near the top of the frame, end on the grip.
const CAM_X = 0.34;
const CAM_Z = 1.02;
const START_FOCUS = TOP_Y - 0.28;
const END_FOCUS = TOP_Y - BLADE_LENGTH * 0.9;
const GUARD_Y = TOP_Y - BLADE_LENGTH * GUARD_T;
const GUARD_PROGRESS = (START_FOCUS - GUARD_Y) / (START_FOCUS - END_FOCUS);
const STILL_PROGRESS = 0.8;
const SUN_LIGHT = new THREE.Color("#e7d8d2");
const MOON_LIGHT = new THREE.Color("#d2edff");
const SUN_RIM = new THREE.Color("#be1e2d");
const MOON_RIM = new THREE.Color("#5c94ef");

type JourneyProps = {
  progress: React.RefObject<number>;
  still: boolean;
  onReady: () => void;
  frameSink: KatanaFrameSink;
};

function Journey({ progress, still, onReady, frameSink }: JourneyProps) {
  const { scene } = useGLTF(MODEL_PATH);
  const rig = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const axialTurn = useRef<THREE.Group>(null);
  const counterPivot = useRef<THREE.Group>(null);
  const lights = useRef<THREE.Group>(null);
  const sweep = useRef<THREE.PointLight>(null);
  const rim = useRef<THREE.PointLight>(null);
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const ready = useRef(false);
  useEffect(() => {
    for (const name of HIDDEN_NODES) {
      const node = scene.getObjectByName(name);
      if (node) node.visible = false;
    }
    if (!ready.current) {
      ready.current = true;
      onReady();
    }
  }, [scene, onReady]);

  useFrame((state) => {
    const p = still ? STILL_PROGRESS : clamp01(progress.current ?? 0);

    // Orbit the section in view, keeping it anchored while revealing its bevels.
    const portrait = size.height > size.width;
    const focusY = START_FOCUS + (END_FOCUS - START_FOCUS) * p;

    // As the guard arrives, lift the camera and look down so the tsuba's
    // decorated top face is visible instead of edge-on.
    const guardBump =
      Math.exp(-Math.pow((p - GUARD_PROGRESS) / 0.09, 2)) * (portrait ? 0.46 : 0.56);

    const arc = Math.sin(p * Math.PI * 1.7);
    const camX = (portrait ? 0.23 : CAM_X) + arc * 0.12;
    const camZ = (portrait ? 1.85 : 1.12) + Math.sin(p * Math.PI) * 0.16;
    const lookX = portrait ? -0.08 : 0;

    camera.position.set(camX, focusY + 0.06 + guardBump, camZ);
    camera.lookAt(lookX, focusY, 0);

    const group = rig.current;
    if (group) {
      group.position.x =
        (portrait ? 0.1 : 0) + Math.sin(p * Math.PI * 2) * (portrait ? 0.035 : 0.08);
    }

    const roller = spin.current;
    if (roller) {
      // Pivot locally rather than tilting the whole sword out of the camera path.
      roller.position.y = focusY;
      roller.rotation.set(
        0.12 * Math.sin(p * Math.PI * 1.5 + 0.4),
        0,
        -0.12 + Math.sin(p * Math.PI * 1.6) * 0.16,
      );
      if (counterPivot.current) counterPivot.current.position.y = -focusY;
    }
    // The upright model's long axis is Y. Keep its axial turn inside the
    // tilt rig so scrolling reveals the face, edge, reverse, and face again.
    if (axialTurn.current) {
      axialTurn.current.rotation.y = still ? -0.35 : -0.35 + p * Math.PI * 2;
    }

    const night = THREE.MathUtils.smoothstep(p, 0.18, 0.73);
    // Rotating the baked studio environment sweeps actual reflections without
    // re-rendering a cubemap every frame.
    state.scene.environmentRotation.y = -0.35 + p * 1.65;
    state.scene.environmentRotation.z = Math.sin(p * Math.PI) * 0.12;
    if (lights.current) lights.current.position.y = focusY;
    if (sweep.current) {
      sweep.current.position.x = -0.9 + Math.sin(p * Math.PI * 2) * 1.4;
      sweep.current.color.copy(SUN_LIGHT).lerp(MOON_LIGHT, night);
      sweep.current.intensity = 9 + Math.sin(p * Math.PI) * 5;
    }
    if (rim.current) rim.current.color.copy(SUN_RIM).lerp(MOON_RIM, night);

    frameSink.current?.({
      progress: clamp01(progress.current),
      width: size.width,
      height: size.height,
    });
  });

  return (
    <>
      <group ref={rig}>
        <group ref={spin}>
          <group ref={axialTurn} name="katana-axial-turn">
            <group ref={counterPivot}>
              <group quaternion={MODEL_ROTATION}>
                <primitive object={scene} position={[-PIVOT.x, -PIVOT.y, -PIVOT.z]} />
              </group>
            </group>
          </group>
        </group>
      </group>
      <group ref={lights}>
        <pointLight ref={sweep} position={[-0.9, 0.65, 1.4]} intensity={12} distance={7} />
        <pointLight ref={rim} position={[0.8, -0.4, -0.8]} intensity={16} distance={6} />
      </group>
    </>
  );
}

type SceneProps = {
  progress: React.RefObject<number>;
  still?: boolean;
  frameloop?: "always" | "demand" | "never";
  onReady: () => void;
  frameSink: KatanaFrameSink;
};

export default function KatanaScene({
  progress,
  still = false,
  frameloop = "always",
  onReady,
  frameSink,
}: SceneProps) {
  return (
    <Canvas
      aria-hidden
      frameloop={frameloop}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [CAM_X, START_FOCUS + 0.06, CAM_Z], fov: 42, near: 0.02, far: 60 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <fog attach="fog" args={["#070606", 5, 18]} />

      <ambientLight intensity={0.24} />
      <directionalLight position={[2.5, 4, 3]} intensity={0.9} />

      <Environment resolution={256}>
        <Lightformer
          form="rect"
          intensity={3}
          color="#f0f5ff"
          position={[0.5, 0, 4]}
          scale={[0.35, 8, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.2}
          color="#dce8f5"
          position={[-1, 1, 4]}
          scale={[2, 7, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.8}
          color="#d9efff"
          position={[-2, 0.4, 2.4]}
          scale={[0.7, 6, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.3}
          color="#ff7a45"
          position={[2.4, 0.8, 2]}
          scale={[0.8, 5, 1]}
        />
        <Lightformer
          form="rect"
          intensity={0.9}
          color="#6b9fe8"
          position={[-2.4, -0.5, -2]}
          scale={[1.2, 5, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1}
          color="#e3b25c"
          position={[2.2, -0.8, -1.8]}
          scale={[1, 4, 1]}
        />
        <Lightformer
          form="circle"
          intensity={0.7}
          color="#f3ede3"
          position={[0, 0.4, -4]}
          scale={2.5}
        />
      </Environment>

      <Journey progress={progress} still={still} onReady={onReady} frameSink={frameSink} />
      {!still && <Embers count={120} size={22} opacity={0.16} />}

      <Preload all />

      <EffectComposer multisampling={0}>
        <Bloom intensity={0.35} luminanceThreshold={0.85} luminanceSmoothing={0.6} mipmapBlur />
        <Noise opacity={0.025} blendFunction={BlendFunction.SOFT_LIGHT} />
        <Vignette offset={0.18} darkness={0.9} />
      </EffectComposer>
    </Canvas>
  );
}

useGLTF.preload(MODEL_PATH);
