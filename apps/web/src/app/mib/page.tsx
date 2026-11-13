import type { Metadata } from "next";
import { MibExperience } from "./mib-experience";

export const metadata: Metadata = {
  title: "Maa Inti Bangaaram × OnceMore",
  description:
    "A scroll-controlled cinematic experience for Maa Inti Bangaaram fans, created with OnceMore.",
};

export default function MibPage() {
  return <MibExperience />;
}
