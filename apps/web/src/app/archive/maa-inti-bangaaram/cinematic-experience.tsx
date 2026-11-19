"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { FrameSequence } from "./frame-sequence";
import { CaseStudy, OnceMoreMark } from "./case-study";
import styles from "./cinematic.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const MEDIA = "/maa-inti-bangaaram/v2";
const SHOT_END = 11;
const TITLE_START = 11.65;
const TITLE_END = 13;
const TOTAL = 16;
const LAST_FRAME = 329;

export function CinematicExperience() {
  const sceneRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const scene = sceneRef.current;
      const canvas = canvasRef.current;
      if (!scene || !canvas) return;

      const title = scene.querySelector<HTMLElement>("[data-title]")!;
      const status = scene.querySelector<HTMLElement>("[data-status]")!;
      let sequence: FrameSequence | undefined;
      let requested = 0;
      let clock = 0;
      let presented = -1;
      let failed = false;
      let reduced = false;
      let disposed = false;
      let visible = !document.hidden;

      const overlays = gsap
        .timeline({ paused: true })
        .fromTo(
          title,
          { autoAlpha: 0, scale: 0.96, y: 24 },
          { autoAlpha: 1, scale: 1, y: 0, duration: TITLE_END - TITLE_START, ease: "power2.out" },
          TITLE_START,
        )
        .to(title, { autoAlpha: 0, y: "-6svh", duration: 1.8, ease: "none" }, 14.2)
        .to({}, { duration: TOTAL }, 0);

      const paintOverlays = () => {
        const time =
          failed || reduced
            ? TOTAL
            : clock > SHOT_END && presented !== LAST_FRAME
              ? SHOT_END
              : clock;
        overlays.time(time);
      };

      const onError = () => {
        if (disposed || failed) return;
        failed = true;
        sequence?.dispose();
        sequence = undefined;
        scene.dataset.fallback = "true";
        scene.dataset.loading = "false";
        status.textContent = "Maa Inti Bangaaram";
        paintOverlays();
        ScrollTrigger.refresh();
      };

      // Share the existing GSAP/Lenis clock. A short, frame-rate-independent
      // settle removes wheel/touch steps; no video seeks or competing RAF loop.
      const tick = (_time: number, delta: number) => {
        if (!visible || failed || reduced || !sequence) return;
        const difference = requested - clock;
        if (Math.abs(difference) < 0.0005) clock = requested;
        else clock += difference * (1 - Math.exp(-Math.min(delta, 64) / 80));
        sequence.setFrame(Math.min(clock / SHOT_END, 1) * LAST_FRAME);
        paintOverlays();
      };
      gsap.ticker.add(tick);

      const syncVisibility = () => {
        visible = !document.hidden;
        sequence?.setVisible(visible);
      };
      document.addEventListener("visibilitychange", syncVisibility);
      window.addEventListener("pageshow", syncVisibility);

      const mm = gsap.matchMedia();
      mm.add(
        {
          reduced: "(prefers-reduced-motion: reduce)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          reduced = Boolean(context.conditions?.reduced);
          scene.dataset.reduced = String(reduced);
          if (reduced) {
            scene.dataset.loading = "false";
            paintOverlays();
            return;
          }
          failed = false;
          delete scene.dataset.fallback;
          delete scene.dataset.ready;
          scene.dataset.loading = "true";
          try {
            sequence = new FrameSequence(
              canvas,
              (frame) => {
                if (disposed) return;
                presented = frame;
                scene.dataset.frame = String(frame);
                scene.dataset.ready = "true";
                scene.dataset.loading = "false";
                status.textContent = "";
                paintOverlays();
              },
              onError,
            );
          } catch {
            onError();
          }

          const trigger = ScrollTrigger.create({
            trigger: scene,
            start: "top top",
            endTrigger: scene.querySelector("[data-shot-end]"),
            end: "top top",
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              requested = self.progress * TOTAL;
            },
            onRefresh: (self) => {
              requested = self.progress * TOTAL;
            },
          });
          requested = trigger.progress * TOTAL;
          clock = requested;
          sequence?.setFrame(Math.min(clock / SHOT_END, 1) * LAST_FRAME);
          paintOverlays();
          return () => {
            trigger.kill();
            sequence?.dispose();
            sequence = undefined;
          };
        },
      );

      document.fonts.ready.then(() => {
        if (!disposed) ScrollTrigger.refresh();
      });
      return () => {
        disposed = true;
        gsap.ticker.remove(tick);
        mm.revert();
        sequence?.dispose();
        document.removeEventListener("visibilitychange", syncVisibility);
        window.removeEventListener("pageshow", syncVisibility);
      };
    },
    { scope: sceneRef },
  );

  return (
    <section
      className={styles.scene}
      ref={sceneRef}
      data-loading="true"
      aria-label="OnceMore × Maa Inti Bangaaram fan experience"
    >
      <header className={styles.header}>
        <a href="/" className={styles.brandLink} aria-label="OnceMore home">
          <OnceMoreMark className={styles.brandMark} />
        </a>
        <span className={styles.headerLabel}>Maa Inti Bangaaram / The launch you missed</span>
        <a className={styles.skip} href="#mib-results">
          Fan unlocks <span aria-hidden="true">↗</span>
        </a>
      </header>
      <div className={styles.viewport}>
        <div className={styles.media} aria-hidden="true">
          <div className={styles.still} />
          <canvas ref={canvasRef} className={styles.canvas} />
        </div>
        <div className={styles.veil} aria-hidden="true" />

        <div className={styles.title} data-title>
          <svg
            className={styles.titleArtwork}
            viewBox="225 575 990 300"
            role="img"
            aria-label="Maa Inti Bangaaram film title"
          >
            <image href={`${MEDIA}/title-card.jpg`} width="1440" height="1440" />
          </svg>
          <p className={styles.titleByline}>For the fans. With OnceMore.</p>
        </div>
        <span className={styles.srOnly} data-status role="status">
          Loading experience
        </span>
      </div>

      <CaseStudy />
      <noscript>
        <style>{`.${styles.canvas},.${styles.title}{display:none}.${styles.still}{background-image:url(${MEDIA}/final.webp);background-position:center top}.${styles.staticTitle}{display:block}.${styles.chapter}{min-height:auto;padding-block:80px}.${styles.titlePause}{min-height:60svh}`}</style>
      </noscript>
    </section>
  );
}
