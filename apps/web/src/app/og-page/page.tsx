import type { Metadata } from "next";
import { IslandArrival } from "@/components/island-arrival";
import "@fontsource/anton/latin-400.css";
import "@fontsource/barlow-condensed/latin-400.css";
import "@fontsource/barlow-condensed/latin-500.css";

import { CarExperience } from "./car-experience";

export const metadata: Metadata = {
  title: "They Call Him OG — Unlocked by the Fans | OnceMore",
  description:
    "The actual car from They Call Him OG. The comic reveal powered by a million fans on OnceMore. Step inside the story they unlocked together, pixel by pixel.",
  openGraph: {
    title: "They Call Him OG — Unlocked by the Fans",
    description: "A million fans. Under 42 hours. OG’s comic, unlocked pixel by pixel on OnceMore.",
    images: ["/og-car/story/v1/first-blood.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "They Call Him OG — Unlocked by the Fans",
    description:
      "The car from the film. The world unlocked by its fans. A OnceMore fan experience.",
    images: ["/og-car/story/v1/first-blood.webp"],
  },
};

export default function OGCarPage() {
  return (
    <>
      <IslandArrival />
      <CarExperience />
    </>
  );
}
