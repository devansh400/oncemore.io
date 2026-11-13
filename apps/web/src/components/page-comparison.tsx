"use client";

import {
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import styles from "./page-comparison.module.css";

type Anchor = { current: number; original: number };

function chapters(document: Document) {
  return Array.from(document.querySelectorAll<HTMLElement>("main > section > div > section"));
}

// A live, full-viewport comparison. The current page retains native input;
// the original is a clipped, non-interactive same-origin view.
export function PageComparison({ beforeUrl }: { beforeUrl: string }) {
  const [enabled, setEnabled] = useState(false);
  const [position, setPosition] = useState(50);
  const [loadCount, setLoadCount] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pointerRef = useRef<{ id: number; x: number; position: number } | null>(null);
  const helpId = useId();

  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setEnabled(false);
      toggleRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !loadCount) return;
    const originalWindow = iframeRef.current?.contentWindow;
    if (!originalWindow) return;
    let originalDocument: Document;
    try {
      originalDocument = originalWindow.document;
      if (!originalDocument.querySelector("main > section"))
        throw new Error("Original page unavailable");
    } catch {
      setFailed(true);
      return;
    }

    let disposed = false;
    let syncRaf = 0;
    let measureRaf = 0;
    let readyRaf = 0;
    let anchors: Anchor[] = [];
    let lastTarget = -1;

    const sync = () => {
      syncRaf = 0;
      if (disposed || anchors.length < 2) return;
      const y = Math.max(0, window.scrollY);
      let segment = anchors.length - 2;
      for (let i = 0; i < anchors.length - 1; i++) {
        if (y <= anchors[i + 1].current) {
          segment = i;
          break;
        }
      }
      const from = anchors[segment];
      const to = anchors[segment + 1];
      const progress = Math.min(
        1,
        Math.max(0, (y - from.current) / Math.max(1, to.current - from.current)),
      );
      const target = from.original + (to.original - from.original) * progress;
      if (Math.abs(lastTarget - target) < 0.5) return;
      lastTarget = target;
      originalWindow.scrollTo(0, target);
    };

    const scheduleSync = () => {
      if (!syncRaf && !disposed) syncRaf = requestAnimationFrame(sync);
    };

    const measure = () => {
      measureRaf = 0;
      if (disposed) return;
      const currentMax = Math.max(0, document.documentElement.scrollHeight - innerHeight);
      const originalMax = Math.max(
        0,
        originalDocument.documentElement.scrollHeight - originalWindow.innerHeight,
      );
      const currentSections = chapters(document);
      const originalSections = chapters(originalDocument);
      const next: Anchor[] = [{ current: 0, original: 0 }];
      if (currentSections.length === originalSections.length) {
        currentSections.forEach((section, index) => {
          const current = section.getBoundingClientRect().top + window.scrollY;
          const original =
            originalSections[index].getBoundingClientRect().top + originalWindow.scrollY;
          const previous = next[next.length - 1];
          if (
            current > previous.current + 1 &&
            original > previous.original + 1 &&
            current < currentMax - 1 &&
            original < originalMax - 1
          ) {
            next.push({ current, original });
          }
        });
      }
      next.push({ current: currentMax, original: originalMax });
      anchors = next;
      lastTarget = -1;
      sync();
    };

    const scheduleMeasure = () => {
      if (!measureRaf && !disposed) measureRaf = requestAnimationFrame(measure);
    };
    const silenceOriginal = () => {
      originalDocument.querySelectorAll("video").forEach((video) => {
        if (!video.muted) video.muted = true;
      });
    };

    silenceOriginal();
    measure();
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleMeasure);
    originalDocument.addEventListener("load", scheduleMeasure, true);
    originalDocument.addEventListener("volumechange", silenceOriginal, true);
    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(document.body);
    observer.observe(originalDocument.body);
    void originalDocument.fonts.ready.then(() => {
      if (!disposed) scheduleMeasure();
    });

    // Wait for the original's canvas to catch up before revealing it, notably
    // when comparison is switched on halfway down the page.
    const started = performance.now();
    const reveal = () => {
      if (disposed) return;
      const original = originalDocument.querySelector<HTMLElement>("main > section");
      const current = document.querySelector<HTMLElement>("main > section");
      const still = original?.dataset.reduced === "true" || original?.dataset.fallback === "true";
      const matched =
        original?.dataset.ready === "true" &&
        Math.abs(Number(original.dataset.frame) - Number(current?.dataset.frame)) <= 8;
      if (still || matched || performance.now() - started > 5000) setReady(true);
      else readyRaf = requestAnimationFrame(reveal);
    };
    reveal();

    return () => {
      disposed = true;
      cancelAnimationFrame(syncRaf);
      cancelAnimationFrame(measureRaf);
      cancelAnimationFrame(readyRaf);
      observer.disconnect();
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleMeasure);
      originalDocument.removeEventListener("load", scheduleMeasure, true);
      originalDocument.removeEventListener("volumechange", silenceOriginal, true);
    };
  }, [enabled, loadCount]);

  const toggle = () => {
    setReady(false);
    setFailed(false);
    setLoadCount(0);
    setEnabled(!enabled);
    pointerRef.current = null;
  };
  const moveToPointer = (event: PointerEvent<HTMLButtonElement>) => {
    const start = pointerRef.current;
    if (!start) return;
    setPosition(
      Math.max(
        0,
        Math.min(100, start.position + ((event.clientX - start.x) / window.innerWidth) * 100),
      ),
    );
  };
  const onSliderKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step = event.shiftKey ? 10 : 2;
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      setPosition((value) => Math.max(0, value - step));
    } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      setPosition((value) => Math.min(100, value + step));
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      setPosition(event.key === "Home" ? 0 : 100);
    }
  };

  return (
    <div data-page-comparison data-enabled={enabled} data-ready={ready}>
      <div className={styles.dock}>
        <button
          ref={toggleRef}
          type="button"
          className={styles.toggle}
          aria-pressed={enabled}
          aria-label={
            enabled ? "Disable before and after comparison" : "Enable before and after comparison"
          }
          onClick={toggle}
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            aria-hidden="true"
          >
            <rect x="2" y="3" width="16" height="14" rx="2" />
            <path d="M10 3v14" />
          </svg>
          <span>Before / After</span>
          <span className={styles.state}>{enabled ? "On" : "Off"}</span>
        </button>
        {enabled && !ready && (
          <p className={styles.status} role="status">
            {failed ? "Original unavailable. Close and retry." : "Loading original…"}
          </p>
        )}
      </div>
      {enabled && (
        <div
          className={styles.overlay}
          style={{ "--comparison-split": `${position}%` } as CSSProperties}
        >
          <div className={styles.before} style={{ visibility: ready ? "visible" : "hidden" }}>
            <iframe
              ref={iframeRef}
              src={beforeUrl}
              title="Original page, visual comparison"
              aria-hidden="true"
              tabIndex={-1}
              onLoad={() => setLoadCount((count) => count + 1)}
              onError={() => setFailed(true)}
            />
          </div>
          {ready && (
            <>
              <div className={styles.divider} />
              <button
                type="button"
                className={styles.handle}
                role="slider"
                aria-label="Before and after reveal"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(position)}
                aria-valuetext={`${Math.round(position)} percent before, ${100 - Math.round(position)} percent after`}
                aria-orientation="horizontal"
                aria-describedby={helpId}
                onPointerDown={(event) => {
                  pointerRef.current = { id: event.pointerId, x: event.clientX, position };
                  event.currentTarget.setPointerCapture(event.pointerId);
                }}
                onPointerMove={(event) => {
                  if (pointerRef.current?.id === event.pointerId) moveToPointer(event);
                }}
                onPointerUp={() => {
                  pointerRef.current = null;
                }}
                onPointerCancel={() => {
                  pointerRef.current = null;
                }}
                onLostPointerCapture={() => {
                  pointerRef.current = null;
                }}
                onKeyDown={onSliderKey}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m8 8-4 4 4 4m8-8 4 4-4 4M12 5v14" />
                </svg>
              </button>
              <span
                className={`${styles.label} ${styles.beforeLabel}`}
                style={{ opacity: position < 5 ? 0 : 1 }}
              >
                Before <span>Original</span>
              </span>
              <span
                className={`${styles.label} ${styles.afterLabel}`}
                style={{ opacity: position > 95 ? 0 : 1 }}
              >
                After <span>Current</span>
              </span>
              <p id={helpId} className={styles.srOnly}>
                Drag horizontally, or use the arrow keys. Home shows the current page; End shows the
                original. Scroll to compare the entire page. Escape closes comparison.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
