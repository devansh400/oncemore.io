import type { Metadata } from "next";

import { KatanaExperience } from "@/components/katana/katana-experience";

export const metadata: Metadata = {
  title: "They Call Him OG — OnceMore",
  description:
    "Three games. One million fans in under 42 hours. Explore the OG fan experience built by OnceMore.",
  openGraph: {
    title: "They Call Him OG — OnceMore",
    description:
      "Three games. One million fans in under 42 hours. Explore the OG fan experience built by OnceMore.",
    type: "website",
    siteName: "OnceMore",
  },
};

export default function KatanaPage() {
  return <KatanaExperience />;
}
