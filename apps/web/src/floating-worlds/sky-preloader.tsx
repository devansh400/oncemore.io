"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./sky-preloader.module.css";

const firstVisitMs = 1800;
const repeatVisitMs = 500;
const exitMs = 1100;
const seenKey = "oncemore:sky-seen";

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
 * Cloud break: a cloud deck that clears from the edges inward as the sky loads,
 * then the camera pushes through it. Displayed progress is eased and floored by
 * a minimum duration so it never flashes or stalls.
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
  const root = useRef<HTMLDivElement>(null);
  const latest = useRef({ progress, ready });
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    latest.current = { progress, ready };
  }, [progress, ready]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minimum = minimumDuration();
    const start = performance.now();
    let shown = 0;
    let frame = 0;

    function tick(now: number) {
      const { progress, ready } = latest.current;
      const floor = Math.min(1, (now - start) / minimum);
      const goal = Math.min(ready ? 1 : Math.min(progress, 0.92), floor);
      shown = goal - shown < 0.002 ? goal : shown + (goal - shown) * 0.08;
      element?.style.setProperty("--p", String(reduced ? 0 : shown));
      if (ready && shown >= 1) {
        setExiting(true);
        return;
      }
      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!exiting) return;
    const timeout = window.setTimeout(() => setGone(true), exitMs);
    return () => window.clearTimeout(timeout);
  }, [exiting]);

  if (gone) return null;

  return (
    <div
      ref={root}
      role="status"
      aria-label="Opening the sky"
      className={styles.root}
      data-exit={exiting}
      inert={exiting}
    >
      <div aria-hidden="true" className={`${styles.layer} ${styles.outer} ${styles.drift}`} />
      <div aria-hidden="true" className={`${styles.layer} ${styles.middle} ${styles.drift}`} />
      <div aria-hidden="true" className={`${styles.layer} ${styles.centre}`} />
      <div aria-hidden="true" className={`${styles.wordmark} ${displayClassName}`}>
        oncemore
      </div>
    </div>
  );
}
