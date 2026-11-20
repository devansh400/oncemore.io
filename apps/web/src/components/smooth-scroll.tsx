"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lerp = pathname === "/mib-page" || pathname === "/og-page" ? 0.12 : 0.09;
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      lerp,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      anchors: true,
    });

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const raf = (time: number) => lenis.raf(time * 1000);
    // Run first on each tick so scroll-driven work (e.g. frame sequences)
    // presents this frame's position, not the previous one.
    gsap.ticker.add(raf, false, true);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => undefined);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [lerp, reduced]);

  return <>{children}</>;
}
