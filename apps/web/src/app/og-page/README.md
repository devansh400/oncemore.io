# They Call Him OG — a fan-powered chapter

Route: `/og-car`. A cinematic fan-facing retrospective built around the actual
car used in the film. `/katana`, `/scroll2` and `/mib2` remain unchanged.

## Story and page structure

Context comes from `components/katana/story-content.ts`,
`components/scroll2/scroll-copy.ts`, their page implementations, and the user's
confirmation that this is the actual film car. OnceMore hosted OG's comic
reveal; fans unlocked it together, pixel by pixel. The source pages supply the
three games, personalised cards, one-million-plus verified fans and under-42-hour
milestone. Rewards are described as a historical chance to win, and signup links
invite future participation in OnceMore rather than claiming the OG event is live.

The opening has four reversible text beats over the car: the film car, the
OnceMore reveal, the fans' shared unlock, and the OG title. Copy appears over
slower orbit sections, with clear intervals during fast headlight-facing turns.
The 1100svh desktop / 1050svh phone scroll track uses a piecewise source-time
mapping in `car-experience.tsx`; the existing source-safe frame selection remains
unchanged. A final hold separates the cinematic sequence from the continuing
story. The last frame stays on the sticky canvas behind the following chapters.

The continuing page includes a 160-cell scroll-driven replay of the comic reveal,
fan milestones, a selectable three-game video archive, a fan-card spread beside
the supplied rain poster, and a fire-poster closing with signup and replay links.
Headings reveal by masked lines. Game previews are muted and only play when
visible; switching games and pause/play are keyboard-accessible. Reduced motion
skips the long scrub track, shows the hero still, and keeps the complete story
and comic visible without automatic gameplay playback. No JavaScript retains
the hero still and full story, with the pixel mask disabled.

All images and all four videos in `media/project01/` were reviewed. Selected
story assets are served from `/og-car/story/v1/`: quality-91 WebP derivatives,
the original OG title isolated onto transparency, three muted 720p/30fps gameplay
copies with faststart and matching posters. The clean and theatrical rain posters
are variants of the same artwork; the theatrical version is displayed. Source
assets are untouched. No generated replacement artwork is used.

## Car sequence and protected source frames

Source: `media/project01/video-to-animation.mp4`, 1920×1080, 24 fps,
328 source frames (13.667 seconds). The master video remains unchanged.

Current version: **v3**, 669 frames, approximately 106.6 MB encoded. It preserves
the higher-quality v2 images outside two protected intervals: 0.4–2.0 seconds
and 10.5–13.0 seconds. Fast camera turns and direct headlight glare caused v2's
optical flow to warp the grille, light housings and cloth. These intervals now
use authentic source frames at 24 fps and quality 94, with no optical-flow
generation or runtime crossfading. This prioritizes correct geometry over
synthetic smoothness in those brief sections. All other frames are byte-identical
to v2. The final source frame is retained.

`frame-timing.json` stores timestamps in 120Hz ticks, representing both 24fps
and 60fps exactly. `frameAtProgress()` maps scroll progress to source time using
binary search; changing frame density does not speed up or slow down the shot.
The renderer displays the nearest whole frame at every position. A new asset
version bypasses cached bad frames.

To reproduce, first generate the v2 interpolation outside the protected intervals:

```sh
ffmpeg -i media/project01/video-to-animation.mp4 -an -vf 'minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1' -c:v libwebp -quality 94 -compression_level 4 -start_number 0 apps/web/public/og-car/v2/frames/%03d.webp
```

Then extract authentic source frames and assemble the mixed-density sequence:

```sh
ffmpeg -i media/project01/video-to-animation.mp4 -an -c:v libwebp -quality 94 -compression_level 4 -start_number 0 output/og-car-source-review/frames/%03d.webp
node apps/web/scripts/build-og-car-safe-sequence.mjs
```

The builder generates v3, its opening still, timestamp metadata and an offline
source manifest in `output/og-car-source-review/v3-manifest.json`. Create output
directories before running FFmpeg. Versioned assets have immutable cache headers;
use a new version for subsequent media changes. Loading remains progressive.

The renderer builds on `/mib2`'s bounded frame loader, with centered cover
framing. It uses eight concurrent fetches, two concurrent decodes, a 10-frame
decoded cache on phones / 18 on larger screens, and a canvas capped at 3840px
and 2 DPR. Preloading prioritizes the direction of travel, then establishes
sparse coverage across the shot, then fills gaps. Encoded frames remain cached
for reverse scrolling. Decoded bitmaps are explicitly closed on eviction.

One sticky viewport spans the cinematic track and continuing story. Lenis
smooths wheel input with a 0.12 lerp and preserves native touch scrolling.
ScrollTrigger maps the scroll position directly to the reversible playhead.
GSAP's ticker presents the available frame; an unavailable frame holds until a
closer frame is ready. Unchanged images are not redrawn.
The final frame holds at the bottom. No per-frame React state or native video
seeking is used. Hidden tabs pause work; unmount aborts fetches and frees bitmaps.
Reduced motion and no-JavaScript show the opening still in a single viewport;
failed loading also retains the opening still.

Version 2 performance baseline: a 24-second forward/reverse sweep at 1440×900
and 2 DPR captured 2,401 browser
RAF samples, 10.1ms p95, and no intervals above 50ms. There were 4,793 canvas
draws (adjacent-frame blending) and 1,614 frame changes. These are local desktop
browser measurements, not physical phone performance. The 390×844, 2-DPR phone
viewport fills without horizontal overflow; both endpoints and reverse scrolling
work. Reduced-motion reloads request no frame sequence and show one viewport.

Version 3 verification: all 669 asset hashes match their selected source files;
1,970 sampled timestamps in protected intervals select integer, authentic-source
frames exclusively. TypeScript, lint and Next.js compilation/runtime checks pass.
A 12-second forward/reverse browser sweep captured 1,201 RAF samples, 10.1ms p95
and no intervals above 50ms. Both headlight sections, phone framing and endpoints
were checked in Chromium. The protected sections deliberately retain native
24fps cadence to avoid both geometric warping and doubled headlight images.

## Story-page verification

- TypeScript, targeted lint, Next.js compilation and runtime checks pass.
- Desktop at 1440×900, tablets at 701/768px, and 320/390px phones: no horizontal
  overflow or clipped heading lines. Overlay placement reviewed over the footage.
- A 12-second forward/reverse sweep with all film overlays active at 1440×900
  and 2 DPR captured 1,201 RAF samples, 10.1ms p95, no intervals above 50ms.
  This is local desktop Chromium, not physical mobile hardware.
- The final frame remains 668 while the story continues; cinematic overlays
  fade out for the following chapters. Both original headlight-safe ranges remain.
- All three game selectors, visible-only playback, pause/play and explicit
  reduced-motion playback work. Offscreen previews pause.
- Reduced-motion reload: zero frame requests, one-viewport hero, no pixel mask,
  full readable story, no gameplay autoplay. The React tree includes CarExperience,
  OGStory and GameShowcase without per-scroll React state updates.
- Axe: zero violations, 36 passes. Gradient/video contrast still requires manual
  review. Gameplay derivatives contain no audio; descriptive text accompanies each.

## Portrait gameplay correction

The source clips use 1920×1080 encoded frames with non-square pixels (SAR 81:256),
so their intended display ratio is **9:16**. Gameplay now uses cache-safe assets
under `/og-car/story/v2/`, normalized from the originals to 720×1280, SAR 1:1,
30fps, silent H.264 with faststart and correctly proportioned portrait posters.
The car sequence and other artwork remain unchanged.

The desktop archive now pairs a vertical selector and description with a
365px-wide portrait preview. Phones stack compact game choices, a centered
9:16 preview, and its description. `object-fit: contain` preserves the full frame.
All three clips were checked at 720×1280; switching and pause controls work.
Desktop, 768px tablet, 390px phone and 320px phone checks pass without overflow.
TypeScript, lint and Next.js compilation/runtime checks pass.

## Layered fan cards

The card spread now reuses `/og2`'s `LayeredFanCard` component and existing
background/portrait WebPs, with SVG-isolated original OG/name brush lettering
and a separate fan-number layer. `/og2` itself is unchanged. The scroll timeline
assembles portraits, logos, numbers and names above the clean plates, then moves
portraits, logos and names at independent Z depths (45 / 28 / 65px), matching the
reference treatment. The outer spread keeps its own fan-out animation, with the
middle card in front. Reversing scroll disassembles the layers. Reduced motion
and no JavaScript display fully assembled cards.

Verified all three layered cards, image loading, independent layer transforms,
reverse assembly, desktop and 390/320px layouts, and reduced-motion visibility.
No horizontal overflow. TypeScript, targeted lint and Next.js runtime/compilation
checks pass. React inspection confirms three instances of the shared component.

## Delivery v4 (tiered frames)

Frames are served from `/og-car/v4/frames/` in three WebP tiers re-encoded from
v3: `preview/` (480px q50, 3.8 MB total), `md/` (1280px q75, 17.7 MB) and `hd/`
(1920px q80, 36.9 MB). `preview.pack` holds the whole preview tier in one
coverage-ordered file (every 16th frame, then every 4th, then the rest), built
by `scripts/build-preview-pack.mjs`; the loader streams it and publishes frames
as their bytes arrive, so a cold first visit covers the shot from one request.
The page preloads the poster and the pack in `<head>`, and the home page warms
both while the OG island is framed. Phones and small windows stream `md`;
larger screens stream `hd`. The canvas never exceeds the detail tier's
resolution. Streaming stops once the visitor scrolls past the shot. The shared
loader lives in `src/lib/frame-sequence.ts`.
