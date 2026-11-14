# Fan card layers

Six PNG masters edited with built-in image generation from the original
`og_card_1.png`, `og_card_2.png`, and `og_card_3.png` assets.

Each card has a clean background plate and a transparent portrait. Background
plates remove the person, fan name, OG logo, and registration number, restoring
the patterned paper behind them. The oncemore.io mark remains on the background.
Portrait extraction preserves the source pose, clothing, and accessories and
reconstructs clothing behind the original name lettering.

Production WebPs at 678px width are in `apps/web/public/og2/cards/`.
The original composite cards are preserved.

The logo and fan-name layers retain the original brush lettering through a
live SVG red-ink filter and separate clips in `layered-fan-card.tsx`. The fan
number is a separate DOM text layer. Each card therefore has five independently
rendered layers: background, portrait, logo, number, and name.

Generation prompt set:

- Background, one call per card: remove the person completely, OG logo, number,
  and fan name; reconstruct the hidden patterned background in the original
  grey dragon / red watercolor / blue map palette; preserve the rounded frame
  and oncemore.io mark; retain the 339:589 aspect ratio.
- Portrait, one call per card: extract only the photographed man with true
  transparency; preserve identity, expression, pose, clothing and crop; remove
  the entire card and all lettering; reconstruct trousers behind the name;
  retain proportional positioning in a 339:589 portrait canvas.
