"use client";

import { type CSSProperties, useState } from "react";

import { glassEyebrow, glassFocus, glassPanel } from "@/lib/glass";

import { type Concept, concepts } from "./marks";

const surfaces = {
  glass: {
    label: "Glass",
    style: { color: "#ede6d6", "--logo-accent": "#8fcbff" },
    stage: "bg-[rgb(5_8_14/0.18)]",
  },
  midnight: {
    label: "Midnight",
    style: { color: "#ede6d6", "--logo-accent": "#8fcbff", backgroundColor: "#0b0f17" },
    stage: "",
  },
  cloud: {
    label: "Cloud",
    style: { color: "#0b0f17", "--logo-accent": "#2f86d6", backgroundColor: "#ede6d6" },
    stage: "",
  },
} as const;

type Surface = keyof typeof surfaces;

const shortlist = ["eclipse", "encore", "five-worlds"];

const control = `${glassFocus} glass-control inline-flex min-h-10 cursor-pointer items-center justify-center rounded-full px-4 text-sm font-medium`;

/** The mark as it would ship small: an app icon and a browser favicon. */
function SmallSizes({ concept }: { concept: Concept }) {
  const icon = {
    color: "#ede6d6",
    "--logo-accent": "#8fcbff",
    backgroundColor: "#0b0f17",
  } as CSSProperties;
  return (
    <div className="flex items-end gap-3" aria-label={`${concept.name} at small sizes`}>
      <div
        className="grid size-14 place-items-center rounded-[22%] shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_6px_16px_-6px_rgb(0_0_0/0.6)]"
        style={icon}
      >
        <concept.Mark size={36} />
      </div>
      <div className="grid size-8 place-items-center rounded-lg" style={icon}>
        <concept.Mark size={22} />
      </div>
      <div className="grid size-4 place-items-center rounded-[4px]" style={icon}>
        <concept.Mark size={14} />
      </div>
    </div>
  );
}

function ConceptCard({
  concept,
  index,
  surface,
  displayClassName,
}: {
  concept: Concept;
  index: number;
  surface: Surface;
  displayClassName: string;
}) {
  const { style, stage } = surfaces[surface];
  const picked = shortlist.includes(concept.id);
  return (
    <li id={concept.id} className={`${glassPanel} flex scroll-mt-24 flex-col gap-5 p-4 sm:p-5`}>
      <div
        className={`${stage} relative grid aspect-16/10 place-items-center overflow-hidden rounded-2xl transition-colors duration-300`}
        style={style as CSSProperties}
      >
        <div className="flex items-center gap-4 sm:gap-5">
          <concept.Mark size={76} />
          {concept.id !== "lettermark" && (
            <span
              className={`${displayClassName} text-4xl leading-none font-medium tracking-[-0.03em] sm:text-5xl`}
            >
              oncemore
            </span>
          )}
        </div>
        {picked && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-[rgb(143_203_255/0.16)] px-2.5 py-1 text-xs font-medium text-[#c4e3ff]">
            <span aria-hidden="true" className="glass-dot" /> Shortlist
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4 px-1 pb-1">
        <div className="max-w-sm min-w-0 flex-1">
          <p className={glassEyebrow}>
            <span className="text-[#8fcbff]">{String(index + 1).padStart(2, "0")}</span> / Concept
          </p>
          <h3 className={`${displayClassName} mt-2 text-2xl font-medium tracking-[-0.02em]`}>
            {concept.name}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-[rgb(237_230_214/0.86)]">
            {concept.idea}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[rgb(237_230_214/0.6)]">{concept.why}</p>
        </div>
        <SmallSizes concept={concept} />
      </div>
    </li>
  );
}

export function LogoGallery({ displayClassName }: { displayClassName: string }) {
  const [surface, setSurface] = useState<Surface>("glass");
  const picks = shortlist.map((id) => concepts.find((concept) => concept.id === id)!);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="glass-type text-sm text-[rgb(237_230_214/0.8)]">
          {concepts.length} concepts, each shown as a lockup, an app icon and a favicon.
        </p>
        <div
          role="group"
          aria-label="Logo surface"
          className="glass-veil inline-flex gap-1 rounded-full p-1"
        >
          {(Object.keys(surfaces) as Surface[]).map((key) => (
            <button
              key={key}
              type="button"
              className={control}
              aria-pressed={surface === key}
              onClick={() => setSurface(key)}
            >
              {surfaces[key].label}
            </button>
          ))}
        </div>
      </div>

      <ul className="grid gap-5 lg:grid-cols-2">
        {concepts.map((concept, index) => (
          <ConceptCard
            key={concept.id}
            concept={concept}
            index={index}
            surface={surface}
            displayClassName={displayClassName}
          />
        ))}
      </ul>

      <section aria-labelledby="shortlist-title" className="mt-24 sm:mt-32">
        <header className="glass-scrim glass-type mb-10 max-w-2xl">
          <p className={`${glassEyebrow} flex items-center gap-2`}>
            <span className="text-[#8fcbff]">02</span>
            <span aria-hidden="true" className="h-px w-6 bg-current opacity-40" />
            Shortlist
          </p>
          <h2
            id="shortlist-title"
            className={`${displayClassName} mt-4 text-4xl leading-[0.95] font-medium tracking-[-0.03em] sm:text-6xl`}
          >
            Three to take further.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[rgb(237_230_214/0.82)]">
            The marks that hold up best at every size and say the most about OnceMore with the
            least.
          </p>
        </header>
        <ol className="grid gap-5 md:grid-cols-3">
          {picks.map((concept, index) => (
            <li key={concept.id} className={`${glassPanel} flex flex-col gap-6 p-6 sm:p-7`}>
              <div className="flex items-start justify-between gap-4">
                <div style={surfaces.glass.style as CSSProperties}>
                  <concept.Mark size={96} />
                </div>
                <span
                  aria-hidden="true"
                  className={`${displayClassName} text-5xl leading-none font-medium text-[#8fcbff]`}
                >
                  {index + 1}
                </span>
              </div>
              <div>
                <h3 className={`${displayClassName} text-2xl font-medium tracking-[-0.02em]`}>
                  <a href={`#${concept.id}`} className={`${glassFocus} rounded-md hover:underline`}>
                    {concept.name}
                  </a>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[rgb(237_230_214/0.78)]">
                  {
                    {
                      eclipse:
                        "The strongest story. It reuses the preloader's eclipse, so the brand's first impression is also its mark.",
                      encore:
                        "The clearest reading of the name. Two Os, linked, with the second one lit: once, and more.",
                      "five-worlds":
                        "The most flexible system. Dots can light up one by one as new worlds launch.",
                    }[concept.id]
                  }
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
