"use client";

import { useRef } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { EASE, SCROLL_START } from "@/lib/motion";

type SplitHeadingProps = {
  children: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
  stagger?: number;
};

export function SplitHeading({
  children,
  as: Tag = "h2",
  className,
  delay = 0,
  stagger = 0.035,
}: SplitHeadingProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!ref.current || reduced) return;

      const split = SplitText.create(ref.current, {
        type: "lines,words",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) => {
          gsap.from(self.words, {
            yPercent: 120,
            autoAlpha: 0,
            duration: 1,
            ease: EASE.reveal,
            stagger,
            delay,
            scrollTrigger: {
              trigger: ref.current,
              start: SCROLL_START,
              once: true,
            },
          });
        },
      });

      return () => split.revert();
    },
    { scope: ref, dependencies: [reduced, delay, stagger] },
  );

  return (
    <Tag ref={ref as React.RefObject<HTMLHeadingElement>} className={className}>
      {children}
    </Tag>
  );
}
