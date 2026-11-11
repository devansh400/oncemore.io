"use client";

import Lanyard from "@oncemore-landing-page/ui/components/Lanyard";

export function SouvenirLanyard({ size = 0.66, className }: { size?: number; className?: string }) {
  return (
    <Lanyard
      frontImage="/souvenir/front.svg"
      backImage="/souvenir/back.svg"
      imageFit="cover"
      cardColor="#FFF8F2"
      orientation="portrait"
      finish="matte"
      cornerRadius={0.42}
      size={size}
      anchor="center"
      strapLength={0.52}
      strapColor="#4A3B58"
      strapWidth={0.62}
      metal="gold"
      gravity={1}
      damping={0.55}
      elasticity={0.5}
      breeze={0.28}
      interactive
      intro
      className={className}
    />
  );
}
