"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { FrameSequence } from "@/lib/frame-sequence";
import { OG_OPTIONS } from "./frame-sequence";
import { frameAtProgress } from "./frame-timing";
import { Arrow, OGStory, STORY_MEDIA } from "./og-story";
import styles from "./car.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Keep fast headlight-facing turns clear; let copy breathe over the slow orbit.
const SHOT_TIMING = [
  [0, 0],
  [0.08, 0.35],
  [0.15, 2],
  [0.32, 3.8],
  [0.53, 6.8],
  [0.72, 9.3],
  [0.82, 10.5],
  [0.94, 13],
  [1, 13.625],
];
function shotProgress(progress: number) {
  for (let index = 1; index < SHOT_TIMING.length; index++) {
    const [end, to] = SHOT_TIMING[index];
    const [start, from] = SHOT_TIMING[index - 1];
    if (progress <= end)
      return (from + (to - from) * Math.max(0, (progress - start) / (end - start))) / 13.625;
  }
  return 1;
}

export function CarExperience() {
  const sceneRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useGSAP(
    () => {
      const scene = sceneRef.current;
      const canvas = canvasRef.current;
      if (!scene || !canvas) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        let sequence: FrameSequence | undefined;
        let frame = 0;
        let visible = !document.hidden;
        let disposed = false;
        delete scene.dataset.fallback;
        delete scene.dataset.ready;
        const overlays = scene.querySelector<HTMLElement>("[data-film-overlays]")!;
        const film = gsap.timeline({ paused: true });
        film.to(
          scene.querySelector("[data-panel='hero']"),
          { autoAlpha: 0, y: -30, duration: 0.045, ease: "none" },
          0.055,
        );
        const addPanel = (name: string, start: number, end?: number) => {
          const panel = scene.querySelector<HTMLElement>(`[data-panel='${name}']`)!;
          film
            .fromTo(
              panel,
              { autoAlpha: 0, y: 0 },
              { autoAlpha: 1, y: 0, duration: 0.025, ease: "none", immediateRender: false },
              start,
            )
            .fromTo(
              panel.querySelectorAll("[data-film-line]"),
              { yPercent: 105 },
              {
                yPercent: 0,
                duration: 0.04,
                stagger: 0.009,
                ease: "power3.out",
                immediateRender: false,
              },
              start,
            );
          if (end !== undefined)
            film.to(panel, { autoAlpha: 0, y: -22, duration: 0.025, ease: "none" }, end);
        };
        addPanel("car", 0.19, 0.3);
        addPanel("platform", 0.38, 0.515);
        addPanel("fans", 0.6, 0.75);
        addPanel("final", 0.96);
        film.to({}, { duration: 1 }, 0);
        gsap.from(scene.querySelectorAll("[data-hero-reveal]"), {
          y: 30,
          opacity: 0,
          duration: 1.1,
          stagger: 0.13,
          ease: "power3.out",
        });
        const setProgress = gsap.quickSetter(scene.querySelector("[data-film-progress]"), "scaleX");
        const onError = () => {
          scene.dataset.fallback = "true";
          sequence?.dispose();
          sequence = undefined;
        };
        try {
          sequence = new FrameSequence(
            canvas,
            OG_OPTIONS,
            (frame, tier) => {
              scene.dataset.frame = String(frame);
              scene.dataset.tier = tier;
              scene.dataset.ready = "true";
            },
            onError,
          );
          sequence.setVisible(visible);
        } catch {
          onError();
        }
        const syncProgress = (progress: number) => {
          frame = frameAtProgress(shotProgress(progress));
          // Past the shot, stop streaming frames so story media gets the bandwidth.
          sequence?.setIdle(progress >= 1);
          film.progress(progress);
          setProgress(progress);
        };
        const tick = () => {
          if (visible) sequence?.setFrame(frame);
        };
        const trigger = ScrollTrigger.create({
          trigger: scene,
          start: "top top",
          endTrigger: scene.querySelector("[data-shot-end]"),
          end: "top top",
          invalidateOnRefresh: true,
          onUpdate: (self) => syncProgress(self.progress),
          onRefresh: (self) => syncProgress(self.progress),
        });
        syncProgress(trigger.progress);
        gsap.ticker.add(tick);
        gsap.to(overlays, {
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: {
            trigger: scene.querySelector("[data-after-story]"),
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
        scene.querySelectorAll<HTMLElement>("[data-heading]").forEach((heading) => {
          gsap.fromTo(
            heading.querySelectorAll("[data-line]"),
            { yPercent: 110 },
            {
              yPercent: 0,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: { trigger: heading, start: "top 92%", end: "top 48%", scrub: true },
            },
          );
        });
        scene.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
          gsap.from(element, {
            y: 32,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 92%", once: true },
          });
        });
        gsap.fromTo(
          scene.querySelectorAll("[data-pixel]"),
          { opacity: 1 },
          {
            opacity: 0,
            duration: 0.3,
            stagger: (index) => (((index * 73) % 160) / 160) * 0.7,
            ease: "steps(1)",
            scrollTrigger: {
              trigger: scene.querySelector("[data-comic-reveal]"),
              start: "top 85%",
              end: "bottom 62%",
              scrub: true,
            },
          },
        );
        // Reuse /og2's actual layered cards and its assembly order. Keep the
        // outer fan spread separate from the portrait and brush-ink depth.
        const fanCards = scene.querySelector("[data-fan-cards]")!;
        const fanTimeline = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: { trigger: fanCards, start: "top 92%", end: "bottom 55%", scrub: true },
        });
        fanTimeline
          .fromTo(
            fanCards.querySelectorAll("[data-fan-card]"),
            { x: (index) => (1 - index) * 70, rotation: 0, y: 35 },
            { x: 0, y: 0, rotation: (index) => (index - 1) * 9, duration: 0.9, stagger: 0.08 },
            0,
          )
          .fromTo(
            fanCards.querySelectorAll("[data-fan-portrait]"),
            { autoAlpha: 0, yPercent: 12, z: -140, scale: 0.88 },
            { autoAlpha: 1, yPercent: 0, z: 12, scale: 1, duration: 0.9, stagger: 0.12 },
            0.25,
          )
          .fromTo(
            fanCards.querySelectorAll("[data-fan-logo]"),
            { autoAlpha: 0, xPercent: -9, scale: 0.75 },
            { autoAlpha: 1, xPercent: 0, scale: 1, duration: 0.55, stagger: 0.12 },
            0.55,
          )
          .fromTo(
            fanCards.querySelectorAll("[data-fan-number]"),
            { autoAlpha: 0, y: -8 },
            { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.12 },
            0.8,
          )
          .fromTo(
            fanCards.querySelectorAll("[data-fan-name]"),
            { autoAlpha: 0, yPercent: 10, scale: 0.9 },
            { autoAlpha: 1, yPercent: 0, scale: 1, duration: 0.55, stagger: 0.12 },
            0.95,
          )
          .to(
            fanCards.querySelectorAll("[data-fan-portrait]"),
            { z: 45, yPercent: -2.5, duration: 0.95, stagger: 0.08 },
            1.55,
          )
          .to(
            fanCards.querySelectorAll("[data-fan-name]"),
            { z: 65, yPercent: 2, duration: 0.9, stagger: 0.08 },
            1.7,
          )
          .to(
            fanCards.querySelectorAll("[data-fan-logo]"),
            { z: 28, xPercent: -1.5, duration: 0.9, stagger: 0.08 },
            1.7,
          );
        const syncVisibility = () => {
          visible = !document.hidden;
          sequence?.setVisible(visible);
        };
        document.addEventListener("visibilitychange", syncVisibility);
        window.addEventListener("pageshow", syncVisibility);
        document.fonts.ready.then(() => {
          if (!disposed) ScrollTrigger.refresh();
        });
        return () => {
          disposed = true;
          gsap.ticker.remove(tick);
          sequence?.dispose();
          document.removeEventListener("visibilitychange", syncVisibility);
          window.removeEventListener("pageshow", syncVisibility);
          delete scene.dataset.ready;
          delete scene.dataset.frame;
          delete scene.dataset.tier;
        };
      });
      return () => mm.revert();
    },
    { scope: sceneRef },
  );
  return (
    <section
      ref={sceneRef}
      className={styles.scene}
      id="og-top"
      aria-label="They Call Him OG — a fan-powered chapter by OnceMore"
    >
      <header className={styles.header}>
        <a href="/" className={styles.brand} aria-label="OnceMore home">
          oncemore<span>®</span>
        </a>
        <a className={styles.headerChapter} href="#og-story">
          THE OG CHAPTER <span> / 01</span>
        </a>
        <a href="/archive/signup" className={styles.headerJoin}>
          Join the next one <Arrow />
        </a>
      </header>
      <div className={styles.viewport}>
        <div className={styles.media} data-island-arrival-media aria-hidden="true">
          <canvas ref={canvasRef} className={styles.canvas} />
        </div>
        <div className={styles.filmShade} aria-hidden="true" />
        <div className={styles.filmOverlays} data-film-overlays>
          <div className={`${styles.filmPanel} ${styles.hero}`} data-panel="hero">
            <div className={styles.heroMain}>
              <p className={styles.eyebrow} data-hero-reveal>
                A LEGEND ON SCREEN. A MOVEMENT OFF IT.
              </p>
              <h1 data-hero-reveal>
                <Image
                  src={`${STORY_MEDIA}/og-title-cutout.png`}
                  alt="They Call Him OG"
                  width={569}
                  height={278}
                  priority
                  unoptimized
                />
              </h1>
              <p className={styles.heroDescription} data-hero-reveal>
                The car from the film.
                <br />
                The world unlocked by its fans.
              </p>
            </div>
            <p className={styles.heroAside} data-hero-reveal>
              The comic. The community.
              <br />
              <strong>The reveal they earned.</strong>
            </p>
            <div className={styles.heroBottom} data-hero-reveal>
              <span>
                <i /> THE ACTUAL CAR USED IN THE FILM
              </span>
              <a href="#og-story">
                SCROLL INTO HIS WORLD <Arrow down />
              </a>
              <span>ONCEMORE × OG</span>
            </div>
          </div>
          <article className={`${styles.filmPanel} ${styles.carPanel}`} data-panel="car">
            <p className={styles.eyebrow}>01 / THE MACHINE</p>
            <h2 aria-label="Straight from the screen.">
              {["STRAIGHT FROM", "THE SCREEN."].map((line) => (
                <span className={styles.lineMask} key={line}>
                  <span data-film-line>{line}</span>
                </span>
              ))}
            </h2>
            <p className={styles.filmCopy}>
              The actual car used in <em>They Call Him OG.</em>
              <br />
              You’re looking at a piece of the film.
            </p>
          </article>
          <article className={`${styles.filmPanel} ${styles.platformPanel}`} data-panel="platform">
            <p className={styles.eyebrow}>02 / THE PLATFORM. THE PEOPLE.</p>
            <h2 aria-label="The reveal was ours.">
              {["THE REVEAL", "WAS OURS."].map((line) => (
                <span className={styles.lineMask} key={line}>
                  <span data-film-line>{line}</span>
                </span>
              ))}
            </h2>
            <p className={styles.filmCopy}>
              OG’s comic made its reveal on <strong>OnceMore.</strong>
              <br />
              The fans made it happen.
            </p>
          </article>
          <article className={`${styles.filmPanel} ${styles.fansPanel}`} data-panel="fans">
            <p className={styles.eyebrow}>03 / A COLLECTIVE OBSESSION</p>
            <h2 aria-label="One fan. One pixel.">
              {["ONE FAN.", "ONE PIXEL."].map((line) => (
                <span className={styles.lineMask} key={line}>
                  <span data-film-line>{line}</span>
                </span>
              ))}
            </h2>
            <p className={styles.filmCopy}>
              Every signup uncovered another piece.
              <br />A million fans brought the hidden story to light.
            </p>
            <div className={styles.filmMetrics}>
              <span>
                <b>1M+</b> FANS
              </span>
              <span>
                <b>&lt;42H</b> ONE REVEAL
              </span>
            </div>
          </article>
          <div className={`${styles.filmPanel} ${styles.finalPanel}`} data-panel="final">
            <p className={styles.eyebrow}>THE MACHINE. THE MYTH. THE MILLION.</p>
            <Image
              src={`${STORY_MEDIA}/og-title-cutout.png`}
              alt="They Call Him OG"
              width={569}
              height={278}
              unoptimized
            />
            <p className={styles.finalNote}>AN OG FAN EXPERIENCE. BUILT BY ONCEMORE.</p>
          </div>
          <div className={styles.filmProgress} aria-hidden="true">
            <span data-film-progress />
          </div>
        </div>
      </div>
      <div className={styles.shotTrack} aria-hidden="true" />
      <div data-shot-end aria-hidden="true" />
      <div className={styles.finalHold} aria-hidden="true" />
      <OGStory />
      <noscript>
        <style>{`.${styles.shotTrack},.${styles.finalHold}{display:none}.${styles.viewport}{position:relative}.${styles.pixelGrid}{display:none}`}</style>
      </noscript>
    </section>
  );
}
