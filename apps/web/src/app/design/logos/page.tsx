import { ArrowDown, ArrowUp, Compass } from "lucide-react";
import type { Metadata } from "next";

import { WorldsNav } from "@/components/worlds-nav";
import { glassEyebrow, glassPill, glassPrimary, glassSecondary } from "@/lib/glass";

import { brandBody, brandDisplay } from "../brand-fonts";
import { LiveBackdrop } from "../glass/live-backdrop";
import { LogoGallery } from "./logo-gallery";

export const metadata: Metadata = {
  title: "Logo concepts | OnceMore Design",
  description:
    "Twelve logo concepts for OnceMore, drawn for the glass design system and shown over the live Floating Worlds scene.",
};

const display = brandDisplay.className;

export default function LogoConceptsPage() {
  return (
    <div className={`${brandBody.className} ${brandDisplay.variable} text-[#ede6d6]`}>
      <LiveBackdrop
        navigation={
          <WorldsNav className="z-40 mx-auto w-full max-w-3xl" wordmarkClassName={display} />
        }
        intro={
          <div className="glass-scrim glass-type max-w-3xl">
            <p className={`${glassEyebrow} flex items-center gap-2`}>
              <span aria-hidden="true" className="glass-dot" />
              OnceMore design system
            </p>
            <h1
              className={`${display} mt-5 text-6xl leading-[0.88] font-medium tracking-[-0.045em] sm:text-8xl lg:text-[8.5rem]`}
            >
              A mark for
              <br />
              many worlds.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[rgb(237_230_214/0.85)]">
              Twelve directions for the OnceMore logo, drawn for the glass system and set over the
              live sky. Change the lighting to see which ones hold.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#concepts" className={glassPrimary}>
                See the concepts <ArrowDown aria-hidden="true" className="size-4" />
              </a>
              <a href="#shortlist-title" className={glassSecondary}>
                Jump to the shortlist
              </a>
            </div>
          </div>
        }
      >
        <section id="concepts" aria-labelledby="concepts-title" className="scroll-mt-8 py-20 sm:py-28">
          <header className="glass-scrim glass-type mb-8 max-w-2xl">
            <p className={`${glassEyebrow} flex items-center gap-2`}>
              <span className="text-[#8fcbff]">01</span>
              <span aria-hidden="true" className="h-px w-6 bg-current opacity-40" />
              Concepts
            </p>
            <h2
              id="concepts-title"
              className={`${display} mt-4 text-4xl leading-[0.95] font-medium tracking-[-0.03em] sm:text-6xl`}
            >
              Once, and more.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[rgb(237_230_214/0.82)]">
              Each mark uses one colour and a single Moonlight accent, so it works on glass, on
              Midnight and on Cloud without separate artwork.
            </p>
          </header>
          <LogoGallery displayClassName={display} />
        </section>

        <footer className="relative z-40 flex flex-wrap items-center justify-between gap-3 pt-6 pb-10">
          <span
            className={`${glassPill} ${glassEyebrow} inline-flex min-h-11 items-center gap-2 px-4`}
          >
            <Compass aria-hidden="true" className="size-4" /> OnceMore / Logo concepts
          </span>
          <a href="#top" className={glassSecondary}>
            Back to top <ArrowUp aria-hidden="true" className="size-4" />
          </a>
        </footer>
      </LiveBackdrop>
    </div>
  );
}
