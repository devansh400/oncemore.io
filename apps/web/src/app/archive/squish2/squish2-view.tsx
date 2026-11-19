"use client";

import ElasticMesh from "@oncemore-landing-page/ui/components/ElasticMesh";

export function Squish2View() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-black">
      <div className="h-[min(50vh,420px)] w-[min(92vw,1280px)]">
        <ElasticMesh text="OnceMore" />
      </div>
    </div>
  );
}
