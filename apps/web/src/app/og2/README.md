# OG / second visual direction

`/og2` is an independent illustrated experience. `/scroll2` remains intact.

The opening reuses its kasumi clouds, scroll geometry, and demand-rendered
Japanese handscroll model. The original unlocked **The First Blood** cover is
the first reveal. Everything afterward uses a new GSAP perspective journey,
with independent environment, protagonist, accent, and foreground layers.
Scenes approach from negative Z; foreground artwork and figures pass the
reader before the next world arrives. There is no horizontal content track.

Sequence: cover → Katana courtyard → Archery forest → Bushido ravine → fan
cards / million-fan milestone → signup invitation. Each game has original
illustrated scenery and a protagonist performing that activity.

Nine generated art masters live in `media/project01/og2-generated/`.
Optimized WebP versions, preserving alpha, live in `public/og2/` alongside
the original cover JPEG. The WebP layers total approximately 3.8 MB.
The originals in `media/project01/og comic/`, the movie posters, fan cards,
and event archive informed the ink, petrol-blue, and vermilion palette.
The motion reference is https://45r.jp/ja/indigo-hakusho/.

Controls: vertical scrolling or six chapter buttons; an accessible modal
chapter menu; signup and replay at the end. Hidden scenes are inert and
excluded from the accessibility tree. Reduced motion and no JavaScript
show the six illustrated chapters in ordinary document order.

Verified in the running Next.js app at desktop, 390px, and 320px widths,
including forward/backward travel, chapter selection, image loading, and
reduced motion. TypeScript and Next compilation/runtime checks pass.

The three fan cards now assemble from separate clean background, portrait,
original OG lettering, registration-number, and original fan-name layers.
Their scroll-scrubbed reveals stagger in that order; portraits and lettering
then move at different depths. Reduced motion shows the assembled cards.
PNG masters and generation notes are in `media/project01/og2-generated/cards/`;
optimized WebPs are in `public/og2/cards/`. The original card assets are preserved.
