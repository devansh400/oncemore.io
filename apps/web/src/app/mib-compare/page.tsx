import type { Metadata } from "next";
import { SideBySideComparison } from "@/components/side-by-side-comparison";

export const metadata: Metadata = { title: "MIB — Side by side | OnceMore" };

export default function MIBComparePage() {
  return (
    <SideBySideComparison title="Maa Inti Bangaaram" before="/maa-inti-bangaaram" after="/mib2" />
  );
}
