import type { Metadata } from "next";

import { SquishStage } from "./squish-stage";

export const metadata: Metadata = {
  title: "OnceMore — Elastic",
  description: "The name, made of rubber. Drag it, flick it, watch it settle.",
  openGraph: {
    title: "OnceMore — Elastic",
    description: "The name, made of rubber. Drag it, flick it, watch it settle.",
    type: "website",
    siteName: "OnceMore",
  },
};

export default function SquishPage() {
  return <SquishStage />;
}
