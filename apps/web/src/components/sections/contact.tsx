import { Magnetic } from "@/components/ui/magnetic";
import { Reveal } from "@/components/ui/reveal";
import { SplitHeading } from "@/components/ui/split-heading";

export function Contact() {
  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden border-t border-bone/10 px-5 py-28 md:px-10 md:py-44"
    >
      <div className="ember-fallback absolute inset-0 opacity-45" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(7,6,6,0.75)_100%)]" />

      <div className="relative mx-auto max-w-[1600px]">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-ember">
            Start a collaboration
          </p>
        </Reveal>

        <SplitHeading className="mt-6 max-w-5xl font-display text-[clamp(3.2rem,9vw,8.5rem)] leading-[0.86]">
          Bring your world to life.
        </SplitHeading>

        <div className="mt-12 flex flex-col gap-10 md:mt-16 md:flex-row md:items-end md:justify-between">
          <Reveal delay={0.08}>
            <p className="max-w-md text-base leading-relaxed text-bone/60 md:text-lg">
              Tell us about the film, show, or world you want fans to live inside. We will come back
              with a way in.
            </p>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">
              Launch windows · 2026 and beyond
            </p>
          </Reveal>

          <Reveal delay={0.14}>
            <Magnetic>
              <a
                href="mailto:hello@oncemore.io"
                className="inline-flex items-center gap-3 rounded-full bg-bone px-7 py-4 font-mono text-[11px] uppercase tracking-[0.24em] text-ink transition-colors hover:bg-ember"
              >
                hello@oncemore.io <span aria-hidden>↗</span>
              </a>
            </Magnetic>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
