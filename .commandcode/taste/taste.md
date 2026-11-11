# Taste

## Styling & scoping

- Treats styles as per-page/per-feature: new pages get their own self-contained design system (scoped CSS module variables, own fonts) rather than inheriting the existing app's look, and explicitly says not to look at or mimic other parts of the app because "all have a different style." Confidence: 0.6

## Design aesthetics

- Rejects generic, corporate-looking UI — especially default blue / Material-style palettes. Expects a distinctive, deliberately art-directed design system (often derived from a reference image the user provides) instead of safe generic colors. Confidence: 0.7
- Expects page/dashboard layouts to fill the entire browser viewport (full-bleed, edge-to-edge, content stretching into available height) rather than sitting in a small max-width centered container. Confidence: 0.6

## Visual / 3D direction

- When describing a "scroll down through the model" journey, expects the 3D model framed vertically on screen with camera travel downward along its length (e.g. blade tip → handle) — not a horizontal/lateral pass. Corrections on framing/orientation should be taken literally. Confidence: 0.6
