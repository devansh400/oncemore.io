"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import type { KatanaFrameSink } from "./katana-frame";

const Scene = dynamic(() => import("./katana-scene"), {
  ssr: false,
  loading: () => null,
});

type KatanaCanvasProps = {
  progress: React.RefObject<number>;
  still?: boolean;
  frameSink: KatanaFrameSink;
};

export default function KatanaCanvas({ progress, still = false, frameSink }: KatanaCanvasProps) {
  const container = useRef<HTMLDivElement>(null);
  const [supported, setSupported] = useState(true);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);

  const onReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    if (supported) return;
    let id = 0;
    const tick = () => {
      frameSink.current?.({
        progress: progress.current,
        width: window.innerWidth,
        height: window.innerHeight,
      });
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [supported, frameSink, progress]);

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
      {
        rootMargin: "240px",
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  if (!supported) {
    return <div aria-hidden className="absolute inset-0 ember-fallback" />;
  }

  return (
    <div ref={container} aria-hidden className="absolute inset-0">
      <Scene
        progress={progress}
        still={still}
        frameloop={visible ? "always" : "demand"}
        onReady={onReady}
        frameSink={frameSink}
      />

      <div
        className={`pointer-events-none absolute inset-0 z-20 bg-ink transition-opacity duration-1000 ${ready ? "opacity-0" : "opacity-100"}`}
      />
    </div>
  );
}
