export const glassOptics = "border border-white/5 backdrop-blur-lg backdrop-saturate-150";
export const glassPill = `${glassOptics} rounded-full bg-neutral-950/15`;
export const glassPanel = `${glassOptics} rounded-2xl bg-neutral-950/60`;

export const glassFocus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
export const glassAction =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm";
export const glassPrimary = `${glassAction} ${glassFocus} bg-white font-medium text-neutral-950 hover:bg-neutral-200`;
export const glassSecondary = `${glassAction} ${glassFocus} ${glassPill} text-white hover:bg-white/10`;
export const glassField = `${glassFocus} min-h-11 w-full rounded-xl border border-white/20 bg-neutral-950/40 px-3 text-sm text-white placeholder:text-neutral-400`;
