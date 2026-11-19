"use client";

import { useEffect, useRef } from "react";
import "./mib.css";

export function MibExperience() {
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = viewport.current;
    const section = root.current;
    if (!host || !section) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let cancelled = false;
    let dispose: (() => void) | undefined;

    async function start() {
      if (motion.matches) return;
      try {
        const { mountCinema } = await import("./mib-scene");
        if (cancelled || motion.matches) return;
        const cleanup = await mountCinema(host!, section!, () => cancelled || motion.matches);
        if (cancelled || motion.matches) cleanup?.();
        else dispose = cleanup;
      } catch (error) {
        // The server-rendered portrait remains usable when WebGL cannot start.
        console.warn("MIB cinema unavailable; showing the still portrait.", error);
      }
    }

    void start();
    const onPreference = () => {
      dispose?.();
      dispose = undefined;
      if (!motion.matches) void start();
    };
    motion.addEventListener("change", onPreference);
    return () => {
      cancelled = true;
      motion.removeEventListener("change", onPreference);
      dispose?.();
    };
  }, []);

  return (
    <section ref={root} className="mib-cinema" aria-label="Maa Inti Bangaaram cinematic experience">
      <div
        ref={viewport}
        className="mib-viewport"
        role="img"
        aria-label="Scroll to raise the rifle, move into the barrel, and follow a single projectile through a crimson atmosphere. Scroll back to reverse the sequence."
      >
        {/* A real image keeps the opening visible before JS, with reduced motion, and without WebGL. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="mib-poster"
          src="/mib/opening.webp"
          width="1545"
          height="1018"
          alt="Samantha in a red saree, holding a wooden rifle against a textured crimson background."
          fetchPriority="high"
        />
        <div className="mib-vignette" aria-hidden="true" />
        <div className="mib-scroll-cue" aria-hidden="true">
          <span />
          <i />
        </div>
        <div className="mib-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}
