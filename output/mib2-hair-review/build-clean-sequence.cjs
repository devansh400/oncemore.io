// Run from the repository root. All writes stay in the derived /mib2 assets.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('../../node_modules/.bun/sharp@0.35.5+6896990797d7a805/node_modules/sharp');

const source = path.resolve('apps/web/public/maa-inti-bangaaram/v2');
const target = path.resolve('apps/web/public/mib2/hair-clean-v1');
if (source === target || !target.startsWith(path.resolve('apps/web/public/mib2') + path.sep)) {
  throw new Error('Derived output must be separate from the original assets');
}
const sha = (data) => crypto.createHash('sha256').update(data).digest('hex');
const smooth = (t) => (t = Math.max(0, Math.min(1, t)), t * t * (3 - 2 * t));
// Main updo silhouette above and below the unwanted loop, tracked as it rotates.
// [frame, upper y, upper x, lower y, lower x]
const keys = [
  [0, 102, 665, 177, 633],
  [15, 100, 666, 176, 632],
  [30, 109, 655, 180, 632],
  [40, 122, 648, 191, 630],
  [45, 130, 644, 195, 628],
  [50, 138, 635, 198, 623],
  [53, 142, 629, 197, 617],
  [56, 145, 619, 197, 607],
];
function track(frame) {
  const k = keys.findIndex((key) => key[0] >= frame);
  if (k <= 0) return keys[0].slice(1);
  const a = keys[k - 1], b = keys[k];
  const t = (frame - a[0]) / (b[0] - a[0]);
  return a.slice(1).map((value, i) => value + (b[i + 1] - value) * t);
}

(async () => {
  fs.mkdirSync(path.join(target, 'frames'), { recursive: true });
  // Use only clean red background from the imagegen retouch. Never use its
  // regenerated face/hair/body. Its subtle texture is matched to each source
  // frame's local lighting before compositing through the tracked matte.
  const master = await sharp('output/mib2-hair-review/000-cleanup-concept.png')
    .resize(1920, 1024).extract({ left: 450, top: 95, width: 140, height: 120 })
    .removeAlpha().raw().toBuffer();
  const low = await sharp(master, { raw: { width: 140, height: 120, channels: 3 } })
    .blur(3).raw().toBuffer();
  const report = [];
  for (let frame = 0; frame < 330; frame++) {
    const name = `${String(frame).padStart(3, '0')}.webp`;
    const input = fs.readFileSync(path.join(source, 'frames', name));
    const out = path.join(target, 'frames', name);
    if (frame > 56) {
      fs.writeFileSync(out, input);
      report.push({ frame, changedPixels: 0, originalSha256: sha(input), derivedSha256: sha(input) });
      continue;
    }
    const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const original = Buffer.from(data);
    const [trackedTop, trackedUpperX, bottom, lowerX] = track(frame);
    // Start the fade above the loop, so its uppermost antialiased pixels
    // cannot survive as a small dark remnant in the early frames.
    const top = trackedTop - 8;
    const upperX = trackedUpperX + 4;
    let changedPixels = 0;
    const bounds = { left: 1920, top: 1024, right: 0, bottom: 0 };
    for (let y = Math.floor(top); y <= Math.ceil(bottom); y++) {
      const t = Math.max(0, Math.min(1, (y - top) / (bottom - top)));
      const edge = lowerX + (upperX - lowerX) * Math.pow(1 - t, 1.5);
      const left = Math.floor(edge - 50);
      // Estimate the local red gradient using two clean 12x7 background blocks.
      const centers = [edge - 63, edge - 31];
      const colors = centers.map((cx) => {
        const sum = [0, 0, 0]; let count = 0;
        for (let yy = y - 3; yy <= y + 3; yy++) {
          for (let xx = Math.round(cx) - 6; xx <= Math.round(cx) + 6; xx++) {
            const j = (yy * info.width + xx) * 3;
            for (let c = 0; c < 3; c++) sum[c] += original[j + c];
            count++;
          }
        }
        return sum.map((v) => v / count);
      });
      const vertical = smooth((y - top) / 4) * smooth((bottom - y) / 5);
      for (let x = left; x <= Math.ceil(edge + 1.5); x++) {
        const alpha = vertical * smooth((x - left) / 9) * smooth((edge + 1.5 - x) / 3);
        if (alpha <= 0) continue;
        const j = (y * info.width + x) * 3;
        // Reuse the same retouched background texture in head-local coordinates;
        // lighting follows each frame, avoiding independent AI-frame flicker.
        const tx = Math.max(0, Math.min(139, Math.round(x - edge + 100)));
        const ty = Math.max(0, Math.min(119, Math.round(y - top + 15)));
        const m = (ty * 140 + tx) * 3;
        for (let c = 0; c < 3; c++) {
          const gradient = (colors[1][c] - colors[0][c]) / 32;
          const background = colors[1][c] + gradient * (x - centers[1]) + (master[m + c] - low[m + c]) * 0.35;
          data[j + c] = Math.max(0, Math.min(255, Math.round(original[j + c] * (1 - alpha) + background * alpha)));
        }
        if (data[j] !== original[j] || data[j + 1] !== original[j + 1] || data[j + 2] !== original[j + 2]) {
          changedPixels++;
          bounds.left = Math.min(bounds.left, x); bounds.right = Math.max(bounds.right, x);
          bounds.top = Math.min(bounds.top, y); bounds.bottom = Math.max(bounds.bottom, y);
        }
      }
    }
    // Lossless encoding preserves every decoded source pixel outside the matte.
    await sharp(data, { raw: { width: info.width, height: info.height, channels: 3 } })
      .webp({ lossless: true, effort: 5 }).toFile(out);
    report.push({ frame, changedPixels, bounds, originalSha256: sha(input), derivedSha256: sha(fs.readFileSync(out)) });
  }
  fs.copyFileSync(path.join(target, 'frames/000.webp'), path.join(target, 'opening.webp'));
  for (const name of ['final.webp', 'title-card.jpg']) {
    fs.copyFileSync(path.join(source, name), path.join(target, name));
  }
  fs.writeFileSync('output/mib2-hair-review/repair-manifest.json', JSON.stringify({
    source, target, repairedFrames: 57, totalFrames: 330, keys, frames: report,
  }, null, 2));
  console.log('Created 330 derived frames; repaired 000–056 and matched opening poster.');
})();

