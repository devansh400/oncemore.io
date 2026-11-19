import type { Metadata } from "next";
import "@fontsource/anton/latin-400.css";
import "@fontsource/barlow-condensed/latin-400.css";
import { OGJourney } from "@/components/og2/og-journey";

export const metadata: Metadata = {
  title: "OG — Step Inside the Story | OnceMore",
  description:
    "A million fans unlocked The First Blood. Walk through the illustrated world of OG: Katana, Archery, Bushido, and the fans who made it happen.",
};

export default function OGPage() {
  return <OGJourney />;
}
