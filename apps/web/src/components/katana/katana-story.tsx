"use client";

import ScrollReveal from "@oncemore-landing-page/ui/components/ScrollReveal";
import DecayCard from "@oncemore-landing-page/ui/components/DecayCard";
import "@fontsource/anton/latin-400.css";
import "@fontsource/barlow-condensed/latin-400.css";
import { useEffect, useRef } from "react";
import type { KatanaFrameSink } from "./katana-frame";

import styles from "./katana-story.module.css";

const asset = "/projects/og/";
import { chapters, clips } from "./story-content";
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (n: number) => {
  const t = clamp(n);
  return t * t * (3 - 2 * t);
};

export function KatanaStory({
  frameSink,
  reduced,
}: {
  frameSink: KatanaFrameSink;
  reduced: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);

  const videos = useRef(clips.map(() => ({ current: null as HTMLVideoElement | null })));
  const controllers = useRef(
    chapters.map(() => ({ current: null as ((progress: number) => void) | null })),
  );
  const bodyControllers = useRef(
    chapters.map(() => ({ current: null as ((progress: number) => void) | null })),
  );
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const panels = Array.from(element.querySelectorAll<HTMLElement>("[data-chapter]"));
    let lastActive = -1;
    let playingGame = -1;
    const gameCards = Array.from(element.querySelectorAll<HTMLElement>("[data-game]"));
    const gameLabel = element.querySelector<HTMLElement>("[data-game-label]")!;
    frameSink.current = ({ progress: p }) => {
      // Seven equal scroll beats: intro, three games, cards, result, comic.
      const beat = p * 7;
      const active = beat < 1 ? 0 : beat < 4 ? 1 : Math.min(4, Math.floor(beat) - 2);
      const local =
        active === 1 ? (beat - 1) / 3 : active === 0 ? beat : Math.min(1, beat - active - 2);
      const textProgress = active === 1 ? local * 3 : local;
      const reveal = reduced
        ? 1
        : active === 0
          ? clamp(0.25 + local * 2)
          : clamp(textProgress / 0.48);
      const fade = reduced || active === 4 ? 1 : 1 - ease((local - 0.85) / 0.15);
      if (active !== lastActive) {
        panels.forEach((panel, i) => {
          panel.style.visibility = i === active ? "visible" : "hidden";
          panel.inert = i !== active;
          panel.setAttribute("aria-hidden", String(i !== active));
        });
        lastActive = active;
      }
      panels[active]!.querySelector<HTMLElement>(`.${styles.copy}`)!.style.opacity = String(fade);
      controllers.current[active]!.current?.(reveal);
      bodyControllers.current[active]!.current?.(reduced ? 1 : clamp((textProgress - 0.06) / 0.5));
      element.dataset.chapter = String(active);
      element.dataset.progress = p.toFixed(5);
      const gameBeat = Math.max(0, Math.min(3, beat - 1));
      const gameIndex = Math.min(2, Math.floor(gameBeat));
      const blend = gameIndex === 2 ? 0 : ease((gameBeat - gameIndex - 0.72) / 0.28);
      const position = gameIndex + blend;
      const front = Math.min(2, Math.round(position));
      gameCards.forEach((card, index) => {
        const distance = index - position;
        const depth = Math.min(1, Math.abs(distance));
        card.style.transform = reduced
          ? "none"
          : `translate3d(${distance * 26}px,${depth * 18}px,0) rotate(${distance * 4}deg) scale(${1 - depth * 0.1})`;
        card.style.opacity = String(reduced ? Number(index === front) : 1 - depth * 0.68);
        card.style.zIndex = String(10 - Math.round(Math.abs(distance) * 3));
        card.setAttribute("aria-hidden", String(index !== front));
      });
      gameLabel.textContent = `0${front + 1} / ${["Katana", "Archery", "Bushido"][front]}`;
      const nextPlaying = active === 1 && !reduced ? front : -1;
      if (nextPlaying !== playingGame) {
        playingGame = nextPlaying;
        videos.current.forEach((ref, index) => {
          if (index === nextPlaying) void ref.current?.play().catch(() => {});
          else ref.current?.pause();
        });
      }
    };
    return () => {
      frameSink.current = null;
      videos.current.forEach((ref) => ref.current?.pause());
    };
  }, [frameSink, reduced]);
  return (
    <div ref={root} className={styles.story}>
      {chapters.map((c, i) => (
        <section
          key={c.label}
          data-chapter={i}
          className={`${styles.panel} ${c.side === "right" ? styles.reverse : ""}`}
          aria-label={c.title}
        >
          <p className={styles.label}>{c.label}</p>
          <div className={styles.copy}>
            <ScrollReveal
              as={i === 0 ? "h1" : "h2"}
              progressController={controllers.current[i]}
              scrollContainerRef={undefined}
              baseRotation={0}
              containerClassName={styles.title}
              textClassName={styles.titleText}
            >
              {c.title}
            </ScrollReveal>
            <ScrollReveal
              as="p"
              progressController={bodyControllers.current[i]}
              scrollContainerRef={undefined}
              baseRotation={0}
              containerClassName={styles.body}
              textClassName={styles.bodyText}
            >
              {c.body}
            </ScrollReveal>
          </div>
          <div className={styles.media}>
            {i === 0 && (
              <div className={styles.poster} role="img" aria-label="OG with a katana in the rain">
                <DecayCard
                  intensity={0.1}
                  travel={10}
                  fit="contain"
                  image={asset + "poster01.jpg"}
                  width="100%"
                  height="100%"
                />
              </div>
            )}
            {i === 1 && (
              <div className={styles.games}>
                <div className={styles.gameDeck}>
                  {clips.map((clip, index) => (
                    <div
                      key={clip}
                      data-game={index}
                      className={styles.gameCard}
                      aria-label={`${["Katana", "Archery", "Bushido"][index]} gameplay`}
                    >
                      <DecayCard
                        intensity={0.1}
                        travel={10}
                        fit="contain"
                        image=""
                        video={asset + clip}
                        videoRef={videos.current[index]}
                        width="100%"
                        height="100%"
                      />
                    </div>
                  ))}
                </div>
                <p className={styles.gameLabel} data-game-label>
                  01 / Katana
                </p>
              </div>
            )}
            {i === 2 && (
              <div className={styles.cards}>
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className={styles.fanCard}
                    role="img"
                    aria-label={`Personalised OG fan card ${n}`}
                  >
                    <DecayCard
                      intensity={0.1}
                      travel={10}
                      fit="contain"
                      image={`${asset}og_card_${n}.png`}
                      width="100%"
                      height="100%"
                    />
                  </div>
                ))}
              </div>
            )}
            {i === 3 && (
              <div className={styles.metric}>
                <strong>1M+</strong>
                <span>VERIFIED FANS</span>
                <b>42H</b>
              </div>
            )}
            {i === 4 && (
              <div className={styles.comic}>
                <a
                  className={styles.comicArtwork}
                  href="https://oncemore.io/experience/?card=1"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Enter the original OG experience"
                >
                  <DecayCard
                    intensity={0.1}
                    travel={10}
                    fit="contain"
                    image={asset + "og-first-blood-poster.png"}
                    width="100%"
                    height="100%"
                  />
                  <span className={styles.comicLink}>Enter the original experience ↗</span>
                </a>
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
