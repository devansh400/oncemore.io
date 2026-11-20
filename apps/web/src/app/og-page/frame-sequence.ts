import type { SequenceOptions, SequenceSource } from "@/lib/frame-sequence";
import { FRAME_COUNT } from "./frame-timing";

export const OG_POSTER = "/og-car/v4/opening.webp";

export const OG_SEQUENCE: SequenceSource = {
  root: "/og-car/v4/frames",
  count: FRAME_COUNT,
  width: 1920,
  height: 1080,
  maxDpr: 2,
};

export const OG_OPTIONS: SequenceOptions = {
  ...OG_SEQUENCE,
  // Centered cover framing.
  crop: (_frame, sw, sh) => [
    Math.max(0, Math.min(OG_SEQUENCE.width - sw, 0.5 * OG_SEQUENCE.width - sw / 2)),
    (OG_SEQUENCE.height - sh) / 2,
  ],
};
