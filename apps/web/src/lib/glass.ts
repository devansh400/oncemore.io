/*
 * Glass over worlds. The material itself (tint, rim, sheen, grain, shadow)
 * lives in src/index.css; these recipes add shape and layout.
 *
 * Veil  13% tint: navigation, chips, short labels over the scene.
 * Pane  34% tint: cards and grouped controls.
 * Slab  64% tint: reading, menus, dialogs and anything the art competes with.
 */
export const glassVeil = "glass-veil";
export const glassPane = "glass-pane";
export const glassSlab = "glass-slab";

export const glassPill = `${glassVeil} rounded-full`;
export const glassPanel = `${glassPane} rounded-3xl`;
export const glassReading = `${glassSlab} rounded-3xl`;

export const glassFocus = "glass-focus";
export const glassAction =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full px-5 text-sm font-medium disabled:cursor-default disabled:opacity-45";
export const glassPrimary = `${glassAction} ${glassFocus} glass-primary`;
export const glassSecondary = `${glassAction} ${glassFocus} ${glassVeil}`;
export const glassInsetAction = `${glassAction} ${glassFocus} glass-control`;
export const glassField = `${glassFocus} glass-well min-h-11 w-full rounded-xl px-3.5 text-sm placeholder:text-[rgb(237_230_214/0.4)]`;

/** Technical labels: Geist Mono, tracked out. */
export const glassEyebrow =
  "font-mono text-[0.6875rem] font-medium tracking-[0.18em] text-[rgb(237_230_214/0.7)] uppercase";
