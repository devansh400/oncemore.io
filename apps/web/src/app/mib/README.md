# MIB cinematic sequence

Mounted at `/mib`. This route deliberately bypasses shared site chrome. All visual direction comes from the supplied brief and `media/project02/poster02 clean.png`.

`mib-experience.tsx` renders the accessible static fallback and lazy-loads `mib-scene.ts`. The scene owns one Three.js renderer and one GSAP/ScrollTrigger master timeline. The existing global Lenis instance drives scrolling; no second smooth-scroll controller is created.

## Tuning

- Scroll distance: `innerHeight * 7` in the master ScrollTrigger's `end` callback.
- Named beats: `establish`, `lift`, `pushIn`, `barrel`, `shot`, `emergence`, `tracking`, `exit`, `handoff` at the end of `mountCinema`.
- Visual timing: the progress ranges in `render(p)`. Labels document those same positions; update both when retiming.
- Framing: opening `startX`, `fitHeight`, and the muzzle coordinates in `render(p)`.
- Quality: capped device pixel ratio of 1.5; rendering happens on progress or viewport changes, without an independent animation loop.

The opening-to-firing action uses the brief's fallback of matched composited poses, blended by scroll. This is a two-pose dissolve, not a fully articulated character rig. The barrel and projectile are procedural real-time meshes; they need no external GLB. Smoke, sparks, spin, light, camera and recoil derive only from progress. The woman is out of frame before the shot. The bullet exits without an impact or title reveal.

Reduced motion skips importing Three.js and removes pinning. Missing WebGL or a lost WebGL context leaves the portrait visible. All geometries, textures, materials, the environment render target, renderer, observers and ScrollTrigger context are disposed on cleanup.

## Assets and provenance

- Opening source: `media/project02/poster02 clean.png`, unchanged.
- Raised-pose source: `media/mib/raised-pose-source.png`, edited from the opening with the built-in image-generation tool. No generated or prerecorded video is used.
- Runtime assets: `apps/web/public/mib/opening.webp` and `raised-pose.webp`, quality 92, approximately 334 KB combined. The runtime derives the crimson background plate from the unoccupied right side of the original image.

Raised-pose image prompt:

> Edit the supplied photograph into one carefully matched second animation key pose. Keep the SAME actress Samantha face, hairstyle, head position and size, red saree, jewelry, warm lighting, original wide 1545:1018 composition, and EXACT textured crimson/burgundy background and shadows. Change only her arms and wooden rifle: she has now deliberately raised the SAME wooden hunting rifle into a believable shoulder firing position, aiming towards the right, with rifle stock against shoulder, right hand on trigger, left hand supporting forestock. Rifle full barrel extends rightwards and slightly towards the viewer, muzzle visible at approximately 70% image width and 48% image height. Her head and torso stay in original position on left; full original head visible. Photorealistic anatomical hands, no duplicated hands or arms or rifle, seamlessly reconstruct the saree where old arm/rifle were. Keep face identity EXACTLY as source. No text, no typography, no title, no border, no muzzle flash, no bullet. This is a static edited key pose for a browser-rendered scroll animation, not a video. Preserve original crimson background across entire frame.

## Verification

- TypeScript check passes.
- Next.js compilation and runtime error checks pass (existing Google Fonts network warnings remain).
- Browser checks: desktop opening, firing pose, barrel and projectile; narrow 390 × 844 framing without horizontal overflow; reduced motion returns to one viewport and removes the canvas.
- Forward and reverse screenshots at progress 0.76 have identical SHA-256 hashes.
- Physical mid-range device profiling has not been performed.
