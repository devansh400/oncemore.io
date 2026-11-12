import type { Metadata } from "next";
import { ScrollExperience } from "@/components/scroll/scroll-experience";

export const metadata: Metadata = {
  title: "The OG Fan Event — See What You Missed | OnceMore",
  description:
    "Three games. Personalized OG cards. A comic unlocked pixel by pixel by over a million fans in under 42 hours. See what you missed, and join OnceMore for future fan experiences.",
};

export default function ScrollPage() {
  return <ScrollExperience />;
}
