"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

const Scene = dynamic(() => import("../three/scene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 ember-fallback" />,
});

export function HeroCanvas({ progress }: { progress: React.RefObject<number> }) {
  const reduced = useReducedMotion();
  const container = useRef<HTMLDivElement>(null);
  const [supported, setSupported] = useState(true);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      setSupported(Boolean(context));
    } catch {
      setSupported(false);
    }
  }, []);

  useEffect(() => {
    const element = container.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry?.isIntersecting ?? true),
      { rootMargin: "200px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  if (reduced || !supported) {
    return <div aria-hidden className="absolute inset-0 ember-fallback" />;
  }

  return (
    <div ref={container} aria-hidden className="absolute inset-0">
      <Scene progress={progress} frameloop={visible ? "always" : "demand"} />
    </div>
  );
}
