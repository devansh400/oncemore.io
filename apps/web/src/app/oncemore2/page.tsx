import type { Metadata } from "next";

import { OnceMore2Experience } from "@/components/oncemore2/oncemore2-experience";

export const metadata: Metadata = {
  title: "OnceMore — Elastic",
  description: "The OnceMore wordmark, crystallized then stretched into an elastic surface.",
  openGraph: {
    title: "OnceMore — Elastic",
    description: "The OnceMore wordmark, crystallized then stretched into an elastic surface.",
    type: "website",
    siteName: "OnceMore",
  },
};

export default function OnceMore2Page() {
  return <OnceMore2Experience />;
}
