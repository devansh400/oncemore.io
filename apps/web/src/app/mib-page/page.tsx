import type { Metadata } from "next";
import { IslandArrival } from "@/components/island-arrival";
import "@fontsource/anton/latin-400.css";
import "@fontsource/barlow-condensed/latin-400.css";
import "@fontsource/barlow-condensed/latin-500.css";

import { preloadSequence } from "@/lib/preload-sequence";

import { CinematicExperience } from "./cinematic-experience";
import { MIB_POSTER, MIB_SEQUENCE } from "./frame-sequence";

export const metadata: Metadata = {
  title: "Maa Inti Bangaaram — You had to be there | OnceMore",
  description:
    "A million players matched answers with Samantha and unlocked personal MIB cards and edits. See what you missed—and join OnceMore for the next fan experience.",
  openGraph: {
    title: "Maa Inti Bangaaram — You had to be there",
    description:
      "The MIB launch event has ended. See what fans unlocked and join OnceMore for what’s next.",
    images: ["/mib2/hair-clean-v1/opening.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maa Inti Bangaaram — You had to be there",
    description:
      "Missed the MIB launch experience? See what fans unlocked—and be there for the next one with OnceMore.",
    images: ["/mib2/hair-clean-v1/opening.webp"],
  },
};

export default function MaaIntiBangaaramPage() {
  preloadSequence(MIB_SEQUENCE, MIB_POSTER);
  return (
    <>
      <IslandArrival />
      <CinematicExperience />
    </>
  );
}
