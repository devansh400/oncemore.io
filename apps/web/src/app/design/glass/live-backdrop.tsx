"use client";

import { ChevronLeft, ChevronRight, Layers3 } from "lucide-react";
import Image from "next/image";
import { type ReactNode, useEffect, useRef, useState } from "react";

import { loadFloatingWorlds } from "@/floating-worlds/load-scene";
import type { SceneController, SceneState } from "@/floating-worlds/scene-types";
import {
  edgeBlurOverUi,
  edgeBlurUnderUi,
  SceneEdgeBlur,
} from "@/floating-worlds/scene-edge-blur";
import { glassEyebrow, glassFocus, glassReading } from "@/lib/glass";

const moods = ["Dusk", "Storm", "Golden hour", "Bright", "Blue hour", "Artwork"] as const;
type Mood = (typeof moods)[number];

const control = `${glassFocus} glass-control inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full font-medium disabled:cursor-default disabled:opacity-45`;

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
        {/* The scene's share of the edge blur; the UI layers below add the rest. */}
        <SceneEdgeBlur edge="top" strength={edgeBlurUnderUi} />
        <SceneEdgeBlur strength={edgeBlurUnderUi} />
        {/* A low dusk gradient keeps type legible without boxing it in. */}
        <div className="absolute inset-0 bg-linear-to-t from-[rgb(5_8_14/0.6)] via-transparent to-[rgb(5_8_14/0.25)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
        <section
          id="top"
          className="flex min-h-svh flex-col justify-between gap-24 pt-5 pb-8 sm:pb-12"
        >
          {navigation}
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            {intro}
            <aside
              aria-label="Scene controls"
              className={`${glassReading} w-full max-w-sm justify-self-start p-5 lg:justify-self-end`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className={`${glassEyebrow} flex items-center gap-2`}>
                  <Layers3 aria-hidden="true" className="size-3.5" /> The scene
                </p>
                <span
                  role="status"
                  className="glass-control inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs"
                >
                  <span aria-hidden="true" className="glass-dot" data-live={Boolean(ready)} />
                  {ready ? "Live" : live ? "Loading" : "Still"}
                </span>
              </div>
              <p className={`${glassEyebrow} mt-5 mb-2`}>Lighting</p>
              <div role="group" aria-label="Scene lighting" className="grid grid-cols-3 gap-1.5">
                {moods.map((name) => (
                  <button
                    key={name}
                    type="button"
                    className={`${control} px-2 text-xs`}
                    aria-pressed={mood === name}
                    onClick={() => changeMood(name)}
                  >
                    {name}
                  </button>
                ))}
              </div>
              <p className={`${glassEyebrow} mt-5 mb-2`}>Viewpoint</p>
              <div role="group" aria-label="Scene viewpoint" className="flex items-center gap-1.5">
                <button
                  type="button"
                  className={`${control} px-0`}
                  aria-label="Previous viewpoint"
                  disabled={!ready || scene?.moving}
                  onClick={() => controller.current?.goTo((stop + count - 1) % count)}
                >
                  <ChevronLeft aria-hidden="true" className="size-4" />
                </button>
                <button
                  type="button"
                  className={`${control} flex-1 px-3 font-mono text-xs tracking-wider`}
                  disabled={!ready || scene?.moving || stop === 0}
                  onClick={() => controller.current?.goTo(0)}
                >
                  {viewpoint}
                </button>
                <button
                  type="button"
                  className={`${control} px-0`}
                  aria-label="Next viewpoint"
                  disabled={!ready || scene?.moving}
                  onClick={() => controller.current?.goTo((stop + 1) % count)}
                >
                  <ChevronRight aria-hidden="true" className="size-4" />
                </button>
              </div>
              <div className="mt-4 flex min-h-11 items-center border-t border-[rgb(237_230_214/0.06)] pt-3 text-xs text-[rgb(237_230_214/0.62)]">
                {failed ? (
                  "WebGL is unavailable, so this is a still."
                ) : reduceMotion ? (
                  "A still view, following your reduced-motion setting."
                ) : (
                  <button
                    type="button"
                    className={`${glassFocus} min-h-11 cursor-pointer rounded-md underline decoration-[rgb(237_230_214/0.3)] underline-offset-4 hover:text-[#ede6d6]`}
                    onClick={() => {
                      setScene(null);
                      setUseStill((value) => !value);
                    }}
                  >
                    {useStill ? "Resume the live backdrop" : "Use a still backdrop"}
                  </button>
                )}
              </div>
            </aside>
          </div>
        </section>
        {children}
      </div>
      {/*
       * Content scrolling past either edge softens with the scene behind it.
       * The navbar and footer sit at z-40 so they always stay sharp.
       */}
      <SceneEdgeBlur className="fixed z-30" edge="top" strength={edgeBlurOverUi} />
      <SceneEdgeBlur className="fixed z-30" strength={edgeBlurOverUi} />
    </div>
  );
}
