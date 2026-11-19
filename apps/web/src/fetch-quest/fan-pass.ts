/*
 * The fan's pass: the golden ticket, made permanent. Built as SVG at runtime
 * (it carries their name and fan number) in the dusk palette, with the
 * painted dog embedded as a data URL, since an SVG loaded as an image can't
 * fetch anything itself. Returned as blob URLs for the souvenir lanyard.
 */
import type { Fan } from "./register";

const escape = (text: string) =>
  text.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

async function dataUrl(path: string) {
  try {
    const blob = await (await fetch(path)).blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

const mark = `<path d="M48.7 13.9A25 25 0 1 0 48.7 50.1" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M38 10a24 24 0 0 1 0 44A28 28 0 0 0 38 10Z" fill="currentColor"/><circle cx="53" cy="32" r="3" fill="currentColor"/>`;

function frontSvg(fan: Fan, dog: string | null) {
  const name = escape(fan.name);
  const size = fan.name.length > 18 ? 46 : fan.name.length > 12 ? 58 : 72;
  const number = String(fan.number).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const year = new Date(fan.joinedAt).getFullYear();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1125" viewBox="0 0 800 1125">
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#0B0F17"/><stop offset="0.45" stop-color="#1A2233"/>
    <stop offset="0.78" stop-color="#5A3B32"/><stop offset="1" stop-color="#C9783F"/>
  </linearGradient>
  <radialGradient id="sun" cx="0.82" cy="0.62" r="0.5">
    <stop offset="0" stop-color="#FFD9A0" stop-opacity="0.9"/><stop offset="1" stop-color="#FFB46A" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="gold" x1="1" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#FFF0C2"/><stop offset="0.4" stop-color="#F2C76A"/><stop offset="1" stop-color="#A86B24"/>
  </linearGradient>
  <linearGradient id="cloud" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#EDE6D6" stop-opacity="0.75"/><stop offset="1" stop-color="#EDE6D6" stop-opacity="0"/>
  </linearGradient>
</defs>
<rect width="800" height="1125" fill="url(#sky)"/>
<rect width="800" height="1125" fill="url(#sun)"/>
<circle cx="560" cy="250" r="70" fill="#05070C"/>
<circle cx="560" cy="250" r="72" fill="none" stroke="#FFE7BF" stroke-opacity="0.8" stroke-width="3"/>
<g fill="url(#cloud)" opacity="0.55">
  <ellipse cx="150" cy="760" rx="260" ry="70"/><ellipse cx="620" cy="790" rx="300" ry="80"/>
</g>
<g transform="translate(64 64) scale(0.9)" color="#EDE6D6">${mark}</g>
<text x="736" y="104" text-anchor="end" font-family="ui-monospace, monospace" font-size="20" letter-spacing="6" fill="#EDE6D6" fill-opacity="0.7">NO. ${number}</text>
${dog ? `<image href="${dog}" x="130" y="300" width="540" height="540"/>` : ""}
<rect x="40" y="880" width="720" height="205" rx="34" fill="#0B0F17" fill-opacity="0.55" stroke="#EDE6D6" stroke-opacity="0.12"/>
<text x="400" y="${975 + (72 - size) * 0.3}" text-anchor="middle" font-family="'Bricolage Grotesque', system-ui, sans-serif" font-weight="600" font-size="${size}" letter-spacing="-1" fill="url(#gold)">${name}</text>
<text x="400" y="1040" text-anchor="middle" font-family="ui-monospace, monospace" font-size="18" letter-spacing="7" fill="#8FCBFF">FETCHED · ${year}</text>
</svg>`;
}

function backSvg() {
  const stars = Array.from({ length: 60 }, (_, i) => {
    const x = (i * 137.5) % 800;
    const y = (i * 263.1) % 1125;
    return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(1 + (i % 3)).toString()}" fill="#EDE6D6" fill-opacity="${(0.15 + (i % 5) * 0.08).toFixed(2)}"/>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1125" viewBox="0 0 800 1125">
<rect width="800" height="1125" fill="#0B0F17"/>${stars}
<g transform="translate(272 434) scale(4)" color="#F2C76A">${mark}</g>
</svg>`;
}

export async function buildFanPass(fan: Fan) {
  const dog = await dataUrl("/fetch-quest/poses/carry-sit.svg");
  const type = { type: "image/svg+xml" };
  return {
    front: URL.createObjectURL(new Blob([frontSvg(fan, dog)], type)),
    back: URL.createObjectURL(new Blob([backSvg()], type)),
  };
}
