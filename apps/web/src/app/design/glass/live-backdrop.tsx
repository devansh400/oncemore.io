"use client";

import { ChevronLeft, ChevronRight, Layers3 } from "lucide-react";
import Image from "next/image";
import { type ReactNode, useEffect, useRef, useState } from "react";

import { loadFloatingWorlds } from "@/floating-worlds/load-scene";
import type { SceneController, SceneState } from "@/floating-worlds/scene-types";
import { SceneEdgeBlur } from "@/floating-worlds/scene-edge-blur";
import { glassFocus, glassInsetAction, glassPanel } from "@/lib/glass";

const moods = ["Dusk", "Storm", "Golden hour", "Bright", "Blue hour", "Artwork"] as const;
type Mood = (typeof moods)[number];

const control = `${glassInsetAction} min-w-11 cursor-pointer disabled:cursor-default disabled:opacity-50 aria-pressed:bg-white aria-pressed:text-neutral-950`;

export function LiveBackdrop({
  navigation,
  intro,
  children,
}: {
  navigation: ReactNode;
  intro: ReactNode;
  children: ReactNode;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const controller = useRef<SceneController | null>(null);
  const moodRef = useRef<Mood>("Dusk");
  const [mood, setMood] = useState<Mood>("Dusk");
  const [scene, setScene] = useState<SceneState | null>(null);
  const [failed, setFailed] = useState(false);
  const [reduceMotion, setReduceMotion] = useState<boolean | null>(null);
  const [useStill, setUseStill] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setScene(null);
      setReduceMotion(preference.matches);
    };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  const live = reduceMotion === false && !useStill && !failed;

  useEffect(() => {
    const element = canvas.current;
    if (!live || !element) return;
    let active = true;

    async function mount(element: HTMLCanvasElement) {
      try {
        const { mountFloatingWorlds } = await loadFloatingWorlds();
        if (!active) return;
        controller.current = mountFloatingWorlds(element, {
          ignoreInput: () => true,
          lookStorageKey: null,
          onScene: setScene,
          onLook: () => {},
          onProgress: () => {},
          onVeil: () => {},
          onError: () => setFailed(true),
        });
        controller.current.setPreset(moodRef.current);
      } catch {
        if (active) setFailed(true);
      }
    }

    const onContextLost = () => setFailed(true);
    element.addEventListener("webglcontextlost", onContextLost);
    void mount(element);
    return () => {
      active = false;
      element.removeEventListener("webglcontextlost", onContextLost);
      controller.current?.dispose();
      controller.current = null;
    };
  }, [live]);

  function changeMood(nextMood: Mood) {
    moodRef.current = nextMood;
    setMood(nextMood);
    controller.current?.setPreset(nextMood);
  }

  const stop = scene?.stop ?? 0;
  const count = (scene?.worlds.length ?? 0) + 1;
  const ready = live && scene?.ready;
  const viewpoint = ready && stop !== 0 ? `Island ${stop} / ${count - 1}` : "All islands";

  return (
    <div className="relative isolate min-h-svh bg-neutral-950">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0">
        {!ready && (
          <Image
            src={`/brand/looks/${mood.toLowerCase().replace(" ", "-")}/floating-worlds.webp`}
            alt=""
            fill
            sizes="100vw"
            preload
            className="object-cover"
          />
        )}
        {live && (
          <canvas
            ref={canvas}
            data-glass-backdrop
            className={`absolute inset-0 size-full ${ready ? "" : "invisible"}`}
          />
        )}
        <SceneEdgeBlur />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
        <section
          id="top"
          className="flex min-h-svh flex-col justify-between gap-32 pt-5 pb-8 sm:pb-12"
        >
          {navigation}
          <div className="grid items-end gap-4 md:grid-cols-2">
            {intro}
            <aside
              aria-label="Scene controls"
              className={`${glassPanel} w-full max-w-sm justify-self-end p-4 sm:p-5`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="flex items-center gap-2 font-mono text-xs tracking-wide uppercase">
                  <Layers3 aria-hidden="true" className="size-4" /> Scene controls
                </p>
                <span role="status" className="rounded-full bg-white/10 px-2 py-1 text-xs">
                  {ready ? "Live" : live ? "Loading" : "Still"}
                </span>
              </div>
              <div role="group" aria-label="Scene lighting" className="mt-4 flex flex-wrap gap-2">
                {moods.map((name) => (
                  <button
                    key={name}
                    type="button"
                    className={control}
                    aria-pressed={mood === name}
                    onClick={() => changeMood(name)}
                  >
                    {name}
                  </button>
                ))}
              </div>
              <div
                role="group"
                aria-label="Scene viewpoint"
                className="mt-3 flex items-center gap-2"
              >
                <button
                  type="button"
                  className={control}
                  aria-label="Previous viewpoint"
                  disabled={!ready || scene?.moving}
                  onClick={() => controller.current?.goTo((stop + count - 1) % count)}
                >
                  <ChevronLeft aria-hidden="true" className="size-4" />
                </button>
                <button
                  type="button"
                  className={`${control} flex-1`}
                  disabled={!ready || scene?.moving || stop === 0}
                  onClick={() => controller.current?.goTo(0)}
                >
                  {viewpoint}
                </button>
                <button
                  type="button"
                  className={control}
                  aria-label="Next viewpoint"
                  disabled={!ready || scene?.moving}
                  onClick={() => controller.current?.goTo((stop + 1) % count)}
                >
                  <ChevronRight aria-hidden="true" className="size-4" />
                </button>
              </div>
              <div className="mt-3 flex min-h-11 items-center text-xs text-neutral-200">
                {failed ? (
                  "WebGL unavailable; showing a still."
                ) : reduceMotion ? (
                  "Still view follows your reduced-motion setting."
                ) : (
                  <button
                    type="button"
                    className={`${glassFocus} min-h-11 cursor-pointer rounded-md underline underline-offset-4`}
                    onClick={() => {
                      setScene(null);
                      setUseStill((value) => !value);
                    }}
                  >
                    {useStill ? "Resume live backdrop" : "Use a still backdrop"}
                  </button>
                )}
              </div>
            </aside>
          </div>
        </section>
        {children}
      </div>
    </div>
  );
}
