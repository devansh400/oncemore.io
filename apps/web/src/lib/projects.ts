export type Project = {
  slug: string;
  index: string;
  title: string;
  year: string;
  genre: string;
  director: string;
  lead: string;
  summary: string;
  tags: string[];
  poster: string;
  posterAlt: string;
  inset: string;
  insetAlt: string;
  accent: "ember" | "gold";
};

export const projects: Project[] = [
  {
    slug: "they-call-him-og",
    index: "01",
    title: "They Call Him OG",
    year: "2025",
    genre: "Telugu crime action",
    director: "Sujeeth",
    lead: "Pawan Kalyan",
    summary:
      "Rain-soaked Bombay. A city on the edge. We turned the launch into a living underworld built around the film's most iconic moments.",
    tags: ["Interactive world", "AI character moments", "Launch campaign"],
    poster: "/media/og/poster-rain.jpg",
    posterAlt: "They Call Him OG poster — a man aiming a pistol in heavy rain",
    inset: "/media/og/poster-flame.webp",
    insetAlt: "They Call Him OG key art — a figure seated in front of flames",
    accent: "ember",
  },
  {
    slug: "maa-inti-bangaaram",
    index: "02",
    title: "Maa Inti Bangaaram",
    year: "2026",
    genre: "Telugu action comedy drama",
    director: "B. V. Nandini Reddy",
    lead: "Samantha Ruth Prabhu",
    summary:
      "A family story with a golden edge. We built an experience that let fans step into the film's warmth, wit, and quiet danger before release.",
    tags: ["Interactive world", "Exclusive reveals", "Fan companion"],
    poster: "/media/mib/poster-main.jpg",
    posterAlt: "Maa Inti Bangaaram poster — a woman in a red saree holding a shotgun",
    inset: "/media/mib/muzzle.jpg",
    insetAlt: "Maa Inti Bangaaram key art detail — a muzzle flash in the dark",
    accent: "gold",
  },
];

export const capabilities = [
  {
    index: "01",
    title: "Interactive Worlds",
    body: "Playable, explorable fan environments built around your IP — not another microsite.",
  },
  {
    index: "02",
    title: "AI-Powered Moments",
    body: "Characters and companions that respond, remember, and surprise every fan differently.",
  },
  {
    index: "03",
    title: "Exclusive Content",
    body: "Drops, reveals, and behind-the-scenes access fans cannot get anywhere else.",
  },
  {
    index: "04",
    title: "Launch Amplification",
    body: "Campaigns engineered to turn anticipation into a global fan surge on day one.",
  },
];

export const processSteps = [
  {
    index: "01",
    title: "Collaborate",
    body: "We embed with your team to find the moment fans will care about most.",
  },
  {
    index: "02",
    title: "Design",
    body: "We prototype the world, the mechanics, and the emotional arc before we build.",
  },
  {
    index: "03",
    title: "Build",
    body: "We ship a production-grade experience across web and mobile, ready for scale.",
  },
  {
    index: "04",
    title: "Launch",
    body: "We light it up with your release — and keep the world alive long after.",
  },
];

export const stats = [
  { value: "1M+", label: "fans in 48 hours" },
  { value: "02", label: "flagship IP launches" },
  { value: "01", label: "platform for living fan worlds" },
];
