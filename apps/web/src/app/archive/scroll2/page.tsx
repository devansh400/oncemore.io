import type { Metadata } from "next";
import "@fontsource/anton/latin-400.css";
import "@fontsource/barlow-condensed/latin-400.css";
import { ResponsiveScrollExperience } from "@/components/scroll2/scroll-responsive";

export const metadata: Metadata = {
  title: "The OG Fan Event — See What You Missed | OnceMore",
  description:
    "Three games. Personalized OG cards. A comic unlocked pixel by pixel by over a million fans in under 42 hours. See what you missed, and join OnceMore for future fan experiences.",
};

export default function ScrollPage() {
  return <ResponsiveScrollExperience />;
}
