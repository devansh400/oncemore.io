"use client";

import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import {
  CanvasTexture,
  CylinderGeometry,
  SRGBColorSpace,
  TextureLoader,
  type Group,
  type Mesh,
} from "three";

export type MobileRollState = { progress: number; distance: number };
type Props = {
  state: RefObject<MobileRollState>;
  invalidateRef: RefObject<(() => void) | null>;
  onReady: () => void;
  onUnavailable: () => void;
};

class RollBoundary extends Component<
  { children: ReactNode; onUnavailable: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onUnavailable();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function Roll({ state, invalidateRef, onReady, onUnavailable }: Props) {
  const source = useLoader(TextureLoader, "/scroll/japanese-scroll.png");
  const { size, invalidate } = useThree();
  const spindle = useRef<Group>(null);
  const fabric = useRef<Mesh>(null);
  const cover = useRef<Mesh>(null);
  const collars = useRef<Group>(null);

  const geometry = useMemo(() => {
    // Cylinder axis runs horizontally. U follows the spindle; V winds around it.
    const shape = new CylinderGeometry(1.003, 1.003, 1, 96, 1, true, -Math.PI / 2, Math.PI);
    const uv = shape.getAttribute("uv");
    for (let i = 0; i < uv.count; i++) {
      const around = uv.getX(i),
        along = uv.getY(i);
      uv.setXY(i, along, 1 - around);
    }
    shape.rotateZ(-Math.PI / 2);
    return shape;
  }, []);
  const unitCylinder = useMemo(() => {
    const shape = new CylinderGeometry(1, 1, 1, 96);
    shape.rotateZ(-Math.PI / 2);
    return shape;
  }, []);

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1536;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    const image = source.image as HTMLImageElement;
    const sx = image.width / 840,
      sy = image.height / 1880;
    // Sample only the supplied asset's patterned cloth; the label is laid onto
    // the same texture, never drawn as a separate plane in front of the cylinder.
    ctx.fillStyle = "#111310";
    ctx.fillRect(0, 0, 1536, 512);
    ctx.drawImage(image, 205 * sx, 140 * sy, 70 * sx, 1580 * sy, 0, 0, 1536, 512);
    ctx.fillStyle = "#e9e0cc";
    ctx.fillRect(415, 125, 706, 262);
    ctx.strokeStyle = "#625c4b";
    ctx.lineWidth = 3;
    ctx.setLineDash([18, 12]);
    ctx.strokeRect(427, 137, 682, 238);
    ctx.setLineDash([]);
    ctx.fillStyle = "#22251f";
    ctx.font = '128px "Yu Mincho", "Noto Serif JP", serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // Canvas Y runs opposite to the winding UV: the completed texture rotates
    // with the entire cover shell, so all four characters stay on one surface.
    ctx.fillText("もう一度", 768, 263);
    const map = new CanvasTexture(canvas);
    map.colorSpace = SRGBColorSpace;
    map.anisotropy = 4;
    return map;
  }, [source]);

  useEffect(() => {
    invalidateRef.current = invalidate;
    onReady();
    invalidate();
    return () => {
      invalidateRef.current = null;
      onUnavailable();
    };
  }, [invalidate, invalidateRef, onReady, onUnavailable]);
  useEffect(
    () => () => {
      geometry.dispose();
      unitCylinder.dispose();
      texture.dispose();
    },
    [geometry, unitCylinder, texture],
  );

  useFrame(() => {
    if (!spindle.current || !fabric.current || !cover.current || !collars.current) return;
    const radius = 30 - state.current.progress * 9;
    const length = size.width - 54;
    // Match rotation to the length of paper released, rather than flipping a
    // rectangle. Positive X rotation carries the front artwork around the bottom.
    const angle = state.current.distance / ((30 + radius) / 2);
    spindle.current.rotation.x = angle;
    fabric.current.scale.set(length, radius, radius);
    // The whole semicylinder is occluded at PI. Hide it only then, before a
    // later revolution could bring the discarded outer cover back to the front.
    cover.current.visible = angle < Math.PI;
    collars.current.children.forEach((child, index) => {
      child.position.x = (index === 0 ? -1 : 1) * (length / 2 - 3);
      child.scale.set(6, radius * 1.012, radius * 1.012);
    });
  });

  return (
    <>
      <ambientLight intensity={1.3} />
      <directionalLight position={[-120, 180, 220]} intensity={2.2} color="#fff1d7" />
      <directionalLight position={[180, -60, 100]} intensity={0.45} color="#bbd2c7" />
      <mesh rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[13, 12, size.width - 24, 40]} />
        <meshStandardMaterial color="#643b25" roughness={0.36} metalness={0.08} />
      </mesh>
      <group ref={spindle}>
        <mesh ref={fabric} geometry={unitCylinder}>
          <meshStandardMaterial color="#e8ddc2" roughness={0.94} />
          <mesh ref={cover} geometry={geometry}>
            <meshStandardMaterial map={texture} roughness={0.88} />
          </mesh>
        </mesh>
        <group ref={collars}>
          {[0, 1].map((n) => (
            <mesh key={n} geometry={unitCylinder}>
              <meshStandardMaterial color="#348c7f" roughness={0.62} />
            </mesh>
          ))}
        </group>
      </group>
    </>
  );
}

export default function MobileScrollRoll(props: Props) {
  return (
    <RollBoundary onUnavailable={props.onUnavailable}>
      <Canvas
        orthographic
        camera={{ position: [0, 0, 500], zoom: 1, near: 0.1, far: 1000 }}
        dpr={[1, 1.5]}
        frameloop="demand"
        style={{ pointerEvents: "none" }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        onCreated={({ gl }) =>
          gl.domElement.addEventListener("webglcontextlost", props.onUnavailable, { once: true })
        }
      >
        <Suspense fallback={null}>
          <Roll {...props} />
        </Suspense>
      </Canvas>
    </RollBoundary>
  );
}
