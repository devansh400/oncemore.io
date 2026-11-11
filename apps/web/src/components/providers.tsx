"use client";

import { Toaster } from "@oncemore-landing-page/ui/components/sonner";

import { SmoothScroll } from "./smooth-scroll";
import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <SmoothScroll>{children}</SmoothScroll>
      <Toaster richColors theme="dark" />
    </ThemeProvider>
  );
}
