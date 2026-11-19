import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const web = fileURLToPath(new URL("../", import.meta.url));
const source = path.resolve(web, "../../output/og-car-source-review/frames");
const interpolated = path.join(web, "public/og-car/v2/frames");
const destination = path.join(web, "public/og-car/v3/frames");
// 120 ticks/second exactly represents both 24fps and 60fps timestamps.
// Keep authentic frames through the fast camera turns and direct headlight glare.
const originalRanges = [
  [48, 240],
  [1260, 1560],
];
const protectedTime = (tick) => originalRanges.some(([start, end]) => tick >= start && tick <= end);
const entries = [];
for (let frame = 0; frame < 816; frame++) {
  const tick = frame * 2;
  if (!protectedTime(tick)) entries.push({ tick, frame, original: false });
}
for (let frame = 0; frame < 328; frame++) {
  const tick = frame * 5;
  if (protectedTime(tick) || frame === 327) entries.push({ tick, frame, original: true });
}
entries.sort((a, b) => a.tick - b.tick);
await mkdir(destination, { recursive: true });
for (const [index, entry] of entries.entries()) {
  await copyFile(
    path.join(
      entry.original ? source : interpolated,
      `${String(entry.frame).padStart(3, "0")}.webp`,
    ),
    path.join(destination, `${String(index).padStart(3, "0")}.webp`),
  );
}
await copyFile(path.join(destination, "000.webp"), path.join(destination, "../opening.webp"));
await writeFile(
  path.join(web, "src/app/og-page/frame-timing.json"),
  JSON.stringify({
    ticksPerSecond: 120,
    originalRanges,
    timestamps: entries.map(({ tick }) => tick),
  }),
);
await writeFile(
  path.resolve(web, "../../output/og-car-source-review/v3-manifest.json"),
  JSON.stringify(entries, null, 2),
);
console.log(
  `Built ${entries.length} frames; ${entries.filter((entry) => entry.original).length} authentic source frames.`,
);
