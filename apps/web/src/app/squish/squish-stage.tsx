"use client";

import ElasticMesh from "@oncemore-landing-page/ui/components/ElasticMesh";
import { useLayoutEffect, useRef, useState } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, useGSAP } from "@/lib/gsap";

import "./squish.css";

const materials = [
  { id: "jelly", label: "Jelly", color: "#c6ff4a" },
  { id: "chrome", label: "Chrome", color: "#ece9ff" },
  { id: "balloon", label: "Rubber", color: "#7c5cff" },
  { id: "clay", label: "Clay", color: "#46e0ff" },
] as const;

type MaterialId = (typeof materials)[number]["id"];

export function SquishStage() {
  const root = useRef<HTMLElement>(null);
  const shell = useRef<HTMLDivElement>(null);
  const flash = useRef<HTMLDivElement>(null);
  const hud = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [material, setMaterial] = useState<MaterialId>("jelly");
  const [family, setFamily] = useState("");
  const [slammed, setSlammed] = useState(0);

  useLayoutEffect(() => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue("--font-inter-tight")
      .trim();
    if (value) setFamily(value);
  }, []);

  const palette = materials.find((item) => item.id === material) ?? materials[0];

  const slam = () => {
    if (!reduced) {
      const timeline = gsap.timeline();
      timeline.fromTo(
        flash.current,
        { autoAlpha: 0.95, scale: 0.72 },
        { autoAlpha: 0, scale: 1.6, duration: 0.7, ease: "power2.out" },
      );
      timeline.fromTo(
        shell.current,
        { scaleX: 1, scaleY: 1 },
        {
          scaleX: 1.14,
          scaleY: 0.84,
          duration: 0.16,
          ease: "power4.out",
          yoyo: true,
          repeat: 1,
          transformOrigin: "50% 55%",
          immediateRender: false,
        },
        0,
      );
      timeline.to(
        shell.current,
        { scaleX: 1, scaleY: 1, duration: 1.15, ease: "elastic.out(1, 0.32)" },
        0.32,
      );
      timeline.fromTo(
        root.current,
        { x: 0, y: 0 },
        {
          keyframes: [
            { x: -14, y: 6, duration: 0.06 },
            { x: 12, y: -7, duration: 0.06 },
            { x: -8, y: 4, duration: 0.06 },
            { x: 5, y: -2, duration: 0.06 },
            { x: 0, y: 0, duration: 0.18 },
          ],
          ease: "none",
        },
        0,
      );
    }
    setSlammed((value) => value + 1);
  };

  useGSAP(
    () => {
      if (reduced) {
        gsap.set([shell.current, hud.current], { autoAlpha: 1, clearProps: "clipPath,scale" });
        return;
      }

      gsap.set(hud.current, { autoAlpha: 0, y: 14 });
      gsap.set(shell.current, {
        autoAlpha: 0,
        scale: 1.42,
        clipPath: "inset(46% 0% 46% 0%)",
        transformOrigin: "50% 55%",
      });
      gsap.set(flash.current, { autoAlpha: 0, scale: 0.6 });

      const timeline = gsap.timeline({ delay: 0.15 });
      timeline
        .to(shell.current, {
          autoAlpha: 1,
          scale: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.5,
          ease: "expo.out",
        })
        .fromTo(
          flash.current,
          { autoAlpha: 0.9, scale: 0.6 },
          { autoAlpha: 0, scale: 1.7, duration: 1.1, ease: "power2.out" },
          0.05,
        )
        .to(hud.current, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.65)
        .to(shell.current, { scale: 1.03, duration: 0.28, ease: "power2.out" }, 0.62)
        .to(shell.current, {
          scale: 1,
          duration: 1.25,
          ease: "elastic.out(1, 0.3)",
          onStart: slam,
        })
        .set(shell.current, { clearProps: "clipPath" });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      ref={root}
      className="squish-stage relative flex min-h-svh w-full flex-col overflow-hidden text-[#ece9ff]"
      aria-label="OnceMore elastic wordmark"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 squish-aurora" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[62%] squish-grid" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 squish-scan" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-[46vh] -translate-y-1/2 squish-halo"
      />

      <div ref={hud} className="pointer-events-none relative z-20 flex items-start justify-between px-5 pt-6 md:px-9 md:pt-8">
        <div className="flex items-center gap-3">
          <span className="size-1.5 animate-pulse rounded-full bg-[#c6ff4a]" />
          <p className="font-mono text-[9px] uppercase tracking-[0.42em] text-[#ece9ff]/55">
            Elastic field
          </p>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-[0.42em] text-[#ece9ff]/35">
          Nº 001 / Squish
        </p>
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center px-2 sm:px-3">
        <div
          ref={shell}
          className="squish-shell relative w-full max-w-[1500px]"
          style={{ height: "min(52vh, 460px)" }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center font-sans text-[clamp(3.2rem,15vw,13rem)] font-black leading-none tracking-[-0.055em] text-[#7c5cff]/20 blur-[26px]"
            style={{ fontFamily: family || undefined }}
          >
            OnceMore
          </span>

          {family && (
            <ElasticMesh
              key={material}
              text="OnceMore"
              fontFamily={family}
              fontWeight={900}
              color={palette.color}
              material={material}
              inflate={1.12}
              stiffness={0.4}
              wobble={0.74}
              grabRadius={120}
              stretch={0.72}
              press={0.62}
              shadow={0.3}
              chaos={reduced ? 0 : 0.85}
              intro={!reduced}
              theme="dark"
              dpr={2}
              className="squish-word absolute inset-0"
            />
          )}

          <div
            aria-hidden
            ref={flash}
            className="pointer-events-none absolute inset-[-12%] -z-10 squish-flash opacity-0"
          />
        </div>
      </div>

      <div className="pointer-events-none relative z-20 flex flex-col gap-5 px-5 pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-6 md:px-9 md:pb-9">
        <div className="pointer-events-auto flex flex-col gap-3">
          <p className="hidden font-mono text-[9px] uppercase leading-relaxed tracking-[0.3em] text-[#ece9ff]/40 sm:block">
            Grab it · flick it · poke it
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={slam}
              data-cursor="hover"
              className="shrink-0 whitespace-nowrap rounded-full bg-[#ece9ff] px-5 py-2.5 font-mono text-[9px] uppercase tracking-[0.3em] text-[#04030a] transition-colors hover:bg-[#c6ff4a]"
            >
              Slam it
            </button>
            <span className="whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.26em] text-[#ece9ff]/25">
              {String(slammed).padStart(2, "0")} hits
            </span>
          </div>
        </div>

        <div className="pointer-events-auto flex flex-col gap-2.5 sm:items-end">
          <p className="hidden font-mono text-[9px] uppercase tracking-[0.3em] text-[#ece9ff]/30 sm:block">
            Surface
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {materials.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setMaterial(item.id)}
                aria-pressed={material === item.id}
                data-cursor="hover"
                className={`whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em] transition-all duration-300 ${
                  material === item.id
                    ? "border-transparent bg-[#ece9ff]/90 text-[#04030a]"
                    : "border-[#ece9ff]/20 text-[#ece9ff]/45 hover:border-[#ece9ff]/50 hover:text-[#ece9ff]/80"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <a
        href="/"
        className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.34em] text-[#ece9ff]/25 transition-colors hover:text-[#c6ff4a] lg:block"
      >
        ← Back to OnceMore
      </a>

      <p className="sr-only">
        The OnceMore wordmark is rendered as a soft elastic surface. Drag, flick or tap it to
        deform the letters; they wobble and settle back into shape.
      </p>
    </section>
  );
}
