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
  DoubleSide,
  SRGBColorSpace,
  TextureLoader,
  type Group,
  type Mesh,
} from "three";
import { scrollPose } from "./scroll-geometry";

type Props = {
  opening: RefObject<{ time: number }>;
  invalidateRef: RefObject<(() => void) | null>;
  onReady: () => void;
  onUnavailable: () => void;
};

class ModelBoundary extends Component<
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

function Roll({ opening, invalidateRef, onReady, onUnavailable }: Props) {
  const source = useLoader(TextureLoader, "/scroll/japanese-scroll.png");
  const { size, invalidate } = useThree();
  const body = useRef<Group>(null);
  const spindle = useRef<Group>(null);
  const fabric = useRef<Mesh>(null);
  const cover = useRef<Mesh>(null);
  const ends = useRef<Group>(null);
  const curl = useRef<Group>(null);
  const coverGeometry = useMemo(() => {
    // One outer cover, with the original front artwork mapped continuously.
    // It turns behind the roll as a whole instead of changing the body texture.
    const geometry = new CylinderGeometry(1.002, 1.002, 1, 96, 1, true, -Math.PI / 2, Math.PI);
    const uv = geometry.getAttribute("uv");
    for (let i = 0; i < uv.count; i++) uv.setX(i, 0.25 + uv.getX(i) * 0.5);
    return geometry;
  }, []);

  const textures = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 2048;
    const context = canvas.getContext("2d")!;
    const image = source.image as HTMLImageElement;
    const sx = image.width / 840;
    const sy = image.height / 1880;
    context.fillStyle = "#101311";
    context.fillRect(0, 0, canvas.width, canvas.height);
    const backing = document.createElement("canvas");
    backing.width = canvas.width;
    backing.height = canvas.height;
    const backContext = backing.getContext("2d")!;
    backContext.fillStyle = "#101311";
    backContext.fillRect(0, 0, backing.width, backing.height);
    // The supplied image is a lit, frontal view. Invert its cylindrical
    // projection, then wrap that artwork around the front half of a real mesh.
    // The back repeats its patterned cloth edge, without repeating the label.
    for (let x = 0; x < 1024; x++) {
      const angle = (x / 1024 - 0.5) * Math.PI * 2;
      const front = Math.abs(angle) <= Math.PI / 2;
      const sourceX = front ? 417 + Math.sin(angle) * 216 : 224 + ((x * 0.17) % 40);
      context.drawImage(image, sourceX * sx, 112 * sy, 1.8 * sx, 1656 * sy, x, 0, 1, 2048);
      backContext.drawImage(
        image,
        (224 + ((x * 0.17) % 40)) * sx,
        112 * sy,
        1.8 * sx,
        1656 * sy,
        x,
        0,
        1,
        2048,
      );
    }
    return [canvas, backing].map((surface) => {
      const ctx = surface.getContext("2d")!;
      ctx.fillStyle = "#3d9180";
      ctx.fillRect(0, 0, 1024, 25);
      ctx.fillRect(0, 2023, 1024, 25);
      const map = new CanvasTexture(surface);
      map.colorSpace = SRGBColorSpace;
      map.anisotropy = 4;
      return map;
    });
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
  useEffect(() => () => textures.forEach((texture) => texture.dispose()), [textures]);
  useEffect(() => () => coverGeometry.dispose(), [coverGeometry]);

  useFrame(() => {
    const pose = scrollPose(opening.current.time, size.width, size.height);
    if (!body.current || !fabric.current || !spindle.current || !ends.current || !curl.current)
      return;
    body.current.position.set(pose.x - size.width / 2, 0, 0);
    // A slight initial tilt exposes the layered top and the lacquered dowel.
    body.current.rotation.x = 0.065 * (1 - pose.unroll);
    spindle.current.rotation.y = pose.rotation;
    // The cover only disappears once its entire arc is behind the opaque body.
    // Reversing the scroll brings the same intact artwork back into view.
    if (cover.current) cover.current.visible = Math.abs(pose.rotation) <= Math.PI;
    fabric.current.scale.set(pose.radius, pose.paperHeight, pose.radius);
    ends.current.scale.set(pose.radius, 1, pose.radius);
    const dowelRadius = pose.initialRadius * 0.34;
    spindle.current.children.forEach((child, index) => {
      if (index === 0) return;
      child.position.y = (index === 1 ? 1 : -1) * (pose.paperHeight / 2 + 10);
      child.scale.set(dowelRadius, 26, dowelRadius);
    });
    ends.current.children.forEach((child, index) => {
      child.position.y = (index === 0 ? 1 : -1) * (pose.paperHeight / 2 + 0.5);
    });
    curl.current.visible = pose.unroll > 0.002;
    curl.current.rotation.x = body.current.rotation.x;
    curl.current.position.set(pose.edge - size.width / 2, 0, 0.8);
    curl.current.scale.set(pose.radius, pose.paperHeight, pose.radius);
  });

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[-350, 400, 500]} intensity={2.8} color="#fff1d7" />
      <directionalLight position={[350, 70, 200]} intensity={0.8} color="#c4d5c4" />
      <group ref={body}>
        <group ref={spindle}>
          <mesh ref={fabric}>
            <cylinderGeometry args={[1, 1, 1, 96, 1, true, -Math.PI]} />
            <meshStandardMaterial map={textures[1]} roughness={0.88} metalness={0.04} />
            <mesh ref={cover} geometry={coverGeometry}>
              <meshStandardMaterial map={textures[0]} roughness={0.88} metalness={0.04} />
            </mesh>
          </mesh>
          {[1, -1].map((sign) => (
            <mesh key={sign}>
              <cylinderGeometry args={[1, 0.92, 1, 48]} />
              <meshStandardMaterial color="#5e160e" roughness={0.29} metalness={0.17} />
            </mesh>
          ))}
        </group>
        <group ref={ends}>
          {[1, -1].map((sign) => (
            <group key={sign}>
              <mesh rotation-x={-Math.PI / 2}>
                <ringGeometry args={[0.18, 1, 96]} />
                <meshStandardMaterial color="#c9b78a" side={DoubleSide} roughness={0.95} />
              </mesh>
              {[0.32, 0.45, 0.58, 0.71, 0.84, 0.96].map((radius) => (
                <mesh key={radius} rotation-x={Math.PI / 2}>
                  <torusGeometry args={[radius, 0.005, 4, 80]} />
                  <meshStandardMaterial color="#817154" roughness={1} />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      </group>
      <group ref={curl}>
        <mesh position={[0.1, 0, 0]} rotation-y={-Math.PI / 2}>
          <cylinderGeometry args={[0.1, 0.1, 1, 24, 1, true, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#e2d3ae" side={DoubleSide} roughness={0.92} />
        </mesh>
        {[-0.49, 0.49].map((y) => (
          <mesh key={y} position={[0.1, y, 0]} rotation-y={-Math.PI / 2}>
            <cylinderGeometry args={[0.101, 0.101, 0.022, 24, 1, true, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#3a6d61" side={DoubleSide} roughness={0.7} />
          </mesh>
        ))}
      </group>
    </>
  );
}

export default function ScrollModel(props: Props) {
  return (
    <ModelBoundary onUnavailable={props.onUnavailable}>
      <Canvas
        style={{ pointerEvents: "none" }}
        orthographic
        camera={{ position: [0, 0, 1000], zoom: 1, near: 0.1, far: 2000 }}
        dpr={[1, 1.5]}
        frameloop="demand"
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        fallback={null}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", props.onUnavailable, { once: true });
        }}
      >
        <Suspense fallback={null}>
          <Roll {...props} />
        </Suspense>
      </Canvas>
    </ModelBoundary>
  );
}
