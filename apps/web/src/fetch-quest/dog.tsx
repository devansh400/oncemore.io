"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";

/*
 * The dog. Every pose is a painted 1024×1024 transparent frame from
 * media/fetch-quest (Codex), facing right, paws on a ground line at y = 900,
 * at one fixed scale, so poses swap without jitter. All frames are stacked
 * and toggled directly, so switching never waits on a decode.
 */

export const poseNames = [
  "sit-idle",
  "look-up",
  "head-tilt",
  "crouch",
  "leap",
  "snap",
  "land",
  "tumble",
  "sniff",
  "sneeze",
  "run-1",
  "run-2",
  "howl-start",
  "howl",
  "whine",
  "proud-sit",
  "carry-1",
  "carry-2",
  "carry-sit",
  "sleep",
] as const;

export type Pose = (typeof poseNames)[number];

/**
 * Poses with painted art (WebP). Every other pose uses the vector rig's frame
 * (vector-dog.ts, built to SVG by scripts/build-fetch-dog.ts). Add a pose
 * here once its painted frame is in public/fetch-quest/poses.
 */
const painted = new Set<Pose>([]);
/** Poses the vector rig draws. */
const drawn = new Set<Pose>(poseNames);

export const isPainted = (pose: Pose) => painted.has(pose);
const hasFrame = (pose: Pose) => painted.has(pose) || drawn.has(pose);
const frameSource = (pose: Pose) =>
  `/fetch-quest/poses/${pose}.${painted.has(pose) ? "webp" : "svg"}`;

const stand: Partial<Record<Pose, Pose>> = {
  "look-up": "sit-idle",
  "head-tilt": "sit-idle",
  crouch: "sit-idle",
  snap: "leap",
  land: "sit-idle",
  tumble: "leap",
  sniff: "sit-idle",
  sneeze: "sit-idle",
  "run-1": "leap",
  "run-2": "leap",
  "howl-start": "howl",
  whine: "sit-idle",
  "proud-sit": "sit-idle",
  "carry-1": "sit-idle",
  "carry-2": "sit-idle",
  "carry-sit": "sit-idle",
  sleep: "sit-idle",
};

export function frameFor(pose: Pose): Pose {
  return hasFrame(pose) ? pose : (stand[pose] ?? "sit-idle");
}

export const runCycle: Pose[] = ["run-1", "run-2"];
export const carryCycle: Pose[] = ["carry-1", "carry-2"];

/** Where the dog's ground point sits in the frame (fractions of the frame). */
export const groundPoint = { x: 0.5, y: 900 / 1024 };

/**
 * Where the mouth is in each frame, as fractions, for holding the ticket.
 * From the vector rig (scripts/build-fetch-dog.ts prints them); re-check
 * against painted frames when they replace these.
 */
export const mouthPoint: Partial<Record<Pose, [number, number]>> = {
  "sit-idle": [0.667, 0.522],
  "proud-sit": [0.653, 0.506],
  "carry-sit": [0.657, 0.516],
  "carry-1": [0.744, 0.572],
  "carry-2": [0.744, 0.578],
  leap: [0.698, 0.385],
  snap: [0.715, 0.414],
};

/** The howling muzzle, where the sound rings start. */
export const howlMouth: [number, number] = [0.55, 0.37];

/** The visible dog fills about this much of its frame's width. */
export const figureShare = 0.55;

export type DogHandle = {
  element: HTMLDivElement | null;
  setPose: (pose: Pose) => void;
  pose: () => Pose;
};

export const Dog = forwardRef<DogHandle, { className?: string; initialPose?: Pose }>(function Dog(
  { className, initialPose = "sit-idle" },
  ref,
) {
  const root = useRef<HTMLDivElement>(null);
  const current = useRef<Pose>(initialPose);

  useImperativeHandle(ref, () => ({
    get element() {
      return root.current;
    },
    setPose(pose: Pose) {
      if (current.current === pose) return;
      current.current = pose;
      const frame = frameFor(pose);
      root.current?.setAttribute("data-pose", pose);
      root.current?.querySelectorAll<HTMLImageElement>("img[data-frame]").forEach((image) => {
        image.style.visibility = image.dataset.frame === frame ? "visible" : "hidden";
      });
    },
    pose: () => current.current,
  }));

  const initialFrame = frameFor(initialPose);
  const frames = poseNames.filter(hasFrame);

  return (
    <div ref={root} className={className} data-pose={initialPose} aria-hidden="true">
      {frames.map((frame) => (
        // Plain <img>: these are stacked, pre-sized sprite frames, not content images.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={frame}
          data-frame={frame}
          src={frameSource(frame)}
          alt=""
          draggable={false}
          decoding="async"
          className="absolute inset-0 size-full select-none"
          style={{ visibility: frame === initialFrame ? "visible" : "hidden" }}
        />
      ))}
    </div>
  );
});
