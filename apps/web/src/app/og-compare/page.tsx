import type { Metadata } from "next";
import { SideBySideComparison } from "@/components/side-by-side-comparison";

export const metadata: Metadata = { title: "OG — Side by side | OnceMore" };

export default function OGComparePage() {
  return <SideBySideComparison title="The OG experience" before="/scroll" after="/scroll2" />;
}
