"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import styles from "./scroll-themes.module.css";

const themes = [
  { id: "parchment", name: "Parchment", paper: "#e6dcc7", ink: "#9c3b28" },
  { id: "katana", name: "Katana", paper: "#090d0e", ink: "#de3436" },
  { id: "jade", name: "Jade", paper: "#133c35", ink: "#d8c18c" },
  { id: "noir", name: "Noir", paper: "#e7e7e2", ink: "#202321" },
  { id: "vermilion", name: "Vermilion", paper: "#a22f24", ink: "#ffe8bc" },
  { id: "black-rain", name: "Black Rain", paper: "#07171e", ink: "#ff5149" },
  { id: "scorched", name: "Scorched", paper: "#17110c", ink: "#eea463" },
] as const;
type Theme = (typeof themes)[number]["id"];

export function ScrollThemes({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("parchment");
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  return (
    <div className={styles.scope} data-og-theme={theme}>
      {children}
      <div className={styles.dock} role="group" aria-label="Page theme">
        <span className={styles.label}>Choose your mood</span>
        <div className={styles.options}>
          {themes.map((item, index) => (
            <button
              key={item.id}
              ref={(element) => {
                buttons.current[index] = element;
              }}
              type="button"
              aria-label={`${item.name} theme`}
              aria-pressed={theme === item.id}
              title={item.name}
              className={styles.option}
              style={{ "--swatch-paper": item.paper, "--swatch-ink": item.ink } as CSSProperties}
              onClick={() => setTheme(item.id)}
              onKeyDown={(event) => {
                const direction =
                  event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
                if (!direction && event.key !== "Home" && event.key !== "End") return;
                event.preventDefault();
                const next =
                  event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? themes.length - 1
                      : (index + direction + themes.length) % themes.length;
                setTheme(themes[next]!.id);
                buttons.current[next]?.focus();
              }}
            >
              <span className={styles.swatch} aria-hidden="true">
                Aa
              </span>
              <span className={styles.name}>{item.name}</span>
            </button>
          ))}
        </div>
        <span className={styles.srOnly} aria-live="polite">
          {themes.find((item) => item.id === theme)?.name} theme selected
        </span>
      </div>
    </div>
  );
}
