import type { SequenceOptions, SequenceSource } from "@/lib/frame-sequence";

const WIDTH = 1920;
const HEIGHT = 1024;

export const MIB_POSTER = "/mib2/hair-clean-v2/opening.webp";

export const MIB_SEQUENCE: SequenceSource = {
  root: "/mib2/hair-clean-v2/frames",
  count: 330,
  width: WIDTH,
  height: HEIGHT,
  maxDpr: 1.5,
};

// Focus points in the original shot. Portrait viewports follow the subject
// instead of permanently cropping the woman, muzzle, or travelling bullet.
const FOCUS = [
  [0, 0.395],
  [1.5, 0.395],
  [2, 0.37],
  [3, 0.61],
  [4, 0.52],
  [5, 0.5],
  [6, 0.5],
  [7, 0.625],
  [8, 0.625],
  [9, 0.77],
  [9.5, 0.815],
  [10, 0.78],
  [10.97, 0.5],
  [11, 0.5],
];

export function focalPoint(frame: number) {
  const time = frame / 30;
  for (let i = 1; i < FOCUS.length; i++) {
    const [end, to] = FOCUS[i];
    const [start, from] = FOCUS[i - 1];
    if (time <= end) {
      const t = Math.max(0, (time - start) / (end - start));
      return from + (to - from) * t * t * (3 - 2 * t);
    }
  }
  return 0.5;
}

const cropX = (frame: number, sw: number) =>
  Math.max(0, Math.min(WIDTH - sw, focalPoint(frame) * WIDTH - sw / 2));

export function mibOptions(canvas: HTMLCanvasElement): SequenceOptions {
  return {
    ...MIB_SEQUENCE,
    // On ultrawide screens crop from below, preserving the woman's head.
    crop: (frame, sw) => [cropX(frame, sw), 0],
    // Align the CSS poster with the canvas's first-frame framing.
    onResize: (width, height) => {
      const sw = Math.min(WIDTH, (width / height) * HEIGHT);
      const position = sw < WIDTH ? (cropX(0, sw) / (WIDTH - sw)) * 100 : 50;
      canvas.parentElement?.style.setProperty("--poster-x", `${position}%`);
    },
  };
}
