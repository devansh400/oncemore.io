"use client";

import { useRef } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { isFinePointer } from "@/lib/motion";

export function CustomCursor() {
  const root = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !isFinePointer() || !dot.current || !ring.current) return;

      document.documentElement.style.cursor = "none";
      gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50, autoAlpha: 0 });

      const dotX = gsap.quickTo(dot.current, "x", { duration: 0.09, ease: "power3.out" });
      const dotY = gsap.quickTo(dot.current, "y", { duration: 0.09, ease: "power3.out" });
      const ringX = gsap.quickTo(ring.current, "x", { duration: 0.38, ease: "power3.out" });
      const ringY = gsap.quickTo(ring.current, "y", { duration: 0.38, ease: "power3.out" });

      let visible = false;

      const onMove = (event: PointerEvent) => {
        if (!visible) {
          visible = true;
          gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 });
        }
        dotX(event.clientX);
        dotY(event.clientY);
        ringX(event.clientX);
        ringY(event.clientY);
      };

      const onOver = (event: PointerEvent) => {
        const target = event.target as HTMLElement | null;
        const interactive = target?.closest(
          "a, button, [data-cursor='hover'], input, textarea, label",
        );
        gsap.to(ring.current, {
          scale: interactive ? 2.1 : 1,
          opacity: interactive ? 0.55 : 1,
          duration: 0.35,
          ease: "power3.out",
        });
        gsap.to(dot.current, {
          scale: interactive ? 0 : 1,
          duration: 0.3,
          ease: "power3.out",
        });
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerover", onOver, { passive: true });

      return () => {
        document.documentElement.style.cursor = "";
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerover", onOver);
      };
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] hidden md:block"
    >
      <div
        ref={dot}
        className="absolute left-0 top-0 size-1.5 rounded-full bg-ember opacity-0 mix-blend-difference"
      />
      <div
        ref={ring}
        className="absolute left-0 top-0 size-8 rounded-full border border-bone/70 opacity-0 mix-blend-difference"
      />
    </div>
  );
}
