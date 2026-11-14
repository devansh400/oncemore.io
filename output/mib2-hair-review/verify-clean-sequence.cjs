const fs = require('node:fs');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const sharp = require('../../node_modules/.bun/sharp@0.35.5+6896990797d7a805/node_modules/sharp');
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const originalHashes = JSON.parse(fs.readFileSync('output/mib2-hair-review/original-frame-sha256.json'));
const manifest = JSON.parse(fs.readFileSync('output/mib2-hair-review/repair-manifest.json'));
(async () => {
  let bytes = 0, maxChanged = 0;
  for (const item of manifest.frames) {
    const name = `${String(item.frame).padStart(3, '0')}.webp`;
    const source = fs.readFileSync(`${manifest.source}/frames/${name}`);
    const derived = fs.readFileSync(`${manifest.target}/frames/${name}`);
    assert.equal(sha(source), originalHashes[name], `Original changed: ${name}`);
    assert.equal(sha(derived), item.derivedSha256, `Derived file changed: ${name}`);
    bytes += derived.length;
    if (item.frame > 56) {
      assert.equal(sha(derived), sha(source), `Unaffected frame differs: ${name}`);
      continue;
    }
    const a = await sharp(source).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const b = await sharp(derived).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.equal(b.info.width, 1920); assert.equal(b.info.height, 1024);
    let changed = 0;
    for (let p = 0; p < a.data.length; p += 3) {
      if (a.data[p] === b.data[p] && a.data[p + 1] === b.data[p + 1] && a.data[p + 2] === b.data[p + 2]) continue;
      changed++;
      const x = (p / 3) % 1920, y = Math.floor(p / 3 / 1920);
      assert.ok(x >= item.bounds.left && x <= item.bounds.right && y >= item.bounds.top && y <= item.bounds.bottom, `Changes escaped repair bounds: ${name}`);
      assert.ok(x >= 550 && x <= 680 && y >= 85 && y <= 205, `Changes escaped hair region: ${name}`);
    }
    assert.equal(changed, item.changedPixels, `Lossless pixel check failed: ${name}`);
    assert.ok(changed > 0 && changed < 6000);
    maxChanged = Math.max(maxChanged, changed);
  }
  assert.equal(sha(fs.readFileSync(`${manifest.target}/opening.webp`)), sha(fs.readFileSync(`${manifest.target}/frames/000.webp`)));
  for (const name of ['final.webp', 'title-card.jpg']) {
    assert.equal(sha(fs.readFileSync(`${manifest.target}/${name}`)), sha(fs.readFileSync(`${manifest.source}/${name}`)));
  }
  const result = { originalFramesVerified: 330, repairedFramesVerified: 57, byteIdenticalLaterFrames: 273,
    outsideRepairPixelsUnchanged: true, openingMatchesFirstFrame: true,
    derivedSequenceBytes: bytes, maximumChangedPixelsPerFrame: maxChanged,
    maximumChangedPercentage: +(maxChanged / (1920 * 1024) * 100).toFixed(3) };
  fs.writeFileSync('output/mib2-hair-review/verification.json', JSON.stringify(result, null, 2));
  console.log(result);
})();
