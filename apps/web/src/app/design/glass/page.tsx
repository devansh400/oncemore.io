import { ArrowDown, ArrowUp, Compass } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { WorldsNav } from "@/components/worlds-nav";
import {
  glassEyebrow,
  glassPane,
  glassPanel,
  glassPill,
  glassPrimary,
  glassSecondary,
  glassSlab,
  glassVeil,
} from "@/lib/glass";

import { brandBody, brandDisplay } from "../brand-fonts";
import { ComponentGallery } from "./component-gallery";
import { LiveBackdrop } from "./live-backdrop";

export const metadata: Metadata = {
  title: "Glass over worlds | OnceMore Design",
  description:
    "OnceMore's glass system: three densities of brand-tinted glass, shown over the live Floating Worlds scene.",
};

const display = brandDisplay.className;

const tiers = [
  {
    name: "Veil",
    classes: glassVeil,
    tint: "13%",
    blur: "14px",
    use: "Navigation, chips and short labels. The world stays almost fully visible.",
  },
  {
    name: "Pane",
    classes: glassPane,
    tint: "34%",
    blur: "22px",
    use: "Cards and grouped controls. Enough body to hold a form over moving clouds.",
  },
  {
    name: "Slab",
    classes: glassSlab,
    tint: "64%",
    blur: "30px",
    use: "Reading, menus and dialogs. For anything the artwork would otherwise compete with.",
  },
] as const;

const anatomy = [
  { title: "Midnight tint", text: "#0B0F17 at the tier's density. Never neutral grey." },
  { title: "Sunlit rim", text: "A 1px edge, brightest at the upper right, where the sun sits." },
  { title: "Cloud sheen", text: "A soft top light, as if the glass catches the sky above it." },
  { title: "Grain and depth", text: "Fine grain against banding, and a long, low ambient shadow." },
] as const;

const palette = [
  { name: "Midnight", hex: "#0B0F17", role: "Glass tint, deep text" },
  { name: "Cloud", hex: "#EDE6D6", role: "Type, primary action" },
  { name: "Moonlight", hex: "#8FCBFF", role: "Focus, the current choice" },
  { name: "Twilight", hex: "#4A9BE8", role: "Gradients into Moonlight" },
  { name: "Atmosphere", hex: "#758592", role: "Avatars, quiet fills" },
] as const;

const guidelines = [
  {
    title: "Let the art lead",
    text: "Put glass at the edges and in the corners. Keep the centre of the frame for the world, and never stack glass on glass.",
  },
  {
    title: "Choose density by the job",
    text: "Veil for labels, Pane for grouped controls, Slab for reading and anything that pops over. When a bright look washes text out, step up a density rather than adding a shadow.",
  },
  {
    title: "Light comes from the sun",
    text: "Every rim is brightest at the upper right, where the scene's sun sits. Moonlight marks focus and the current choice, and nothing else is blue.",
  },
  {
    title: "Keep motion in the scene",
    text: "Glass doesn't shimmer or drift. Controls respond within 200ms, and reduced motion swaps the live world for a still.",
  },
] as const;

function SectionHeader({
  number,
  label,
  id,
  title,
  children,
}: {
  number: string;
  label: string;
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <header className="glass-scrim glass-type mb-10 max-w-2xl">
      <p className={`${glassEyebrow} flex items-center gap-2`}>
        <span className="text-[#8fcbff]">{number}</span>
        <span aria-hidden="true" className="h-px w-6 bg-current opacity-40" />
        {label}
      </p>
      <h2
        id={id}
        className={`${display} mt-4 text-4xl leading-[0.95] font-medium tracking-[-0.03em] sm:text-6xl`}
      >
        {title}
      </h2>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-[rgb(237_230_214/0.82)]">
        {children}
      </p>
    </header>
  );
}

export default function GlassDesignPage() {
  return (
    <div className={`${brandBody.className} text-[#ede6d6]`}>
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
              id="glass-title"
              className={`${display} mt-5 text-6xl leading-[0.88] font-medium tracking-[-0.045em] sm:text-8xl lg:text-[8.5rem]`}
            >
              Glass over
              <br />
              worlds.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[rgb(237_230_214/0.85)]">
              A material made for the sky it sits in: tinted with Midnight, lit by the same low sun,
              and only as dense as the job needs. The live landing scene stays behind everything
              here.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#components" className={glassPrimary}>
                Try the components <ArrowDown aria-hidden="true" className="size-4" />
              </a>
              <a href="#material" className={glassSecondary}>
                See the material
              </a>
            </div>
          </div>
        }
      >
        <section
          id="material"
          aria-labelledby="material-title"
          className="scroll-mt-8 py-20 sm:py-28"
        >
          <SectionHeader
            number="01"
            label="Material"
            id="material-title"
            title="Three densities of glass."
          >
            One recipe at three strengths. Each tier keeps the same rim, sheen and grain, so the
            surfaces read as one family however much of the world shows through.
          </SectionHeader>
          <ul className="grid gap-5 md:grid-cols-3 md:pb-16">
            {tiers.map((tier, index) => (
              <li
                key={tier.name}
                className={`${tier.classes} flex min-h-80 flex-col justify-between rounded-3xl p-6 sm:p-7 ${
                  ["", "md:translate-y-8", "md:translate-y-16"][index]
                }`}
              >
                <div>
                  <p className={glassEyebrow}>
                    <span className="text-[#8fcbff]">0{index + 1}</span> / Tier
                  </p>
                  <h3
                    className={`${display} mt-3 text-5xl font-medium tracking-[-0.03em] sm:text-6xl`}
                  >
                    {tier.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[rgb(237_230_214/0.8)]">
                    {tier.use}
                  </p>
                </div>
                <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-[rgb(237_230_214/0.05)]">
                  {[
                    ["Tint", tier.tint],
                    ["Blur", tier.blur],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-[rgb(5_8_14/0.28)] px-4 py-3">
                      <dt className={glassEyebrow}>{label}</dt>
                      <dd className={`${display} mt-1 text-2xl font-medium`}>{value}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ul>
          <dl
            className={`${glassPanel} mt-10 grid divide-y divide-[rgb(237_230_214/0.05)] lg:grid-cols-4 lg:divide-x lg:divide-y-0`}
          >
            {anatomy.map(({ title, text }, index) => (
              <div key={title} className="p-5 sm:p-6">
                <dt className={glassEyebrow}>
                  <span className="text-[#8fcbff]">0{index + 1}</span> / Layer
                </dt>
                <dd>
                  <p className={`${display} mt-2 text-lg font-medium`}>{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[rgb(237_230_214/0.72)]">
                    {text}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section
          id="components"
          aria-labelledby="components-title"
          className="scroll-mt-8 py-20 sm:py-28"
        >
          <SectionHeader
            number="02"
            label="Components"
            id="components-title"
            title="Built for the sky."
          >
            shadcn/ui, retuned for glass. Open the menus, dialogs and sheet, fill the form, and switch
            the density while the world moves behind them.
          </SectionHeader>
          <ComponentGallery bodyClassName={brandBody.className} displayVariable={brandDisplay.variable} />
        </section>

        <section
          id="foundations"
          aria-labelledby="foundations-title"
          className="scroll-mt-8 py-20 sm:py-28"
        >
          <SectionHeader
            number="03"
            label="Foundations"
            id="foundations-title"
            title="Night holds the light."
          >
            Midnight and Cloud from the brand palette do the everyday work. One cool accent,
            Moonlight, answers the warm sky and leads the eye.
          </SectionHeader>
          <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <ul className={`${glassPanel} grid grid-cols-2 gap-3 p-4 sm:grid-cols-5 sm:p-5`}>
              {palette.map(({ name, hex, role }) => (
                <li key={name} className="min-w-0">
                  <div
                    className="aspect-4/5 rounded-2xl shadow-[inset_0_0_0_1px_rgb(237_230_214/0.08),inset_0_1px_0_rgb(255_255_255/0.12)]"
                    style={{ backgroundColor: hex }}
                  />
                  <p className={`${display} mt-3 text-base font-medium`}>{name}</p>
                  <p className="font-mono text-xs text-[rgb(237_230_214/0.6)]">{hex}</p>
                  <p className="mt-1 text-xs leading-snug text-[rgb(237_230_214/0.72)]">{role}</p>
                </li>
              ))}
            </ul>
            <div className={`${glassPanel} flex flex-col justify-between gap-6 p-6 sm:p-7`}>
              <div className="flex items-end justify-between gap-4">
                <p
                  aria-hidden="true"
                  className={`${display} text-8xl leading-[0.8] font-medium tracking-[-0.05em]`}
                >
                  Aa
                </p>
                <p className={`${glassEyebrow} text-right`}>Type</p>
              </div>
              <dl className="grid gap-4 border-t border-[rgb(237_230_214/0.06)] pt-5 text-sm">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className={`${display} text-xl font-medium`}>Bricolage Grotesque</dt>
                  <dd className="text-[rgb(237_230_214/0.6)]">Titles</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-base">DM Sans</dt>
                  <dd className="text-[rgb(237_230_214/0.6)]">Reading and controls</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="font-mono text-sm">Geist Mono</dt>
                  <dd className="text-[rgb(237_230_214/0.6)]">Technical labels</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section
          id="guidelines"
          aria-labelledby="guidelines-title"
          className="scroll-mt-8 py-20 sm:py-28"
        >
          <SectionHeader
            number="04"
            label="Guidelines"
            id="guidelines-title"
            title="Working over artwork."
          >
            Four rules that keep the world in front and the interface honest.
          </SectionHeader>
          <ol className="grid gap-5 sm:grid-cols-2">
            {guidelines.map(({ title, text }, index) => (
              <li key={title} className={`${glassPanel} flex gap-5 p-6 sm:p-7`}>
                <span
                  aria-hidden="true"
                  className={`${display} text-5xl leading-none font-medium text-[#8fcbff]`}
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className={`${display} text-xl font-medium tracking-[-0.01em]`}>{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[rgb(237_230_214/0.78)]">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <footer className="relative z-40 flex flex-wrap items-center justify-between gap-3 pt-6 pb-10">
          <span
            className={`${glassPill} ${glassEyebrow} inline-flex min-h-11 items-center gap-2 px-4`}
          >
            <Compass aria-hidden="true" className="size-4" /> OnceMore / Glass system
          </span>
          <a href="#top" className={glassSecondary}>
            Back to top <ArrowUp aria-hidden="true" className="size-4" />
          </a>
        </footer>
      </LiveBackdrop>
    </div>
  );
}
