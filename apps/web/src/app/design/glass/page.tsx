import { ArrowRight, ArrowUpRight, CircleCheck, Compass } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { WorldsNav } from "@/components/worlds-nav";
import {
  glassField,
  glassFocus,
  glassPanel,
  glassPill,
  glassPrimary,
  glassSecondary,
} from "@/lib/glass";

import { ArtworkPreview } from "./artwork-preview";

export const metadata: Metadata = {
  title: "Glass over worlds | OnceMore Design",
  description: "An artwork-first interface system built from the OnceMore Floating Worlds navbar.",
};

const eyebrow = "font-mono text-xs font-medium tracking-widest text-neutral-400 uppercase";
const sectionTitle = "mt-2 text-3xl font-semibold tracking-tight sm:text-5xl";
const docLink = `${glassFocus} inline-flex min-h-11 items-center gap-1 rounded-full px-2 text-sm text-neutral-300 hover:text-white sm:px-3`;

const materials = [
  {
    label: "01 / Tint",
    value: "Neutral 950",
    detail: "15% for navigation, 60% for reading",
    swatch: "bg-neutral-950",
  },
  {
    label: "02 / Edge",
    value: "White at 5%",
    detail: "One pixel, no sheen or shadow",
    swatch: "border border-white/5",
  },
  {
    label: "03 / Optics",
    value: "Blur LG",
    detail: "Backdrop blur with 150% saturation",
    swatch: "bg-linear-to-r from-sky-500/50 to-indigo-500/50",
  },
  {
    label: "04 / Shape",
    value: "Full / 2XL",
    detail: "Pills for controls, soft corners for panels",
    swatch: "bg-white/10",
  },
] as const;

const guidelines = [
  {
    title: "Let the art lead",
    text: "Place chrome at the edges and leave the center clear. Avoid stacking blurred surfaces over one another.",
  },
  {
    title: "Earn the opacity",
    text: "Use the lighter tint for short labels. Move long copy onto a denser panel, and use a solid surface when the backdrop still competes.",
  },
  {
    title: "Check the brightest frame",
    text: "Test contrast on bright, dark, and detailed artwork. Use a visible keyboard focus outline and pair status color with text or an icon.",
  },
  {
    title: "Keep motion in the scene",
    text: "Skip decorative shimmer and drifting glass. Use restrained state changes and respect reduced motion when adding transitions.",
  },
] as const;

export default function GlassDesignPage() {
  return (
    <div className="min-h-svh bg-neutral-950 font-sans text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-x-4 border-b border-white/10 py-3">
          <span className={eyebrow}>OnceMore / Design</span>
          <nav aria-label="Design resources" className="flex flex-wrap">
            <Link href="/design/brand" className={docLink}>
              Brand book
            </Link>
            <Link href="/" className={docLink} prefetch={false}>
              Landing <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </nav>
        </header>

        <section aria-labelledby="glass-title" className="pt-12 pb-14 sm:pt-16 sm:pb-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5 sm:mb-10">
            <div>
              <p className={eyebrow}>01 / Interface system</p>
              <h1
                id="glass-title"
                className="mt-3 text-5xl leading-none font-semibold tracking-tighter sm:text-7xl lg:text-8xl"
              >
                Glass over worlds.
              </h1>
            </div>
            <p className="max-w-sm text-base leading-relaxed text-neutral-300 sm:text-lg">
              An interface for illustrated scenes: keep the controls clear and let the artwork carry
              the color.
            </p>
          </div>
          <ArtworkPreview navigation={<WorldsNav className="mx-auto w-full max-w-3xl" />} />
        </section>

        <section id="foundations" className="scroll-mt-6 border-t border-white/10 py-12 sm:py-16">
          <p className={eyebrow}>02 / Foundations</p>
          <h2 className={sectionTitle}>The material</h2>
          <p className="mt-3 max-w-lg leading-relaxed text-neutral-300">
            The landing navbar sets the baseline. Two densities build on the same blur and nearly
            invisible edge.
          </p>
          <dl className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {materials.map(({ label, value, detail, swatch }) => (
              <div key={label} className="rounded-2xl bg-neutral-900 p-4 sm:p-5">
                <dt className={eyebrow}>{label}</dt>
                <dd className="mt-4 flex flex-col gap-2">
                  <span aria-hidden="true" className={`${swatch} mb-2 h-9 rounded-full`} />
                  <span className="text-xl font-medium tracking-tight">{value}</span>
                  <span className="text-sm text-neutral-300">{detail}</span>
                </dd>
              </div>
            ))}
          </dl>
          <details className="mt-4 rounded-2xl border border-white/10 px-4 py-3 sm:px-5">
            <summary className={`${glassFocus} cursor-pointer rounded text-sm font-medium`}>
              View Tailwind recipes
            </summary>
            <dl className="mt-4 grid gap-4 text-sm md:grid-cols-2">
              <div>
                <dt className={eyebrow}>Navigation</dt>
                <dd className="mt-2">
                  <code className="font-mono text-xs leading-relaxed text-neutral-200">
                    {glassPill}
                  </code>
                </dd>
              </div>
              <div>
                <dt className={eyebrow}>Reading panel</dt>
                <dd className="mt-2">
                  <code className="font-mono text-xs leading-relaxed text-neutral-200">
                    {glassPanel}
                  </code>
                </dd>
              </div>
            </dl>
          </details>
          <div className="mt-8 grid gap-6 border-t border-white/10 pt-6 md:grid-cols-2">
            <div>
              <p className={eyebrow}>Type</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">Quiet, clear hierarchy.</p>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-300">
                Use the app sans for headlines, reading, and regular-weight navigation. Reserve mono
                for indexes and technical labels.
              </p>
            </div>
            <div>
              <p className={eyebrow}>Layout</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">Room for the scene.</p>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-300">
                Use the Tailwind spacing scale. Start with 16px page gutters, 16?24px panel padding,
                and 44px touch targets.
              </p>
            </div>
          </div>
        </section>

        <section id="components" className="scroll-mt-6 border-t border-white/10 py-12 sm:py-16">
          <p className={eyebrow}>03 / Components</p>
          <h2 className={sectionTitle}>Controls and surfaces</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <article className="flex flex-col justify-between gap-8 rounded-3xl bg-neutral-900 p-5 sm:p-8">
              <div>
                <p className={eyebrow}>Actions</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">One clear next step</h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-neutral-300">
                  Use a solid fill for the main action. Keep secondary actions translucent.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/" className={glassPrimary} prefetch={false}>
                  Open worlds <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
                <a href="#guidelines" className={glassSecondary}>
                  Read guidelines
                </a>
              </div>
            </article>
            <article className="flex flex-col gap-4 rounded-3xl bg-neutral-900 p-5 sm:p-8">
              <div>
                <p className={eyebrow}>Panel / field / status</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">Make state visible</h3>
              </div>
              <div className={`${glassPanel} flex flex-col gap-4 p-4 sm:p-5`}>
                <label className="flex flex-col gap-2 text-sm font-medium">
                  World name
                  <input
                    className={glassField}
                    type="text"
                    placeholder="Try typing a name"
                    aria-describedby="world-name-hint"
                  />
                </label>
                <p id="world-name-hint" className="text-xs text-neutral-300">
                  Example field. Changes are not saved.
                </p>
                <span className="inline-flex items-center gap-2 self-start rounded-full bg-white/10 px-3 py-1.5 text-xs">
                  <CircleCheck aria-hidden="true" className="size-4 text-emerald-300" /> Preview
                  ready
                </span>
              </div>
            </article>
          </div>
        </section>

        <section id="guidelines" className="scroll-mt-6 border-t border-white/10 py-12 sm:py-16">
          <p className={eyebrow}>04 / Guidelines</p>
          <h2 className={sectionTitle}>Working over artwork</h2>
          <ol className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {guidelines.map(({ title, text }, index) => (
              <li key={title} className="flex gap-4 border-t border-white/10 pt-4">
                <span aria-hidden="true" className={`${eyebrow} pt-1`}>
                  0{index + 1}
                </span>
                <div>
                  <h3 className="text-lg font-medium">{title}</h3>
                  <p className="mt-1 max-w-lg text-sm leading-relaxed text-neutral-300">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 py-5">
          <span className={`${eyebrow} inline-flex items-center gap-2`}>
            <Compass aria-hidden="true" className="size-4" /> OnceMore / Glass system
          </span>
          <a href="#glass-title" className={docLink}>
            Back to top
          </a>
        </footer>
      </div>
    </div>
  );
}
