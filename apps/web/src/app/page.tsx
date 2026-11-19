import { WorldsNav } from "@/components/worlds-nav";
import { FloatingWorlds } from "@/floating-worlds/floating-worlds";

export default function Home() {
  return (
    <FloatingWorlds>
      <WorldsNav className="absolute inset-x-4 top-16 z-10 mx-auto max-w-3xl xl:top-4" onLanding />
    </FloatingWorlds>
  );
}
