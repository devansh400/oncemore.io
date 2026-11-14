"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ScrollCloudIntro } from "../scroll2/scroll-cloud-intro";
import { OPENING_DURATION, scrollPose } from "../scroll2/scroll-geometry";
const TOTAL = 18.4;
import styles from "./og-journey.module.css";
import { LayeredFanCard } from "./layered-fan-card";

const ScrollModel = dynamic(() => import("../scroll2/scroll-model"), { ssr: false });
const chapters = [
  { name: "The unlock", time: 1.85 },
  { name: "Katana", time: 4.45 },
  { name: "Archery", time: 7.85 },
  { name: "Bushido", time: 11.25 },
  { name: "The fans", time: 14.8 },
  { name: "Your next story", time: 17.5 },
];
const worlds = [
  {
    id: "katana",
    label: "01 / THE BLADE",
    title: "KATANA",
    line: "Become the storm.",
    alt: "OG swinging a katana in a rain-soaked Japanese temple courtyard",
    side: "right",
  },
  {
    id: "archery",
    label: "02 / THE AIM",
    title: "ARCHERY",
    line: "One breath. One shot.",
    alt: "OG drawing a bow toward targets deep in a misty bamboo forest",
    side: "left",
  },
  {
    id: "bushido",
    label: "03 / THE WAY",
    title: "BUSHIDO",
    line: "Courage. Justice. Respect.",
    alt: "OG leaping above a mountain training ground beneath a crimson dragon",
    side: "right",
  },
];
export function OGJourney() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDialogElement>(null);
  const status = useRef<HTMLSpanElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const opening = useRef({ time: 0 });
  const invalidate = useRef<(() => void) | null>(null);
  const reduced = useReducedMotion();
  const modelReady = useCallback(() => {
    if (root.current) root.current.dataset.modelReady = "true";
  }, []);
  const modelUnavailable = useCallback(() => {
    if (root.current) root.current.dataset.modelReady = "false";
  }, []);

  useGSAP(
    () => {
      const el = root.current,
        viewport = stage.current;
      if (!el || !viewport) return;
      const panels = Array.from(el.querySelectorAll<HTMLElement>("[data-chapter]"));
      if (reduced) {
        el.dataset.motion = "reduced";
        panels.forEach((p) => {
          p.inert = false;
          p.removeAttribute("aria-hidden");
        });
        return;
      }
      el.dataset.motion = "full";
      const select = gsap.utils.selector(el);
      const nav = Array.from(el.querySelectorAll<HTMLButtonElement>("[data-chapter-nav]"));
      let previous = -2,
        alive = true;
      const poseRoll = () => {
        const pose = scrollPose(opening.current.time, viewport.clientWidth, viewport.clientHeight);
        el.style.setProperty("--paper-height", pose.paperHeight + "px");
        el.style.setProperty("--paper-edge", Math.max(0, pose.edge) + "px");
        el.style.setProperty("--paper-right", pose.paperRight + "px");
        el.style.setProperty("--roll-x", pose.x + "px");
        el.style.setProperty("--roll-scale", String(pose.radius / pose.initialRadius));
        invalidate.current?.();
      };
      poseRoll();
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => "+=" + viewport.clientHeight * 16.8,
          pin: viewport,
          scrub: 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: poseRoll,
          onUpdate: (self) => el.style.setProperty("--progress", String(self.progress)),
        },
        onUpdate: () => {
          const t = tl.time();
          const active =
            t < 1.05
              ? -1
              : t < 3.05
                ? 0
                : t < 6.45
                  ? 1
                  : t < 9.85
                    ? 2
                    : t < 13.25
                      ? 3
                      : t < 16.4
                        ? 4
                        : 5;
          if (active === previous) return;
          previous = active;
          el.dataset.active = String(active);
          if (status.current)
            status.current.textContent =
              active < 0
                ? "PROLOGUE"
                : String(active + 1).padStart(2, "0") + " / " + chapters[active].name.toUpperCase();
          panels.forEach((p, i) => {
            p.inert = i !== active;
            p.setAttribute("aria-hidden", String(i !== active));
          });
          nav.forEach((b) => {
            if (Number(b.dataset.chapterNav) === active) b.setAttribute("aria-current", "step");
            else b.removeAttribute("aria-current");
          });
        },
      });
      timeline.current = tl;
      tl.to(
        opening.current,
        { time: OPENING_DURATION, duration: OPENING_DURATION, onUpdate: poseRoll },
        0,
      )
        .to(select("[data-prologue]"), { autoAlpha: 0, y: -30, duration: 0.45 }, 0.05)
        .to(select("[data-roll]"), { autoAlpha: 0, duration: 0.15 }, 1.2)
        .fromTo(
          select("[data-cover-art]"),
          { scale: 0.84, xPercent: 9 },
          { scale: 1, xPercent: 0, duration: 1.3 },
          0.6,
        )
        .fromTo(
          select("[data-cover-dragon]"),
          { scale: 0.65, xPercent: -15 },
          { scale: 1.1, xPercent: 0, duration: 2.2 },
          0.55,
        )
        .to(
          select("[data-cover-art]"),
          { scale: 1.7, xPercent: 35, autoAlpha: 0, duration: 1 },
          2.55,
        )
        .to(
          select("[data-cover-dragon]"),
          { scale: 2, xPercent: -60, autoAlpha: 0, duration: 1.1 },
          2.5,
        )
        .to(select("[data-cover]"), { autoAlpha: 0, duration: 0.6 }, 3.05)
        .to(viewport, { backgroundColor: "#090e12", duration: 0.7 }, 2.6)
        .to(select("[data-ink-chrome]"), { color: "#eee7d7", duration: 0.6 }, 0.9);
      worlds.forEach((world, index) => {
        const scene = el.querySelector<HTMLElement>('[data-world="' + world.id + '"]')!;
        const bg = scene.querySelector("[data-background]"),
          hero = scene.querySelector("[data-hero]"),
          foreground = scene.querySelector("[data-foreground]"),
          title = scene.querySelector("[data-title]"),
          accent = scene.querySelector("[data-accent]");
        const start = 2.65 + index * 3.4,
          direction = world.side === "right" ? 1 : -1;
        tl.fromTo(scene, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7 }, start)
          .fromTo(
            bg,
            { z: -1600, scale: 1.5 },
            { z: 0, scale: 1.08, duration: 1.45, ease: "power1.out" },
            start,
          )
          .fromTo(
            hero,
            { z: -2400, xPercent: -direction * 28, yPercent: 6, autoAlpha: 0 },
            { z: 0, xPercent: 0, yPercent: 0, autoAlpha: 1, duration: 1.6, ease: "power1.out" },
            start + 0.16,
          )
          .fromTo(
            foreground,
            { z: -800, scale: 1.2, autoAlpha: 0 },
            { z: 80, scale: 1, autoAlpha: 1, duration: 1.5 },
            start + 0.1,
          )
          .fromTo(
            title,
            { autoAlpha: 0, y: 30 },
            { autoAlpha: 1, y: 0, duration: 0.55 },
            start + 0.8,
          )
          .fromTo(
            accent,
            { autoAlpha: 0, z: -1800, rotation: -12 },
            { autoAlpha: 0.8, z: -120, rotation: 0, duration: 1.7 },
            start + 0.2,
          )
          .to(bg, { z: 420, scale: 1.2, duration: 1.6 }, start + 1.55)
          .to(
            hero,
            {
              z: 750,
              xPercent: direction * 75,
              yPercent: 18,
              autoAlpha: 0,
              duration: 1.2,
              ease: "power1.in",
            },
            start + 2.1,
          )
          .to(foreground, { z: 650, scale: 1.35, autoAlpha: 0, duration: 1.25 }, start + 1.95)
          .to(title, { autoAlpha: 0, y: -35, duration: 0.6 }, start + 2.45)
          .to(
            accent,
            { z: 500, xPercent: -direction * 40, autoAlpha: 0, duration: 1 },
            start + 2.25,
          )
          .to(scene, { autoAlpha: 0, duration: 0.65 }, start + 2.85);
      });
      const fans = el.querySelector<HTMLElement>("[data-fans]")!;
      tl.fromTo(fans, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 12.9)
        .fromTo(
          select("[data-fan-copy]"),
          { scale: 0.45, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 1.3 },
          13.25,
        )
        .fromTo(
          select("[data-fan-card]"),
          { z: -2200, rotationY: -16, autoAlpha: 0 },
          { z: 0, rotationY: 0, autoAlpha: 1, duration: 1.5, stagger: 0.15 },
          13.1,
        )
        .to(
          select("[data-fan-card]"),
          {
            z: 850,
            xPercent: (i: number) => (i - 1) * 150,
            yPercent: (i: number) => (i === 1 ? 120 : -25),
            autoAlpha: 0,
            duration: 1.4,
            stagger: 0.07,
          },
          15.1,
        )
        .to(select("[data-fan-copy]"), { scale: 1.35, autoAlpha: 0, duration: 0.8 }, 15.85)
        .to(fans, { autoAlpha: 0, duration: 0.7 }, 16)
        .fromTo(select("[data-finale]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.9 }, 16.15)
        .fromTo(
          select("[data-final-dragon]"),
          { scale: 0.6, xPercent: 30 },
          { scale: 1, xPercent: 0, duration: 1.8 },
          16.15,
        )
        .fromTo(
          select("[data-final-copy]"),
          { autoAlpha: 0, y: 25 },
          { autoAlpha: 1, y: 0, duration: 0.8 },
          16.6,
        )
        .to({}, { duration: 0.1 }, TOTAL - 0.1);
      // Build each souvenir above its clean plate: portrait, logo, ID, then name.
      tl.fromTo(
        select("[data-fan-portrait]"),
        { autoAlpha: 0, yPercent: 12, z: -140, scale: 0.88 },
        { autoAlpha: 1, yPercent: 0, z: 12, scale: 1, duration: 0.9, stagger: 0.12 },
        13.5,
      )
        .fromTo(
          select("[data-fan-logo]"),
          { autoAlpha: 0, xPercent: -9, scale: 0.75 },
          { autoAlpha: 1, xPercent: 0, scale: 1, duration: 0.55, stagger: 0.12 },
          13.7,
        )
        .fromTo(
          select("[data-fan-number]"),
          { autoAlpha: 0, y: -8 },
          { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.12 },
          13.9,
        )
        .fromTo(
          select("[data-fan-name]"),
          { autoAlpha: 0, yPercent: 10, scale: 0.9 },
          { autoAlpha: 1, yPercent: 0, scale: 1, duration: 0.55, stagger: 0.12 },
          14,
        )
        .to(
          select("[data-fan-portrait]"),
          { z: 45, yPercent: -2.5, duration: 0.95, stagger: 0.08 },
          14.5,
        )
        .to(select("[data-fan-name]"), { z: 65, yPercent: 2, duration: 0.9, stagger: 0.08 }, 14.65)
        .to(
          select("[data-fan-logo]"),
          { z: 28, xPercent: -1.5, duration: 0.9, stagger: 0.08 },
          14.65,
        );
      const refresh = () => {
        if (alive) ScrollTrigger.refresh();
      };
      void document.fonts.ready.then(refresh);
      window.addEventListener("resize", poseRoll);
      return () => {
        alive = false;
        window.removeEventListener("resize", poseRoll);
        timeline.current = null;
        panels.forEach((p) => {
          p.inert = false;
          p.removeAttribute("aria-hidden");
        });
      };
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );
  function go(index: number) {
    menu.current?.close();
    if (reduced) {
      root.current
        ?.querySelectorAll<HTMLElement>("[data-chapter]")
        [index]?.scrollIntoView({ behavior: "instant" });
      return;
    }
    const trigger = timeline.current?.scrollTrigger;
    if (trigger)
      window.scrollTo({
        top: trigger.start + ((trigger.end - trigger.start) * chapters[index].time) / TOTAL,
        behavior: "instant",
      });
  }

  return (
    <div ref={root} className={styles.root} data-og-journey>
      <div ref={stage} className={styles.stage} data-og-stage>
        <header className={styles.header} data-ink-chrome>
          <Link href="/" className={styles.brand}>
            oncemore<span>®</span>
          </Link>
          <span className={styles.edition}>THEY CALL HIM OG / A FAN STORY</span>
          <button
            className={styles.menuButton}
            onClick={() => menu.current?.showModal()}
            aria-label="Open chapters"
          >
            <i aria-hidden="true" />
            <span>Chapters</span>
          </button>
        </header>
        <div className={styles.prologue} data-prologue>
          <span className={styles.eyebrow}>ONCEMORE × THEY CALL HIM OG</span>
          <h1>
            A million fans.
            <br />
            <em>One hidden story.</em>
          </h1>
          <button onClick={() => go(0)} className={styles.begin}>
            Unroll the story <span aria-hidden="true">↙</span>
          </button>
        </div>
        <div className={styles.prologueMark} data-prologue aria-hidden="true">
          <span>物語のはじまり</span>
          <small>THE STORY BEGINS</small>
        </div>
        <section
          className={styles.paper}
          data-cover
          data-chapter
          aria-label="The First Blood cover unlocked by fans"
        >
          <img className={styles.coverDragon} data-cover-dragon src="/og2/dragon.webp" alt="" />
          <div className={styles.coverCopy}>
            <span className={styles.eyebrow}>THE COMIC. UNLOCKED BY YOU.</span>
            <h2>
              THE FIRST
              <br />
              <span>BLOOD.</span>
            </h2>
            <p>A million fans opened this chapter.</p>
            <span className={styles.coverSeal}>
              OG<span>UNLOCKED</span>
            </span>
          </div>
          <figure className={styles.coverArt} data-cover-art>
            <img
              src="/og2/first-blood-cover.jpg"
              alt="The original OG: The First Blood comic cover, with OG behind a katana and two dragons"
              fetchPriority="high"
            />
            <figcaption>THE COVER YOU UNLOCKED ↗</figcaption>
          </figure>
          <span className={styles.paperNote}>KEEP GOING. STEP INSIDE.</span>
        </section>
        {worlds.map((world, index) => (
          <section
            key={world.id}
            className={styles.world + " " + styles[world.id]}
            data-world={world.id}
            data-chapter
            aria-label={world.title}
          >
            <div className={styles.background} data-background>
              <img src={"/og2/" + world.id + "-world.webp"} alt="" />
            </div>
            <div className={styles.worldShade} />
            <div className={styles.accent} data-accent aria-hidden="true">
              {index === 2 ? (
                <img src="/og2/bushido-virtues.webp" alt="" />
              ) : (
                <span>{index === 0 ? "刀" : "弓"}</span>
              )}
            </div>
            <div className={styles.worldCopy} data-title>
              <span className={styles.eyebrow}>{world.label}</span>
              <h2>{world.title}</h2>
              <p>{world.line}</p>
              <span className={styles.gameNote}>ONE WORLD. THREE GAMES.</span>
            </div>
            <div className={styles.hero} data-hero>
              <img src={"/og2/" + world.id + "-hero.webp"} alt={world.alt} />
            </div>
            <div className={styles.foreground} data-foreground aria-hidden="true">
              <img src="/og2/foreground.webp" alt="" />
            </div>
            <span className={styles.marginNumber} aria-hidden="true">
              0{index + 1}
            </span>
          </section>
        ))}
        <section
          className={styles.fans}
          data-fans
          data-chapter
          aria-label="One million fans, under 42 hours"
        >
          <div className={styles.fanSun} aria-hidden="true" />
          <div className={styles.fanCopy} data-fan-copy>
            <span className={styles.eyebrow}>THE FANS WROTE THIS PART.</span>
            <h2>
              1M<span>+</span>
            </h2>
            <p>
              FANS. UNDER <strong>42</strong> HOURS.
            </p>
            <span className={styles.gameNote}>PLAYED. CLAIMED. UNLOCKED.</span>
          </div>
          {[1, 2, 3].map((n) => (
            <LayeredFanCard key={n} index={n} />
          ))}
        </section>
        <section
          className={styles.finale}
          data-finale
          data-chapter
          aria-label="Join OnceMore for the next story"
        >
          <img className={styles.finalDragon} data-final-dragon src="/og2/dragon.webp" alt="" />
          <div className={styles.finalCopy} data-final-copy>
            <span className={styles.eyebrow}>THIS CHAPTER WAS THEIRS.</span>
            <h2>
              THE NEXT
              <br />
              COULD BE <em>YOURS.</em>
            </h2>
            <Link href={{ pathname: "/signup" }} className={styles.join}>
              Join OnceMore <span aria-hidden="true">↗</span>
            </Link>
            <button
              className={styles.replay}
              onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}
            >
              Back to the beginning ↺
            </button>
          </div>
        </section>
        <div className={styles.texture} aria-hidden="true" />
        <div className={styles.roll} data-roll aria-hidden="true">
          <div className={styles.fallbackRoll}>
            <img src="/scroll/japanese-scroll.png" alt="" />
          </div>
          {!reduced && (
            <div className={styles.model}>
              <ScrollModel
                opening={opening}
                invalidateRef={invalidate}
                onReady={modelReady}
                onUnavailable={modelUnavailable}
              />
            </div>
          )}
        </div>
        <footer className={styles.footer} data-ink-chrome>
          <span className={styles.scrollHint}>
            SCROLL TO EXPLORE <span aria-hidden="true">↓</span>
          </span>
          <nav aria-label="Story chapters">
            {chapters.map((chapter, index) => (
              <button
                key={chapter.name}
                data-chapter-nav={index}
                onClick={() => go(index)}
                aria-label={`Go to ${chapter.name}`}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <i />
              </button>
            ))}
          </nav>
          <span ref={status} className={styles.current} aria-live="polite">
            PROLOGUE
          </span>
        </footer>
        <div className={styles.progress} aria-hidden="true" />
      </div>
      <ScrollCloudIntro reduced={reduced} />
      <dialog
        ref={menu}
        className={styles.contents}
        data-lenis-prevent
        aria-labelledby="og-contents-title"
      >
        <div className={styles.contentsHeader}>
          <span className={styles.brand}>oncemore®</span>
          <button onClick={() => menu.current?.close()} aria-label="Close chapters">
            Close ×
          </button>
        </div>
        <span className={styles.eyebrow}>A STORY YOU WALK THROUGH</span>
        <h2 id="og-contents-title">STEP INSIDE.</h2>
        <nav aria-label="All chapters">
          {chapters.map((chapter, index) => (
            <button key={chapter.name} onClick={() => go(index)}>
              <span>0{index + 1}</span>
              {chapter.name}
              <span aria-hidden="true">↗</span>
            </button>
          ))}
        </nav>
      </dialog>
    </div>
  );
}
