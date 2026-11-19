"use client";

import { type RefObject, useEffect, useRef } from "react";

import type { SceneController, SceneState } from "@/floating-worlds/scene-types";
import { gsap } from "@/lib/gsap";

import { islandScreenHeight, islandSpots, projectSpot } from "./anchors";
import { carryCycle, Dog, type DogHandle, groundPoint, type Pose, runCycle } from "./dog";
import styles from "./fetch-quest.module.css";
import { GoldenTicket } from "./props";

/*
 * The dog and the ticket over the islands. Both are pinned to points on the
 * paintings (see anchors.ts) and re-projected every frame. On each arrival a
 * short wordless beat plays: the dog nearly gets the ticket, and it escapes
 * toward the next island. A fan who has already finished carries it instead.
 */

type Actor = { x: number; y: number; rotate: number; scale: number; opacity: number };
const rest = (): Actor => ({ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 });

const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The dog's frame size against an island. The figure fills about half its
 * frame, so this reads as a small hero animal, not a speck.
 */
function dogSize(islandHeight: number | null, width: number, height: number) {
  const narrow = width < 640;
  return clamp((islandHeight ?? height * 0.6) * 0.34, narrow ? 120 : 160, narrow ? 220 : 320);
}

/** Where things sit on the overview, before the first island. */
function overviewSpots(width: number, height: number) {
  const narrow = width < 640;
  return {
    dog: { x: width * (narrow ? 0.68 : 0.74), y: height * (narrow ? 0.8 : 0.9) },
    ticket: { x: width * 0.56, y: height * 0.34 },
    size: clamp(height * 0.3, 150, 280),
  };
}

export function Companion({
  scene,
  controller,
  visible,
  carrying,
  onVault,
}: {
  scene: SceneState;
  controller: RefObject<SceneController | null>;
  visible: boolean;
  /** The fan has finished: the dog has the ticket. */
  carrying: boolean;
  onVault: () => void;
}) {
  const layer = useRef<HTMLDivElement>(null);
  const dogWrap = useRef<HTMLDivElement>(null);
  const ticketWrap = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLButtonElement>(null);
  const dog = useRef<DogHandle>(null);
  const dogActor = useRef<Actor>(rest());
  const ticketActor = useRef<Actor>(rest());
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const runFrame = useRef(0);
  // The frame loop reads these through refs so it never restarts.
  const carryingRef = useRef(carrying);
  const currentStop = useRef(scene.stop);

  useEffect(() => {
    carryingRef.current = carrying;
  }, [carrying]);

  useEffect(() => {
    currentStop.current = scene.stop;
  }, [scene.stop]);

  const settled = scene.ready && !scene.moving && !scene.diving;

  /* ---------- Every frame: pin actors to their islands ---------- */
  useEffect(() => {
    let frame = 0;
    const tick = (time: number) => {
      frame = requestAnimationFrame(tick);
      const width = window.innerWidth;
      const height = window.innerHeight;
      const scene = controller.current;
      const flight = scene?.debug?.F;
      const overview = overviewSpots(width, height);

      const spotsFor = (stop: number) => {
        if (stop === 0) return overview;
        const spot = islandSpots[stop - 1];
        const dogPoint = projectSpot(scene, stop - 1, spot.dog, width, height);
        const ticketPoint = projectSpot(scene, stop - 1, spot.ticket, width, height);
        const islandHeight = islandScreenHeight(scene, stop - 1, width, height);
        if (!dogPoint || !ticketPoint) return overview;
        return {
          dog: dogPoint,
          ticket: ticketPoint,
          size: dogSize(islandHeight, width, height),
        };
      };

      let dogSpot: { x: number; y: number };
      let ticketSpot: { x: number; y: number };
      let size: number;
      let flying = false;
      let flightT = 0;

      if (flight?.active) {
        flying = true;
        flightT = smoother(clamp(flight.t, 0, 1));
        const from = spotsFor(flight.from);
        const to = spotsFor(flight.to);
        // Run between the two spots, kept inside the frame.
        dogSpot = {
          x: clamp(from.dog.x + (to.dog.x - from.dog.x) * flightT, width * 0.12, width * 0.88),
          y: clamp(from.dog.y + (to.dog.y - from.dog.y) * flightT, height * 0.3, height * 0.9),
        };
        size = from.size + (to.size - from.size) * flightT;
        ticketSpot = to.ticket;
      } else {
        const here = spotsFor(currentStop.current);
        dogSpot = here.dog;
        ticketSpot = here.ticket;
        size = here.size;
      }

      const d = dogActor.current;
      const t = ticketActor.current;
      const carryingNow = carryingRef.current;

      if (flying && !reducedMotion()) {
        const cycle = carryingNow ? carryCycle : runCycle;
        const index = Math.floor(time / 85) % cycle.length;
        if (index !== runFrame.current) {
          runFrame.current = index;
          dog.current?.setPose(cycle[index]);
        }
      }
      const hop = flying && !reducedMotion() ? -Math.abs(Math.sin(time / 120)) * size * 0.09 : 0;

      const dogElement = dogWrap.current;
      if (dogElement) {
        dogElement.style.width = `${size}px`;
        dogElement.style.height = `${size}px`;
        dogElement.style.transform = `translate(${dogSpot.x - size * groundPoint.x + d.x}px, ${
          dogSpot.y - size * groundPoint.y + d.y + hop
        }px) rotate(${d.rotate}deg) scale(${d.scale})`;
        dogElement.style.opacity = String(d.opacity);
      }

      const ticketElement = ticketWrap.current;
      if (ticketElement) {
        const ticketWidth = size * (carryingNow ? 0.42 : 0.62);
        ticketElement.style.width = `${ticketWidth}px`;
        if (carryingNow) {
          // The carry poses hold the ticket in the art itself.
          ticketElement.style.opacity = "0";
        } else {
          ticketElement.style.transform = `translate(${ticketSpot.x - ticketWidth / 2 + t.x}px, ${
            ticketSpot.y - ticketWidth * 0.25 + t.y
          }px) rotate(${t.rotate}deg) scale(${t.scale})`;
          // In flight the next ticket fades in late, so it never seems to teleport.
          const arriving = flying ? clamp((flightT - 0.55) / 0.3, 0, 1) : 1;
          ticketElement.style.opacity = String(t.opacity * arriving);
        }
      }

      if (hint.current) {
        hint.current.style.transform = `translate(${dogSpot.x - 22}px, ${dogSpot.y + 18}px)`;
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [controller]);

  /* ---------- Beats ---------- */
  useEffect(() => {
    timeline.current?.kill();
    timeline.current = null;
    const timers: number[] = [];
    const showHint = (shown: boolean) => {
      if (hint.current) hint.current.dataset.shown = String(shown);
    };
    showHint(false);

    if (!settled) {
      // In flight: reset both actors; the frame loop runs the cycle.
      Object.assign(dogActor.current, rest());
      Object.assign(ticketActor.current, rest());
      return;
    }

    const pose = (name: Pose) => () => dog.current?.setPose(name);
    const d = dogActor.current;
    const t = ticketActor.current;
    Object.assign(d, rest());
    Object.assign(t, rest());

    if (carrying) {
      dog.current?.setPose("carry-sit");
      if (scene.stop === 5) showHint(true);
      return;
    }

    const quick = reducedMotion();
    const width = window.innerWidth;
    const height = window.innerHeight;
    const stop = scene.stop;
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    timeline.current = tl;

    if (stop === 0) {
      // The ticket drifts about the sky; the dog watches it.
      dog.current?.setPose("look-up");
      if (!quick) {
        tl.to(t, { x: width * 0.12, y: -height * 0.05, rotate: 20, duration: 3.2, ease: "sine.inOut" })
          .to(t, { x: -width * 0.08, y: height * 0.04, rotate: -16, duration: 3.6, ease: "sine.inOut" })
          .to(t, { x: 0, y: 0, rotate: 0, duration: 3, ease: "sine.inOut" })
          .call(pose("head-tilt"), [], 2.2)
          .call(pose("look-up"), [], 3.4)
          .repeat(-1);
      }
      return () => {
        tl.kill();
      };
    }

    const spot = islandSpots[stop - 1];
    const ctl = controller.current;
    const dogPoint = projectSpot(ctl, stop - 1, spot.dog, width, height);
    const ticketPoint = projectSpot(ctl, stop - 1, spot.ticket, width, height);
    const size = dogSize(islandScreenHeight(ctl, stop - 1, width, height), width, height);
    const dx = ticketPoint && dogPoint ? ticketPoint.x - dogPoint.x : size;
    const dy = ticketPoint && dogPoint ? ticketPoint.y - dogPoint.y : -size;
    const away = { x: width * 0.55, y: -height * 0.5 };

    dog.current?.setPose("land");
    if (quick) {
      // No choreography: the ticket simply moves on.
      tl.call(pose("look-up"), [], 0.3).to(t, { opacity: 0, duration: 0.6 }, 1.2).call(pose("sit-idle"), [], 1.8);
      if (stop === 5) tl.call(() => showHint(true), [], 2);
      return () => {
        tl.kill();
      };
    }

    tl.call(pose("look-up"), [], 0.35);

    switch (spot.beat) {
      case "embers": {
        // Leap for the ticket on the torii; an ember gust lifts it away.
        tl.call(pose("crouch"), [], 1.1)
          .call(pose("leap"), [], 1.4)
          .to(d, { x: dx * 0.8, y: dy * 0.8, duration: 0.45 }, 1.4)
          .call(pose("snap"), [], 1.78)
          .call(() => sparks(ticketPoint, "#FF8A3D", 22, size), [], 1.72)
          .to(t, { x: away.x * 0.6, y: away.y, rotate: 540, scale: 0.6, duration: 1.3, ease: "power2.in" }, 1.72)
          .to(t, { opacity: 0, duration: 0.4 }, 2.6)
          .to(d, { x: 0, y: 0, duration: 0.5, ease: "power2.in" }, 1.92)
          .call(pose("land"), [], 2.42)
          .call(pose("head-tilt"), [], 2.75)
          .call(pose("sit-idle"), [], 4);
        break;
      }
      case "sneeze": {
        // Creep up and sniff it... and sneeze it clean off the island.
        tl.call(() => walk(1100), [], 0.9)
          .to(d, { x: dx - size * 0.55, y: dy * 0.6, duration: 1.1, ease: "power1.inOut" }, 0.9)
          .call(pose("sniff"), [], 2)
          .to(d, { y: `+=${size * 0.03}`, duration: 0.2, yoyo: true, repeat: 3 }, 2.1)
          .call(pose("sneeze"), [], 3)
          .call(() => sparks(ticketPoint, "#F2C76A", 16, size), [], 3.05)
          .to(t, { x: away.x * 0.5, y: away.y * 0.8, rotate: -420, scale: 0.6, duration: 1.4, ease: "power2.in" }, 3.05)
          .to(t, { opacity: 0, duration: 0.4 }, 4)
          .call(pose("head-tilt"), [], 3.5)
          .call(pose("sit-idle"), [], 4.8);
        break;
      }
      case "bounce": {
        // The ticket bounces like a ball; a header, a miss, a tumble.
        tl.to(t, { y: -size * 0.5, duration: 0.35, ease: "power2.out", yoyo: true, repeat: 3 }, 0.6)
          .call(pose("crouch"), [], 1.6)
          .call(pose("leap"), [], 2)
          .to(d, { x: dx * 0.7, y: dy * 0.7, duration: 0.42 }, 2)
          .to(t, { x: -away.x * 0.5, y: away.y, rotate: 300, scale: 0.6, duration: 1.2, ease: "power2.in" }, 2.3)
          .to(t, { opacity: 0, duration: 0.4 }, 3.1)
          .call(pose("tumble"), [], 2.42)
          .to(d, { x: 0, y: 0, rotate: 360, duration: 0.6, ease: "power2.in" }, 2.42)
          .set(d, { rotate: 0 }, 3.02)
          .call(pose("land"), [], 3.02)
          .call(pose("head-tilt"), [], 3.4)
          .call(pose("sit-idle"), [], 4.6);
        break;
      }
      case "boom": {
        // The speakers thump; the shockwave blows the ticket (and the dog's ears) back.
        tl.call(pose("crouch"), [], 1)
          .call(() => booms(ticketPoint, size), [], 1.4)
          .to(d, { x: -size * 0.35, duration: 0.25, ease: "power3.out" }, 1.5)
          .to(t, { x: away.x * 0.6, y: away.y * 0.6, rotate: 360, scale: 0.6, duration: 1.2, ease: "power2.in" }, 1.5)
          .to(t, { opacity: 0, duration: 0.4 }, 2.3)
          .to(d, { x: 0, duration: 0.8, ease: "power1.inOut" }, 2)
          .call(pose("head-tilt"), [], 2.4)
          .call(pose("sit-idle"), [], 3.8);
        break;
      }
      case "gate": {
        // The ticket drifts into the light of the door. The dog follows, then waits.
        tl.to(t, { y: -size * 0.15, scale: 0.35, opacity: 0, duration: 2.4, ease: "power1.in" }, 1.2)
          .call(() => sparks(ticketPoint, "#FFC56E", 18, size), [], 3.2)
          .call(() => walk(1200), [], 1.6)
          .to(d, { x: dx * 0.35, y: dy * 0.3, duration: 1.2, ease: "power1.inOut" }, 1.6)
          .call(pose("look-up"), [], 2.8)
          .call(pose("sit-idle"), [], 4)
          .call(() => showHint(true), [], 4.2);
        break;
      }
    }

    /** Trot frames for `ms`, then whatever the timeline sets next. */
    function walk(ms: number) {
      let index = 0;
      const id = window.setInterval(() => {
        dog.current?.setPose(runCycle[index++ % runCycle.length]);
      }, 95);
      timers.push(id, window.setTimeout(() => window.clearInterval(id), ms));
    }

    return () => {
      tl.kill();
      timers.forEach((id) => {
        window.clearInterval(id);
        window.clearTimeout(id);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settled, scene.stop, carrying]);

  /* ---------- Particles ---------- */
  function sparks(point: { x: number; y: number } | null, colour: string, count: number, size: number) {
    if (!point || !layer.current || reducedMotion()) return;
    for (let i = 0; i < count; i++) {
      const spark = document.createElement("div");
      spark.className = styles.spark;
      const radius = 2 + Math.random() * 3;
      Object.assign(spark.style, {
        left: `${point.x}px`,
        top: `${point.y}px`,
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
        background: colour,
        boxShadow: `0 0 ${radius * 4}px ${colour}`,
      });
      layer.current.appendChild(spark);
      const angle = -Math.PI / 4 + (Math.random() - 0.5) * 2;
      const distance = size * (0.6 + Math.random() * 1.6);
      const animation = spark.animate(
        [
          { transform: "translate(0,0) scale(1)", opacity: 1 },
          {
            transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0.2)`,
            opacity: 0,
          },
        ],
        { duration: 900 + Math.random() * 800, easing: "cubic-bezier(0.2, 0.7, 0.4, 1)", fill: "forwards" },
      );
      animation.onfinish = () => spark.remove();
    }
  }

  function booms(point: { x: number; y: number } | null, size: number) {
    if (!point || !layer.current || reducedMotion()) return;
    for (let i = 0; i < 3; i++) {
      const ring = document.createElement("div");
      ring.className = styles.spark;
      Object.assign(ring.style, {
        left: `${point.x - size * 0.5}px`,
        top: `${point.y - size * 0.5}px`,
        width: `${size}px`,
        height: `${size}px`,
        border: "2px solid rgb(232 140 255 / 0.8)",
        boxShadow: "0 0 18px rgb(232 140 255 / 0.6)",
      });
      layer.current.appendChild(ring);
      const animation = ring.animate(
        [
          { transform: "scale(0.2)", opacity: 0.9 },
          { transform: "scale(2.6)", opacity: 0 },
        ],
        { duration: 800, delay: i * 140, easing: "ease-out", fill: "both" },
      );
      animation.onfinish = () => ring.remove();
    }
  }

  return (
    <div
      ref={layer}
      className={styles.companion}
      style={{ opacity: visible ? 1 : 0, transition: "opacity 400ms ease" }}
      aria-hidden="true"
    >
      <div ref={ticketWrap} className={styles.actor}>
        <div className={carrying ? undefined : styles.flutter}>
          <GoldenTicket className="w-full drop-shadow-[0_0_14px_rgb(255_200_120/0.55)]" glow={0.5} />
        </div>
      </div>
      <div ref={dogWrap} className={styles.actor}>
        <Dog ref={dog} className={styles.dogSprite} initialPose="look-up" />
      </div>
      <button
        ref={hint}
        type="button"
        tabIndex={visible ? 0 : -1}
        data-world-controls
        data-shown="false"
        aria-label="Follow the ticket"
        className={`${visible ? "" : "invisible"} glass-veil glass-focus pointer-events-auto absolute top-0 left-0 grid size-11 cursor-pointer place-items-center rounded-full opacity-0 transition-opacity duration-500 data-[shown=false]:pointer-events-none data-[shown=true]:opacity-100`}
        onClick={onVault}
      >
        <svg viewBox="0 0 24 24" className="size-5 motion-safe:animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}
