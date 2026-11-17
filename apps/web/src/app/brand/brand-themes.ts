import type { CSSProperties } from "react";

export const lookSlugs = [
  "dusk",
  "storm",
  "golden-hour",
  "bright",
  "blue-hour",
  "artwork",
] as const;
export type LookSlug = (typeof lookSlugs)[number];
export type BrandColour = { name: string; hex: string; role: string };
export type LookSettings = Record<
  | "exposure"
  | "fill"
  | "relight"
  | "sun"
  | "rim"
  | "sky"
  | "warmth"
  | "haze"
  | "clouds"
  | "glow"
  | "contrast"
  | "saturation"
  | "vignette",
  number
>;
export type BrandTheme = {
  slug: LookSlug | "original";
  name: string;
  mood: string;
  description: string;
  colourTitle: string;
  colourStory: string;
  imageDirection: string;
  signature: string;
  caption: [string, string];
  colours: [BrandColour, BrandColour, BrandColour, BrandColour, BrandColour, BrandColour];
  settings: LookSettings;
  light?: boolean;
};

// Look settings mirror the named presets in public/floating-worlds/app.js.
// HEX palettes are design interpretations of those rendered looks, not shader inputs.
const stormSettings: LookSettings = {
  exposure: 1,
  fill: 1,
  relight: 1,
  sun: 1,
  rim: 1,
  sky: 1,
  warmth: 1,
  haze: 1,
  clouds: 1,
  glow: 1,
  contrast: 1,
  saturation: 1,
  vignette: 1,
};
function colours(names: string[], hexes: string[]): BrandTheme["colours"] {
  const roles = [
    "The anchor. Dark surfaces and primary text.",
    "The breathing room. Light surfaces and inverse text.",
    "The invitation. Primary actions, focus, and emphasis.",
    "The warmth. Expressive illustration and image accents.",
    "The distance. Supporting graphics and atmospheric layers.",
    "The landscape. Secondary graphics and quiet details.",
  ];
  return names.map((name, i) => ({
    name,
    hex: hexes[i]!,
    role: roles[i]!,
  })) as BrandTheme["colours"];
}

export const brandThemes: Record<LookSlug, BrandTheme> = {
  dusk: {
    slug: "dusk",
    name: "Dusk",
    mood: "The warmth that stays.",
    description:
      "The moment between day and night. Slate shadows soften around a copper horizon, with enough light to make every world feel close.",
    colourTitle: "Let the last light linger.",
    colourStory:
      "Twilight and Cloud carry the structure. Copperlight gives the interface its warm invitation. Muted mauve, clay, and sage echo the islands as they settle into the evening.",
    imageDirection:
      "Balance warm highlights with cool, layered shadows. Keep the sunset present without letting it wash away the foreground.",
    signature: "A soft copper rim against slate-blue depth.",
    caption: ["The day fades.", "The story stays."],
    colours: colours(
      ["Twilight", "Cloud", "Copperlight", "Fired clay", "Evening slate", "Distant sage"],
      ["#10141E", "#EEE5D6", "#DBAA75", "#BA7456", "#747988", "#858B7B"],
    ),
    settings: { ...stormSettings, exposure: 1.08, fill: 1.22, sun: 1.1, sky: 1.15, vignette: 0.9 },
  },
  storm: {
    slug: "storm",
    name: "Storm",
    mood: "A little closer to the unknown.",
    description:
      "Deeper shadows. A tighter pool of light. Storm turns the same horizon into something more dramatic, with graphite skies and a weathered bronze glow.",
    colourTitle: "Find the light in the dark.",
    colourStory:
      "Thunderhead makes room for the drama. Silver cloud keeps the reading clear. Beacon is the small warm signal that guides you through charcoal, iron blue, and weathered stone.",
    imageDirection:
      "Protect the dark foreground and the pockets of warm light. Let cloud layers fall into shadow, while keeping the route through the world legible.",
    signature: "Weathered bronze breaking through graphite clouds.",
    caption: ["Into the unknown.", "Follow the glow."],
    colours: colours(
      ["Thunderhead", "Silver cloud", "Beacon", "Weathered bronze", "Iron blue", "Wet stone"],
      ["#0D1119", "#DDE0DD", "#D4A06B", "#A76448", "#647180", "#797F78"],
    ),
    settings: { ...stormSettings },
  },
  "golden-hour": {
    slug: "golden-hour",
    name: "Golden hour",
    mood: "Everything, in a warmer light.",
    description:
      "The horizon opens in honey, apricot, and sunlit haze. Stronger sunlight and warmer skies turn the journey into an expansive, generous invitation.",
    colourTitle: "Give the horizon room to glow.",
    colourStory:
      "Umber grounds the brightness. Warm linen and Honey bring the sun into the system. Apricot, sandstone, and olive keep the warmth rooted in a real landscape.",
    imageDirection:
      "Use broad pools of warm sunlight, luminous cloud edges, and gentle haze. Keep dark rock and readable silhouettes beneath the glow.",
    signature: "Honey light, apricot edges, and a generous horizon.",
    caption: ["Follow the light.", "Find your world."],
    colours: colours(
      ["Umber", "Warm linen", "Honey", "Apricot", "Sandstone", "Sunlit olive"],
      ["#241913", "#F7E7CA", "#F1BD70", "#D1864B", "#AC8F7E", "#8E9270"],
    ),
    settings: {
      exposure: 1.16,
      fill: 1.45,
      relight: 0.85,
      sun: 1.5,
      rim: 1.3,
      sky: 1.5,
      warmth: 1.4,
      haze: 1.15,
      clouds: 1,
      glow: 1.15,
      contrast: 1,
      saturation: 1.06,
      vignette: 0.7,
    },
  },
  bright: {
    slug: "bright",
    name: "Bright",
    mood: "More light. More possibility.",
    description:
      "Open shadows, a brighter sky, and less haze. The worlds feel lighter and easier to enter, with warm white surfaces and crisp blue-grey detail.",
    colourTitle: "Let the whole world breathe.",
    colourStory:
      "Daylight becomes the main canvas, with Sky ink for clear, grounded type. Ochre gives actions a readable warm tone; Sunwash, mist, and pale sage carry the airiness of the scene.",
    imageDirection:
      "Lift the shadows and keep the sky open. Favour clear atmospheric layers, natural island detail, and gentle highlights over heavy glows.",
    signature: "Open daylight, clear silhouettes, and a quiet ochre accent.",
    caption: ["A wider horizon.", "An open invitation."],
    colours: colours(
      ["Sky ink", "Daylight", "Ochre", "Sunwash", "Morning mist", "Pale sage"],
      ["#23333E", "#F3F0E7", "#9A592E", "#E7C889", "#A1AFB4", "#A6B19B"],
    ),
    settings: {
      exposure: 1.28,
      fill: 1.75,
      relight: 0.6,
      sun: 1.2,
      rim: 0.8,
      sky: 1.9,
      warmth: 0.85,
      haze: 0.8,
      clouds: 1,
      glow: 0.8,
      contrast: 0.97,
      saturation: 1.05,
      vignette: 0.45,
    },
    light: true,
  },
  "blue-hour": {
    slug: "blue-hour",
    name: "Blue hour",
    mood: "Stay with the quiet wonder.",
    description:
      "Cooler air, softer sunlight, and a silver-blue horizon. A more contemplative world, where the last warm lights feel all the more human.",
    colourTitle: "A quieter kind of luminous.",
    colourStory:
      "Blue night and Moon cloud set a cool foundation. Moonlight guides the interface in pale blue. The copper accent is a small reminder of the inhabited worlds inside the mist.",
    imageDirection:
      "Let blue-grey atmosphere lead. Soften sunlight and rim light, retain small copper windows, and preserve the layered separation of the islands.",
    signature: "Silver-blue distance with a trace of copper warmth.",
    caption: ["The world gets quiet.", "Wonder stays awake."],
    colours: colours(
      ["Blue night", "Moon cloud", "Moonlight", "Last copper", "Blue mist", "Silver stone"],
      ["#0E1729", "#DFE7EE", "#A8C3DA", "#BE8B6F", "#647E99", "#8E9CA6"],
    ),
    settings: {
      exposure: 1.1,
      fill: 1.3,
      relight: 1,
      sun: 0.7,
      rim: 0.7,
      sky: 1.35,
      warmth: 0.5,
      haze: 1.1,
      clouds: 1,
      glow: 1,
      contrast: 1,
      saturation: 0.92,
      vignette: 0.9,
    },
  },
  artwork: {
    slug: "artwork",
    name: "Artwork",
    mood: "Let every world be itself.",
    description:
      "Less relighting and less haze allow the original island art to speak. Red leaves, aged gold, green canopies, and textured stone become the identity’s richest notes.",
    colourTitle: "Take your colour from the world.",
    colourStory:
      "Obsidian and Canvas keep the frame quiet. Aged gold invites discovery, while Vermilion, mineral blue, and Canopy bring the handcrafted landscapes into the identity.",
    imageDirection:
      "Preserve the artwork’s native colours and material detail. Use lighter atmospheric grading and let red foliage, gold architecture, and green canopies keep their character.",
    signature: "Aged gold, vermilion leaves, and living green detail.",
    caption: ["Worlds with character.", "Stories with soul."],
    colours: colours(
      ["Obsidian", "Canvas", "Aged gold", "Vermilion", "Mineral blue", "Canopy"],
      ["#151C1B", "#F1E3CB", "#D6AA72", "#BA5F3E", "#677B7E", "#829573"],
    ),
    settings: {
      exposure: 1.12,
      fill: 1.35,
      relight: 0.25,
      sun: 1,
      rim: 0.6,
      sky: 1.3,
      warmth: 1,
      haze: 0.7,
      clouds: 0.9,
      glow: 1,
      contrast: 1,
      saturation: 1.05,
      vignette: 0.6,
    },
  },
};

export const originalTheme: BrandTheme = {
  ...brandThemes.dusk,
  slug: "original",
  name: "Original",
  mood: "A new horizon.",
  colourTitle: "Night holds the light.",
  colourStory:
    "A world of deep shadows and warm horizons. Midnight and Cloud do the everyday work. Afterglow leads the eye. The landscape colours add depth in small doses.",
  colours: colours(
    ["Midnight", "Cloud", "Afterglow", "Ember", "Atmosphere", "Earth"],
    ["#0B0F17", "#EDE6D6", "#E5A15B", "#C8663D", "#758592", "#829182"],
  ),
  caption: ["Five worlds.", "Endless possibility."],
};

export function themeAsset(theme: BrandTheme, file: string) {
  return theme.slug === "original" ? `/brand/${file}` : `/brand/looks/${theme.slug}/${file}`;
}

function luminance(hex: string) {
  const c = hex
    .slice(1)
    .match(/../g)!
    .map((v) => parseInt(v, 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return c[0]! * 0.2126 + c[1]! * 0.7152 + c[2]! * 0.0722;
}
export function contrast(a: string, b: string) {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
export function colourText(hex: string, theme: BrandTheme) {
  const [dark, light] = theme.colours;
  return contrast(hex, dark.hex) > contrast(hex, light.hex) ? dark.hex : light.hex;
}
export function themeStyle(theme: BrandTheme): CSSProperties {
  const [dark, light, accent, warm, atmosphere, landscape] = theme.colours;
  return {
    "--b-ink": dark.hex,
    "--b-cloud": light.hex,
    "--b-amber": accent.hex,
    "--b-warm": warm.hex,
    "--b-atmosphere": atmosphere.hex,
    "--b-landscape": landscape.hex,
    "--b-page": theme.light ? light.hex : dark.hex,
    "--b-text": theme.light ? dark.hex : light.hex,
    "--b-action-text": colourText(accent.hex, theme),
    "--b-success": theme.light ? "#426744" : "#A7BCA2",
    "--b-error": theme.light ? "#A03C27" : "#F0A48D",
  } as CSSProperties;
}
