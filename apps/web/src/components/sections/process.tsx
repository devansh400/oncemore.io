"use client";

import { useRef } from "react";

import { Reveal } from "@/components/ui/reveal";
import { SplitHeading } from "@/components/ui/split-heading";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { processSteps } from "@/lib/projects";

export function Process() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!ref.current || reduced) return;

      const line = ref.current.querySelector<HTMLElement>("[data-progress-line]");
      if (!line) return;

      const tween = gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top",
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 70%",
            end: "bottom 70%",
            scrub: true,
          },
        },
      );

      return () => tween.kill();
    },
    { scope: ref, dependencies: [reduced] },
  );

  return (
    <section
      ref={ref}
      id="process"
      className="scroll-mt-24 border-t border-bone/10 px-5 py-24 md:px-10 md:py-36"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-20">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-ember">
              How it works
            </p>
          </Reveal>
          <SplitHeading className="font-display text-[clamp(2.6rem,6vw,5.4rem)] leading-[0.94]">
            From story to world.
          </SplitHeading>
        </div>

        <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-[0.4fr_1fr] md:gap-20">
          <div className="md:sticky md:top-28 md:self-start">
            <p className="max-w-xs text-sm leading-relaxed text-bone/50">
              A four-part collaboration designed around your release calendar, not ours.
            </p>

            <div className="relative mt-10 hidden h-40 w-px bg-bone/10 md:block">
              <span
                data-progress-line
                className="absolute inset-0 block origin-top bg-ember"
                style={{ transform: "scaleY(0)" }}
              />
            </div>
          </div>

          <ol className="border-y border-bone/10">
            {processSteps.map((step, index) => (
              <li
                key={step.index}
                className="grid grid-cols-[auto_1fr] gap-6 border-b border-bone/10 py-8 last:border-b-0 md:gap-10 md:py-12"
              >
                <Reveal delay={index * 0.05}>
                  <span className="font-mono text-[11px] tracking-[0.3em] text-ember">
                    {step.index}
                  </span>
                </Reveal>
                <Reveal delay={index * 0.05 + 0.04}>
                  <h3 className="font-display text-3xl leading-none md:text-5xl">{step.title}</h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-bone/55">{step.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
