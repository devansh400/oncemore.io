declare module "@oncemore-landing-page/ui/components/CrystalizedBall.jsx" {
  import type { ComponentType, CSSProperties } from "react";

  export type CrystalizedBallPreset =
    | "plasma"
    | "aurora"
    | "nebula"
    | "ember"
    | "frost"
    | "solar"
    | "eclipse"
    | "abyss";

  export type CrystalizedBallProps = {
    preset?: CrystalizedBallPreset;
    color?: string;
    theme?: "dark" | "light";
    size?: number;
    strands?: number;
    crackle?: number;
    flares?: number;
    glow?: number;
    sparks?: number;
    particleCount?: number;
    fill?: number;
    motion?: "rise" | "fall" | "drift" | "orbit";
    particleShape?: "square" | "round";
    depth?: number;
    sway?: number;
    twinkle?: number;
    haze?: number;
    speed?: number;
    dustSpeed?: number;
    interactive?: boolean;
    hoverStrength?: number;
    intro?: boolean;
    paused?: boolean;
    className?: string;
    style?: CSSProperties;
  };

  const CrystalizedBall: ComponentType<CrystalizedBallProps>;
  export default CrystalizedBall;
}
