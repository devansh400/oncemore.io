import {
  brandThemes,
  lookSlugs,
  originalTheme,
  themeAsset,
  themeStyle,
  contrast,
  type BrandTheme,
} from "./brand-themes";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import { BrandMark } from "./brand-mark";
import { ComponentPreview, LogoPlayground, MotionPreview, Palette } from "./brand-interactions";
import "./brand.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--brand-display" });
const body = DM_Sans({ subsets: ["latin"], variable: "--brand-body" });

function SectionHeading({
  number,
  label,
  title,
  children,
}: {
  number: string;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="brand-section-heading">
      <span className="brand-mono">
        {number} / {label}
      </span>
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}

export function BrandBook({ theme = originalTheme }: { theme?: BrandTheme }) {
  const [dark, light, accent] = theme.colours;
  const asset = (file: string) => themeAsset(theme, file);
  const isOriginal = theme.slug === "original";
  return (
    <div
      className={`brand ${display.variable} ${body.variable}`}
      data-look={theme.slug}
      data-scheme={theme.light ? "light" : "dark"}
      style={themeStyle(theme)}
    >
      <header className="brand-header">
        <a className="brand-wordmark" href="#top" aria-label="Oncemore brand home">
          <BrandMark />
          oncemore
        </a>
        <nav aria-label="Brand sections">
          <a href="#identity">Identity</a>
          <a href="#colour">Colour</a>
          <a href="#typography">Type</a>
          <a href="#applications">In the world</a>
        </nav>
        <a className="brand-header-download" href={asset("oncemore-tokens.json")} download>
          Get the tokens <span>↓</span>
        </a>
      </header>
      <section id="top" className="brand-hero">
        <div className="brand-hero-top brand-mono">
          <span>ONCEMORE / BRAND UNIVERSE</span>
          <span>
            {isOriginal ? "EDITION 01 — A NEW HORIZON" : `LOOK STUDY / ${theme.name.toUpperCase()}`}
          </span>
        </div>
        <div className="brand-hero-copy">
          <span className="brand-eyebrow">
            <i /> THE STORY IS ONLY THE BEGINNING
          </span>
          <h1>
            Beyond
            <br />
            the <span>frame.</span>
            <sup>↗</sup>
          </h1>
          <p>
            Stories you don’t just watch.
            <br />
            Worlds you get to be part of.
          </p>
          <a className="brand-text-link" href="#foundation">
            Discover the identity <span>↓</span>
          </a>
        </div>
        <figure className="brand-hero-world">
          <img
            src={asset("floating-worlds.webp")}
            alt="A winding cloud path linking floating worlds beneath an amber eclipse"
            fetchPriority="high"
          />
          <div className="brand-world-caption">
            <span className="brand-mono">
              {isOriginal
                ? "OUR POINT OF DEPARTURE"
                : `${theme.name.toUpperCase()} / FLOATING WORLDS`}
            </span>
            <span>
              {theme.caption[0]}
              <br />
              {theme.caption[1]}
            </span>
            <a href="/floating-worlds" aria-label="Enter Floating Worlds">
              ↗
            </a>
          </div>
        </figure>
        <div className="brand-hero-bottom brand-mono">
          <span>AN IDENTITY BUILT FROM ATMOSPHERE.</span>
          <span>STRATEGY → EXPRESSION → EXPERIENCE</span>
          <span>SCROLL TO EXPLORE ↓</span>
        </div>
      </section>

      <aside className="brand-look-selector" aria-label="Brand look editions">
        <div>
          <span className="brand-mono">SIX ATMOSPHERES. ONE ONCEMORE.</span>
          <p>{isOriginal ? "Explore the identity in a different light." : theme.mood}</p>
        </div>
        <nav aria-label="Choose a brand look">
          {lookSlugs.map((slug) => (
            <a
              key={slug}
              href={`/brand-${slug}`}
              aria-current={theme.slug === slug ? "page" : undefined}
            >
              <i style={{ background: brandThemes[slug].colours[2].hex }} />
              {brandThemes[slug].name}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
      </aside>
      <section id="foundation" className="brand-section brand-foundation">
        <SectionHeading
          number="01"
          label="THE FOUNDATION"
          title="The credits roll. The world stays open."
        >
          Oncemore turns the stories people love into interactive worlds they can step inside. We
          bring the scale of cinema and the intimacy of being part of it.
        </SectionHeading>
        <div className="brand-principles">
          {[
            [
              "01",
              "Wonder, with a way in.",
              "Give people a glimpse of something extraordinary. Then make the next step feel effortless.",
            ],
            [
              "02",
              "Made for belonging.",
              "Fans are participants. Speak to them as people with a place in the story.",
            ],
            [
              "03",
              "A little more human.",
              "Balance epic worlds with warm words, honest interactions, and room to breathe.",
            ],
          ].map(([n, title, text]) => (
            <article key={n}>
              <span className="brand-mono">{n} ↗</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <div className="brand-voice">
          <span className="brand-mono">OUR VOICE</span>
          <strong>Inviting. Imaginative. Assured.</strong>
          <p>
            “Step inside. There’s more to this story.”
            <br />
            <span>Short invitations. Concrete language. Wonder without the grand promises.</span>
          </p>
        </div>
      </section>

      <section id="identity" className="brand-section brand-paper">
        <SectionHeading
          number="02"
          label="THE IDENTITY"
          title="A familiar pull. A new possibility."
        >
          An open orbit around a crescent of light. Inspired by the eclipse above our floating
          worlds, the mark captures the moment a new world comes into view.
        </SectionHeading>
        <LogoPlayground theme={theme} />
        <div className="brand-logo-details">
          <figure className="brand-construction">
            <div className="brand-mark-grid">
              <BrandMark />
            </div>
            <figcaption>
              <span className="brand-mono">THE SYMBOL</span>
              <p>A frame that never quite closes.</p>
            </figcaption>
          </figure>
          <article>
            <span className="brand-mono">GIVE IT SPACE</span>
            <h3>Let the light breathe.</h3>
            <p>
              Keep at least half the symbol’s height clear on every side. Use the full lockup at
              140px or larger, and the symbol alone from 24px.
            </p>
            <p>
              Keep the mark upright, monochrome, and undistorted. Use {light.name} on {dark.name} or{" "}
              {dark.name} on {light.name}. {accent.name} is reserved for the standalone symbol.
            </p>
            <a className="brand-text-link" href={asset("oncemore-mark.svg")} download>
              Download the symbol <span>↓</span>
            </a>
          </article>
          <figure className="brand-avatar">
            <BrandMark />
            <figcaption className="brand-mono">SMALL FORMAT / BIG PRESENCE</figcaption>
          </figure>
        </div>
      </section>

      <section id="colour" className="brand-section">
        <SectionHeading number="03" label="COLOUR & ATMOSPHERE" title={theme.colourTitle}>
          {theme.colourStory}
        </SectionHeading>
        <Palette theme={theme} />
        <div className="brand-colour-guidance">
          <div className="brand-colour-ratio">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div>
            <span className="brand-mono">A STARTING BALANCE</span>
            <p>
              60% {theme.light ? light.name : dark.name} · 25%{" "}
              {theme.light ? dark.name : light.name} · 10% {accent.name} · 5% landscape
            </p>
          </div>
          <div>
            <span className="brand-mono">READABILITY FIRST</span>
            <p>
              {light.name} on {dark.name}: {contrast(light.hex, dark.hex).toFixed(1)}:1. Action
              labels use the higher-contrast foreground. Use the tested pairs for text and controls;
              keep landscape colours decorative.
            </p>
          </div>
        </div>
      </section>

      <section id="typography" className="brand-section brand-paper">
        <SectionHeading number="04" label="TYPOGRAPHY" title="Epic in scale. Human in detail.">
          A new typographic voice, independent of the Floating Worlds page. Expressive shapes give
          us character; a clean reading face keeps every invitation clear.
        </SectionHeading>
        <div className="brand-type-specimen">
          <div>
            <span className="brand-mono">DISPLAY / BRICOLAGE GROTESQUE</span>
            <div className="brand-type-aa">
              Aa<span>↗</span>
            </div>
            <p className="brand-type-alphabet">
              ABCDEFGHIJKLMNOPQRSTUVWXYZ
              <br />
              abcdefghijklmnopqrstuvwxyz
              <br />
              0123456789 &?!
            </p>
          </div>
          <div className="brand-type-story">
            <span className="brand-mono">MAKE ROOM FOR THE UNEXPECTED.</span>
            <h3>
              Your story.
              <br />
              Another
              <br />
              <em>dimension.</em>
            </h3>
            <p>
              Use expressive scale and tight spacing for a single strong thought. Keep headlines in
              sentence case. Never sacrifice clarity for drama.
            </p>
          </div>
        </div>
        <div className="brand-type-bottom">
          <div>
            <span className="brand-mono">READING / DM SANS</span>
            <h3>Come a little closer.</h3>
            <p>
              Every world begins with a story. The best ones make room for you. A warm, direct voice
              makes even the most extraordinary experience feel easy to enter.
            </p>
          </div>
          <div>
            <span className="brand-mono">DETAIL / GEIST MONO</span>
            <div className="brand-mono brand-type-detail">
              WORLD 01 / NOW OPEN
              <br />
              18.5204° N · 73.8567° E<br />
              PRESS PLAY ON POSSIBILITY ↗
            </div>
          </div>
        </div>
        <div className="brand-scale">
          {[
            ["Display", "72–144", "Bricolage / 500"],
            ["Heading", "40–64", "Bricolage / 500"],
            ["Title", "24–32", "Bricolage / 500"],
            ["Body", "16–18", "DM Sans / 400"],
            ["Label", "11–12", "Geist Mono / 400"],
          ].map(([label, size, face]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>
                {size}
                <small>px</small>
              </strong>
              <span className="brand-mono">{face}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="expression" className="brand-section">
        <SectionHeading number="05" label="VISUAL LANGUAGE" title="Build a world. Leave some air.">
          Borrow the feeling of Floating Worlds: depth, warm light, tactile landscapes, and a path
          that invites discovery. Let imagery carry the spectacle and the interface provide calm.
        </SectionHeading>
        {!isOriginal && (
          <div className="brand-look-study">
            <div>
              <span className="brand-mono">FROM SCENE TO SYSTEM / {theme.name.toUpperCase()}</span>
              <h3>{theme.mood}</h3>
              <p>{theme.description}</p>
              <p className="brand-study-note">
                The image below is rendered with this exact Floating Worlds preset. The palette
                translates its atmosphere into usable interface colours.
              </p>
            </div>
            <dl>
              {(["exposure", "sky", "warmth", "haze", "relight", "vignette"] as const).map(
                (key) => (
                  <div key={key}>
                    <dt>{key}</dt>
                    <dd>{theme.settings[key].toFixed(2)}</dd>
                  </div>
                ),
              )}
            </dl>
          </div>
        )}
        <div className="brand-expression-grid">
          <figure className="brand-image-study">
            <img
              src={asset("floating-worlds.webp")}
              alt="Amber light fading across layers of clouds and distant floating islands"
              loading="lazy"
            />
            <figcaption>
              <span className="brand-mono">01 / ATMOSPHERIC DEPTH</span>
              <p>Rich foreground. Softer distance. One point of light.</p>
            </figcaption>
          </figure>
          <figure className="brand-eclipse-study">
            <div className="brand-eclipse" />
            <figcaption>
              <span className="brand-mono">02 / LIGHT AS A SIGNATURE</span>
              <p>{isOriginal ? "A glow, used with intention." : theme.signature}</p>
            </figcaption>
          </figure>
          <figure className="brand-grid-study">
            <div>
              <span>
                Space
                <br />
                creates
                <br />
                <em>scale.</em>
              </span>
              <i>↗</i>
            </div>
            <figcaption>
              <span className="brand-mono">03 / EDITORIAL STRUCTURE</span>
              <p>12 columns. 8px rhythm. Generous margins.</p>
            </figcaption>
          </figure>
        </div>
        <div className="brand-expression-rules">
          <p>
            <strong>Image direction</strong>
            {theme.imageDirection} Keep text on calm areas or a solid surface.
          </p>
          <p>
            <strong>Graphic language</strong>Open circles, fine orbital lines, warm edges, and
            directional arrows. Use texture in imagery; keep reading surfaces clean.
          </p>
          <p>
            <strong>Interface shape</strong>Precise edges and fine rules. Use spacing to create
            hierarchy. Save rounded forms for the orbital mark and status indicators.
          </p>
        </div>
      </section>

      <section id="motion" className="brand-section brand-paper">
        <SectionHeading number="06" label="MOTION & INTERACTION" title="A gentle pull forward.">
          Movement should feel like entering a world: grounded, continuous, and unhurried. A clear
          response comes first. Atmosphere follows.
        </SectionHeading>
        <div className="brand-motion-grid">
          <MotionPreview />
          <div className="brand-motion-notes">
            {[
              ["Respond", "160ms", "Buttons and feedback. Immediate, small shifts."],
              ["Reveal", "400ms", "Content comes into focus. Up to 16px of travel."],
              ["Enter", "700ms", "A world opening. Ease out, never bounce."],
            ].map(([name, time, text]) => (
              <div key={name}>
                <h3>
                  {name}
                  <span className="brand-mono">{time}</span>
                </h3>
                <p>{text}</p>
              </div>
            ))}
            <p className="brand-mono">
              EASE: CUBIC-BEZIER(0.22, 1, 0.36, 1)
              <br />
              REDUCED MOTION: NO TRAVEL OR AMBIENT LOOPS.
            </p>
          </div>
        </div>
      </section>

      <section id="components" className="brand-section">
        <SectionHeading
          number="07"
          label="THE WORKING SYSTEM"
          title="Extraordinary worlds. Effortless tools."
        >
          Clear actions, visible focus, generous touch targets, and feedback that sounds like a
          person. The experience should be as easy to use as it is exciting to enter.
        </SectionHeading>
        <ComponentPreview />
      </section>

      <section id="applications" className="brand-section brand-paper">
        <SectionHeading number="08" label="IN THE WORLD" title="One identity. More possibilities.">
          From the first invitation to the world inside. A flexible system that can hold different
          stories without losing its own sense of self.
        </SectionHeading>
        <div className="brand-applications">
          <figure className="brand-poster">
            <div className="brand-wordmark">
              <BrandMark />
              oncemore
            </div>
            <span className="brand-mono">AN INVITATION TO GO FURTHER.</span>
            <h3>
              Some stories
              <br />
              stay with you.
              <br />
              <em>
                Step into
                <br />
                one.
              </em>
            </h3>
            <div className="brand-poster-orbit" />
            <figcaption className="brand-mono">BEYOND THE FRAME. / ONCEMORE</figcaption>
          </figure>
          <div className="brand-application-stack">
            <figure className="brand-world-card">
              <img
                src={asset("floating-worlds.webp")}
                alt="Floating Worlds experience cover"
                loading="lazy"
              />
              <div>
                <span className="brand-mono">
                  {isOriginal ? "AN ONCEMORE EXPERIENCE" : `ONCEMORE / ${theme.name.toUpperCase()}`}
                </span>
                <h3>
                  A world away.
                  <br />
                  One scroll closer.
                </h3>
                <a href="/floating-worlds">Enter Floating Worlds ↗</a>
              </div>
            </figure>
            <figure className="brand-stationery">
              <div className="brand-wordmark">
                <BrandMark />
                oncemore
              </div>
              <p>
                There’s always
                <br />
                another way in.
              </p>
              <figcaption className="brand-mono">
                INTERACTIVE WORLDS.
                <br />
                LASTING CONNECTIONS.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section id="resources" className="brand-resources">
        <div>
          <span className="brand-mono">THE NEXT CHAPTER IS YOURS.</span>
          <h2>
            Make more
            <br />
            <span>possible.</span>
          </h2>
          <p>Take the essentials. Build something worth stepping into.</p>
        </div>
        <div className="brand-resource-links">
          <a href={asset("oncemore-cloud.svg")} download>
            <span>01 / Primary logo</span>
            <span>SVG ↓</span>
          </a>
          <a href={asset("oncemore-mark.svg")} download>
            <span>02 / Eclipse symbol</span>
            <span>SVG ↓</span>
          </a>
          <a href={asset("oncemore-tokens.css")} download>
            <span>03 / Design tokens</span>
            <span>CSS ↓</span>
          </a>
          <a href={asset("oncemore-tokens.json")} download>
            <span>04 / Design tokens</span>
            <span>JSON ↓</span>
          </a>
          <a href="/floating-worlds">
            <span>05 / The inspiration</span>
            <span>EXPLORE ↗</span>
          </a>
        </div>
      </section>
      <footer className="brand-footer">
        <a className="brand-wordmark" href="#top">
          <BrandMark />
          oncemore
        </a>
        <span className="brand-mono">A WORLD BEYOND THE FRAME.</span>
        <a href="#top" className="brand-mono">
          BACK TO THE HORIZON ↑
        </a>
      </footer>
    </div>
  );
}
