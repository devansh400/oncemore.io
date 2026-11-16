import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { LayeredFanCard } from "@/components/og2/layered-fan-card";
import styles from "./car.module.css";

export const STORY_MEDIA = "/og-car/story/v1";
const GAME_MEDIA = "/og-car/story/v2";
export function Arrow({ down = false }: { down?: boolean }) {
  return <span aria-hidden="true">{down ? "↓" : "↗"}</span>;
}
export function StoryHeading({ lines, className = "" }: { lines: string[]; className?: string }) {
  return (
    <h2 className={`${styles.storyHeading} ${className}`} data-heading aria-label={lines.join(" ")}>
      {lines.map((line) => (
        <span className={styles.lineMask} aria-hidden="true" key={line}>
          <span data-line>{line}</span>
        </span>
      ))}
    </h2>
  );
}
const games = [
  {
    id: "katana",
    name: "Katana",
    prompt: "Draw the blade.",
    title: "THE FIRST CUT.",
    copy: "Fans picked up the blade and stepped into OG’s world before the film hit cinemas.",
  },
  {
    id: "archery",
    name: "Archery",
    prompt: "Find your focus.",
    title: "EVERY SHOT COUNTS.",
    copy: "A steady hand. A clear target. Another challenge inside OG’s Japan.",
  },
  {
    id: "bushido",
    name: "Bushido",
    prompt: "Follow the warrior’s code.",
    title: "FOLLOW THE CODE.",
    copy: "The way of the warrior. A third challenge, and another way to become part of the world.",
  },
] as const;

function GameShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const manualPlay = useRef(false);
  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;
    const sync = () => {
      if (inView && !document.hidden && !paused && (!media.matches || manualPlay.current))
        void video.play().catch(() => undefined);
      else video.pause();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { threshold: 0.2 },
    );
    observer.observe(container);
    document.addEventListener("visibilitychange", sync);
    media.addEventListener("change", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      media.removeEventListener("change", sync);
      video.pause();
    };
  }, [active, paused]);
  const game = games[active];
  return (
    <div className={styles.gameShowcase} ref={containerRef}>
      <div className={styles.gameTabs} role="group" aria-label="Choose a gameplay preview">
        {games.map((item, index) => (
          <button
            type="button"
            key={item.id}
            aria-pressed={active === index}
            aria-controls="og-game-preview"
            onClick={() => {
              setActive(index);
              setPaused(false);
              manualPlay.current = false;
            }}
          >
            <span className={styles.gameIndex}>0{index + 1}</span>
            <span className={styles.gameChoice}>
              <strong>{item.name}</strong>
              <small>{item.prompt}</small>
            </span>
            <Arrow />
          </button>
        ))}
      </div>
      <div className={styles.gameScreen} id="og-game-preview">
        <video
          key={game.id}
          ref={videoRef}
          src={`${GAME_MEDIA}/${game.id}.mp4`}
          poster={`${GAME_MEDIA}/${game.id}.webp`}
          width={720}
          height={1280}
          muted
          playsInline
          loop
          preload="none"
          aria-label={`${game.name} gameplay from the completed OG fan event`}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
        <div className={styles.gameScreenTop}>
          <span>ONCEMORE / OG</span>
          <span>GAMEPLAY ARCHIVE</span>
        </div>
        <button
          className={styles.videoControl}
          type="button"
          aria-label={playing ? "Pause gameplay preview" : "Play gameplay preview"}
          onClick={() => {
            const video = videoRef.current;
            if (!video) return;
            if (video.paused) {
              manualPlay.current = true;
              setPaused(false);
              void video.play().catch(() => undefined);
            } else {
              setPaused(true);
              video.pause();
            }
          }}
        >
          {playing ? "Ⅱ" : "▷"}
          <span>{playing ? "Pause" : "Play"}</span>
        </button>
      </div>
      <div className={styles.gameCaption} aria-live="polite">
        <h3>{game.title}</h3>
        <p>{game.copy}</p>
      </div>
    </div>
  );
}

export function OGStory() {
  return (
    <div className={styles.afterStory} data-after-story id="og-story">
      <section className={styles.bridge} aria-labelledby="og-bridge-title">
        <p className={styles.eyebrow} data-reveal>
          THE OG FAN EVENT / ONCEMORE
        </p>
        <h2
          id="og-bridge-title"
          className={styles.bridgeHeading}
          data-heading
          aria-label="The world opened. The fans stepped in."
        >
          {["THE WORLD OPENED.", "THE FANS", "STEPPED IN."].map((line) => (
            <span className={styles.lineMask} aria-hidden="true" key={line}>
              <span data-line>{line}</span>
            </span>
          ))}
        </h2>
        <div className={styles.bridgeBottom}>
          <span className={styles.redStamp} data-reveal>
            BUILT FOR THE FANS.
            <br />
            POWERED BY THE FANS.
          </span>
          <p data-reveal>
            Before opening day, OnceMore brought fans inside the world of <em>They Call Him OG.</em>{" "}
            Three games. Their own fan cards. And one mission that needed everyone.
          </p>
        </div>
      </section>
      <section
        className={styles.comicSection}
        id="og-comic"
        aria-label="The comic reveal on OnceMore"
      >
        <div className={styles.sectionTop}>
          <span>01 / THE COLLECTIVE REVEAL</span>
          <span>ONCEMORE × OG</span>
        </div>
        <div className={styles.comicIntro}>
          <StoryHeading lines={["ONE COMMUNITY.", "EVERY PIXEL."]} />
          <div className={styles.comicCopy} data-reveal>
            <p className={styles.lead}>
              OG’s comic made its reveal on <strong>OnceMore.</strong>
            </p>
            <p>
              Every verified signup uncovered another piece of <em>OG: The First Blood.</em> Fans
              came together, pixel by pixel, to unlock his pre-story. Nobody could do it alone.
            </p>
          </div>
        </div>
        <figure className={styles.comicFigure} data-comic-reveal>
          <div className={styles.comicFrame}>
            <Image
              src={`${STORY_MEDIA}/first-blood.webp`}
              alt="OG: The First Blood — the pre-story comic revealed by fans together on OnceMore"
              width={1154}
              height={682}
              sizes="(max-width: 700px) 100vw, 90vw"
              unoptimized
            />
            <div className={styles.pixelGrid} aria-hidden="true">
              {Array.from({ length: 160 }, (_, index) => (
                <span key={index} data-pixel />
              ))}
            </div>
            <div className={styles.comicCorner} aria-hidden="true">
              OG / THE FIRST BLOOD
            </div>
          </div>
          <figcaption>
            <span>THE REVEAL, REPLAYED AS YOU SCROLL</span>
            <span className={styles.unlocked}>
              <i /> UNLOCKED BY THE FANS
            </span>
          </figcaption>
        </figure>
        <div className={styles.milestones}>
          <div data-reveal>
            <strong>
              1M<span>+</span>
            </strong>
            <span>VERIFIED FANS</span>
          </div>
          <div data-reveal>
            <strong>
              <small>UNDER</small>42<span>H</span>
            </strong>
            <span>TO MAKE IT HAPPEN</span>
          </div>
          <p data-reveal>
            A million individual moments.
            <br />
            One reveal that belonged to everyone.
          </p>
        </div>
      </section>
      <section className={styles.gamesSection} id="og-games" aria-label="The three OG games">
        <div className={styles.sectionTop}>
          <span>02 / ENTER HIS WORLD</span>
          <span>JAPAN. THE OG WAY.</span>
        </div>
        <div className={styles.gamesIntro}>
          <StoryHeading lines={["PICK YOUR", "WAY IN."]} />
          <p data-reveal>
            Katana. Archery. Bushido.
            <br />
            Three ways fans got closer to the legend.
          </p>
        </div>
        <GameShowcase />
        <p className={styles.archiveNote}>
          From the completed OG fan event. Registered fans also had a chance to win rewards,
          including film tickets.
        </p>
      </section>
      <section className={styles.cardsSection} aria-label="Personalised OG fan cards">
        <div className={styles.sectionTop}>
          <span>03 / THEIR PIECE OF THE LEGEND</span>
          <span>A NAME. A FAN CODE. A KEEPSAKE.</span>
        </div>
        <div className={styles.cardsLayout}>
          <figure className={styles.rainPoster} data-reveal>
            <Image
              src={`${STORY_MEDIA}/og-rain.webp`}
              alt="They Call Him OG theatrical poster, with OG standing in the rain"
              width={1200}
              height={1800}
              sizes="(max-width: 700px) 75vw, 35vw"
              unoptimized
            />
            <figcaption>THEY CALL HIM OG / THE WORLD THEY STEPPED INTO</figcaption>
          </figure>
          <div className={styles.cardsContent}>
            <p className={styles.eyebrow} data-reveal>
              MORE THAN A SCORE.
            </p>
            <StoryHeading lines={["HIS WORLD.", "THEIR NAME."]} />
            <p className={styles.cardsCopy} data-reveal>
              They played. They registered. They took home a personalised OG card with their name
              and a unique fan code. A little proof they were there.
            </p>
            <div className={styles.fanCards} data-fan-cards>
              {[1, 2, 3].map((number) => (
                <LayeredFanCard key={number} index={number} />
              ))}
            </div>
            <p className={styles.cardNote}>REAL CARDS. REAL FANS. THEIR OWN OG.</p>
          </div>
        </div>
      </section>
      <section className={styles.closing} aria-label="Join OnceMore for future fan experiences">
        <Image
          className={styles.closingArt}
          src={`${STORY_MEDIA}/og-fire.webp`}
          alt="OG seated in a burning chair"
          width={1920}
          height={1080}
          sizes="100vw"
          unoptimized
        />
        <div className={styles.closingShade} aria-hidden="true" />
        <div className={styles.closingCopy}>
          <p className={styles.eyebrow} data-reveal>
            THIS CHAPTER WAS THEIRS. THE NEXT COULD BE YOURS.
          </p>
          <StoryHeading lines={["BE THERE FOR", "THE NEXT ONE."]} />
          <p data-reveal>
            The OG event is complete. Join OnceMore for the next world worth stepping into.
          </p>
          <a className={styles.primaryLink} href="/signup" data-reveal>
            Join OnceMore <Arrow />
          </a>
        </div>
      </section>
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <span>ONCEMORE × THEY CALL HIM OG</span>
          <a href="#og-top">
            Replay the car reveal <Arrow />
          </a>
        </div>
        <a className={styles.footerBrand} href="/" aria-label="OnceMore home">
          oncemore<span>®</span>
        </a>
        <div className={styles.footerBottom}>
          <span>FANDOM. FULL THROTTLE.</span>
          <span>MADE FOR THE MOMENTS THAT BRING US TOGETHER.</span>
        </div>
      </footer>
    </div>
  );
}
