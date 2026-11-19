"use client";

import { Palette } from "lucide-react";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

import styles from "./profile.module.css";

const THEMES = [
  { id: "peach", label: "Peach", color: "#ec8a55" },
  { id: "lavender", label: "Lavender", color: "#9b7bc4" },
  { id: "sage", label: "Sage", color: "#68997b" },
  { id: "ocean", label: "Ocean", color: "#568fb5" },
  { id: "rose", label: "Rose", color: "#c77d91" },
] as const;

type Theme = (typeof THEMES)[number]["id"];
const STORAGE_KEY = "oncemore.profile2.theme.v1";

export function ThemeFrame({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("peach");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (THEMES.some(({ id }) => id === saved)) setTheme(saved as Theme);
    } catch {
      // The selector also works when browser storage is unavailable.
    }
  }, []);

  function selectTheme(next: Theme) {
    setTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Keep the selected theme for this visit if storage is unavailable.
    }
  }

  return (
    <div className={styles.frame} data-profile-theme={theme}>
      {children}
      <fieldset className={styles.themePill}>
        <legend className={styles.visuallyHidden}>Profile theme</legend>
        <Palette className={styles.themeIcon} size={17} aria-hidden="true" />
        {THEMES.map(({ id, label, color }) => (
          <label key={id} className={styles.themeOption} title={`${label} theme`}>
            <input
              type="radio"
              name="profile-theme"
              value={id}
              checked={theme === id}
              onChange={() => selectTheme(id)}
              className={styles.themeInput}
            />
            <span className={styles.themeChoice} style={{ "--swatch": color } as CSSProperties}>
              <span className={styles.themeSwatch} aria-hidden="true" />
              <span className={styles.themeName}>{label}</span>
            </span>
          </label>
        ))}
      </fieldset>
    </div>
  );
}
