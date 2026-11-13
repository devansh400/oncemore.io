"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./side-by-side-comparison.module.css";

type Pair = [number, number];
const LAPTOP_WIDTH = 1440;
const LAPTOP_HEIGHT = 900;

function interpolate(value: number, anchors: Pair[], from: 0 | 1) {
  const to = from === 0 ? 1 : 0;
  for (let index = 1; index < anchors.length; index++) {
    const end = anchors[index]!;
    if (value > end[from] && index < anchors.length - 1) continue;
    const start = anchors[index - 1]!;
    const progress = Math.max(
      0,
      Math.min(1, (value - start[from]) / Math.max(1, end[from] - start[from])),
    );
    return start[to] + (end[to] - start[to]) * progress;
  }
  return 0;
}

export function SideBySideComparison({
  title,
  before,
  after,
}: {
  title: string;
  before: string;
  after: string;
}) {
  const root = useRef<HTMLElement>(null);
  const frames = useRef<(HTMLIFrameElement | null)[]>([]);
  const progress = useRef<HTMLInputElement>(null);
  const position = useRef(0);
  const jump = useRef<(value: number) => void>(() => {});
  const [loads, setLoads] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const screens = root.current!.querySelectorAll<HTMLElement>("[data-laptop-screen]");
    const resize = () =>
      screens.forEach((screen, index) => {
        frames.current[index]?.style.setProperty(
          "--screen-scale",
          String(screen.clientWidth / LAPTOP_WIDTH),
        );
      });
    const observer = new ResizeObserver(resize);
    screens.forEach((screen) => observer.observe(screen));
    resize();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (loads < 2) return;
    const windows = frames.current.map((frame) => frame?.contentWindow);
    if (!windows[0] || !windows[1]) return;
    const views = windows as [Window, Window];
    const docs = views.map((view) => view.document);
    let anchors: Pair[] = [
      [0, 0],
      [1, 1],
    ];
    let maximum = 1;
    let current = 0;
    let target = 0;
    let animation = 0;
    let measureFrame = 0;
    let disposed = false;
    const written = [-1, -1];
    const cleanups: (() => void)[] = [];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const paint = () => {
      position.current = current / maximum;
      if (progress.current) progress.current.value = String(position.current * 100);
      views.forEach((view, index) => {
        const y = index === 0 ? current : interpolate(current, anchors, 0);
        written[index] = y;
        if (Math.abs(view.scrollY - y) > 0.5) view.scrollTo({ top: y, behavior: "instant" });
      });
    };
    const tick = () => {
      animation = 0;
      if (disposed) return;
      current = reduced ? target : current + (target - current) * 0.16;
      if (Math.abs(current - target) < 0.3) current = target;
      paint();
      if (current !== target) animation = requestAnimationFrame(tick);
    };
    const move = (value: number) => {
      target = Math.max(0, Math.min(maximum, value));
      if (!animation) animation = requestAnimationFrame(tick);
    };
    jump.current = (value) => move(value * maximum);
    const measure = () => {
      measureFrame = 0;
      if (disposed) return;
      const max = views.map((view) =>
        Math.max(1, view.document.documentElement.scrollHeight - view.innerHeight),
      );
      const sections = docs.map((doc) =>
        Array.from(doc.querySelectorAll<HTMLElement>("main > section > div > section")),
      );
      const next: Pair[] = [[0, 0]];
      if (sections[0]!.length === sections[1]!.length) {
        sections[0]!.forEach((section, index) => {
          const points: Pair = [
            section.getBoundingClientRect().top + views[0].scrollY,
            sections[1]![index]!.getBoundingClientRect().top + views[1].scrollY,
          ];
          const previous = next[next.length - 1]!;
          if (points.every((point, side) => point > previous[side]! + 1 && point < max[side]! - 1))
            next.push(points);
        });
      }
      next.push([max[0]!, max[1]!]);
      anchors = next;
      const targetProgress = target / maximum;
      maximum = max[0]!;
      current = position.current * maximum;
      target = targetProgress * maximum;
      paint();
      setReady(true);
    };
    const scheduleMeasure = () => {
      if (!measureFrame && !disposed) measureFrame = requestAnimationFrame(measure);
    };
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const element = event.target as Element;
      if (element.closest?.("dialog[open], [data-comparison-controls]")) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const delta =
        event.deltaY * (event.deltaMode === 1 ? 24 : event.deltaMode === 2 ? LAPTOP_HEIGHT : 1);
      move(target + delta);
    };
    const keyboard = (event: KeyboardEvent) => {
      const element = event.target as Element;
      if (
        element.closest?.(
          "button, a, input, select, textarea, video, [contenteditable], dialog[open]",
        )
      )
        return;
      const deltas: Record<string, number> = {
        ArrowDown: 80,
        ArrowUp: -80,
        PageDown: 720,
        PageUp: -720,
        " ": event.shiftKey ? -720 : 720,
      };
      if (!(event.key in deltas) && event.key !== "Home" && event.key !== "End") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      move(event.key === "Home" ? 0 : event.key === "End" ? maximum : target + deltas[event.key]!);
    };
    const bindInput = (view: Window | HTMLElement) => {
      view.addEventListener("wheel", wheel as EventListener, { passive: false, capture: true });
      view.addEventListener("keydown", keyboard as EventListener, true);
      cleanups.push(() => {
        view.removeEventListener("wheel", wheel as EventListener, true);
        view.removeEventListener("keydown", keyboard as EventListener, true);
      });
    };
    bindInput(root.current!);
    views.forEach((view, side) => {
      bindInput(view);
      // Native scrollbar dragging and the embedded pages' chapter links also sync.
      const scroll = () => {
        if (Math.abs(view.scrollY - written[side]!) < 1) return;
        cancelAnimationFrame(animation);
        animation = 0;
        current = target = side === 0 ? view.scrollY : interpolate(view.scrollY, anchors, 1);
        paint();
      };
      view.addEventListener("scroll", scroll, { passive: true });
      docs[side]!.addEventListener("load", scheduleMeasure, true);
      const observer = new ResizeObserver(scheduleMeasure);
      observer.observe(docs[side]!.body);
      void docs[side]!.fonts.ready.then(scheduleMeasure);
      cleanups.push(() => {
        view.removeEventListener("scroll", scroll);
        docs[side]!.removeEventListener("load", scheduleMeasure, true);
        observer.disconnect();
      });
    });
    // The original is a visual reference; only the new page can produce audio.
    const silenceBefore = () =>
      docs[0]!.querySelectorAll("video").forEach((video) => {
        if (!video.muted) video.muted = true;
      });
    silenceBefore();
    docs[0]!.addEventListener("volumechange", silenceBefore, true);
    measure();
    return () => {
      disposed = true;
      cancelAnimationFrame(animation);
      cancelAnimationFrame(measureFrame);
      cleanups.forEach((cleanup) => cleanup());
      docs[0]!.removeEventListener("volumechange", silenceBefore, true);
      jump.current = () => {};
    };
  }, [loads]);

  return (
    <section
      ref={root}
      className={styles.root}
      data-lenis-prevent
      aria-label={`${title} side-by-side comparison`}
    >
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>ONCEMORE / SIDE BY SIDE</span>
          <h1>{title}</h1>
        </div>
        <p>
          Scroll either screen. Both move together.<span>1440 × 900 laptop viewports</span>
        </p>
      </header>
      <div className={styles.workspace}>
        {[
          { label: "Before", url: before },
          { label: "After", url: after },
        ].map((page, index) => (
          <article key={page.url} className={styles.panel}>
            <div className={styles.panelHeader}>
              <span>
                <i aria-hidden="true" />
                {page.label}
              </span>
            </div>
            <div className={styles.screen} data-laptop-screen>
              <iframe
                ref={(frame) => {
                  frames.current[index] = frame;
                }}
                src={page.url}
                title={`${title} — ${page.label}`}
                width={LAPTOP_WIDTH}
                height={LAPTOP_HEIGHT}
                allow="autoplay; fullscreen"
                onLoad={() => {
                  setReady(false);
                  setLoads((value) => value + 1);
                }}
              />
            </div>
          </article>
        ))}
      </div>
      <footer className={styles.controls} data-comparison-controls>
        <button type="button" onClick={() => jump.current(0)}>
          Back to start ↑
        </button>
        <label>
          <span>Shared scroll</span>
          <input
            ref={progress}
            aria-label="Shared scroll progress"
            type="range"
            min="0"
            max="100"
            step="0.1"
            defaultValue="0"
            onChange={(event) => jump.current(Number(event.target.value) / 100)}
          />
        </label>
        <span role="status">{ready ? "Scroll locked" : "Loading both pages…"}</span>
      </footer>
    </section>
  );
}
