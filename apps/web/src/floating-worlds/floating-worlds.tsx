"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type ReactNode, type RefObject, useEffect, useRef, useState } from "react";

import { loadFloatingWorlds } from "./load-scene";
import { SceneEdgeBlur } from "./scene-edge-blur";
import type { LookState, SceneController, SceneState } from "./scene-types";

const initialScene: SceneState = {
  stop: 0,
  worlds: [],
  ready: false,
  moving: false,
  moved: false,
  diving: false,
  inside: false,
};
const numerals = ["I", "II", "III", "IV", "V"];
const label = "text-xs font-medium tracking-widest uppercase";
const technicalLabel = `font-mono ${label}`;
const lookAction =
  "cursor-pointer rounded-md border border-white/20 px-3 py-2 text-xs hover:bg-white/10 aria-pressed:bg-white aria-pressed:text-neutral-950";
const lookToggle =
  "flex min-h-12 cursor-pointer items-center gap-3 border-t border-white/20 py-2 text-xs";

function InputHint({ mouse, touch }: { mouse: string; touch: string }) {
  return (
    <>
      <span className="pointer-coarse:hidden">{mouse}</span>
      <span className="hidden pointer-coarse:inline">{touch}</span>
    </>
  );
}

function LookPanel({
  look,
  controller,
  displayClassName,
}: {
  look: LookState;
  controller: RefObject<SceneController | null>;
  displayClassName: string;
}) {
  const [copied, setCopied] = useState(false);
  const output = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  async function copySettings() {
    try {
      await navigator.clipboard.writeText(look.code);
      setCopied(true);
    } catch {
      output.current?.select();
    }
  }

  return (
    <>
      <h2 className={`${displayClassName} ${label} mb-3`}>Look</h2>
      <div className="mb-3.5 flex flex-wrap gap-1.5">
        {look.presets.map((name) => (
          <button
            className={lookAction}
            type="button"
            key={name}
            aria-pressed={name === look.name}
            onClick={() => controller.current?.setPreset(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <label className={lookToggle}>
        <input
          type="checkbox"
          className="size-4 shrink-0 accent-white"
          checked={look.hideCloudPath}
          onChange={(event) => controller.current?.setCloudPathHidden(event.currentTarget.checked)}
        />
        <span>
          Hide dense cloud path
          <small className="mt-0.5 block text-xs opacity-70">Compare against the open sky.</small>
        </span>
      </label>
      <label className={`${lookToggle} mb-3 border-b`}>
        <input
          type="checkbox"
          className="size-4 shrink-0 accent-white"
          checked={look.edgeVignetteEnabled}
          onChange={(event) => controller.current?.setVignetteEnabled(event.currentTarget.checked)}
        />
        <span>
          Enable edge vignette
          <small className="mt-0.5 block text-xs opacity-70">
            Darken the edges to frame the islands.
          </small>
        </span>
      </label>
      <div>
        {look.controls.map(([key, title, min, max]) => (
          <label className="mb-2 block text-xs has-disabled:opacity-40" key={key}>
            <span className="flex justify-between gap-2">
              {title}
              <span className="tabular-nums opacity-70">{look.values[key].toFixed(2)}</span>
            </span>
            <input
              className="block h-4 w-full accent-white"
              aria-label={title}
              type="range"
              min={min}
              max={max}
              step={0.01}
              value={look.values[key]}
              disabled={key === "vignette" && !look.edgeVignetteEnabled}
              onChange={(event) =>
                controller.current?.setLookValue(key, event.currentTarget.valueAsNumber)
              }
            />
          </label>
        ))}
      </div>
      <p className="mt-2 text-xs opacity-70">Send this line back to lock the look in:</p>
      <textarea
        ref={output}
        className="my-2 h-16 w-full resize-none rounded-md border border-white/20 bg-black/30 p-2 font-mono text-xs"
        aria-label="Current look settings"
        value={look.code}
        readOnly
      />
      <div className="flex gap-2">
        <button className={`${lookAction} flex-1`} type="button" onClick={copySettings}>
          {copied ? "Copied" : "Copy settings"}
        </button>
        <button
          className={`${lookAction} flex-1`}
          type="button"
          onClick={() => controller.current?.resetLook()}
        >
          Reset
        </button>
      </div>
    </>
  );
}

export function FloatingWorlds({
  bodyClassName,
  children,
  displayClassName,
}: {
  bodyClassName: string;
  children: ReactNode;
  displayClassName: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const controller = useRef<SceneController | null>(null);
  const [scene, setScene] = useState(initialScene);
  const [look, setLook] = useState<LookState | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [lookOpen, setLookOpen] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    const element = canvas.current;
    if (!element) return;

    async function mountScene(element: HTMLCanvasElement) {
      try {
        const { mountFloatingWorlds } = await loadFloatingWorlds();
        if (!active) return;
        controller.current = mountFloatingWorlds(element, {
          onScene: setScene,
          onLook: setLook,
          onProgress: setLoadingProgress,
          onVeil: (opacity) => {
            veil.current?.style.setProperty("opacity", String(opacity));
          },
          onError: () => {
            if (active) setFailed(true);
          },
        });
      } catch {
        if (active) setFailed(true);
      }
    }

    void mountScene(element);
    return () => {
      active = false;
      controller.current?.dispose();
      controller.current = null;
    };
  }, []);

  const island = scene.worlds[scene.stop - 1];
  const islandLabel = island ? `Island ${numerals[scene.stop - 1]}` : "Five floating worlds";
  const titleVisible = scene.ready && !scene.moving && !scene.diving;
  const loading = !scene.ready && !failed;
  const showLook = lookOpen && !scene.diving && !failed;

  return (
    <div
      className={`${bodyClassName} fixed inset-0 overflow-hidden overscroll-none bg-neutral-950 text-white **:focus-visible:outline-2 **:focus-visible:outline-white **:focus-visible:-outline-offset-2`}
    >
      <canvas
        ref={canvas}
        id="gl"
        tabIndex={0}
        aria-label="A 3D sky of floating islands. Scroll to fly between them."
        className="absolute inset-0 size-full touch-none"
        hidden={failed}
      />
      {!failed && look?.edgeVignetteEnabled !== false && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/50 to-transparent"
        />
      )}
      {failed && (
        <Image src="/brand/floating-worlds.webp" alt="" fill unoptimized className="object-cover" />
      )}
      <SceneEdgeBlur />
      <header
        data-world-controls
        data-diving={scene.diving}
        className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3 data-[diving=true]:invisible sm:px-6"
      >
        <span className={`${technicalLabel} tabular-nums opacity-80`}>
          {String(scene.stop).padStart(2, "0")} /{" "}
          {String(scene.worlds.length || 5).padStart(2, "0")}
        </span>
        {!failed && (
          <div className="flex items-center gap-4">
            <span className={`${label} hidden opacity-80 sm:inline`}>
              <InputHint mouse="Scroll" touch="Swipe" /> to fly
            </span>
            <button
              type="button"
              className={`${label} pointer-events-auto cursor-pointer rounded-lg bg-neutral-950/60 px-3 py-2 backdrop-blur-md hover:bg-neutral-950/75 aria-expanded:bg-white aria-expanded:text-neutral-950 disabled:opacity-50`}
              aria-expanded={showLook}
              aria-controls="look"
              disabled={!look}
              onClick={() => setLookOpen((open) => !open)}
            >
              Look
            </button>
          </div>
        )}
      </header>
      {scene.ready && !failed && !scene.diving && !showLook && (
        <nav
          className="absolute top-1/2 right-6 hidden -translate-y-1/2 flex-col gap-1 sm:flex"
          aria-label="Islands"
          data-world-controls
        >
          {[null, ...scene.worlds].map((world, index) => (
            <button
              key={index}
              className="group/dot flex h-6 w-8 cursor-pointer items-center justify-end rounded-md px-1"
              aria-label={world ? `Go to island ${index}: ${world.title}` : "All islands"}
              aria-current={scene.stop === index ? "step" : undefined}
              type="button"
              onClick={() => controller.current?.goTo(index)}
            >
              <span className="h-0.5 w-2 rounded-full bg-white/50 group-hover/dot:w-4 group-hover/dot:bg-white group-aria-[current=step]/dot:w-6 group-aria-[current=step]/dot:bg-white" />
            </button>
          ))}
        </nav>
      )}
      <section
        aria-live="polite"
        className="pointer-events-none absolute inset-x-4 bottom-8 opacity-0 motion-safe:transition-opacity data-[visible=true]:opacity-100 md:right-auto md:left-6 md:max-w-sm lg:max-w-md"
        data-visible={titleVisible || failed}
      >
        <p className={`${technicalLabel} text-white/80`}>{islandLabel}</p>
        <h1
          className={
            island
              ? `${displayClassName} mt-2 text-3xl font-medium tracking-tight sm:text-4xl lg:text-6xl`
              : "sr-only"
          }
        >
          {island?.title ?? "OnceMore Floating Worlds"}
        </h1>
        {failed && (
          <div className="mt-3 text-sm">
            <p>The 3D sky is unavailable.</p>
            <div className="pointer-events-auto mt-2 flex flex-wrap gap-4">
              <Link href="/og-page" className="underline">
                They Call Him OG
              </Link>
              <Link href="/mib-page" className="underline">
                Maa Inti Bangaaram
              </Link>
            </div>
          </div>
        )}
        {island && titleVisible && (
          <button
            type="button"
            className={`${label} pointer-events-auto mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-neutral-950/60 px-3 py-2 backdrop-blur-md hover:bg-neutral-950/75`}
            data-world-controls
            onClick={() => controller.current?.enter()}
          >
            <ChevronRight aria-hidden="true" className="size-4" />
            <span>
              <InputHint mouse="Click" touch="Tap" /> the island to enter
            </span>
          </button>
        )}
      </section>
      {!scene.moved && !scene.diving && !failed && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 opacity-70"
        >
          <span className={label}>
            <InputHint mouse="Scroll" touch="Swipe up" />
          </span>
          <span className="h-8 w-px bg-linear-to-b from-white to-transparent motion-safe:animate-pulse" />
        </div>
      )}
      <aside
        id="look"
        aria-label="Look settings"
        data-world-controls
        hidden={!showLook}
        className="absolute inset-x-4 bottom-4 z-20 max-h-1/2 overflow-auto overscroll-contain rounded-xl bg-neutral-950/90 p-4 backdrop-blur-md sm:top-16 sm:right-6 sm:bottom-auto sm:left-auto sm:max-h-4/5 sm:w-80"
      >
        {look && (
          <LookPanel look={look} controller={controller} displayClassName={displayClassName} />
        )}
      </aside>
      <div
        ref={veil}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-radial from-neutral-400 via-neutral-800 to-neutral-950 opacity-0"
      />
      <section
        className="pointer-events-none absolute inset-0 grid place-items-center bg-neutral-950 p-6 text-center opacity-0 motion-safe:transition-opacity motion-safe:duration-700 data-[open=true]:pointer-events-auto data-[open=true]:opacity-100"
        aria-label="Inside the island"
        data-open={scene.inside}
        inert={!scene.inside}
      >
        <div>
          <p className={`${technicalLabel} text-white/80`}>{islandLabel}</p>
          <h2
            className={`${displayClassName} my-4 text-3xl font-medium tracking-tight sm:text-5xl`}
          >
            {island?.title}
          </h2>
          <p className="mb-8 text-sm text-white/80">This world is still being built.</p>
          <button
            type="button"
            className={`${label} cursor-pointer rounded-lg border border-white/30 px-6 py-3 hover:bg-white/10`}
            data-world-controls
            onClick={() => controller.current?.leave()}
          >
            Back to the sky
          </button>
        </div>
      </section>
      <div
        className="absolute inset-0 z-30 grid place-items-center bg-neutral-950 motion-safe:transition-opacity motion-safe:duration-700 data-[done=true]:pointer-events-none data-[done=true]:opacity-0"
        data-done={!loading}
        inert={!loading}
      >
        <div className="flex flex-col items-center gap-4">
          <span className={`${technicalLabel} opacity-80`}>Entering the sky</span>
          <progress
            className="h-2 w-40 accent-white scheme-dark"
            aria-label="Loading the sky"
            max={1}
            value={loadingProgress}
          />
        </div>
      </div>
      <div hidden={scene.diving || showLook}>{children}</div>
    </div>
  );
}
