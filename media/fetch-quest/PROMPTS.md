# Fetch quest: art prompts for ChatGPT

Use **one ChatGPT conversation** for everything, so every pose stays the same dog. Send prompt 0 first, then each pose prompt in turn. If a pose drifts (different markings, ears or tail), reply "Regenerate: keep the dog exactly as in the model sheet" before moving on.

Save each image as a PNG with the file name given, into `media/fetch-quest/raw/`. Don't crop or resize anything: the build script trims each frame, scales it and lines it up on a shared ground line.

---

## 0. Model sheet → `model-sheet.png`

```
I'm making a set of character illustrations for a website. They must all show exactly the same character in exactly the same style, so first create a model sheet that we'll reference for every image after this.

STYLE: a painterly, cinematic digital matte painting, the finish of a high-end animated feature's concept art. Soft, rich rendering with visible but refined brushwork. Semi-realistic and appealing, not cartoon line art, not 3D plastic, not anime. Dusk lighting: a low, warm afterglow sun from the UPPER RIGHT puts a warm orange-gold rim light along the character's upper-right edges, with cool, dim midnight-blue fill light and shadows from the lower left (shadows are deep blue, never pure black).

CHARACTER (original): a young, scruffy Indian street dog (an "Indie" / desi pariah dog). Lean, medium-small, with a ginger-tan coat, a white chest blaze and white socks on the front paws. The RIGHT ear stands upright and the LEFT ear flops over. The tail curls tightly up over the back. Bright amber eyes and slightly scruffy cheek fur. A worn brown leather collar with a small round metal tag that catches a pale blue glint (#8FCBFF). Friendly, determined, a little clumsy.

MODEL SHEET: on a plain, flat mid-grey background, show the same dog as a side view facing right, a three-quarter front view, a front view and a three-quarter back view. Add a row of four head expressions: happy, determined, surprised with ears up, and howling with the muzzle raised. No text or labels anywhere.
```

---

## Poses

Send each of these as its own message, after the model sheet. They all share the same rules, which are written into each prompt.

### `sit-idle.png`
```
Using the exact dog and painting style from the model sheet: the dog SITTING, side view facing right, looking up and to the right with a curious, hopeful expression, tail curled. Full body in frame. Transparent background PNG: no ground, no cast shadow, no scenery, no text. Keep the same dusk lighting with a warm rim light from the upper right.
```

### `look-up.png`
```
Same dog, same style: STANDING on all fours, side view facing right, head tilted sharply upward, staring at something high above with ears perked. Full body, transparent background PNG, no ground, no shadow, no text, same upper-right warm rim light.
```

### `head-tilt.png`
```
Same dog, same style: SITTING, side view facing right but with the head turned toward the viewer and tilted to one side in a puzzled "huh?" look, floppy ear dangling. Full body, transparent background PNG, no ground, no shadow, no text, same lighting.
```

### `crouch.png`
```
Same dog, same style: CROUCHED low and ready to spring, side view facing right, front legs bent, hindquarters raised and coiled, eyes locked on something above to the right, tail up. Full body, transparent background PNG, no ground, no shadow, no text, same lighting.
```

### `leap.png`
```
Same dog, same style: MID-AIR LEAP up and to the right, body fully stretched, front legs reaching forward, hind legs extended behind, jaws open reaching for something above, ears flying back. Full body, transparent background PNG, no ground, no shadow, no text, same lighting.
```

### `snap.png`
```
Same dog, same style: at the TOP of a leap up and to the right, jaws just SNAPPED SHUT on empty air (it missed), eyes squeezed, ears flying, body slightly curled. Full body, transparent background PNG, no ground, no shadow, no text, same lighting.
```

### `land.png`
```
Same dog, same style: LANDING from a jump, side view facing right, front paws touching down, body compressed, ears bouncing, tail up for balance. Full body, transparent background PNG, no ground, no shadow, no text, same lighting.
```

### `tumble.png`
```
Same dog, same style: TUMBLING head over heels in a clumsy, comical somersault, legs splayed, ears and tail flying, a dazed but unhurt expression. Full body, transparent background PNG, no ground, no shadow, no text, same lighting.
```

### `sniff.png`
```
Same dog, same style: STANDING, side view facing right, leaning forward with its nose low and outstretched, sniffing something on the ground just ahead, tail wagging up. Full body, transparent background PNG, no ground, no shadow, no text, same lighting.
```

### `sneeze.png`
```
Same dog, same style: mid-SNEEZE, side view facing right, eyes squeezed shut, nose scrunched, head jerking forward and down, ears flopping forward, a tiny comic puff of breath at the nose. Full body, transparent background PNG, no ground, no shadow, no text, same lighting.
```

### `run-1.png`
```
Same dog, same style: RUNNING to the right at full gallop, EXTENDED stride: front legs reaching far forward, hind legs pushed far back, body long and low, ears streaming back, tail out behind. Full body, transparent background PNG, no ground, no shadow, no text, same lighting.
```

### `run-2.png`
```
Same dog, same style: RUNNING to the right at full gallop, GATHERED stride: all four legs bunched together under the body, back slightly arched, ears bouncing, tail out behind. Full body, transparent background PNG, no ground, no shadow, no text, same lighting.
```

### `howl-start.png`
```
Same dog, same style: SITTING, side view facing right, head lifting upward and mouth opening as it begins to howl, eyes half closed. Full body, transparent background PNG, no ground, no shadow, no text, same lighting.
```

### `howl.png`
```
Same dog, same style: SITTING, side view facing right, muzzle pointed STRAIGHT UP at the sky, eyes closed, mouth in a round "ooo" shape, howling with all its heart, chest puffed. Full body, transparent background PNG, no ground, no shadow, no text, same lighting.
```

### `whine.png`
```
Same dog, same style: SITTING, side view facing right, ears drooped flat, head lowered slightly, big sad pleading eyes, a soft whimpering expression. Full body, transparent background PNG, no ground, no shadow, no text, same lighting.
```

### `proud-sit.png`
```
Same dog, same style: SITTING up tall and proud, side view facing right, chest out, chin raised, eyes bright, a happy open-mouthed grin, tail curled high. Full body, transparent background PNG, no ground, no shadow, no text, same lighting.
```

### `carry-sit.png`
```
Same dog, same style: SITTING proudly, side view facing right, holding a shining GOLDEN MOVIE TICKET gently crosswise in its mouth (a small gold paper ticket with perforated edges and notched sides, no text on it), tail wagging, eyes delighted. Full body, transparent background PNG, no ground, no shadow, no text, same lighting.
```

### `carry-1.png`
```
Same dog, same style: TROTTING happily to the right with the same golden movie ticket held in its mouth, mid-stride with the front leg lifted high, tail up and wagging, ears bouncing. Full body, transparent background PNG, no ground, no shadow, no text, same lighting.
```

### `carry-2.png`
```
Same dog, same style: TROTTING to the right with the golden movie ticket in its mouth, the OTHER phase of the stride (legs gathered under the body), tail up, ears bouncing. Full body, transparent background PNG, no ground, no shadow, no text, same lighting.
```

### `sleep.png` (optional)
```
Same dog, same style: CURLED UP ASLEEP in a tight ball, nose tucked under the tail, the golden movie ticket tucked under one front paw, peaceful. Full body, transparent background PNG, no ground, no shadow, no text, same lighting.
```

---

## Checklist before handing back

- [ ] 19 poses plus the model sheet in `media/fetch-quest/raw/`, named exactly as above.
- [ ] Every pose faces right (except `head-tilt`'s head and `tumble`).
- [ ] Transparent backgrounds. If ChatGPT gave you a white or grey background instead, that's fine: say so and the build step will key it out.
- [ ] Same markings everywhere: white blaze and socks, right ear up, left ear floppy, curled tail, collar tag.
