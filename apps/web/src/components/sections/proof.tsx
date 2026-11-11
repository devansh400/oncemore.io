import { Reveal } from "@/components/ui/reveal";
import { stats } from "@/lib/projects";

export function Proof() {
  return (
    <section className="border-y border-bone/10 px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto grid max-w-[1600px] gap-12 sm:grid-cols-3">
        {stats.map((stat, index) => (
          <Reveal key={stat.label} delay={index * 0.08}>
            <p className="font-display text-[clamp(3.2rem,7vw,6rem)] leading-none text-bone">
              {stat.value}
            </p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">
              {stat.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
