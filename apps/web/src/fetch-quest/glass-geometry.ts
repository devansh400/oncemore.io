/*
 * Procedural glass damage, seeded so a pane always cracks the same way.
 * Cracks are jagged polylines grown from the point where the howl hits;
 * shards are cells between radial rays and two rings around that point.
 */

export type Point = [x: number, y: number];
export type Crack = { d: string; stage: number; width: number };
export type Shard = { points: Point[]; centre: Point };

export function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function path(points: Point[]) {
  return points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
}

function clampTo(point: Point, width: number, height: number): Point {
  return [Math.min(width, Math.max(0, point[0])), Math.min(height, Math.max(0, point[1]))];
}

/** A jagged line from `from` heading `angle`, wandering a little each step. */
function jagged(
  random: () => number,
  from: Point,
  angle: number,
  length: number,
  width: number,
  height: number,
) {
  const points: Point[] = [from];
  let [x, y] = from;
  let heading = angle;
  let travelled = 0;
  while (travelled < length) {
    const step = 10 + random() * 18;
    heading += (random() - 0.5) * 0.7;
    x += Math.cos(heading) * step;
    y += Math.sin(heading) * step;
    travelled += step;
    points.push(clampTo([x, y], width, height));
    if (x <= 0 || x >= width || y <= 0 || y >= height) break;
  }
  return points;
}

/**
 * Cracks for a pane, split into `stages`: one stage appears per character.
 * Early stages are short star cracks at the impact; later ones run to the
 * edges and add concentric arcs, so the glass reads as more and more stressed.
 */
export function crackPattern({
  width,
  height,
  impact,
  stages,
  seed,
}: {
  width: number;
  height: number;
  impact: Point;
  stages: number;
  seed: number;
}): Crack[] {
  const random = seeded(seed);
  const cracks: Crack[] = [];
  const reach = Math.hypot(width, height);
  const tips: Point[] = [impact];

  for (let stage = 0; stage < stages; stage++) {
    const progress = (stage + 1) / stages;
    // Mostly away from the dog (to the right), but all round the impact.
    const angle = (stage * 2.399 + random() * 0.8) % (Math.PI * 2);
    const length = reach * (0.14 + progress * 0.6) * (0.7 + random() * 0.5);
    const main = jagged(random, impact, angle, length, width, height);
    cracks.push({ d: path(main), stage, width: 1.6 - progress * 0.4 });
    tips.push(main[main.length - 1]);

    // A branch from somewhere along this crack.
    if (main.length > 3) {
      const fork = main[1 + Math.floor(random() * (main.length - 2))];
      const branch = jagged(
        random,
        fork,
        angle + (random() < 0.5 ? -1 : 1) * (0.5 + random() * 0.6),
        length * (0.25 + random() * 0.35),
        width,
        height,
      );
      cracks.push({ d: path(branch), stage, width: 0.9 });
    }

    // Concentric fractures appear once the pane is half gone.
    if (progress > 0.45) {
      const radius = reach * (0.08 + progress * 0.22) * (0.8 + random() * 0.4);
      const start = random() * Math.PI * 2;
      const sweep = 0.6 + random() * 1.1;
      const arc: Point[] = [];
      for (let i = 0; i <= 6; i++) {
        const a = start + (sweep * i) / 6;
        const r = radius * (0.92 + random() * 0.16);
        arc.push(clampTo([impact[0] + Math.cos(a) * r, impact[1] + Math.sin(a) * r], width, height));
      }
      cracks.push({ d: path(arc), stage, width: 0.8 });
    }
  }
  return cracks;
}

/** Where a ray from `origin` at `angle` leaves the rectangle. */
function exit(origin: Point, angle: number, width: number, height: number) {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  let t = Infinity;
  if (dx > 1e-6) t = Math.min(t, (width - origin[0]) / dx);
  if (dx < -1e-6) t = Math.min(t, -origin[0] / dx);
  if (dy > 1e-6) t = Math.min(t, (height - origin[1]) / dy);
  if (dy < -1e-6) t = Math.min(t, -origin[1] / dy);
  return t;
}

function along(origin: Point, angle: number, distance: number): Point {
  return [origin[0] + Math.cos(angle) * distance, origin[1] + Math.sin(angle) * distance];
}

function centroid(points: Point[]): Point {
  const sum = points.reduce(([x, y], [px, py]) => [x + px, y + py], [0, 0]);
  return [sum[0] / points.length, sum[1] / points.length];
}

/** Break the pane into shards around the impact. */
export function shardPattern({
  width,
  height,
  impact,
  seed,
  rays = 9,
}: {
  width: number;
  height: number;
  impact: Point;
  seed: number;
  rays?: number;
}): Shard[] {
  const random = seeded(seed * 7 + 3);
  const tau = Math.PI * 2;
  const angles = Array.from(
    { length: rays },
    (_, i) => (i / rays) * tau + (random() - 0.5) * (tau / rays) * 0.7,
  ).sort((a, b) => a - b);
  const reach = Math.hypot(width, height);
  const rings = [reach * 0.1, reach * 0.24];
  const corners: Point[] = [
    [0, 0],
    [width, 0],
    [width, height],
    [0, height],
  ];
  const cornerAngles = corners.map(([x, y]) => {
    const a = Math.atan2(y - impact[1], x - impact[0]);
    return a < 0 ? a + tau : a;
  });

  const ringPoint = (angle: number, ring: number) => {
    const limit = exit(impact, angle, width, height) * 0.9;
    return along(impact, angle, Math.min(rings[ring] * (0.85 + random() * 0.3), limit));
  };

  const shards: Shard[] = [];
  for (let i = 0; i < angles.length; i++) {
    const a = angles[i];
    let b = angles[(i + 1) % angles.length];
    if (b <= a) b += tau;

    const innerA = ringPoint(a, 0);
    const innerB = ringPoint(b, 0);
    const middleA = ringPoint(a, 1);
    const middleB = ringPoint(b, 1);
    const edgeA = along(impact, a, exit(impact, a, width, height));
    const edgeB = along(impact, b, exit(impact, b, width, height));

    const between = corners
      .map((corner, index) => {
        let angle = cornerAngles[index];
        if (angle < a) angle += tau;
        return { corner, angle };
      })
      .filter(({ angle }) => angle > a && angle < b)
      .sort((x, y) => x.angle - y.angle)
      .map(({ corner }) => corner);

    const cells: Point[][] = [
      [impact, innerA, innerB],
      [innerA, middleA, middleB, innerB],
      [middleA, edgeA, ...between, edgeB, middleB],
    ];
    for (const points of cells) shards.push({ points, centre: centroid(points) });
  }
  return shards;
}
