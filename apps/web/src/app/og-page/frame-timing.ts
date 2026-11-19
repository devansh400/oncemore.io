import timing from "./frame-timing.json";

export const FRAME_COUNT = timing.timestamps.length;

// Asset spacing varies: original 24fps images in glare/whip-pan sections,
// 60fps images elsewhere. Preserve source time instead of changing shot speed.
export function frameAtProgress(progress: number) {
  const timestamps = timing.timestamps;
  const tick = Math.max(0, Math.min(1, progress)) * timestamps[FRAME_COUNT - 1];
  let low = 0;
  let high = FRAME_COUNT - 1;
  while (low < high) {
    const middle = Math.ceil((low + high) / 2);
    if (timestamps[middle] <= tick) low = middle;
    else high = middle - 1;
  }
  if (low === FRAME_COUNT - 1) return low;
  const position = low + (tick - timestamps[low]) / (timestamps[low + 1] - timestamps[low]);
  // Never morph or double-expose the headlights. These moments display a
  // single authentic source image; the scroll playhead still eases normally.
  const original = timing.originalRanges.some(([start, end]) => tick >= start && tick <= end);
  return original ? Math.round(position) : position;
}
