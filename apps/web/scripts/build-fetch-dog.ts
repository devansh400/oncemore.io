// Run with: bun apps/web/scripts/build-fetch-dog.ts
// Writes every vector pose of the fetch-quest dog to
// public/fetch-quest/poses/<pose>.svg. Re-run after editing vector-dog.ts.
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { posePoints, renderDog, vectorPoseNames } from "../src/fetch-quest/vector-dog";

const out = fileURLToPath(new URL("../public/fetch-quest/poses/", import.meta.url));
await mkdir(out, { recursive: true });

for (const name of vectorPoseNames) {
  await writeFile(`${out}${name}.svg`, renderDog(name));
}
console.log(`Wrote ${vectorPoseNames.length} poses to ${out}`);
// Paste into dog.tsx (mouthPoint) and vault.tsx (howlMouth) if the rig changes.
console.log(JSON.stringify(posePoints));
