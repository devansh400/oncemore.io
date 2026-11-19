import type { Metadata } from "next";
import { BrandBook } from "../brand/brand-book";
import { brandThemes } from "../brand/brand-themes";
const theme = brandThemes["artwork"];
export const metadata: Metadata = {
  title: `Oncemore — ${theme.name} brand identity`,
  description: theme.description,
};
export default function Page() {
  return <BrandBook theme={theme} />;
}
