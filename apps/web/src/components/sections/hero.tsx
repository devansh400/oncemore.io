"use client";

import { useRef } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { EASE } from "@/lib/motion";

import { HeroCanvas } from "./hero-canvas";
import { Magnetic } from "../ui/magnetic";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!root.current) return;

      if (reduced) {
        progress.current = 0;
        return;
      }

      const q = gsap.utils.selector(root);

      const intro = gsap.timeline({ defaults: { ease: EASE.reveal } });
      intro
        .from(q("[data-hero-line] > span"), {
          yPercent: 115,
          duration: 1.2,
          stagger: 0.12,
        })
        .from(
          q("[data-hero-fade]"),
          {
            y: 26,
            autoAlpha: 0,
            duration: 1,
            stagger: 0.1,
          },
          0.55,
        );

      const sceneTrigger = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          progress.current = self.progress;
        },
      });

      const copyFade = gsap.to(q("[data-hero-copy]"), {
        autoAlpha: 0,
        yPercent: -14,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "35% top",
          end: "bottom top",
          scrub: true,
        },
      });

      return () => {
        intro.kill();
        sceneTrigger.kill();
        copyFade.kill();
      };
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      ref={root}
      id="top"
      className="relative isolate flex min-h-svh flex-col overflow-hidden"
    >
      <HeroCanvas progress={progress} />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,6,6,0.72)_0%,transparent_26%,transparent_58%,rgba(7,6,6,0.92)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(7,6,6,0.88)_0%,rgba(7,6,6,0.35)_38%,transparent_62%)]" />

      <div
        data-hero-copy
        className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-end px-5 pb-14 pt-32 md:px-10 md:pb-20"
      >
        <p data-hero-fade className="font-mono text-[10px] uppercase tracking-[0.42em] text-ember">
          Fan experiences for film &amp; IP
        </p>

        <h1 className="mt-6 max-w-6xl font-display text-[clamp(3.4rem,9vw,9rem)] leading-[0.86] tracking-[-0.02em]">
          <span data-hero-line className="block overflow-hidden">
            <span className="block">Step inside</span>
          </span>
          <span data-hero-line className="block overflow-hidden">
            <span className="block italic text-ember">the story.</span>
          </span>
        </h1>

        <div className="mt-8 flex flex-col gap-8 md:mt-10 md:flex-row md:items-end md:justify-between">
          <p data-hero-fade className="max-w-md text-base leading-relaxed text-bone/65 md:text-lg">
            OnceMore builds AI-powered interactive worlds for the films and shows people love — at
            the exact moment fans are ready to live inside them.
          </p>

          <div data-hero-fade className="flex flex-wrap items-center gap-5">
            <Magnetic>
              <a
                href="#worlds"
                className="inline-flex items-center gap-2 rounded-full bg-ember px-6 py-3 font-mono text-[10px] uppercase tracking-[0.26em] text-ink transition-colors hover:bg-gold"
              >
                Explore the worlds <span aria-hidden>↘</span>
              </a>
            </Magnetic>
            <a
              href="#contact"
              className="link-rule font-mono text-[10px] uppercase tracking-[0.26em] text-bone/70 hover:text-bone"
            >
              Start a collaboration
            </a>
          </div>
        </div>

        <div
          data-hero-fade
          className="mt-12 flex items-center justify-between border-t border-bone/10 pt-5 md:mt-16"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">
            1M fans in under 42 hours
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">
            Scroll to enter ↓
          </span>
        </div>
      </div>
    </section>
  );
}
