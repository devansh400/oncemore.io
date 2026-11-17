import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { brandThemes, lookSlugs, colourText, contrast } from "../src/app/brand/brand-themes";

// Run with: bun apps/web/scripts/generate-brand-look-assets.ts
// Scene captures live beside these generated assets and are rendered from the matching preset.
const root = fileURLToPath(new URL("../public/brand/", import.meta.url));
const base = JSON.parse(await readFile(`${root}/oncemore-tokens.json`, "utf8"));
const logo = await readFile(`${root}/oncemore-cloud.svg`, "utf8");
const symbol = await readFile(`${root}/oncemore-mark.svg`, "utf8");
const roles = ["ink", "cloud", "accent", "warm", "atmosphere", "landscape"];

for (const slug of lookSlugs) {
  const theme = brandThemes[slug];
  const [dark, light, accent] = theme.colours;
  const actionText = colourText(accent.hex, theme);
  const backgroundRole = theme.light ? "cloud" : "ink";
  const textRole = theme.light ? "ink" : "cloud";
  const actionTextRole = actionText === dark.hex ? "ink" : "cloud";
  const colour = Object.fromEntries(theme.colours.map((c, i) => [roles[i], c.hex]));
  const colourNames = Object.fromEntries(theme.colours.map((c, i) => [roles[i], c.name]));
  const success = theme.light ? "#426744" : "#A7BCA2";
  const error = theme.light ? "#A03C27" : "#F0A48D";
  const tokens = {
    ...base,
    look: theme.name,
    description: theme.description,
    colour,
    colourNames,
    semantic: {
      background: `{colour.${backgroundRole}}`,
      text: `{colour.${textRole}}`,
      action: "{colour.accent}",
      actionText: `{colour.${actionTextRole}}`,
      focus: "{colour.accent}",
      success,
      error,
    },
    sourceLook: {
      scene: "/floating-worlds",
      note: "Exact scene look values. HEX colours are an interface interpretation of the rendered look.",
      values: theme.settings,
    },
    contrast: {
      text: Number(contrast(dark.hex, light.hex).toFixed(2)),
      action: Number(contrast(accent.hex, actionText).toFixed(2)),
    },
  };
  if (tokens.contrast.text < 4.5 || tokens.contrast.action < 4.5) {
    throw new Error(`${theme.name} needs more readable text/action colours`);
  }
  const dir = `${root}/looks/${slug}`;
  await mkdir(dir, { recursive: true });
  await writeFile(`${dir}/oncemore-tokens.json`, JSON.stringify(tokens, null, 2) + "\n");
  await writeFile(
    `${dir}/oncemore-tokens.css`,
    `/* Oncemore / ${theme.name}. Load the named font families separately. */
:root {
${Object.entries(colour)
  .map(([key, value]) => `  --oncemore-${key}: ${value};`)
  .join("\n")}
  --oncemore-background: var(--oncemore-${backgroundRole});
  --oncemore-text: var(--oncemore-${textRole});
  --oncemore-action: var(--oncemore-accent);
  --oncemore-action-text: var(--oncemore-${actionTextRole});
  --oncemore-focus: var(--oncemore-accent);
  --oncemore-success: ${success};
  --oncemore-error: ${error};
  --oncemore-font-display: 'Bricolage Grotesque', sans-serif;
  --oncemore-font-body: 'DM Sans', sans-serif;
  --oncemore-font-detail: 'Geist Mono', monospace;
  --oncemore-space: 8px;
  --oncemore-radius: 0px;
  --oncemore-respond: 160ms;
  --oncemore-reveal: 400ms;
  --oncemore-enter: 700ms;
  --oncemore-ease: cubic-bezier(0.22, 1, 0.36, 1);
}
@media (prefers-reduced-motion: reduce) {
  :root { --oncemore-respond: 0ms; --oncemore-reveal: 0ms; --oncemore-enter: 0ms; }
}
`,
  );
  for (const [name, hex] of [
    ["ink", dark.hex],
    ["cloud", light.hex],
  ] as const) {
    await writeFile(
      `${dir}/oncemore-${name}.svg`,
      logo
        .replace('color="#EDE6D6"', `color="${hex}"`)
        .replace('aria-label="oncemore"', `aria-label="Oncemore / ${theme.name}"`),
    );
  }
  await writeFile(
    `${dir}/oncemore-mark.svg`,
    symbol
      .replace('color="#E5A15B"', `color="${accent.hex}"`)
      .replace("Oncemore eclipse symbol", `Oncemore ${theme.name} eclipse symbol`),
  );
  console.log(
    `${theme.name}: text ${tokens.contrast.text}:1 / actions ${tokens.contrast.action}:1`,
  );
}
