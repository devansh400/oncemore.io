import type { Metadata } from "next";

import { TransitionExperience } from "@/components/transition/transition-experience";

export const metadata: Metadata = {
  title: "OnceMore — Transition",
  description: "A light-tunnel transition study: card zoom, tunnel travel, section reveal.",
};

export default function TransitionPage() {
  return <TransitionExperience />;
}
