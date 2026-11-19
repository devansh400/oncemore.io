import type { Metadata } from "next";

import { OnceMoreExperience } from "@/components/oncemore/once-more-experience";

export const metadata: Metadata = {
  title: "OnceMore — Crystalized",
  description: "A crystallized motion study of the OnceMore wordmark.",
  openGraph: {
    title: "OnceMore — Crystalized",
    description: "A crystallized motion study of the OnceMore wordmark.",
    type: "website",
    siteName: "OnceMore",
  },
};

export default function OnceMorePage() {
  return <OnceMoreExperience />;
}
