import type { CSSProperties, ReactNode } from "react";
import styles from "./scroll-experience.module.css";

export function PaperMount({
  children,
  ratio,
  className = "",
}: {
  children: ReactNode;
  ratio: string;
  className?: string;
}) {
  return (
    <div
      className={`${styles.paperMount} ${className}`}
      style={{ "--media-ratio": ratio } as CSSProperties}
    >
      <div className={styles.mediaInk}>{children}</div>
    </div>
  );
}
