import ScrollReveal from "@oncemore-landing-page/ui/components/ScrollReveal";
import Image from "next/image";
import { type ReactNode, type Ref, useEffect, useId, useRef } from "react";

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

export function CaseStudy() {
  const reelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = reelsRef.current;
    if (!row) return;
    const videos = Array.from(row.querySelectorAll("video"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const syncPlayback = () => {
      videos.forEach((video) => {
        if (visible && !document.hidden && !reducedMotion.matches) {
          void video.play().catch(() => undefined);
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
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      reducedMotion.removeEventListener("change", syncPlayback);
      videos.forEach((video) => video.pause());
    };
  }, []);

  return (
    <div className={styles.story}>
      <section
        className={`${styles.chapter} ${styles.hero}`}
        aria-label="OnceMore and Maa Inti Bangaaram"
      >
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Maa Inti Bangaaram / The launch experience</p>
          <Headline hero>{"YOU HAD\nTO BE\nTHERE."}</Headline>
          <Copy hero>
            Samantha had her answers. A million players found out how close theirs came. The MIB
            launch experience is over—here’s what you missed.
          </Copy>
          <a href="#mib-experience" className={styles.textLink}>
            See what you missed <span aria-hidden="true">↓</span>
          </a>
        </div>
        <span className={styles.heroFootnote}>The MIB launch event / Now concluded</span>
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
            Money or time? Samantha had already picked. Fans faced the same fifteen choices and
            found out just how much they thought alike.
          </Copy>
          <Copy>
            Some answers lined up. Others didn’t. Every choice brought them closer to their match
            score. What would yours have been?
          </Copy>
          <p className={styles.artifactNote}>Fifteen choices. How many would you match?</p>
        </div>
      </section>

      <section className={`${styles.chapter} ${styles.rewardsChapter}`} aria-label="The rewards">
        <div className={styles.chapterCopy}>
          <p className={styles.eyebrow}>02 / Something worth playing for</p>
          <Headline>{"MOVIE TICKETS.\nUP FOR GRABS."}</Headline>
          <Copy>
            Fans who matched Samantha’s answers had a chance to win special rewards, including movie
            tickets. That little “we picked the same one” moment came with something extra to play
            for.
          </Copy>
          <span className={styles.smallPrint}>
            A chance to win. One more reason to wish you’d played.
          </span>
        </div>
      </section>

      <section
        className={`${styles.chapter} ${styles.reachChapter}`}
        aria-label="One million players"
      >
        <p className={styles.eyebrow}>03 / A million joined in</p>
        <Headline className={styles.metric}>{"1 MILLION"}</Headline>
        <Headline className={styles.metricCaption}>{"PLAYERS.\nWERE YOU THERE?"}</Headline>
        <Copy>
          One million players were part of the MIB launch. They got the match scores, the cards and
          the reveals. If this is your first look, you missed a good one.
        </Copy>
      </section>

      <section
        id="mib-title"
        className={styles.titlePause}
        aria-label="Maa Inti Bangaaram, an experience by OnceMore"
      >
        <div className={styles.staticTitle}>
          <svg viewBox="225 575 990 300" role="img" aria-label="Maa Inti Bangaaram">
            <image href="/maa-inti-bangaaram/v2/title-card.jpg" width="1440" height="1440" />
          </svg>
          <p className={styles.eyebrow}>For the fans. With OnceMore.</p>
        </div>
      </section>
      <div data-shot-end />

      <section
        id="mib-results"
        className={`${styles.chapter} ${styles.personalChapter}`}
        aria-label="Personal fan cards"
      >
        <div className={styles.chapterCopy}>
          <p className={styles.eyebrow}>04 / A little piece of MIB</p>
          <Headline>{"THEIR VERY\nOWN MIB."}</Headline>
          <Copy>
            Fans left with their Samantha match score, a personality type and a card made from their
            answers. The cards here belonged to real players. What would yours have said?
          </Copy>
          <p className={styles.artifactNote}>Their answers. Their personality. Their card.</p>
        </div>
        <div className={styles.cardGallery}>
          <figure className={styles.matchCards}>
            <Image
              className={styles.cardBack}
              src={`${ASSETS}/match-67.webp`}
              alt="Example gold MIB fan card with a 67 percent Samantha match."
              width={501}
              height={680}
              unoptimized
            />
            <Image
              className={styles.cardFront}
              src={`${ASSETS}/match-71.webp`}
              alt="A personalised MIB match card showing the fan alongside Samantha, with a 71 percent match."
              width={501}
              height={680}
              unoptimized
            />
            <figcaption>A Samantha match score they could share.</figcaption>
          </figure>
          <figure className={styles.personalityCard}>
            <Image
              src={`${ASSETS}/personality.webp`}
              alt="Harika’s personal result: Rising Legend. You bring energy into every room."
              width={326}
              height={680}
              unoptimized
            />
            <figcaption>Harika found her Rising Legend side.</figcaption>
          </figure>
        </div>
      </section>

      <section
        className={`${styles.chapter} ${styles.editsChapter}`}
        aria-label="Unlocked fan edit"
      >
        <div className={styles.editIntro}>
          <p className={styles.eyebrow}>05 / A reveal with their name on it</p>
          <Headline>{"THEY FINISHED.\nTHEY UNLOCKED."}</Headline>
          <Copy>
            Finishing the quiz unlocked a special reel-style video for every player. This is
            Surya’s. His name, his reveal, his MIB moment. You could’ve had one too.
          </Copy>
          <p className={styles.artifactNote}>Surya’s reveal. This could’ve been your moment.</p>
        </div>
        <div
          ref={reelsRef}
          className={styles.reels}
          role="region"
          aria-label="Surya’s unlocked fan edit"
        >
          <figure className={styles.reel}>
            <video
              src={`${ASSETS}/fan-edit-2.mp4`}
              poster={`${ASSETS}/fan-edit-2.webp`}
              aria-label="Watch Surya’s unlocked fan edit"
              controls
              muted
              loop
              playsInline
              preload="none"
            />
            <figcaption>
              <span>Surya</span>
              <span>His MIB moment ↗</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section
        className={`${styles.chapter} ${styles.closing}`}
        aria-label="Fan experiences by OnceMore"
      >
        <div className={styles.closingCopy}>
          <p className={styles.eyebrow}>For the next “you had to be there.”</p>
          <Headline>{"DON’T MISS\nTHE NEXT ONE."}</Headline>
          <Copy>
            The MIB event is over. Your next fan moment is still ahead. Join OnceMore to keep up
            with future events and experiences for the films, shows and stars you love.
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
