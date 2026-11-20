// Packs a sequence's preview tier into one coverage-ordered file so a first
// visit needs a single request (not hundreds of latency-bound ones) to cover
// the whole shot. Frames are written every 16th first, then every 4th, then
// the rest, so a streaming reader covers the shot coarsely within a few KB.
//
// Layout (little-endian): u32 count, count × (u16 frame, u32 byteLength),
// then each WebP in that order.
//
// Usage: node scripts/build-preview-pack.mjs public/og-car/v4/frames
import fs from "node:fs";
import path from "node:path";

const root = process.argv[2];
const dir = path.join(root, "preview");
const count = fs.readdirSync(dir).filter((file) => file.endsWith(".webp")).length;
const order = [];
const seen = new Set();
for (const stride of [16, 4, 1])
  for (let index = 0; index < count; index += stride)
    if (!seen.has(index)) seen.add(index), order.push(index);

const files = order.map((index) => fs.readFileSync(path.join(dir, `${String(index).padStart(3, "0")}.webp`)));
const header = Buffer.alloc(4 + order.length * 6);
header.writeUInt32LE(order.length, 0);
order.forEach((index, i) => {
  header.writeUInt16LE(index, 4 + i * 6);
  header.writeUInt32LE(files[i].length, 6 + i * 6);
});
const out = path.join(root, "preview.pack");
fs.writeFileSync(out, Buffer.concat([header, ...files]));
console.log(`${out}: ${count} frames, ${(fs.statSync(out).size / 1048576).toFixed(2)} MB`);
