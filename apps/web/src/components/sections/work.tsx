"use client";

import Image from "next/image";
import { useRef } from "react";

import { Reveal } from "@/components/ui/reveal";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { projects, type Project } from "@/lib/projects";

function ProjectPanel({ project, flip }: { project: Project; flip: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || reduced) return;

      const media = root.querySelector<HTMLElement>("[data-media]");
      const inner = root.querySelector<HTMLElement>("[data-media-inner]");
      if (!media || !inner) return;

      const clip = gsap.fromTo(
        media,
        { clipPath: "inset(12% 8% 12% 8%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.4,
          ease: "power4.out",
          scrollTrigger: {
            trigger: root,
            start: "top 80%",
            once: true,
          },
        },
      );

      const parallax = gsap.fromTo(
        inner,
        { yPercent: -7 },
        {
          yPercent: 7,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );

      return () => {
        clip.kill();
        parallax.kill();
      };
    },
    { scope: ref, dependencies: [reduced, project.slug] },
  );

  return (
    <article ref={ref} className="border-t border-bone/10 px-5 py-20 md:px-10 md:py-28">
      <div
        className={`mx-auto grid max-w-[1600px] items-center gap-12 md:gap-20 ${
          flip ? "md:grid-cols-[1.05fr_0.95fr]" : "md:grid-cols-[0.95fr_1.05fr]"
        }`}
      >
        <div className={flip ? "md:order-2" : undefined}>
          <Reveal>
            <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">
              <span className="text-ember">Case {project.index}</span>
              <span className="h-px w-10 bg-bone/20" />
              <span>{project.year}</span>
            </div>

            <h2 className="mt-6 font-display text-[clamp(2.8rem,6vw,5.6rem)] leading-[0.9]">
              {project.title}
            </h2>

            <p className="mt-5 font-mono text-[10px] uppercase leading-relaxed tracking-[0.24em] text-bone/60">
              {project.genre} · Dir. {project.director} · {project.lead}
            </p>

            <p className="mt-7 max-w-xl text-base leading-relaxed text-bone/65 md:text-lg">
              {project.summary}
            </p>

            <ul className="mt-8 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-bone/15 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-bone/55"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className={flip ? "md:order-1" : undefined}>
          <div className="group relative aspect-[4/5] overflow-hidden rounded-[2px] border border-bone/10">
            <div
              data-media
              className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.015]"
            >
              <div data-media-inner className="absolute inset-[-8%]">
                <Image
                  src={project.poster}
                  alt={project.posterAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />

            <div className="absolute bottom-6 right-6 w-[52%] overflow-hidden rounded-[2px] border border-bone/20 shadow-2xl">
              <Image
                src={project.inset}
                alt={project.insetAlt}
                width={900}
                height={560}
                sizes="(max-width: 768px) 52vw, 26vw"
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function Work() {
  return (
    <section id="worlds" className="scroll-mt-24">
      <div className="px-5 pb-16 pt-24 md:px-10 md:pb-20 md:pt-36">
        <div className="mx-auto max-w-[1600px]">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-ember">
              Selected worlds
            </p>
            <h2 className="mt-5 max-w-3xl font-display text-[clamp(2.8rem,6vw,5.4rem)] leading-[0.94]">
              Two launches. Two worlds fans stepped into.
            </h2>
          </Reveal>
        </div>
      </div>

      {projects.map((project, index) => (
        <ProjectPanel key={project.slug} project={project} flip={index % 2 === 1} />
      ))}

      <div className="relative flex min-h-[70svh] items-center justify-center overflow-hidden border-t border-bone/10 px-5 py-24 text-center md:px-10">
        <div className="ember-fallback absolute inset-0 opacity-60" />
        <div className="absolute inset-0 bg-ink/40" />
        <Reveal className="relative z-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-bone/50">Case 03</p>
          <h2 className="mt-5 font-display text-[clamp(3rem,8vw,7rem)] leading-[0.88]">
            Your world <span className="italic text-ember">next.</span>
          </h2>
          <a
            href="#contact"
            className="link-rule mt-10 inline-block font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70 hover:text-bone"
          >
            Start the conversation
          </a>
        </Reveal>
      </div>
    </section>
  );
}
