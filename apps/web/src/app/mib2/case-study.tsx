import ScrollReveal from "@oncemore-landing-page/ui/components/ScrollReveal";
import Image from "next/image";
import { type ReactNode, type Ref, useEffect, useId, useRef, useState } from "react";

import styles from "./cinematic.module.css";

const ASSETS = "/maa-inti-bangaaram/case-study/v1";

function Headline({
  children,
  hero = false,
  className = "",
}: {
  children: string;
  hero?: boolean;
  className?: string;
}) {
  return (
    <ScrollReveal
      as={hero ? "h1" : "h2"}
      scrollContainerRef={undefined}
      containerClassName={`${styles.reveal} ${className}`}
      textClassName={hero ? styles.heroHeading : styles.heading}
      effect="rise"
      mode={hero ? "enter" : "scrub"}
      baseRotation={0}
      baseOpacity={0.08}
      blurStrength={3}
      stagger={0.06}
      wordAnimationEnd="top 40%"
    >
      {children}
    </ScrollReveal>
  );
}

// ScrollReveal supplies accessible text via aria-label. Paragraphs cannot be
// named that way, so keep its exact animated markup and expose a hidden copy.
function CopyParagraph({
  children,
  className,
  ref,
  "aria-label": label,
}: {
  children?: ReactNode;
  className?: string;
  ref?: Ref<HTMLParagraphElement>;
  "aria-label"?: string;
}) {
  return (
    <p ref={ref} className={className}>
      <span className={styles.srOnly}>{label}</span>
      {children}
    </p>
  );
}

function Copy({ children, hero = false }: { children: string; hero?: boolean }) {
  return (
    <ScrollReveal
      as={CopyParagraph}
      scrollContainerRef={undefined}
      containerClassName={styles.copyReveal}
      textClassName={styles.bodyCopy}
      mode={hero ? "enter" : "scrub"}
      baseRotation={0}
      baseOpacity={0.15}
      blurStrength={2}
      stagger={0.025}
      wordAnimationEnd="bottom 60%"
    >
      {children}
    </ScrollReveal>
  );
}

export function OnceMoreMark({ className = "" }: { className?: string }) {
  const maskId = useId();
  return (
    <svg viewBox="390 200 290 95" className={className} role="img" aria-label="OnceMore">
      <defs>
        <filter id={maskId} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 2 0 0 -0.6" />
        </filter>
      </defs>
      <image
        href={`${ASSETS}/collaboration.webp`}
        width="1500"
        height="500"
        filter={`url(#${maskId})`}
      />
    </svg>
  );
}

function FanVideo({ matteId }: { matteId: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoId = useId();
  const [muted, setMuted] = useState(false);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setMuted(nextMuted);
    // An explicit sound request can start playback if autoplay was blocked.
    if (!nextMuted && video.paused) void video.play().catch(() => undefined);
  };

  return (
    <>
      <div className={styles.reelSurface}>
        <video
          ref={videoRef}
          id={videoId}
          style={{ filter: `url(#${matteId}) saturate(0.82) brightness(0.94)` }}
          src={`${ASSETS}/fan-edit-surya-hd.mp4`}
          poster={`${ASSETS}/fan-edit-surya-hd.webp`}
          aria-label="Surya’s unlocked fan edit"
          muted={muted}
          loop
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
          tabIndex={-1}
          preload="none"
          onVolumeChange={(event) => setMuted(event.currentTarget.muted)}
        />
      </div>
      <button
        type="button"
        className={styles.soundToggle}
        aria-label={muted ? "Unmute fan video" : "Mute fan video"}
        aria-pressed={!muted}
        aria-controls={videoId}
        onClick={toggleSound}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M11 4 6 8H3v8h3l5 4V4Z" />
          {muted ? (
            <path d="m16 9 6 6m0-6-6 6" />
          ) : (
            <>
              <path d="M15 8a6 6 0 0 1 0 8" />
              <path d="M18 5a10 10 0 0 1 0 14" />
            </>
          )}
        </svg>
        <span aria-hidden="true">Sound {muted ? "off" : "on"}</span>
      </button>
    </>
  );
}

export function CaseStudy() {
  const reelsRef = useRef<HTMLDivElement>(null);
  const reelMatteId = useId();

  useEffect(() => {
    const row = reelsRef.current;
    if (!row) return;
    const videos = Array.from(row.querySelectorAll("video"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let active = true;
    const syncPlayback = () => {
      videos.forEach((video) => {
        if (visible && !document.hidden && !reducedMotion.matches) {
          void video.play().catch((error: unknown) => {
            if (
              active &&
              visible &&
              !document.hidden &&
              !reducedMotion.matches &&
              error instanceof DOMException &&
              error.name === "NotAllowedError"
            ) {
              video.muted = true;
              void video.play().catch(() => undefined);
            }
          });
        } else video.pause();
      });
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        syncPlayback();
      },
      { threshold: 0.15 },
    );
    observer.observe(row);
    document.addEventListener("visibilitychange", syncPlayback);
    reducedMotion.addEventListener("change", syncPlayback);
    return () => {
      active = false;
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      reducedMotion.removeEventListener("change", syncPlayback);
      videos.forEach((video) => video.pause());
    };
  }, []);

  return (
    <div className={styles.story}>
      <svg className={styles.srOnly} aria-hidden="true" focusable="false">
        <defs>
          <filter
            id={reelMatteId}
            x="0"
            y="0"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            {/* Let the scene show through the edit's black ground while
                retaining the fan's face, lettering and bright effects. */}
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0.72 0.9 0.38 0 -0.04"
            />
          </filter>
        </defs>
      </svg>
      <section
        className={`${styles.chapter} ${styles.hero}`}
        aria-label="OnceMore and Maa Inti Bangaaram"
      >
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Maa Inti Bangaaram / Launch event</p>
          <Headline hero>{"YOU HAD\nTO BE\nTHERE."}</Headline>
          <Copy hero>
            The MIB launch is over. A million players matched answers with Samantha. Here’s what you
            missed.
          </Copy>
          <a href="#mib-experience" className={styles.textLink}>
            See what you missed <span aria-hidden="true">↓</span>
          </a>
        </div>
        <span className={styles.heroFootnote}>Launch event ended</span>
      </section>

      <section
        id="mib-experience"
        className={`${styles.chapter} ${styles.quizChapter}`}
        aria-label="The quiz"
      >
        <div className={styles.chapterCopy}>
          <p className={styles.eyebrow}>01 / Think like Samantha?</p>
          <Headline>{"WOULD YOU\nPICK THE SAME?"}</Headline>
          <Copy>
            Fifteen choices. Samantha’s answers. Fans found their match—what would yours have been?
          </Copy>
        </div>
      </section>

      <section className={`${styles.chapter} ${styles.rewardsChapter}`} aria-label="The rewards">
        <div className={styles.chapterCopy}>
          <p className={styles.eyebrow}>02 / The rewards</p>
          <Headline>{"MOVIE TICKETS.\nUP FOR GRABS."}</Headline>
          <Copy>Matching Samantha’s picks gave fans a chance to win movie tickets and more.</Copy>
        </div>
      </section>

      <section
        className={`${styles.chapter} ${styles.reachChapter}`}
        aria-label="One million players"
      >
        <p className={styles.eyebrow}>03 / The fans</p>
        <Headline className={styles.metric}>{"1 MILLION"}</Headline>
        <Headline className={styles.metricCaption}>{"PLAYERS.\nWERE YOU THERE?"}</Headline>
      </section>

      <section
        id="mib-title"
        className={styles.titlePause}
        aria-label="Maa Inti Bangaaram, an experience by OnceMore"
      >
        <div className={styles.staticTitle}>
          <svg viewBox="225 575 990 300" role="img" aria-label="Maa Inti Bangaaram">
            <image href="/mib2/hair-clean-v1/title-card.jpg" width="1440" height="1440" />
          </svg>
          <p className={styles.eyebrow}>A OnceMore fan experience</p>
        </div>
      </section>
      <div data-shot-end />

      <section
        id="mib-results"
        className={`${styles.chapter} ${styles.personalChapter}`}
        aria-label="Personal fan cards"
      >
        <div className={styles.chapterCopy}>
          <p className={styles.eyebrow}>04 / Their piece of MIB</p>
          <Headline>{"THEIR VERY\nOWN MIB."}</Headline>
          <Copy>A Samantha match score. A personality type. A personal fan card. All theirs.</Copy>
        </div>
        <div className={styles.cardGallery}>
          <figure className={styles.matchCards}>
            <div className={`${styles.artifactSurface} ${styles.cardBack}`}>
              <Image
                src={`${ASSETS}/match-67.webp`}
                alt="Example gold MIB fan card with a 67 percent Samantha match."
                width={501}
                height={680}
                unoptimized
              />
            </div>
            <div className={`${styles.artifactSurface} ${styles.cardFront}`}>
              <Image
                src={`${ASSETS}/match-71.webp`}
                alt="A personalised MIB match card showing the fan alongside Samantha, with a 71 percent match."
                width={501}
                height={680}
                unoptimized
              />
            </div>
          </figure>
          <figure className={styles.personalityCard}>
            <div className={`${styles.artifactSurface} ${styles.personalitySurface}`}>
              <Image
                src={`${ASSETS}/personality.webp`}
                alt="Harika’s personal result: Rising Legend. You bring energy into every room."
                width={326}
                height={680}
                unoptimized
              />
            </div>
          </figure>
        </div>
      </section>

      <section
        className={`${styles.chapter} ${styles.editsChapter}`}
        aria-label="Unlocked fan edit"
      >
        <div className={styles.editIntro}>
          <p className={styles.eyebrow}>05 / Their own edit</p>
          <Headline>{"THEY FINISHED.\nTHEY UNLOCKED."}</Headline>
          <Copy>Every player unlocked a special edit. Surya got his. You could’ve too.</Copy>
        </div>
        <div
          ref={reelsRef}
          className={styles.reels}
          role="region"
          aria-label="Surya’s unlocked fan edit"
        >
          <figure className={styles.reel}>
            <FanVideo matteId={reelMatteId} />
          </figure>
        </div>
      </section>

      <section
        className={`${styles.chapter} ${styles.closing}`}
        aria-label="Fan experiences by OnceMore"
      >
        <div className={styles.closingCopy}>
          <p className={styles.eyebrow}>Your next fan moment</p>
          <Headline>{"DON’T MISS\nTHE NEXT ONE."}</Headline>
          <Copy>
            Join OnceMore for future fan experiences. Be there, instead of hearing about it.
          </Copy>
          <a href="/signup" className={styles.primaryLink}>
            Join OnceMore <span aria-hidden="true">↗</span>
          </a>
        </div>
        <footer className={styles.caseFooter}>
          <OnceMoreMark className={styles.footerMark} />
          <span>Be there for the next one.</span>
          <a href="#main" className={styles.textLink}>
            See what you missed <span aria-hidden="true">↑</span>
          </a>
        </footer>
      </section>
    </div>
  );
}
