"use client";

import { useRef } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { DURATION, EASE, SCROLL_START } from "@/lib/motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  blur?: boolean;
  once?: boolean;
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  blur = true,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!ref.current) return;
      if (reduced) {
        gsap.set(ref.current, { clearProps: "all" });
        return;
      }

      gsap.from(ref.current, {
        y,
        autoAlpha: 0,
        ...(blur ? { filter: "blur(10px)" } : {}),
        duration: DURATION.reveal,
        ease: EASE.reveal,
        delay,
        scrollTrigger: {
          trigger: ref.current,
          start: SCROLL_START,
          once,
        },
      });
    },
    { scope: ref, dependencies: [reduced, delay, y, blur, once] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
