import { ArrowUpRight, ChevronRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { glassEyebrow, glassInsetAction, glassPanel, glassPrimary } from "@/lib/glass";

import type { World } from "./scene-types";

type IslandStory = {
  kind: string;
  status: string;
  live: boolean;
  text: string;
  facts?: [label: string, value: string][];
};

/*
 * Copy for each island, in the scene's order (app.js `Mt`). Concluded
 * campaigns stay in the past tense; unbuilt worlds promise nothing specific.
 * See docs/context.md before changing claims.
 */
const stories: IslandStory[] = [
  {
    kind: "Film",
    status: "Concluded",
    live: false,
    text: "Fans played three samurai games and revealed a comic, OG: The First Blood, together. Players kept Fire Cards with their own names on them.",
    facts: [
      ["Played", "3 games"],
      ["Unlocked", "A comic"],
      ["Kept", "Fire Card"],
    ],
  },
  {
    kind: "Film",
    status: "Concluded",
    live: false,
    text: "Fans made fifteen choices to see how closely they matched Samantha, then got a personal card and a hero-reveal video.",
    facts: [
      ["Answered", "15 choices"],
      ["Revealed", "Match score"],
      ["Kept", "Hero video"],
    ],
  },
  {
    kind: "Sport",
    status: "In the works",
    live: true,
    text: "A world for match days and the fans who live for them. It is still being built.",
  },
  {
    kind: "Music",
    status: "In the works",
    live: true,
    text: "A world for live music and the fans in the front row. It is still being built.",
  },
  {
    kind: "Unnamed",
    status: "In the works",
    live: true,
    text: "The furthest island is held for a world that hasn't been announced yet.",
  },
];

const numerals = ["I", "II", "III", "IV", "V"];

/** The glass card for the island currently framed by the camera. */
export function IslandCard({
  index,
  total,
  world,
  displayClassName,
  onEnter,
}: {
  /** Zero-based island index. */
  index: number;
  total: number;
  world: World;
  displayClassName: string;
  onEnter: () => void;
}) {
  const story = stories[index];

  return (
    <article className={`${glassPanel} p-5 sm:p-6`} aria-labelledby="island-title">
      <div className="flex items-center justify-between gap-4">
        <p className={glassEyebrow}>
          <span className="text-[#8fcbff]">{numerals[index]}</span> / {numerals[total - 1]}
          {story && <> · {story.kind}</>}
        </p>
        {story && (
          <p className={`${glassEyebrow} flex items-center gap-2`}>
            {story.live && <span aria-hidden="true" className="glass-dot" />}
            {story.status}
          </p>
        )}
      </div>
      <h1
        id="island-title"
        className={`${displayClassName} mt-3 text-3xl leading-[0.95] font-medium tracking-[-0.03em] text-balance sm:text-4xl`}
      >
        {world.title}
      </h1>
      {story && (
        <p className="mt-3 text-sm leading-relaxed text-pretty text-[rgb(237_230_214/0.8)]">
          {story.text}
        </p>
      )}
      {story?.facts && (
        <dl className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-2xl bg-[rgb(237_230_214/0.05)]">
          {story.facts.map(([label, value]) => (
            <div key={label} className="min-w-0 bg-[rgb(5_8_14/0.28)] px-3 py-2.5 sm:px-4 sm:py-3">
              <dt className={`${glassEyebrow} truncate text-[0.625rem]`}>{label}</dt>
              <dd className={`${displayClassName} mt-1 text-base leading-tight font-medium`}>
                {value}
              </dd>
            </div>
          ))}
        </dl>
      )}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button type="button" className={glassPrimary} data-world-controls onClick={onEnter}>
          Enter the island <ChevronRight aria-hidden="true" className="size-4" />
        </button>
        {world.href && (
          <Link href={world.href as Route} className={glassInsetAction} data-world-controls>
            Read the story <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        )}
      </div>
    </article>
  );
}
