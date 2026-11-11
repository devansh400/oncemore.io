import { Reveal } from "@/components/ui/reveal";
import { SplitHeading } from "@/components/ui/split-heading";
import { capabilities } from "@/lib/projects";

export function Capabilities() {
  return (
    <section className="px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-20">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-ember">
              What we build
            </p>
          </Reveal>
          <SplitHeading className="font-display text-[clamp(2.6rem,6vw,5.4rem)] leading-[0.94]">
            Worlds, not campaigns.
          </SplitHeading>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden border border-bone/10 md:mt-20 md:grid-cols-2">
          {capabilities.map((capability, index) => (
            <Reveal key={capability.index} delay={index * 0.06}>
              <div className="group relative h-full bg-ink p-8 transition-colors duration-500 hover:bg-secondary md:p-12">
                <div className="flex items-start justify-between gap-6">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-ember">
                    {capability.index}
                  </span>
                  <span
                    aria-hidden
                    className="text-bone/30 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-ember"
                  >
                    ↗
                  </span>
                </div>

                <h3 className="mt-10 font-display text-3xl leading-none md:text-4xl">
                  {capability.title}
                </h3>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-bone/55">
                  {capability.body}
                </p>

                <span className="absolute inset-x-8 bottom-0 h-px origin-left scale-x-0 bg-ember transition-transform duration-500 group-hover:scale-x-100 md:inset-x-12" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
