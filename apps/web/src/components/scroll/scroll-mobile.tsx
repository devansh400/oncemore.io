"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { scrollChapters } from "./scroll-copy";
import { clips } from "../katana/story-content";
import { ScrollCloudIntro } from "./scroll-cloud-intro";
import styles from "./scroll-mobile.module.css";
import type { MobileRollState } from "./scroll-mobile-roll";

const asset = "/projects/og/";
const MobileScrollRoll = dynamic(() => import("./scroll-mobile-roll"), { ssr: false });

function Milestone() {
  return (
    <div className={styles.milestone}>
      <span>UNLOCKED BY THE FANS.</span>
      <strong>
        1M<sup>+</sup>
      </strong>
      <span>VERIFIED FANS</span>
      <div className={styles.hours}>
        <b>
          <small>UNDER</small>42
        </b>
        <span>
          HOURS.
          <br />
          ONE POSTER. PIXEL BY PIXEL.
        </span>
      </div>
    </div>
  );
}

export function MobileScrollExperience() {
  const root = useRef<HTMLElement>(null);
  const opening = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDialogElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const bottomRoll = useRef<HTMLDivElement>(null);
  const rollState = useRef<MobileRollState>({ progress: 0, distance: 0 });
  const invalidateRoll = useRef<(() => void) | null>(null);
  const rollReady = useCallback(() => {
    if (bottomRoll.current) bottomRoll.current.dataset.modelReady = "true";
  }, []);
  const rollUnavailable = useCallback(() => {
    if (bottomRoll.current) bottomRoll.current.dataset.modelReady = "false";
  }, []);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const element = root.current;
      if (!element || !stage.current || !sheet.current) return;
      const paper = sheet.current;
      const intro = element.querySelector<HTMLElement>("[data-opening-copy]")!;
      const chapters = [...element.querySelectorAll<HTMLElement>("[data-mobile-chapter]")];
      const videos = [...element.querySelectorAll<HTMLVideoElement>("video")];
      const wall = element.querySelector<HTMLElement>("[data-wall]")!;
      const roller = element.querySelector<HTMLElement>("[data-bottom-roll]")!;
      const cover = element.querySelector<HTMLElement>("[data-roll-cover]")!;
      let timeline: gsap.core.Timeline | undefined;
      let wallHeight = wall.clientHeight;
      const zoomScale = () => stage.current!.clientWidth / (wall.clientWidth - 14);
      const measureWall = () => {
        // Read the responsive CSS height, not the enlarged end-of-opening height.
        const previousHeight = wall.style.height;
        wall.style.removeProperty("height");
        wallHeight = wall.clientHeight;
        wall.style.height = previousHeight;
      };
      const updateRoll = () => {
        if (timeline) rollState.current.progress = Math.min(1, timeline.time());
        const progress = rollState.current.progress;
        const distance = progress * (paper.clientHeight - 24);
        rollState.current.distance = distance;
        roller.style.transform = `translate3d(0, ${distance}px, 0)`;
        // The paper ends behind the cylinder's centre, so it cannot paint a
        // straight cream seam over the front of the turning cover.
        paper.style.clipPath = `inset(0 0 ${Math.max(0, paper.clientHeight - distance - 29)}px 0)`;
        cover.style.visibility = progress < 0.12 ? "visible" : "hidden";
        invalidateRoll.current?.();
      };

      if (!reduced) {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: opening.current,
            pin: stage.current,
            start: "top top",
            end: () => `+=${stage.current!.clientHeight * 1.35}`,
            scrub: 0.45,
            invalidateOnRefresh: true,
            onRefreshInit: measureWall,
            onRefresh: updateRoll,
          },
          onUpdate: () => {
            updateRoll();
            paper.inert = tl.time() < 0.85;
            paper.setAttribute("aria-hidden", String(paper.inert));
            intro.setAttribute("aria-hidden", String(tl.time() > 0.3));
            if (label.current && window.scrollY <= (tl.scrollTrigger?.end ?? 0) + 1)
              label.current.textContent = "THE OG FAN EVENT";
          },
        });
        tl.fromTo(
          wall,
          { y: () => stage.current!.clientHeight * 0.16 },
          { y: 0, duration: 0.35 },
          0,
        )
          .fromTo(rollState.current, { progress: 0 }, { progress: 1, duration: 1 }, 0)
          .to(intro, { autoAlpha: 0, y: -18, duration: 0.25 }, 0)
          .fromTo(
            wall,
            { scale: 1, height: () => wallHeight },
            {
              scale: zoomScale,
              height: () => (stage.current!.clientHeight + 88) / zoomScale(),
              y: () => -wall.offsetTop - 44,
              duration: 0.55,
              ease: "power1.inOut",
              immediateRender: false,
            },
            1,
          )
          .to(`.${styles.leader}`, { autoAlpha: 0, duration: 0.25 }, 1);
        timeline = tl;
        updateRoll();
      } else {
        gsap.set(intro, { autoAlpha: 0 });
        gsap.set(roller, { y: 0, top: "calc(100% - 24px)" });
        gsap.set(cover, { autoAlpha: 0 });
        gsap.set(paper, { clipPath: "inset(0)" });
        paper.inert = false;
        paper.removeAttribute("aria-hidden");
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const chapter = entry.target as HTMLElement;
            const video = chapter.querySelector("video");
            if (entry.isIntersecting) {
              if (label.current) label.current.textContent = chapter.dataset.chapterName!;
              if (video && !reduced) void video.play().catch(() => {});
            } else video?.pause();
          });
        },
        { rootMargin: "-18% 0px -25% 0px", threshold: 0 },
      );
      chapters.forEach((chapter) => observer.observe(chapter));
      const pause = () => {
        if (document.hidden) videos.forEach((video) => video.pause());
      };
      document.addEventListener("visibilitychange", pause);
      return () => {
        observer.disconnect();
        document.removeEventListener("visibilitychange", pause);
        videos.forEach((video) => video.pause());
      };
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  function navigate(index: number) {
    menu.current?.close();
    if (index < 0) {
      if (label.current) label.current.textContent = "THE OG FAN EVENT";
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      return;
    }
    root.current
      ?.querySelector<HTMLElement>(`[data-mobile-chapter="${index}"]`)
      ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }

  return (
    <section
      ref={root}
      className={styles.root}
      aria-label="The OG wall scroll"
      data-lenis-prevent
      data-reduced={reduced}
    >
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          oncemore<sup>®</sup>
        </Link>
        <button onClick={() => menu.current?.showModal()} aria-label="Open chapter contents">
          <i aria-hidden="true" /> Contents
        </button>
      </header>

      <div ref={opening} className={styles.opening}>
        <div ref={stage} className={styles.stage}>
          <div className={styles.wall} data-wall>
            <svg className={styles.cord} viewBox="0 0 300 70" fill="none" aria-hidden="true">
              <path d="M12 67 150 5 288 67" stroke="#8a7856" strokeWidth="1.5" />
              <circle cx="150" cy="5" r="3" fill="#5b4935" />
            </svg>
            <div className={styles.topRail} aria-hidden="true" />
            <div ref={sheet} className={styles.sheet}>
              <div className={styles.leader}>
                <span lang="ja">物語のはじまり</span>
                <small>BEFORE THE FIRST SHOW</small>
              </div>
              <div className={styles.coverTitle}>
                <span className={styles.eyebrow}>THE FAN EVENT YOU MISSED</span>
                <h1>
                  They call him <em>OG.</em>
                </h1>
                <p>Three games. One story unlocked together.</p>
              </div>
              <Milestone />
              <span className={styles.coverFoot}>PLAYED BY FANS. UNLOCKED TOGETHER.</span>
            </div>
            <div ref={bottomRoll} className={styles.bottomRoll} data-bottom-roll aria-hidden="true">
              <div className={styles.rollBody} />
              <div className={styles.rollCover} data-roll-cover>
                <span lang="ja">もう一度</span>
              </div>
              {!reduced && (
                <div className={styles.rollVisual}>
                  <MobileScrollRoll
                    state={rollState}
                    invalidateRef={invalidateRoll}
                    onReady={rollReady}
                    onUnavailable={rollUnavailable}
                  />
                </div>
              )}
            </div>
          </div>
          <div className={styles.openingCopy} data-opening-copy>
            <span className={styles.eyebrow}>THEY CALL HIM OG / THE FAN EVENT</span>
            <h2>
              OG was coming.
              <br />
              Fans got there first.
            </h2>
            <p>
              A million fans. Under 42 hours.
              <br />
              Here’s what you missed.
            </p>
            <span className={styles.swipe}>
              SCROLL TO UNFURL <span aria-hidden="true">↓</span>
            </span>
          </div>
        </div>
      </div>

      <div className={styles.story}>
        <div className={styles.paperLeader}>
          <span lang="ja">巻之一</span>
          <span>
            THE OG FAN EVENT
            <br />A STORY PLAYED TOGETHER
          </span>
          <i />
        </div>
        {scrollChapters.map((chapter, index) => (
          <article
            key={chapter.name}
            className={styles.chapter}
            data-mobile-chapter={index}
            data-chapter-name={`${String(index + 1).padStart(2, "0")} / ${chapter.name}`}
          >
            <div className={styles.copy}>
              <span className={styles.eyebrow}>{chapter.label}</span>
              <h2>
                {chapter.title.split("\n").map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h2>
              <p>{chapter.body}</p>
            </div>
            {index === 0 && (
              <figure className={styles.media}>
                <div className={styles.mount}>
                  <img
                    src={asset + "poster01.jpg"}
                    width="2730"
                    height="4096"
                    alt="OG with a katana in the rain"
                    loading="lazy"
                  />
                </div>
                <figcaption>THE COUNTDOWN WAS AN EXPERIENCE OF ITS OWN.</figcaption>
              </figure>
            )}
            {index >= 1 && index <= 3 && (
              <figure className={styles.media}>
                <div className={`${styles.mount} ${styles.videoMount}`}>
                  <video
                    src={asset + clips[index - 1]}
                    width="1920"
                    height="3413"
                    muted
                    loop
                    playsInline
                    controls
                    preload="metadata"
                    aria-label={`${chapter.name} gameplay`}
                  />
                </div>
                <figcaption>
                  0{index} / {chapter.name.toUpperCase()}
                  <br />
                  PLAYED BEFORE THE FIRST SHOW
                </figcaption>
              </figure>
            )}
            {index === 4 && (
              <figure className={styles.cardFigure}>
                <div className={styles.cards}>
                  {[1, 2, 3].map((n) => (
                    <div key={n} className={styles.mount}>
                      <img
                        src={`${asset}og_card_${n}.png`}
                        width="339"
                        height="589"
                        alt={`Personalised OG fan card ${n}`}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
                <figcaption>THEIR NAME. THEIR CODE. THEIR PIECE OF OG.</figcaption>
              </figure>
            )}
            {index === 5 && (
              <div className={styles.result}>
                <Milestone />
              </div>
            )}
            {index === 6 && (
              <>
                <figure className={styles.media}>
                  <div className={styles.mount}>
                    <img
                      src={asset + "event/first-blood-poster.webp"}
                      width="833"
                      height="1466"
                      alt="OG: The First Blood, the comic fans unlocked together"
                      loading="lazy"
                    />
                  </div>
                  <figcaption>
                    FANS UNLOCKED THE COMIC.
                    <br />
                    THEN READ ITS OPENING PAGES.
                  </figcaption>
                </figure>
                <div className={styles.join}>
                  <a href="/signup">
                    Join OnceMore <span aria-hidden="true">↗</span>
                  </a>
                  <button onClick={() => navigate(-1)}>
                    See it all again <span aria-hidden="true">↑</span>
                  </button>
                </div>
              </>
            )}
            <div className={styles.chapterEnd}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <i />
              <span>{chapter.name}</span>
            </div>
          </article>
        ))}
        <footer className={styles.colophon}>
          <span lang="ja">もう一度</span>
          <p>BE THERE FOR WHAT’S NEXT.</p>
          <Link href="/">oncemore®</Link>
        </footer>
        <div className={styles.endRail} aria-hidden="true" />
      </div>
      <div className={styles.readingLabel} aria-hidden="true">
        <span ref={label}>THE OG FAN EVENT</span>
        <span>↓</span>
      </div>

      <dialog
        ref={menu}
        className={styles.contents}
        data-lenis-prevent
        aria-labelledby="mobile-scroll-contents-title"
      >
        <div className={styles.menuTop}>
          <span className={styles.brand}>oncemore®</span>
          <button onClick={() => menu.current?.close()}>Close ×</button>
        </div>
        <span className={styles.eyebrow}>THE OG FAN EVENT</span>
        <h2 id="mobile-scroll-contents-title">
          You had to
          <br />
          <em>be there.</em>
        </h2>
        <nav aria-label="Scroll chapters">
          <button onClick={() => navigate(-1)}>
            <span>00</span>The event<span aria-hidden="true">↑</span>
          </button>
          {scrollChapters.map((chapter, index) => (
            <button key={chapter.name} onClick={() => navigate(index)}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {chapter.name}
              <span aria-hidden="true">↓</span>
            </button>
          ))}
        </nav>
      </dialog>
      <ScrollCloudIntro reduced={reduced} />
    </section>
  );
}
