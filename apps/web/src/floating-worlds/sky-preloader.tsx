"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { preload } from "react-dom";

import styles from "./sky-preloader.module.css";

const cloudAtlas = "/floating-worlds/cloud-billows-v1.webp";
const firstVisitMs = 2200;
const repeatVisitMs = 700;
/** Pause on the finished crescent before the disc opens. */
const holdMs = 250;
/** Lets the wordmark fade before the camera dives; the disc is still dark. */
const peekMs = 300;
/** Matches the scale transition on .sky and .front. */
const zoomMs = 1400;
const fadeMs = 500;
const seenKey = "oncemore:sky-seen";

/*
 * Eclipse geometry in its 100-unit viewBox. The window cut through the sky is
 * a little wider than the disc so the ring, drawn on top, hides its edge.
 */
const ringRadius = 27.5;
const ringWidth = 3;
const holeRadius = ringRadius;
const innerEdge = ringRadius - ringWidth / 2;

type Phase = "load" | "peek" | "zoom" | "fade" | "gone";

type Cloud = {
  /** Centre, as a percentage of the viewport. */
  x: number;
  y: number;
  /** Width in vw (scaled up on portrait screens). */
  w: number;
  /** Atlas quadrant: 0 top-left, 1 top-right, 2 bottom-left, 3 bottom-right. */
  q: 0 | 1 | 2 | 3;
  /** How far the cloud slides away from the gap at full progress, in vw/vh. */
  dx: number;
  dy: number;
  s?: number;
  flip?: boolean;
};

// Back to front. Front clouds are brighter, grow more and fade less, which
// gives the parting deck some depth without a 3D scene.
const deck: Cloud[] = [
  { x: 12, y: 18, w: 46, q: 2, dx: -30, dy: -25 },
  { x: 88, y: 16, w: 46, q: 1, dx: 30, dy: -25, flip: true },
  { x: 50, y: 22, w: 56, q: 3, dx: 4, dy: -38 },
  { x: 26, y: 42, w: 58, q: 1, dx: -42, dy: -8 },
  { x: 76, y: 40, w: 58, q: 0, dx: 42, dy: -10, flip: true },
  { x: 14, y: 70, w: 56, q: 3, dx: -36, dy: 20 },
  { x: 86, y: 70, w: 56, q: 2, dx: 36, dy: 22, flip: true },
  { x: 40, y: 58, w: 52, q: 0, dx: -30, dy: 26 },
  { x: 62, y: 56, w: 52, q: 3, dx: 30, dy: 26, flip: true },
  { x: 50, y: 46, w: 48, q: 2, dx: 0, dy: 44, s: 0.9 },
  { x: 30, y: 88, w: 68, q: 1, dx: -22, dy: 36 },
  { x: 72, y: 90, w: 68, q: 0, dx: 24, dy: 36, flip: true },
];

function cloudStyle(cloud: Cloud, index: number): CSSProperties {
  const depth = index / (deck.length - 1);
  return {
    "--x": `${cloud.x}%`,
    "--y": `${cloud.y}%`,
    "--w": cloud.w,
    "--qx": cloud.q % 2 ? "100%" : "0%",
    "--qy": cloud.q > 1 ? "100%" : "0%",
    "--dx": cloud.dx,
    "--dy": cloud.dy,
    "--s": cloud.s ?? 1,
    "--flip": cloud.flip ? -1 : 1,
    "--lum": (0.42 + depth * 0.3).toFixed(2),
    "--fade": (0.9 - depth * 0.5).toFixed(2),
    "--grow": (0.15 + depth * 0.55).toFixed(2),
    "--t": `${16 + (index % 4) * 3}s`,
    animationDelay: `${-index * 2.3}s`,
  } as CSSProperties;
}

function minimumDuration() {
  try {
    const seen = window.sessionStorage.getItem(seenKey) === "1";
    window.sessionStorage.setItem(seenKey, "1");
    return seen ? repeatVisitMs : firstVisitMs;
  } catch {
    return firstVisitMs;
  }
}

/**
 * Cloud break: the scene's dusk cloud deck parts from the centre as the sky
 * loads and the eclipse corona traces the progress. Then the dark disc opens
 * onto the live scene and the camera flies through the lit ring.
 */
export function SkyPreloader({
  displayClassName,
  progress,
  ready,
}: {
  displayClassName: string;
  progress: number;
  ready: boolean;
}) {
  preload(cloudAtlas, { as: "image", fetchPriority: "high" });

  const root = useRef<HTMLDivElement>(null);
  const sky = useRef<HTMLDivElement>(null);
  const eclipse = useRef<SVGSVGElement>(null);
  const latest = useRef({ progress, ready });
  const [phase, setPhase] = useState<Phase>("load");

  useEffect(() => {
    latest.current = { progress, ready };
  }, [progress, ready]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minimum = minimumDuration();
    const start = performance.now();
    const timers: number[] = [];
    let shown = 0;
    let frame = 0;

    function after(ms: number, run: () => void) {
      timers.push(window.setTimeout(run, ms));
    }

    function openDisc() {
      const layer = sky.current;
      const svg = eclipse.current;
      if (!element || !layer || !svg) return false;
      const bounds = element.getBoundingClientRect();
      const box = svg.getBoundingClientRect();
      if (!box.width) return false;
      const unit = box.width / 100;
      const cx = box.left + box.width / 2 - bounds.left;
      const cy = box.top + box.height / 2 - bounds.top;
      const r = holeRadius * unit;
      const { width: w, height: h } = bounds;
      layer.style.clipPath =
        `path(evenodd, "M0 0H${w}V${h}H0Z` +
        `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z")`;
      // Scale until the window inside the ring covers the farthest corner.
      const reach = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy));
      const zoom = (reach / (innerEdge * unit)) * 1.1;
      element.style.setProperty("--ox", `${cx}px`);
      element.style.setProperty("--oy", `${cy}px`);
      element.style.setProperty("--zoom", zoom.toFixed(2));
      return true;
    }

    function exit() {
      if (reduced || !openDisc()) {
        setPhase("fade");
        after(fadeMs, () => setPhase("gone"));
        return;
      }
      setPhase("peek");
      after(peekMs, () => setPhase("zoom"));
      after(peekMs + zoomMs, () => setPhase("gone"));
    }

    function tick(now: number) {
      const { progress, ready } = latest.current;
      const floor = Math.min(1, (now - start) / minimum);
      const goal = Math.min(ready ? 1 : Math.min(progress, 0.9), floor);
      shown = goal - shown < 0.002 ? goal : shown + (goal - shown) * 0.06;
      element?.style.setProperty("--p", shown.toFixed(4));
      if (ready && shown >= 1) {
        after(holdMs, exit);
        return;
      }
      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      ref={root}
      role="status"
      aria-label="Opening the sky"
      className={styles.root}
      data-phase={phase}
      inert={phase !== "load"}
    >
      <div ref={sky} aria-hidden="true" className={styles.sky}>
        <div className={styles.fog} />
        <div className={styles.clouds}>
          {deck.map((cloud, index) => (
            <div key={index} className={styles.cloud} style={cloudStyle(cloud, index)} />
          ))}
        </div>
        <div className={styles.light} />
        <div className={styles.shade} />
      </div>
      <div aria-hidden="true" className={styles.front}>
        <svg ref={eclipse} className={styles.eclipse} viewBox="-50 -50 100 100">
          <defs>
            {/* Transparent inside the ring so the opened disc shows the sky untinted. */}
            <radialGradient id="sky-preloader-corona">
              <stop offset="0.52" stopColor="#ffa95c" stopOpacity="0" />
              <stop offset="0.56" stopColor="#ffa95c" stopOpacity="0.55" />
              <stop offset="0.75" stopColor="#ff8a3d" stopOpacity="0.18" />
              <stop offset="1" stopColor="#ff8a3d" stopOpacity="0" />
            </radialGradient>
            <filter id="sky-preloader-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.6" />
            </filter>
          </defs>
          <circle className={styles.corona} r="50" fill="url(#sky-preloader-corona)" />
          <g className={styles.disc}>
            <circle r={ringRadius} fill="#03050b" />
            <circle r="27" fill="none" stroke="#ffe9c8" strokeOpacity="0.14" strokeWidth="1" />
          </g>
          {/* The lit crescent starts on the sun's side, upper right, and sweeps round. */}
          <g transform="rotate(-50)">
            <circle
              className={styles.ring}
              r={ringRadius}
              fill="none"
              stroke="#ffd9a6"
              strokeWidth={ringWidth}
              strokeLinecap="round"
              pathLength={100}
              filter="url(#sky-preloader-glow)"
            />
            <circle
              className={styles.ring}
              r={ringRadius}
              fill="none"
              stroke="#fff4e2"
              strokeWidth="1.2"
              strokeLinecap="round"
              pathLength={100}
            />
          </g>
        </svg>
        <p className={`${styles.wordmark} ${displayClassName}`}>oncemore</p>
      </div>
    </div>
  );
}
