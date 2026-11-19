/*
 * Mock signup service for the fetch quest. Same shape a real API will have:
 * request a code for a phone number, verify it, then register the fan.
 * Nothing leaves the browser; the fan is remembered in localStorage.
 */

export type Fan = { phone: string; name: string; number: number; joinedAt: string };

const fanKey = "oncemore:fan";
const pending = new Map<string, string>();

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

/** Indian mobile numbers: ten digits starting 6–9. */
export const phonePattern = /^[6-9]\d{9}$/;
export const codeLength = 6;
export const nameMax = 32;

export function cleanName(name: string) {
  return name.replace(/\s+/g, " ").trim();
}

export async function requestCode(phone: string): Promise<{ code: string }> {
  if (!phonePattern.test(phone)) throw new Error("invalid-phone");
  await wait(250);
  const code = String(Math.floor(100000 + Math.random() * 900000));
  pending.set(phone, code);
  // Mock delivery: the dog's collar tag shows this code. A real SMS replaces it.
  return { code };
}

export async function verifyCode(phone: string, code: string): Promise<boolean> {
  await wait(180);
  return pending.get(phone) === code;
}

export async function registerFan({ phone, name }: { phone: string; name: string }): Promise<Fan> {
  await wait(300);
  const fan: Fan = {
    phone,
    name: cleanName(name).slice(0, nameMax),
    // Fan numbers echo the OG Fire Cards' participation numbers.
    number: 1_000_000 + Math.floor(Math.random() * 900_000),
    joinedAt: new Date().toISOString(),
  };
  pending.delete(phone);
  try {
    window.localStorage.setItem(fanKey, JSON.stringify(fan));
  } catch {}
  return fan;
}

export function loadFan(): Fan | null {
  try {
    const raw = window.localStorage.getItem(fanKey);
    if (!raw) return null;
    const fan = JSON.parse(raw) as Partial<Fan>;
    if (typeof fan.name !== "string" || typeof fan.number !== "number") return null;
    return fan as Fan;
  } catch {
    return null;
  }
}

export function forgetFan() {
  try {
    window.localStorage.removeItem(fanKey);
  } catch {}
}
