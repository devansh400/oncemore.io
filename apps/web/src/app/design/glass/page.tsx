import { ArrowDown, Compass } from "lucide-react";
import type { Metadata } from "next";

import { WorldsNav } from "@/components/worlds-nav";
import { glassFocus, glassPanel, glassPill, glassPrimary } from "@/lib/glass";

import { brandBody, brandDisplay } from "../brand-fonts";
import { ComponentGallery } from "./component-gallery";
import { LiveBackdrop } from "./live-backdrop";

export const metadata: Metadata = {
  title: "Glass over worlds | OnceMore Design",
  description:
    "An interactive glass component gallery over the live OnceMore Floating Worlds scene.",
};

const eyebrow = "font-mono text-xs font-medium tracking-widest text-neutral-200 uppercase";
const display = brandDisplay.className;
const sectionTitle = `${display} mt-2 text-3xl font-medium tracking-tight sm:text-5xl`;
const docLink = `${glassFocus} inline-flex min-h-11 items-center gap-1 rounded-full px-2 text-sm hover:bg-white/10 sm:px-3`;

const recipes = [
  { label: "Navigation", value: "15% tint / Pill", classes: glassPill },
  { label: "Reading panel", value: "60% tint / 2XL radius", classes: glassPanel },
] as const;

const guidelines = [
  {
    title: "Let the art lead",
    text: "Place glass at the edges and leave a clear view of the scene. Keep filters on the outermost surface rather than stacking glass inside glass.",
  },
  {
    title: "Earn the opacity",
    text: "Use the lighter tint for short labels. Move longer copy to a denser panel, and use a solid surface if the artwork still competes.",
  },
  {
    title: "Check the brightest frame",
    text: "Change the lighting and camera view before shipping. Give every control a visible keyboard focus outline. Pair status color with text or an icon.",
  },
  {
    title: "Keep motion in the scene",
    text: "Skip decorative shimmer and drifting glass. Use a still backdrop for reduced motion and never hijack scrolling to navigate a showcase.",
  },
] as const;

export default function GlassDesignPage() {
  return (
    <div className={`${brandBody.className} text-white`}>
      <LiveBackdrop
        navigation={<WorldsNav className="mx-auto w-full max-w-3xl" wordmarkClassName={display} />}
        intro={
          <div className={`${glassPanel} max-w-xl p-5 sm:p-8`}>
            <p className={eyebrow}>01 / Live material study</p>
            <h1
              id="glass-title"
              className={`${display} mt-3 text-5xl leading-none font-medium tracking-tighter sm:text-7xl`}
            >
              Glass over worlds.
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-neutral-200 sm:text-lg">
              The live landing scene stays behind every component. Change the light or fly closer to
              see where each surface holds up.
            </p>
            <a href="#components" className={`${glassPrimary} mt-5`}>
              Explore components <ArrowDown aria-hidden="true" className="size-4" />
            </a>
          </div>
        }
      >
        <section
          id="components"
          aria-labelledby="components-title"
          className="scroll-mt-5 py-10 sm:py-16"
        >
          <div className={`${glassPanel} mb-4 max-w-xl p-5 sm:p-6`}>
            <p className={eyebrow}>02 / shadcn/ui showcase</p>
            <h2 id="components-title" className={sectionTitle}>
              Try the components
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-200">
              A scene workspace built with shadcn/ui. Try the forms, menus, overlays, and table
              together, or change the glass density while the world moves behind them.
            </p>
          </div>
          <ComponentGallery
            bodyClassName={brandBody.className}
            displayVariable={brandDisplay.variable}
          />
        </section>

        <section
          id="foundations"
          aria-labelledby="foundations-title"
          className={`${glassPanel} scroll-mt-5 p-5 sm:p-8`}
        >
          <p className={eyebrow}>03 / Foundations</p>
          <h2 id="foundations-title" className={sectionTitle}>
            What the glass is made of
          </h2>
          <p className="mt-3 max-w-xl leading-relaxed text-neutral-200">
            Start with a one-pixel white edge at 5%, large backdrop blur, and 150% saturation. No
            sheen or drop shadow. Keep the glass and typography neutral so the artwork sets the
            mood.
          </p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            {recipes.map(({ label, value, classes }) => (
              <div
                key={label}
                className="min-w-0 rounded-xl border border-white/10 bg-neutral-950/25 p-4"
              >
                <dt className={eyebrow}>{label}</dt>
                <dd className="mt-2">
                  <p className={`${display} text-xl font-medium`}>{value}</p>
                  <code className="mt-2 block font-mono text-xs leading-relaxed text-neutral-200">
                    {classes}
                  </code>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-sm leading-relaxed text-neutral-200">
            Bricolage Grotesque for titles, DM Sans for reading and controls, and Geist Mono for
            technical labels. Use the Tailwind spacing scale and 44px targets for primary controls.
          </p>
        </section>

        <section
          id="guidelines"
          aria-labelledby="guidelines-title"
          className={`${glassPanel} mt-4 scroll-mt-5 p-5 sm:p-8`}
        >
          <p className={eyebrow}>04 / Guidelines</p>
          <h2 id="guidelines-title" className={sectionTitle}>
            Working over artwork
          </h2>
          <ol className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {guidelines.map(({ title, text }, index) => (
              <li key={title} className="flex gap-3 border-t border-white/10 pt-4">
                <span aria-hidden="true" className={`${eyebrow} pt-1`}>
                  0{index + 1}
                </span>
                <div>
                  <h3 className={`${display} text-lg font-medium`}>{title}</h3>
                  <p className="mt-1 max-w-md text-sm leading-relaxed text-neutral-200">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-2 py-6">
          <span className={`${glassPanel} ${eyebrow} inline-flex min-h-11 items-center gap-2 px-3`}>
            <Compass aria-hidden="true" className="size-4" /> OnceMore / Glass system
          </span>
          <a href="#top" className={`${glassPanel} ${docLink}`}>
            Back to top
          </a>
        </footer>
      </LiveBackdrop>
    </div>
  );
}
