"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { clips } from "../katana/story-content";
import { scrollChapters } from "./scroll-copy";
import { PaperMount } from "./paper-mount";
import {
  scrollPose,
  TOTAL_DURATION,
  OPENING_DURATION,
  COVER_START,
  PAPER_LEADER_WIDTH,
} from "./scroll-geometry";
import { ScrollCloudIntro } from "./scroll-cloud-intro";
import styles from "./scroll-experience.module.css";

const ScrollModel = dynamic(() => import("./scroll-model"), { ssr: false });
const names = ["The event", ...scrollChapters.map((chapter) => chapter.name)];
const glyphs = ["序", "刀", "弓", "道", "名", "衆", "始"];
const asset = "/projects/og/";

function FanMilestone({ className = "" }: { className?: string }) {
  return (
    <div className={`${styles.metric} ${className}`}>
      <span className={styles.metricKicker}>THE FANS</span>
      <strong>
        1M<span>+</span>
      </strong>
      <span className={styles.metricLabel}>VERIFIED FANS</span>
      <div className={styles.hours}>
        <b>
          <small>UNDER</small>42
        </b>
        <span>HOURS.</span>
      </div>
    </div>
  );
}

export function ScrollExperience() {
  const root = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDialogElement>(null);
  const currentLabel = useRef<HTMLSpanElement>(null);
  const animation = useRef<gsap.core.Timeline | null>(null);
  const opening = useRef({ time: 0 });
  const invalidateModel = useRef<(() => void) | null>(null);
  const fallbackRoll = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const modelReady = useCallback(() => {
    if (root.current) root.current.dataset.modelReady = "true";
  }, []);
  const modelUnavailable = useCallback(() => {
    if (root.current) root.current.dataset.modelReady = "false";
  }, []);

  useGSAP(
    () => {
      const element = root.current,
        stage = scene.current,
        strip = track.current;
      if (!element || !stage || !strip) return;
      const panels = Array.from(element.querySelectorAll<HTMLElement>("[data-panel]"));
      const buttons = Array.from(element.querySelectorAll<HTMLButtonElement>("[data-nav]"));
      const videos = Array.from(element.querySelectorAll<HTMLVideoElement>("video"));
      if (reduced) {
        panels.forEach((panel) => {
          panel.inert = false;
          panel.removeAttribute("aria-hidden");
        });
        buttons.forEach((button) => button.removeAttribute("aria-current"));
        return;
      }
      let previous = -2,
        alive = true;
      const arrivingScroll = stage.querySelector<HTMLElement>("[data-scroll-reveal]");
      if (arrivingScroll)
        gsap.fromTo(
          arrivingScroll,
          { scale: 0.965, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, delay: 0.9, duration: 1.7, ease: "power2.out" },
        );
      let scrollTimeline: gsap.core.Timeline | undefined;
      const chapterTravel = () => stage.clientWidth * (names.length - 1);
      const travel = () => chapterTravel() + PAPER_LEADER_WIDTH;
      const setStripX = gsap.quickSetter(strip, "x", "px");
      const updateOpening = () => {
        // Refresh can reset tween targets before restoring the playhead.
        // Derive the sheet pose from that playhead so a resized cover hold
        // cannot fall back to the initial blank leader position.
        if (scrollTimeline)
          opening.current.time = Math.min(OPENING_DURATION, scrollTimeline.time());
        const { width, height } = stage.getBoundingClientRect();
        const pose = scrollPose(opening.current.time, width, height);
        element.style.setProperty("--viewport", `${width}px`);
        element.style.setProperty("--leader-width", `${PAPER_LEADER_WIDTH}px`);
        element.style.setProperty("--paper-height", `${pose.paperHeight}px`);
        element.style.setProperty("--paper-right", `${pose.paperRight}px`);
        element.style.setProperty("--paper-edge", `${Math.max(0, pose.edge)}px`);
        element.style.setProperty("--unroll", String(pose.unroll));
        element.style.setProperty("--curl-x", `${pose.edge}px`);
        element.style.setProperty("--curl-width", `${pose.radius}px`);
        // The leader travels with the opening sheet and clears the viewport.
        // Only the illustrated cover holds once the roll has finished opening.
        if (!scrollTimeline || scrollTimeline.time() <= COVER_START) {
          setStripX(pose.stripRight - (width * names.length + PAPER_LEADER_WIDTH));
        }
        if (fallbackRoll.current) {
          fallbackRoll.current.style.left = `${pose.x}px`;
          fallbackRoll.current.style.transform = `translateX(-50%) scaleX(${pose.radius / pose.initialRadius})`;
        }
        invalidateModel.current?.();
      };
      updateOpening();
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: element,
          start: "top top",
          end: () => `+=${stage.clientHeight * 2 + travel() * 1.15}`,
          pin: stage,
          scrub: 0.9,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: updateOpening,
          onUpdate: (self) => element.style.setProperty("--progress", String(self.progress)),
        },
        onUpdate: () => {
          const time = tl.time(),
            position = Math.max(0, time - COVER_START);
          if (time <= COVER_START) updateOpening();
          const active = time < OPENING_DURATION ? -1 : Math.min(7, Math.round(position));
          element.style.setProperty("--journey", String(position / 7));
          panels.forEach((panel, i) => {
            panel.style.setProperty("--drift", `${(i - position) * 38}px`);
            panel.style.setProperty("--focus", String(Math.max(0, 1 - Math.abs(i - position))));
          });
          if (active === previous) return;
          previous = active;
          element.dataset.chapter = String(active);
          if (currentLabel.current)
            currentLabel.current.textContent =
              active < 0
                ? "THE OG FAN EVENT"
                : `${String(active + 1).padStart(2, "0")} / ${names[active]}`;
          panels.forEach((panel, i) => {
            panel.inert = i !== active;
            panel.setAttribute("aria-hidden", String(i !== active));
          });
          buttons.forEach((button) =>
            button.setAttribute("aria-current", String(Number(button.dataset.nav) === active)),
          );
          videos.forEach((video, i) => {
            if (active === i + 2) void video.play().catch(() => {});
            else video.pause();
          });
        },
      });
      tl.fromTo(
        opening.current,
        { time: 0 },
        { time: OPENING_DURATION, duration: OPENING_DURATION, onUpdate: updateOpening },
        0,
      )
        .to(`.${styles.intro}`, { autoAlpha: 0, y: -18, duration: 0.35 }, 0)
        .fromTo(
          strip,
          { x: () => -chapterTravel() },
          { x: 0, duration: 7, immediateRender: false },
          COVER_START,
        );
      scrollTimeline = tl;
      animation.current = tl;
      const refresh = () => {
        if (alive) ScrollTrigger.refresh();
      };
      document.fonts.ready.then(refresh);
      window.addEventListener("resize", updateOpening);
      return () => {
        alive = false;
        window.removeEventListener("resize", updateOpening);
        animation.current = null;
        videos.forEach((video) => video.pause());
      };
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  function navigate(index: number) {
    menu.current?.close();
    if (reduced) {
      root.current?.querySelectorAll<HTMLElement>("[data-panel]")[index]?.scrollIntoView();
      return;
    }
    const trigger = animation.current?.scrollTrigger;
    if (trigger)
      window.scrollTo({
        top:
          trigger.start + ((trigger.end - trigger.start) * (COVER_START + index)) / TOTAL_DURATION,
        behavior: "smooth",
      });
  }

  function step(direction: number) {
    const active = Number(root.current?.dataset.chapter ?? -1);
    navigate(Math.max(0, Math.min(names.length - 1, active + direction)));
  }

  return (
    <section ref={root} className={styles.root} aria-label="The OG scroll">
      <div ref={scene} className={styles.scene}>
        <header className={styles.header}>
          <Link href="/" className={styles.brand}>
            oncemore<span>®</span>
          </Link>
          <span className={styles.edition}>THE OG FAN EVENT</span>
          <button
            className={styles.menuButton}
            onClick={() => menu.current?.showModal()}
            aria-label="Open chapter contents"
          >
            <span className={styles.menuIcon} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>Contents</span>
          </button>
        </header>
        <div className={styles.intro}>
          <span className={styles.eyebrow}>THEY CALL HIM OG / THE FAN EVENT</span>
          <p>
            OG was coming.
            <br />
            Fans got there first.
          </p>
          <span className={styles.introNote}>1M+ fans. Under 42 hours.</span>
          <button className={styles.openButton} onClick={() => navigate(0)}>
            See what you missed <span aria-hidden="true">←</span>
          </button>
        </div>
        <div className={styles.introMark} aria-hidden="true">
          <span lang="ja">物語のはじまり</span>
          <small>THE OG FAN EVENT</small>
        </div>
        <div className={styles.paper}>
          <div className={styles.landscape} aria-hidden="true" />
          <div ref={track} className={styles.track}>
            <div
              className={styles.paperLeader}
              data-paper-leader
              aria-label="Blank textured paper at the start of the handscroll"
            >
              <div className={styles.leaderNote}>
                <span lang="ja">物語のはじまり</span>
                <small>THE OG FAN EVENT</small>
              </div>
            </div>
            <article
              data-panel={0}
              className={`${styles.panel} ${styles.cover}`}
              aria-label="The event"
            >
              <img
                className={styles.coverArt}
                src="/scroll/og-landscape.webp"
                alt="An ink-painted samurai overlooking misty Japanese mountains beneath a red sun"
                fetchPriority="high"
              />
              <div className={styles.coverContent}>
                <div className={styles.coverTitle}>
                  <span className={styles.eyebrow}>THE FAN EVENT</span>
                  <h1>
                    They call
                    <br />
                    him <em>OG.</em>
                  </h1>
                  <p>Three games. One shared mission.</p>
                  <span className={styles.redSeal} lang="ja" aria-label="Once more">
                    もう
                    <br />
                    一度
                  </span>
                </div>
                <FanMilestone className={styles.coverMetric} />
              </div>
              <button className={styles.beginButton} onClick={() => navigate(1)}>
                Unroll the story <span aria-hidden="true">←</span>
              </button>
            </article>
            {scrollChapters.map((chapter, index) => {
              const panelIndex = index + 1;
              return (
                <article
                  key={names[panelIndex]}
                  data-panel={panelIndex}
                  className={`${styles.panel} ${styles.chapter} ${index % 2 ? styles.reverse : ""} ${index >= 1 && index <= 3 ? styles.gameChapter : ""} ${index === 5 ? styles.response : ""} ${index === 6 ? styles.finalChapter : ""}`}
                  aria-label={names[panelIndex]}
                >
                  <span className={styles.chapterGlyph} lang="ja" aria-hidden="true">
                    {glyphs[index]}
                  </span>
                  <div className={styles.copy}>
                    <span className={styles.eyebrow}>{chapter.label}</span>
                    <h2>
                      {chapter.title.split("\n").map((line, n) => (
                        <span key={line}>
                          {n > 0 && <br />}
                          {line}
                        </span>
                      ))}
                    </h2>
                    <p>{chapter.body}</p>
                    <div className={styles.chapterNumber}>
                      <span>{String(panelIndex).padStart(2, "0")}</span>
                      <i />
                      <span>{names[panelIndex]}</span>
                    </div>
                    {index === 6 && (
                      <>
                        <a className={styles.experienceLink} href="/signup">
                          Join OnceMore <span>↗</span>
                        </a>
                        <button
                          className={styles.rewindButton}
                          onClick={() =>
                            window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })
                          }
                        >
                          Replay <span>↗</span>
                        </button>
                      </>
                    )}
                  </div>
                  <div className={styles.media}>
                    {index === 0 && (
                      <figure className={styles.poster}>
                        <PaperMount ratio="2730 / 4096">
                          <img src={asset + "poster01.jpg"} alt="OG with a katana in the rain" />
                        </PaperMount>
                      </figure>
                    )}
                    {index >= 1 && index <= 3 && (
                      <figure className={styles.game}>
                        <PaperMount ratio="1920 / 3413" className={styles.videoFrame}>
                          <video
                            src={asset + clips[index - 1]}
                            muted
                            loop
                            playsInline
                            controls
                            preload="metadata"
                            aria-label={`${names[panelIndex]} gameplay`}
                          />
                        </PaperMount>
                      </figure>
                    )}
                    {index === 4 && (
                      <div className={styles.cards}>
                        {[1, 2, 3].map((n) => (
                          <PaperMount key={n} ratio="339 / 589" className={styles.fanCard}>
                            <img
                              src={`${asset}og_card_${n}.png`}
                              alt={`Personalised OG fan card ${n}`}
                            />
                          </PaperMount>
                        ))}
                      </div>
                    )}
                    {index === 5 && <FanMilestone />}
                    {index === 6 && (
                      <figure className={styles.comic}>
                        <PaperMount ratio="833 / 1466">
                          <img
                            src={asset + "event/first-blood-poster.webp"}
                            alt="OG: The First Blood, the pre-story comic fans unlocked together"
                          />
                        </PaperMount>
                      </figure>
                    )}
                  </div>
                  <span className={styles.chapterMargin} aria-hidden="true">
                    THE OG FAN EVENT
                  </span>
                </article>
              );
            })}
          </div>
        </div>
        <div className={styles.paperEnd} aria-hidden="true" />
        <div ref={fallbackRoll} className={styles.roll} aria-hidden="true">
          <img src="/scroll/japanese-scroll.png" alt="" />
        </div>
        <div className={styles.curlShadow} aria-hidden="true" />
        {!reduced && (
          <div className={styles.model} aria-hidden="true" data-scroll-reveal>
            <ScrollModel
              opening={opening}
              invalidateRef={invalidateModel}
              onReady={modelReady}
              onUnavailable={modelUnavailable}
            />
          </div>
        )}
        <footer className={styles.footer}>
          <span className={styles.footerHint}>
            KEEP SCROLLING <span aria-hidden="true">↓</span>
          </span>
          <nav aria-label="Scroll chapters">
            {names.map((name, index) => (
              <button
                key={name}
                data-nav={index}
                onClick={() => navigate(index)}
                aria-label={`Read ${name}`}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
              </button>
            ))}
          </nav>
          <div className={styles.footerArrows}>
            <button onClick={() => step(-1)} aria-label="Previous chapter">
              →
            </button>
            <button onClick={() => step(1)} aria-label="Next chapter">
              ←
            </button>
          </div>
          <span ref={currentLabel} className={styles.currentLabel} aria-live="polite">
            THE OG FAN EVENT
          </span>
        </footer>
        <div className={styles.progress} aria-hidden="true" />
        <dialog
          ref={menu}
          data-lenis-prevent
          className={styles.contents}
          aria-labelledby="scroll-contents-title"
        >
          <div className={styles.contentsHeader}>
            <span className={styles.brand}>oncemore®</span>
            <button onClick={() => menu.current?.close()} aria-label="Close chapter contents">
              Close <span>×</span>
            </button>
          </div>
          <div className={styles.contentsBody}>
            <div>
              <span className={styles.eyebrow}>THE OG FAN EVENT</span>
              <h2 id="scroll-contents-title">
                You had to
                <br />
                <em>be there.</em>
              </h2>
              <p>Be there next time.</p>
              <span className={styles.redSeal} lang="ja">
                もう
                <br />
                一度
              </span>
            </div>
            <nav aria-label="Contents">
              {names.map((name, index) => (
                <button key={name} data-nav={index} onClick={() => navigate(index)}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{name}</span>
                  <span aria-hidden="true">←</span>
                </button>
              ))}
            </nav>
          </div>
          <span className={styles.contentsFooter}>BE THERE NEXT TIME.</span>
        </dialog>
      </div>
      <ScrollCloudIntro reduced={reduced} />
    </section>
  );
}
