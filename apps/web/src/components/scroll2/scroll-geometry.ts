const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};
export const OPENING_DURATION = 1.25;
export const PAPER_LEADER_WIDTH = 550;
// The reading pause belongs to the illustrated cover, after the leader passes.
export const COVER_START = OPENING_DURATION + 0.2;
export const TOTAL_DURATION = COVER_START + 7;

// Read right to left: one continuous roll turns left, revealing its inside.
export function scrollPose(time: number, width: number, height: number) {
  const unroll = smooth(time / 1.05);
  const expand = smooth((time - 0.72) / 0.5);
  const paperHeight = height * (0.84 + 0.16 * expand);
  const initialRadius = Math.min(height * 0.112, width * 0.135);
  const radius = initialRadius * Math.sqrt(1 - unroll * 0.34);
  const initialEdge = width * 0.5 + initialRadius;
  const edge = initialEdge * (1 - unroll) - radius * 0.1 * unroll;
  const freeEnd = initialEdge + (width * (0.95 + 0.05 * expand) - initialEdge) * unroll;
  // Feed the blank leader past the right edge as the roll opens. The artwork
  // reaches x=0 with the opening complete, then stays there for its reading beat.
  const stripRight = freeEnd + PAPER_LEADER_WIDTH * unroll;
  const paperRight = Math.min(width, stripRight);
  const x = edge - radius;
  // The printed face turns toward the left as the inner paper feeds out right.
  const rotation = -(initialEdge - edge) / ((initialRadius + radius) / 2);
  return {
    x,
    edge,
    radius,
    initialRadius,
    paperHeight,
    paperRight,
    stripRight,
    unroll,
    rotation,
    expand,
  };
}
