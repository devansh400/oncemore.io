declare module "@oncemore-landing-page/ui/components/ElasticMesh" {
  import type { ComponentType, CSSProperties } from "react";

  export interface ElasticMeshProps {
    text?: string;
    src?: string;
    fontFamily?: string;
    fontWeight?: number;
    color?: string;
    imageColors?: boolean;
    material?: "balloon" | "chrome" | "jelly" | "clay";
    inflate?: number;
    stiffness?: number;
    wobble?: number;
    grabRadius?: number;
    stretch?: number;
    press?: number;
    shadow?: number;
    chaos?: number;
    intro?: boolean;
    theme?: "dark" | "light";
    dpr?: number;
    className?: string;
    style?: CSSProperties;
  }

  const ElasticMesh: ComponentType<ElasticMeshProps>;
  export default ElasticMesh;
}
