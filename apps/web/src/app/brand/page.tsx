import type { Metadata } from "next";
import { BrandBook } from "./brand-book";
export const metadata: Metadata = {
  title: "Oncemore — A world beyond the frame",
  description:
    "The Oncemore identity: a living system of light, atmosphere, and possibility. Brand foundations, colour, typography, motion, and components.",
};
export default function BrandPage() {
  return <BrandBook />;
}
