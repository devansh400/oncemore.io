/*
 * Synthesised sound for the fetch quest: no audio files.
 * The howl is a sawtooth through two formant filters with a rising glide and
 * vibrato; notes climb a major pentatonic scale so any typing sounds musical.
 * Audio starts only after a user gesture (the first keystroke in the vault).
 */

const pentatonic = [0, 2, 4, 7, 9];
const mutedKey = "oncemore:quest-muted";

let context: AudioContext | null = null;
let master: GainNode | null = null;
let muted = readMuted();

function readMuted() {
  try {
    return typeof window !== "undefined" && window.localStorage.getItem(mutedKey) === "1";
  } catch {
    return false;
  }
}

export function isMuted() {
  return muted;
}

export function setMuted(value: boolean) {
  muted = value;
  try {
    window.localStorage.setItem(mutedKey, value ? "1" : "0");
  } catch {}
  if (master && context) master.gain.setTargetAtTime(value ? 0 : 0.55, context.currentTime, 0.05);
}

function audio() {
  if (typeof window === "undefined") return null;
  if (!context) {
    const Context =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Context) return null;
    context = new Context();
    master = context.createGain();
    master.gain.value = muted ? 0 : 0.55;
    const compressor = context.createDynamicsCompressor();
    master.connect(compressor).connect(context.destination);
  }
  if (context.state === "suspended") void context.resume();
  return context && master ? { ctx: context, out: master } : null;
}

/** Frequency of the nth step up the pentatonic scale from A3. */
export function noteFrequency(step: number) {
  const octave = Math.floor(step / pentatonic.length);
  const semitone = pentatonic[step % pentatonic.length] + octave * 12;
  return 220 * 2 ** (semitone / 12);
}

function noiseBuffer(ctx: AudioContext, seconds: number) {
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * seconds), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

/** One howl. `step` climbs the scale; `hold` is for the final resonant note. */
export function howl(step: number, { hold = false }: { hold?: boolean } = {}) {
  const a = audio();
  if (!a || muted) return;
  const { ctx, out } = a;
  const now = ctx.currentTime;
  const frequency = noteFrequency(step);
  const length = hold ? 1.5 : 0.55;

  const voice = ctx.createOscillator();
  voice.type = "sawtooth";
  voice.frequency.setValueAtTime(frequency * 0.82, now);
  voice.frequency.exponentialRampToValueAtTime(frequency, now + 0.12);
  voice.frequency.setTargetAtTime(frequency * 0.94, now + length * 0.7, 0.2);

  const vibrato = ctx.createOscillator();
  const depth = ctx.createGain();
  vibrato.frequency.value = 5.4;
  depth.gain.setValueAtTime(0, now);
  depth.gain.linearRampToValueAtTime(frequency * 0.018, now + 0.25);
  vibrato.connect(depth).connect(voice.frequency);

  // "Ooo" formants.
  const low = ctx.createBiquadFilter();
  low.type = "bandpass";
  low.frequency.value = 520;
  low.Q.value = 5;
  const high = ctx.createBiquadFilter();
  high.type = "bandpass";
  high.frequency.value = 1100;
  high.Q.value = 8;
  const highLevel = ctx.createGain();
  highLevel.gain.value = 0.35;

  const envelope = ctx.createGain();
  envelope.gain.setValueAtTime(0.0001, now);
  envelope.gain.exponentialRampToValueAtTime(hold ? 0.9 : 0.7, now + 0.08);
  envelope.gain.setTargetAtTime(0.0001, now + length * 0.75, 0.12);

  voice.connect(low).connect(envelope);
  voice.connect(high).connect(highLevel).connect(envelope);
  envelope.connect(out);
  voice.start(now);
  vibrato.start(now);
  voice.stop(now + length + 0.6);
  vibrato.stop(now + length + 0.6);
}

/** A falling whimper for a backspace or a wrong code. */
export function whine() {
  const a = audio();
  if (!a || muted) return;
  const { ctx, out } = a;
  const now = ctx.currentTime;
  const voice = ctx.createOscillator();
  voice.type = "triangle";
  voice.frequency.setValueAtTime(880, now);
  voice.frequency.exponentialRampToValueAtTime(520, now + 0.28);
  const envelope = ctx.createGain();
  envelope.gain.setValueAtTime(0.0001, now);
  envelope.gain.exponentialRampToValueAtTime(0.18, now + 0.03);
  envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
  voice.connect(envelope).connect(out);
  voice.start(now);
  voice.stop(now + 0.4);
}

export function sneeze() {
  const a = audio();
  if (!a || muted) return;
  const { ctx, out } = a;
  const now = ctx.currentTime;
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer(ctx, 0.3);
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(2400, now);
  filter.frequency.exponentialRampToValueAtTime(900, now + 0.18);
  filter.Q.value = 1.2;
  const envelope = ctx.createGain();
  envelope.gain.setValueAtTime(0.0001, now);
  envelope.gain.exponentialRampToValueAtTime(0.5, now + 0.015);
  envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
  source.connect(filter).connect(envelope).connect(out);
  source.start(now);
}

/** A hum while the glass takes the note. `tension` is 0–1. */
export function glassRing(tension: number) {
  const a = audio();
  if (!a || muted) return;
  const { ctx, out } = a;
  const now = ctx.currentTime;
  const tone = ctx.createOscillator();
  tone.type = "sine";
  tone.frequency.value = 1600 + tension * 1800;
  const envelope = ctx.createGain();
  envelope.gain.setValueAtTime(0.0001, now);
  envelope.gain.exponentialRampToValueAtTime(0.04 + tension * 0.06, now + 0.02);
  envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
  tone.connect(envelope).connect(out);
  tone.start(now);
  tone.stop(now + 0.7);
}

export function shatter() {
  const a = audio();
  if (!a || muted) return;
  const { ctx, out } = a;
  const now = ctx.currentTime;

  const crash = ctx.createBufferSource();
  crash.buffer = noiseBuffer(ctx, 1.2);
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 1800;
  const envelope = ctx.createGain();
  envelope.gain.setValueAtTime(0.0001, now);
  envelope.gain.exponentialRampToValueAtTime(0.6, now + 0.01);
  envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
  crash.connect(filter).connect(envelope).connect(out);
  crash.start(now);

  // Tinkling shards landing.
  for (let i = 0; i < 14; i++) {
    const at = now + 0.05 + Math.random() * 0.9;
    const ping = ctx.createOscillator();
    ping.type = "sine";
    ping.frequency.value = 2400 + Math.random() * 4200;
    const level = ctx.createGain();
    level.gain.setValueAtTime(0.0001, at);
    level.gain.exponentialRampToValueAtTime(0.05 + Math.random() * 0.06, at + 0.005);
    level.gain.exponentialRampToValueAtTime(0.0001, at + 0.25 + Math.random() * 0.3);
    ping.connect(level).connect(out);
    ping.start(at);
    ping.stop(at + 0.7);
  }
}

/** A bright rising chime for the reward. */
export function fanfare() {
  const a = audio();
  if (!a || muted) return;
  const { ctx, out } = a;
  const now = ctx.currentTime;
  [0, 4, 7, 12, 16].forEach((semitone, index) => {
    const at = now + index * 0.09;
    const tone = ctx.createOscillator();
    tone.type = "triangle";
    tone.frequency.value = 523.25 * 2 ** (semitone / 12);
    const level = ctx.createGain();
    level.gain.setValueAtTime(0.0001, at);
    level.gain.exponentialRampToValueAtTime(0.16, at + 0.02);
    level.gain.exponentialRampToValueAtTime(0.0001, at + 0.9);
    tone.connect(level).connect(out);
    tone.start(at);
    tone.stop(at + 1);
  });
}
