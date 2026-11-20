"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode, type RefObject, useEffect, useRef, useState } from "react";

import { IslandCard } from "./island-card";
import { loadFloatingWorlds } from "./load-scene";
import { allEdges, SceneEdgeBlur } from "./scene-edge-blur";
import { SkyPreloader } from "./sky-preloader";
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
/*
 * Versioned so looks saved before the vignette became opt-in fall back to the
 * new defaults instead of keeping it switched on.
 */
const lookStorageKey = "oncemore:look-v2";
const edgeBlurKey = "oncemore:edge-blur";
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
  edgeBlur,
  onEdgeBlurChange,
}: {
  look: LookState;
  controller: RefObject<SceneController | null>;
  displayClassName: string;
  edgeBlur: boolean;
  onEdgeBlurChange: (enabled: boolean) => void;
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
      <label className={lookToggle}>
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
      <label className={`${lookToggle} mb-3 border-b`}>
        <input
          type="checkbox"
          className="size-4 shrink-0 accent-white"
          checked={edgeBlur}
          onChange={(event) => onEdgeBlurChange(event.currentTarget.checked)}
        />
        <span>
          Enable edge blur
          <small className="mt-0.5 block text-xs opacity-70">
            Soften every edge of the scene with a gradual blur.
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
          onClick={() => {
            controller.current?.resetLook();
            onEdgeBlurChange(true);
          }}
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
  const [edgeBlur, setEdgeBlur] = useState(true);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(edgeBlurKey) === "off") setEdgeBlur(false);
    } catch {}
  }, []);

  function changeEdgeBlur(enabled: boolean) {
    setEdgeBlur(enabled);
    try {
      window.localStorage.setItem(edgeBlurKey, enabled ? "on" : "off");
    } catch {}
  }

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
          lookStorageKey,
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
  /*
   * The card keeps showing the last island it settled on, so it fades out with
   * the right content when the camera leaves instead of swapping mid-flight.
   */
  const [cardIndex, setCardIndex] = useState(-1);
  if (titleVisible && island && cardIndex !== scene.stop - 1) setCardIndex(scene.stop - 1);
  const cardWorld = scene.worlds[cardIndex];
  const cardVisible = titleVisible && Boolean(island);

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
      {!failed && look?.edgeVignetteEnabled && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/50 to-transparent"
        />
      )}
      {failed && (
        <Image src="/brand/floating-worlds.webp" alt="" fill unoptimized className="object-cover" />
      )}
      {/* The full edge blur, over the scene only: every UI element paints above it and stays sharp. */}
      {edgeBlur && allEdges.map((edge) => <SceneEdgeBlur key={edge} edge={edge} />)}
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
      {cardWorld && !failed && !showLook && (
        /* Above the edge blur so the card stays sharp; scrolling over it still flies. */
        <section
          aria-live="polite"
          className="pointer-events-none absolute inset-x-4 bottom-6 z-20 translate-y-3 opacity-0 motion-safe:transition-[opacity,translate] motion-safe:duration-500 motion-safe:ease-out data-[visible=true]:pointer-events-auto data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100 sm:bottom-8 md:right-auto md:left-6 md:w-md"
          data-visible={cardVisible}
          inert={!cardVisible}
        >
          <IslandCard
            index={cardIndex}
            total={scene.worlds.length}
            world={cardWorld}
            displayClassName={displayClassName}
            onEnter={() => controller.current?.enter()}
          />
        </section>
      )}
      <section
        aria-live="polite"
        className="pointer-events-none absolute inset-x-4 bottom-8 opacity-0 motion-safe:transition-opacity data-[visible=true]:opacity-100 md:right-auto md:left-6 md:max-w-sm lg:max-w-md"
        data-visible={(titleVisible && !island) || failed}
      >
        <p className={`${technicalLabel} text-white/80`}>Five floating worlds</p>
        {!island && <h1 className="sr-only">OnceMore Floating Worlds</h1>}
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
      </section>
      {!scene.moved && !scene.diving && !failed && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 opacity-70"
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
          <LookPanel
            look={look}
            controller={controller}
            displayClassName={displayClassName}
            edgeBlur={edgeBlur}
            onEdgeBlurChange={changeEdgeBlur}
          />
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
      <SkyPreloader
        displayClassName={displayClassName}
        progress={loadingProgress}
        ready={!loading}
      />
      <div hidden={scene.diving || showLook}>{children}</div>
    </div>
  );
}
