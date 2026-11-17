"use client";

import { useState } from "react";
import { Button } from "@oncemore-landing-page/ui/components/button";
import { Input } from "@oncemore-landing-page/ui/components/input";
import { BrandMark } from "./brand-mark";
import { colourText, originalTheme, themeAsset, type BrandTheme } from "./brand-themes";

export function Palette({ theme = originalTheme }: { theme?: BrandTheme }) {
  const [copied, setCopied] = useState("");
  async function copy(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
    } catch {
      setCopied("Copy unavailable — select the HEX value below.");
    }
  }
  return (
    <>
      <div className="brand-palette">
        {theme.colours.map(({ name, hex, role }, index) => (
          <button
            key={hex}
            className="brand-swatch"
            style={{ background: hex, color: colourText(hex, theme) }}
            onClick={() => copy(hex)}
            aria-label={`Copy ${name} ${hex}`}
          >
            <span className="brand-mono">
              {String(index + 1).padStart(2, "0")} <span>↗</span>
            </span>
            <div>
              <h3>{name}</h3>
              <code>{hex}</code>
              <p>{role}</p>
            </div>
          </button>
        ))}
      </div>
      <p className="brand-copy-status" role="status">
        {copied.startsWith("#")
          ? `${copied} copied to clipboard.`
          : copied || "Select any swatch to copy its HEX value."}
      </p>
    </>
  );
}

export function LogoPlayground({ theme = originalTheme }: { theme?: BrandTheme }) {
  const [light, setLight] = useState(false);
  return (
    <div className={`brand-logo-board ${light ? "on-cloud" : "on-ink"}`}>
      <div className="brand-board-top">
        <span className="brand-mono">PRIMARY LOCKUP / 01</span>
        <button className="brand-small-action" onClick={() => setLight(!light)}>
          Switch to {light ? "dark" : "light"} ↗
        </button>
      </div>
      <div className="brand-lockup">
        <BrandMark />
        <span>oncemore</span>
      </div>
      <div className="brand-board-bottom brand-mono">
        <span>AN OPEN ORBIT. ANOTHER POSSIBILITY.</span>
        <a href={themeAsset(theme, light ? "oncemore-ink.svg" : "oncemore-cloud.svg")} download>
          DOWNLOAD SVG ↓
        </a>
      </div>
    </div>
  );
}

export function MotionPreview() {
  const [replay, setReplay] = useState(0);
  return (
    <div className="brand-motion-board">
      <div key={replay} className="brand-motion-orbit">
        <BrandMark />
        <span>
          There’s more
          <br />
          on the other side.
        </span>
      </div>
      <div className="brand-board-bottom">
        <span className="brand-mono">ENTER / 700MS / EASE OUT</span>
        <button className="brand-small-action" onClick={() => setReplay(replay + 1)}>
          Replay motion ↻
        </button>
      </div>
    </div>
  );
}

export function ComponentPreview() {
  const [message, setMessage] = useState("");
  return (
    <div className="brand-component-board">
      <div>
        <span className="brand-mono">01 / CALLS TO ADVENTURE</span>
        <div className="brand-button-row">
          <Button nativeButton={false} size="lg" render={<a href="/floating-worlds" />}>
            Explore the worlds <span aria-hidden="true">↗</span>
          </Button>
          <Button
            nativeButton={false}
            size="lg"
            variant="outline"
            render={<a href="#applications" />}
          >
            See it in the world
          </Button>
        </div>
        <p>One clear primary action. Quiet secondary choices.</p>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setMessage("You’re on the list — this is a local preview. No data was sent.");
        }}
      >
        <label htmlFor="brand-email">Your next chapter starts here.</label>
        <div className="brand-form-row">
          <Input
            id="brand-email"
            name="email"
            type="email"
            placeholder="Your email address"
            required
            autoComplete="email"
          />
          <Button type="submit" size="lg">
            Count me in ↗
          </Button>
        </div>
        <p role="status">{message || "Form preview · a little invitation, never a hard sell."}</p>
      </form>
      <div className="brand-status-row">
        <span>
          <i /> World is open
        </span>
        <span className="brand-status-soon">Coming into view</span>
        <span className="brand-mono">8PX GRID · 44PX MIN. TARGET</span>
      </div>
    </div>
  );
}
