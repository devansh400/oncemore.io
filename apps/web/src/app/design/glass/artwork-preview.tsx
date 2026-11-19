"use client";

import { ArrowDown } from "lucide-react";
import Image from "next/image";
import { type ReactNode, useState } from "react";

import { glassFocus, glassPanel, glassPill, glassPrimary } from "@/lib/glass";

const scenes = [
  {
    name: "Dusk",
    source: "/brand/looks/dusk/floating-worlds.webp",
    note: "Mixed light and deep shadows",
  },
  {
    name: "Bright",
    source: "/brand/looks/bright/floating-worlds.webp",
    note: "Bright sky and busy detail",
  },
  {
    name: "Storm",
    source: "/brand/looks/storm/floating-worlds.webp",
    note: "Dark sky and concentrated highlights",
  },
] as const;

export function ArtworkPreview({ navigation }: { navigation: ReactNode }) {
  const [selected, setSelected] = useState(0);
  const scene = scenes[selected];

  return (
    <figure className="-mx-2 sm:mx-0">
      <div className="relative isolate flex min-h-96 flex-col justify-between gap-20 overflow-hidden rounded-3xl bg-neutral-900 py-4 sm:px-4 md:min-h-120 md:p-6">
        <Image
          src={scene.source}
          alt=""
          fill
          sizes="(min-width: 1280px) 1200px, 100vw"
          className="-z-10 object-cover"
        />
        {navigation}
        <div className="flex flex-wrap items-end justify-between gap-4 px-4 sm:px-0">
          <div className={`${glassPanel} max-w-xs p-4 sm:p-5`}>
            <p className="font-mono text-xs tracking-widest text-neutral-300 uppercase">
              Surface 02
            </p>
            <p className="mt-2 text-xl font-medium tracking-tight">A quieter layer</p>
            <p className="mt-1 text-sm leading-relaxed text-neutral-200">
              A deeper tint keeps longer text legible without covering the scene.
            </p>
          </div>
          <a href="#components" className={glassPrimary}>
            Explore components <ArrowDown aria-hidden="true" className="size-4" />
          </a>
        </div>
      </div>
      <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3 px-2 sm:px-0">
        <div aria-live="polite" aria-atomic="true" className="text-sm text-neutral-300">
          <span className="mr-2 font-mono text-xs text-neutral-400">BACKDROP</span>
          {scene.note}
        </div>
        <div
          role="group"
          aria-label="Artwork backdrop"
          className={`${glassPill} flex items-center gap-1 p-1`}
        >
          {scenes.map(({ name }, index) => (
            <button
              key={name}
              type="button"
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
              className={`${glassFocus} min-h-11 cursor-pointer rounded-full px-3 text-sm text-neutral-200 hover:bg-white/10 aria-pressed:bg-white aria-pressed:text-neutral-950`}
            >
              {name}
            </button>
          ))}
        </div>
      </figcaption>
    </figure>
  );
}
