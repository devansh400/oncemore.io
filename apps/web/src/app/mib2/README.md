# OnceMore × Maa Inti Bangaaram

Route: `/mib2`. A shorter-copy fork of `/maa-inti-bangaaram`; original page
files are unchanged. Styles, animation, media and layout match the source page.
Redundant paragraphs and captions have been trimmed for more visual space.

## Full-page before/after

The floating top-right **Before / After** toggle mounts the original
`/maa-inti-bangaaram` in a clipped, full-viewport same-origin iframe. Drag the
divider to reveal either live page. Matching chapter boundaries synchronize
scrolling across the two versions' different copy lengths; pages without
matching chapter structures fall back to proportional document scrolling.
The original view is visual-only and its videos stay muted.

`PageComparison` lives in `components/page-comparison.tsx` and accepts a
same-origin `beforeUrl`. It loads only while enabled and tears down its frame,
observers and listeners when closed. The current page keeps its scroll position
and interactions on the After side. Arrow keys adjust the split (Shift for
larger steps); Home/End reveal one version completely; Escape closes the view.
Pointer capture supports mouse and touch dragging.

Verified: pointer drag, keyboard endpoints, scrolling over the Before side,
mid-page opening, section alignment on desktop/phone, muted original videos,
off-state cleanup, and no horizontal overflow. TypeScript passes; automated
accessibility checks report no violations for the comparison controls.

The `/mib2` media treatment additionally feathers card/reel edges, removes hard
frames and heavy shadows, and uses a restrained warm grade. A lightweight SVG
luminance matte lets the fan edit's dark background reveal the crimson scene
underneath. A minimal crimson-and-gold mute toggle is the only player control;
native playback, seeking, fullscreen and picture-in-picture UI are removed.
These treatments do not affect the original
`/maa-inti-bangaaram` page or modify any source media.

Self-contained UI built from the supplied brief
and film assets. Other pages' UI is not used. The existing root Lenis/GSAP
integration remains the only smooth-scroll system.

## Rendering

A single full-viewport canvas draws the original 330 frames at 30 fps. This
replaces native MP4 seeking after visible scrub stutter was reported. No video
player, audio status, progress bar, or substitute red fill is shown.

- `FrameSequence` fetches WebP frames with at most six concurrent requests.
  It prioritizes the current frame and neighbours, then the endpoint, then the
  remaining sequence progressively. Encoded frames are cached for reverse
  scrolling; at most two decodes run concurrently.
- Decoded ImageBitmaps are bounded to eight on phones and twelve on larger
  screens (about 63 / 94 MB of decoded pixels), and explicitly closed on
  eviction or unmount. Fetches are aborted on unmount.
- The backing canvas caps DPR at 1.5 and its longest dimension at 1920 pixels.
  It redraws only when the selected source frame or viewport size changes.
- GSAP's existing ticker supplies an 80 ms exponential settle between scroll
  updates, independent of refresh rate. There is no additional RAF loop or
  per-frame React state. Hidden-tab work pauses.
- Cover geometry fills every viewport. The source's baked-in black borders
  are removed (1920x1024 crop at y=28). The remaining photographed scene is not
  regenerated or extended with a mismatched background.
- Portrait framing follows the woman, then the muzzle, then the bullet. Near
  the endpoint it returns to the centre, letting the bullet leave the narrow
  phone crop before the title. Wider viewports retain more of the original
  composition. Full-screen portrait necessarily excludes some side content.
- Poster framing matches the first canvas draw. The final frame remains drawn
  for the title and case study; title visibility is gated on frame 329 being drawn.

## Timing

The scene has one sticky, 100dvh viewport. Marketing chapters scroll normally
over it. The 16-unit scroll clock is centralized in `cinematic-experience.tsx`
and ends at the `data-shot-end` marker after the title interlude:

- 0-11: source frames 0-329, reversible.
- 11-11.65: final-frame hold.
- 11.65-13: title reveal using the supplied real title card.
- 13-16: hold the same frame and fade the film logo before the personal results.
- After 16: retain that frame behind the cards, fan edits and OnceMore closing.

Reduced motion and failed frame loading retain the complete case study over a
full-screen still, with shortened chapter spacing. Reduced-motion cold loads
do not fetch frame sequences. A no-JavaScript still layout is included.
The film title uses an SVG crop of the unchanged
`media/project02/title card.jpg`, with lighten blending.

## OnceMore case study

`case-study.tsx` contains the marketing copy and real campaign examples. The
story covers Samantha's quiz answers, the chance to win rewards/movie tickets,
one million players, individual match scores/personality cards, and the video
unlocked after completing the quiz. The copy addresses MIB fans who missed the
concluded launch event: what other fans played, had a chance to win, and
unlocked. The closing invites them to join OnceMore for future experiences,
linking to the existing `/signup` route. The director/producer footer is removed.
The fan-focused rewrite changes copy in place, preserving the layout, styling
and animation behavior.

The million-player claim comes from the user. Fifteen questions are visible in
the quiz screenshot. Example card percentages are individual outputs, not
campaign conversion statistics. Rewards are presented as a chance to win.

All 16 images and all three 15-second fan edits in `media/project02/` were
reviewed. This includes both title cards; posters; gun/muzzle/render assets;
the four gold match cards; personality-card and quiz screens; the top-score
example; the OnceMore collaboration artwork; and the MSD, Surya and Vicky edits.
Campaign UI supplied the crimson, antique gold and ivory palette; its tall
condensed typography is expressed with locally bundled Anton and Barlow
Condensed fonts. No other page's UI is used as a reference.

Text uses the existing `ScrollReveal.jsx` word staggering, blur, opacity and
rise behavior. The hero enters on load; later copy scrubs in both directions.
Its animation logic is unchanged. A JSDoc-only `as` type widening permits a
page-local accessible paragraph wrapper; body copy remains readable to screen
readers while animated visual fragments are hidden from them.

Optimized campaign images and fan edits are served under
`/maa-inti-bangaaram/case-study/v1/` with immutable caching. Only Surya's edit is
displayed: featured beside the copy on desktop and centred below it on phones.
It preloads no data until in view, then autoplays and loops.
The featured edit uses `media/project02/fan vid high res.mp4` at 720×1280,
replacing the earlier 320×568 copy. The public `fan-edit-surya-hd.mp4` is
stream-copied with faststart (no video/audio re-encoding), with a matching
high-resolution poster and a new cache-safe filename.
The original audio track is retained. Sound starts enabled by default. If the
browser blocks audible autoplay, the edit falls back to muted playback; the
custom sound toggle lets viewers enable audio. Visibility changes preserve
the viewer's choice.
Offscreen or hidden-tab playback pauses. Reduced motion starts with the poster;
an explicit sound request can start the edit. The quiz screenshot is removed.

## Assets

Source: `b8983099-0356-4369-abeb-8e4c3db8cfdc-video.mp4` from Downloads,
46,663,554 bytes, 1920x1080, 30 fps, 11 seconds. The master remains untouched.
Its final frame still contains a small bullet. The desktop view may show it;
the portrait composition allows it to leave the crop without editing footage.

Versioned public assets: `/maa-inti-bangaaram/v2/`. All 330 WebPs together are
14,499,950 bytes. Cache headers are immutable for a year, so replacements must
use a new version. The earlier v1 video assets are no longer used by this route.

Reproduce the frames using FFmpeg (substitute the source path):

```sh
ffmpeg -i SOURCE.mp4 -vf 'crop=1920:1024:0:28' -c:v libwebp -quality 82 -compression_level 5 -start_number 0 frames/%03d.webp
```

`opening.webp` is frame 000 and `final.webp` is frame 329.

## Verification

- TypeScript and formatting checks pass; Next.js runtime/config checks clean.
- Edge/Chromium at desktop, ultrawide, tablet, and portrait viewport sizes:
  canvas fills the viewport; no side bars or horizontal page overflow.
- Forward/reverse phase boundaries and final-frame/title gate checked.
- A four-second forward/reverse scroll in a 390x844 viewport produced 401 RAF
  samples with 10.1 ms p95 interval and no intervals above 50 ms, settling back
  on frame 0. This is a desktop browser emulation measurement, not physical
  phone performance.
- Reduced-motion, failed-frame, resize, skip/replay, and continued-scroll states
  checked. No per-scroll React renders are required.
- Marketing pass: web and UI-package TypeScript checks pass. Browser tests at
  320x568, 390x844 and 1440x900 verify layout bounds, reversible text, frame/title
  boundaries, videos and preserved content in reduced motion.
- With marketing overlays active, a four-second forward/reverse browser run
  captured 393 RAF samples, 10.2 ms p95 interval, and no intervals above 50 ms.
- Automated axe check: no violations, 36 passes. Contrast over moving imagery
  and caption requirements for the supplied fan videos need manual review.

Physical iOS Safari / Android hardware and constrained mobile networking still
need device testing.
