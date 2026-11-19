"use client";

import { type CSSProperties, type ReactNode, useEffect, useMemo, useRef, useState } from "react";

import styles from "./fetch-quest.module.css";
import { crackPattern, type Point, shardPattern } from "./glass-geometry";

export const paneSize = { width: 260, height: 340 };

export type Tier = "veil" | "pane" | "slab";
const tierClass: Record<Tier, string> = {
  veil: "glass-veil",
  pane: "glass-pane",
  slab: "glass-slab",
};

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * One pane of glass between the dog and the ticket. Real design-system glass
 * (Veil, Pane or Slab), so the live sky refracts through it. Each revealed
 * stage grows a crack; `pulse` changes on every note so the glass shivers;
 * `broken` swaps it for shards cut from the same glass that tumble away.
 */
export function BreakablePane({
  tier,
  stages,
  level,
  tension,
  pulse,
  broken,
  seed,
  impact,
  style,
  slot,
  children,
}: {
  tier: Tier;
  stages: number;
  /** Stages of cracking revealed. */
  level: number;
  /** 0–1: how close the glass is to its resonant note. */
  tension: number;
  pulse: number;
  broken: boolean;
  seed: number;
  /** Where the howl lands, in pane pixels. */
  impact: Point;
  style?: CSSProperties;
  slot: "active" | "queued" | "gone";
  children?: ReactNode;
}) {
  const { width, height } = paneSize;
  const glass = useRef<HTMLDivElement>(null);
  // Cracks retract more slowly than they grow, so a backspace reads as healing.
  const [previousLevel, setPreviousLevel] = useState(level);
  const [healing, setHealing] = useState(false);
  if (level !== previousLevel) {
    setHealing(level < previousLevel);
    setPreviousLevel(level);
  }

  const cracks = useMemo(
    () => crackPattern({ width, height, impact, stages, seed }),
    [width, height, impact, stages, seed],
  );
  const shards = useMemo(
    () => shardPattern({ width, height, impact, seed }),
    [width, height, impact, seed],
  );

  // Shiver on every note, harder as the tension climbs.
  useEffect(() => {
    if (!pulse || !glass.current || reducedMotion()) return;
    const amount = 0.4 + tension * 1.4;
    glass.current.animate(
      [
        { transform: "none" },
        { transform: `rotate(${-amount}deg) scale(${1 + amount * 0.006})` },
        { transform: `rotate(${amount * 0.7}deg)` },
        { transform: `rotate(${-amount * 0.3}deg)` },
        { transform: "none" },
      ],
      { duration: 320, easing: "ease-out" },
    );
  }, [pulse, tension]);

  return (
    <div
      className={styles.slot}
      data-slot={slot}
      style={{ width, height, ...style }}
      aria-hidden={slot !== "active"}
      inert={slot !== "active"}
    >
      {!broken && (
        <div
          ref={glass}
          className={`${tierClass[tier]} ${styles.glass}`}
          data-tension
          style={
            {
              "--tension": tension.toFixed(3),
              "--impact-x": `${(impact[0] / width) * 100}%`,
              "--impact-y": `${(impact[1] / height) * 100}%`,
            } as CSSProperties
          }
        >
          <div className={styles.strain} />
          <div className={styles.content}>{children}</div>
          <svg className={styles.cracks} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
            {cracks.map((crack, index) => {
              const shown = crack.stage < level;
              return (
                <g key={index}>
                  <path
                    className={styles.crack}
                    d={crack.d}
                    pathLength={1}
                    strokeDasharray="1 1"
                    strokeDashoffset={shown ? 0 : 1}
                    data-healing={healing}
                    stroke="rgb(5 8 14 / 0.35)"
                    strokeWidth={crack.width + 1.4}
                    transform="translate(0.6 0.8)"
                  />
                  <path
                    className={styles.crack}
                    d={crack.d}
                    pathLength={1}
                    strokeDasharray="1 1"
                    strokeDashoffset={shown ? 0 : 1}
                    data-healing={healing}
                    stroke="rgb(240 248 255 / 0.92)"
                    strokeWidth={crack.width}
                  />
                </g>
              );
            })}
          </svg>
        </div>
      )}
      {broken &&
        shards.map((shard, index) => (
          <Shard key={index} tier={tier} points={shard.points} centre={shard.centre} impact={impact} index={index} />
        ))}
    </div>
  );
}

function Shard({
  tier,
  points,
  centre,
  impact,
  index,
}: {
  tier: Tier;
  points: Point[];
  centre: Point;
  impact: Point;
  index: number;
}) {
  const element = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = element.current;
    if (!node) return;
    if (reducedMotion()) {
      node.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: "forwards" });
      return;
    }
    // Deterministic per shard so a replay looks the same.
    const random = (n: number) => {
      const x = Math.sin(index * 12.9898 + n * 78.233) * 43758.5453;
      return x - Math.floor(x);
    };
    const dx = centre[0] - impact[0];
    const dy = centre[1] - impact[1];
    const distance = Math.hypot(dx, dy) || 1;
    // Blown away from the dog (rightward), popped up, then falling.
    const vx = (dx / distance) * (160 + random(1) * 220) + 140;
    const vy = (dy / distance) * (120 + random(2) * 160) - 260;
    const gravity = 1500;
    const spin = (random(3) - 0.5) * 720;
    const tilt = (random(4) - 0.5) * 160;
    const duration = 1.25 + random(5) * 0.5;
    const frames = Array.from({ length: 9 }, (_, step) => {
      const t = (step / 8) * duration;
      const x = vx * t;
      const y = vy * t + 0.5 * gravity * t * t;
      return {
        transform: `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${(spin * (t / duration)).toFixed(1)}deg) rotateX(${(tilt * (t / duration)).toFixed(1)}deg)`,
        opacity: step > 5 ? 1 - (step - 5) / 3 : 1,
      };
    });
    node.animate(frames, {
      duration: duration * 1000,
      easing: "linear",
      fill: "forwards",
      delay: (Math.hypot(dx, dy) / 400) * 60,
    });
  }, [centre, impact, index]);

  return (
    <div
      ref={element}
      className={`${tierClass[tier]} ${styles.shard}`}
      style={{
        clipPath: `polygon(${points.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(",")})`,
        transformOrigin: `${centre[0]}px ${centre[1]}px`,
      }}
    />
  );
}
