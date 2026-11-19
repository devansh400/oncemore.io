import { WorldsNav } from "@/components/worlds-nav";
import { FloatingWorlds } from "@/floating-worlds/floating-worlds";

import { brandBody, brandDisplay } from "./design/brand-fonts";

export default function Home() {
  return (
    <FloatingWorlds
      bodyClassName={`${brandBody.className} ${brandDisplay.variable}`}
      displayClassName={brandDisplay.className}
    >
      <WorldsNav
        className="absolute inset-x-4 top-16 z-10 mx-auto max-w-3xl xl:top-4"
        onLanding
        wordmarkClassName={brandDisplay.className}
      />
    </FloatingWorlds>
  );
}
