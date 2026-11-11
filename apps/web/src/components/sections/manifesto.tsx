import { Reveal } from "@/components/ui/reveal";
import { SplitHeading } from "@/components/ui/split-heading";

export function Manifesto() {
  return (
    <section id="studio" className="px-5 py-24 md:px-10 md:py-40">
      <div className="mx-auto grid max-w-[1600px] gap-12 md:grid-cols-[0.85fr_1.15fr] md:gap-20">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-ember">The studio</p>
          <p className="mt-6 max-w-xs font-mono text-[10px] uppercase leading-relaxed tracking-[0.22em] text-bone/60">
            Built for the moment a fan wants more.
          </p>
        </Reveal>

        <div>
          <SplitHeading className="font-display text-[clamp(2.6rem,6vw,5.4rem)] leading-[0.94]">
            The happiest place on everyone&apos;s device.
          </SplitHeading>

          <Reveal delay={0.1}>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-bone/60 md:text-lg">
              OnceMore is where fans meet the stories they love — exclusive content, playable
              worlds, and AI-powered moments built for launch day and beyond.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-12 grid max-w-xl grid-cols-2 gap-6 border-t border-bone/10 pt-8">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-bone/60">
                  Built for
                </p>
                <p className="mt-2 text-sm leading-relaxed text-bone/70">
                  Film, television, and IP launches
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-bone/60">
                  Designed for
                </p>
                <p className="mt-2 text-sm leading-relaxed text-bone/70">
                  Fans who want to live inside the story
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
