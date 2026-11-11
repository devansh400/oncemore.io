"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

import atmosphere from "./katana-atmosphere.module.css";
import { KatanaStory } from "./katana-story";
import type { KatanaFrameSink } from "./katana-frame";

const KatanaCanvas = dynamic(() => import("./katana-canvas"), { ssr: false });

export function KatanaExperience() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const frameSink: KatanaFrameSink = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!root.current) return;
      const updateComicScale = (remaining: number) => {
        const amount = reduced ? 0 : gsap.utils.clamp(0, 1, 1 - remaining / 400);
        root.current?.style.setProperty("--comic-scale", String(1 + amount * 0.2));
      };
      const trigger = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        onRefresh: (self) => updateComicScale(self.end - self.scroll()),
        onUpdate: (self) => {
          updateComicScale(self.end - self.scroll());
          progress.current = self.progress;
          const night = gsap.utils.clamp(0, 1, (self.progress - 0.18) / 0.55);
          root.current?.style.setProperty(
            "--katana-night",
            String(night * night * (3 - 2 * night)),
          );
          root.current?.style.setProperty("--katana-drift", `${-self.progress * 85}px`);
        },
      });
      return () => trigger.kill();
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <>
      <section
        id="og-top"
        ref={root}
        className="relative h-[850svh] bg-[#080a0b]"
        aria-label="They Call Him OG — an interactive fan experience by OnceMore"
      >
        <div className="sticky top-0 h-svh overflow-hidden">
          <div aria-hidden className={atmosphere.atmosphere}>
            <div className={atmosphere.night} />
            <div className={atmosphere.distantClouds} />
            <div className={atmosphere.halo}>
              <div className={atmosphere.moon} />
            </div>
            <div className={atmosphere.cloudVeil} />
            <div className={atmosphere.dust} />
            <div className={atmosphere.haze} />
          </div>
          <div aria-hidden className={atmosphere.nearClouds} />
          <KatanaCanvas progress={progress} still={reduced} frameSink={frameSink} />
          <div aria-hidden className={atmosphere.foregroundMist} />
          <KatanaStory frameSink={frameSink} reduced={reduced} />
        </div>
      </section>
    </>
  );
}
