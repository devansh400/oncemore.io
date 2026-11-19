"use client";

import Lanyard from "@oncemore-landing-page/ui/components/Lanyard";
import {
  type ChangeEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { gsap } from "@/lib/gsap";
import { glassField, glassInsetAction, glassVeil } from "@/lib/glass";

import { BreakablePane, paneSize, type Tier } from "./breakable-pane";
import { Dog, type DogHandle, groundPoint, howlMouth, mouthPoint, type Pose, runCycle } from "./dog";
import { buildFanPass } from "./fan-pass";
import styles from "./fetch-quest.module.css";
import type { Point } from "./glass-geometry";
import * as sound from "./howl-audio";
import { CloseGlyph, CollarTag, GoldenTicket, MessageGlyph, NameTagGlyph, PawGlyph, PhoneGlyph, SoundGlyph } from "./props";
import {
  cleanName,
  codeLength,
  type Fan,
  nameMax,
  phonePattern,
  registerFan,
  requestCode,
  verifyCode,
} from "./register";

/*
 * The vault at the end of the sky: the golden ticket behind three panes of
 * glass, one per thing we ask for. Every character the fan types is a note
 * the dog howls; the glass cracks as the pitch climbs and shatters on the
 * last one. Wordless on screen; labels exist for screen readers only.
 */

type Layout = {
  width: number;
  height: number;
  ground: number;
  paneX: number;
  queued: [number, number];
  ticket: { x: number; y: number; width: number };
  dog: { x: number; size: number };
};

const landscape: Layout = {
  width: 1000,
  height: 560,
  ground: 470,
  paneX: 540,
  queued: [178, 292],
  ticket: { x: 880, y: 300, width: 170 },
  // Sized so the nose sits just short of the active pane.
  dog: { x: 300, size: 390 },
};

const portrait: Layout = {
  width: 600,
  height: 820,
  ground: 700,
  paneX: 352,
  queued: [140, 200],
  ticket: { x: 470, y: 230, width: 150 },
  dog: { x: 150, size: 280 },
};

type PaneSpec = { tier: Tier; stages: number; impact: Point; seed: number; pitch: number };
const panes: PaneSpec[] = [
  { tier: "veil", stages: 10, impact: [54, 150], seed: 11, pitch: 0 },
  { tier: "pane", stages: codeLength, impact: [48, 168], seed: 23, pitch: 3 },
  { tier: "slab", stages: 12, impact: [58, 140], seed: 37, pitch: 5 },
];

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

type Fit = { layout: Layout; scale: number; x: number; y: number };

function measure(): Fit {
  const viewport = window.visualViewport;
  const width = viewport?.width ?? window.innerWidth;
  const height = viewport?.height ?? window.innerHeight;
  const top = viewport?.offsetTop ?? 0;
  const layout = width / height < 0.85 ? portrait : landscape;
  const scale = Math.min(width / layout.width, height / layout.height) * 0.96;
  return {
    layout,
    scale,
    x: (width - layout.width * scale) / 2,
    y: top + (height - layout.height * scale) / 2,
  };
}

export function Vault({
  open,
  fan,
  displayClassName,
  onClose,
  onRegistered,
}: {
  open: boolean;
  fan: Fan | null;
  displayClassName: string;
  onClose: () => void;
  onRegistered: (fan: Fan) => void;
}) {
  const [fit, setFit] = useState<Fit | null>(null);
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [sentCode, setSentCode] = useState("");
  const [broken, setBroken] = useState([false, false, false]);
  const [full, setFull] = useState([false, false, false]);
  const [pulse, setPulse] = useState([0, 0, 0]);
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState<"panes" | "reward" | "pass">(fan ? "pass" : "panes");
  const [pass, setPass] = useState<{ front: string; back: string } | null>(null);
  const [muted, setMutedState] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const stage = useRef<HTMLDivElement>(null);
  const dog = useRef<DogHandle>(null);
  const dogWrap = useRef<HTMLDivElement>(null);
  const ticketWrap = useRef<HTMLDivElement>(null);
  const inputs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const poseTimer = useRef(0);

  useEffect(() => setMutedState(sound.isMuted()), []);

  useLayoutEffect(() => {
    if (!open) return;
    const update = () => setFit(measure());
    update();
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    window.visualViewport?.addEventListener("scroll", update);
    return () => {
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("scroll", update);
    };
  }, [open]);

  // A returning fan goes straight to their pass.
  useEffect(() => {
    if (fan && phase !== "pass" && phase !== "reward") setPhase("pass");
  }, [fan, phase]);

  useEffect(() => {
    if (!fan) return;
    let active = true;
    let urls: { front: string; back: string } | null = null;
    void buildFanPass(fan).then((built) => {
      urls = built;
      if (active) setPass(built);
      else {
        URL.revokeObjectURL(built.front);
        URL.revokeObjectURL(built.back);
      }
    });
    return () => {
      active = false;
      if (urls) {
        URL.revokeObjectURL(urls.front);
        URL.revokeObjectURL(urls.back);
      }
    };
  }, [fan]);

  const focusStep = useCallback(
    (index: number, delay: number) => {
      window.setTimeout(() => inputs[index]?.current?.focus({ preventScroll: true }), delay);
    },
    // Refs are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Focus the active pane's field once it has slid up and is enabled again.
  useEffect(() => {
    if (open && phase === "panes" && !busy && step < 3) focusStep(step, step === 0 ? 700 : 80);
  }, [open, phase, step, busy, focusStep]);

  /** Show `pose` for `ms`, then settle back to `rest`. */
  const strike = useCallback((pose: Pose, ms: number, rest: Pose = "sit-idle") => {
    window.clearTimeout(poseTimer.current);
    dog.current?.setPose(pose);
    poseTimer.current = window.setTimeout(() => dog.current?.setPose(rest), ms);
  }, []);

  // When nobody is typing, the dog glances back at the fan now and then.
  useEffect(() => {
    if (!open || phase !== "panes") return;
    const id = window.setInterval(() => {
      if (dog.current?.pose() === "sit-idle") strike("head-tilt", 1100);
    }, 5200);
    return () => window.clearInterval(id);
  }, [open, phase, strike]);

  /* ---------- Rings: the howl travelling to the glass ---------- */

  const paneLeft = (layout: Layout) => layout.paneX - paneSize.width / 2;
  const paneTop = (layout: Layout) => layout.ground - paneSize.height;

  function sendRings(paneIndex: number, strength: number) {
    if (!fit || !stage.current || reducedMotion()) return;
    const { layout } = fit;
    const size = layout.dog.size;
    const from: Point = [
      layout.dog.x - size * groundPoint.x + size * howlMouth[0],
      layout.ground - size * groundPoint.y + size * howlMouth[1],
    ];
    const impact = panes[paneIndex].impact;
    const to: Point = [paneLeft(layout) + impact[0], paneTop(layout) + impact[1]];
    for (let i = 0; i < 2 + Math.round(strength * 2); i++) {
      const ring = document.createElement("div");
      ring.className = styles.ring;
      const radius = 26 + i * 10;
      Object.assign(ring.style, {
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
        left: `${from[0] - radius}px`,
        top: `${from[1] - radius}px`,
        rotate: `${(Math.atan2(to[1] - from[1], to[0] - from[0]) * 180) / Math.PI}deg`,
      });
      stage.current.appendChild(ring);
      const animation = ring.animate(
        [
          { transform: "translate(0, 0) scale(0.4)", opacity: 0 },
          { opacity: 0.95, offset: 0.2 },
          {
            transform: `translate(${to[0] - from[0]}px, ${to[1] - from[1]}px) scale(${1.4 + strength})`,
            opacity: 0,
          },
        ],
        { duration: 520, delay: i * 90, easing: "cubic-bezier(0.3, 0.6, 0.5, 1)", fill: "both" },
      );
      animation.onfinish = () => ring.remove();
    }
  }

  function bump(index: number) {
    setPulse((current) => current.map((value, i) => (i === index ? value + 1 : value)));
  }

  /** One note: the dog howls, rings fly, the glass shivers and cracks. */
  function note(index: number, position: number, stages: number) {
    const tension = Math.min(1, (position + 1) / stages);
    sound.howl(panes[index].pitch + position);
    window.setTimeout(() => sound.glassRing(tension), 140);
    dog.current?.setPose("howl-start");
    window.clearTimeout(poseTimer.current);
    poseTimer.current = window.setTimeout(() => {
      dog.current?.setPose("howl");
      poseTimer.current = window.setTimeout(() => dog.current?.setPose("sit-idle"), 380);
    }, 70);
    sendRings(index, tension);
    window.setTimeout(() => bump(index), 300);
  }

  function refuse() {
    sound.sneeze();
    strike("sneeze", 420);
  }

  function heal() {
    sound.whine();
    strike("whine", 420);
  }

  /** The held note: the glass hits resonance and shatters. */
  async function resonate(index: number) {
    setBusy(true);
    setFull((current) => current.map((value, i) => (i === index ? true : value)));
    window.clearTimeout(poseTimer.current);
    dog.current?.setPose("howl");
    sound.howl(panes[index].pitch + panes[index].stages, { hold: true });
    sendRings(index, 1);
    window.setTimeout(() => sendRings(index, 1), 260);
    window.setTimeout(() => bump(index), 300);
    window.setTimeout(() => bump(index), 620);
    await wait(reducedMotion() ? 200 : 900);
    sound.shatter();
    setBroken((current) => current.map((value, i) => (i === index ? true : value)));
    dog.current?.setPose("crouch");
    await wait(reducedMotion() ? 100 : 520);
  }

  /** Trot in place while the next pane slides up to the dog. */
  async function advance(next: number) {
    setStep(next);
    if (reducedMotion()) {
      dog.current?.setPose("sit-idle");
      return;
    }
    let frame = 0;
    const id = window.setInterval(() => dog.current?.setPose(runCycle[frame++ % runCycle.length]), 90);
    const bob = dogWrap.current?.animate(
      [{ translate: "0 0" }, { translate: "0 -10px" }, { translate: "0 0" }],
      { duration: 240, iterations: 3 },
    );
    await wait(720);
    window.clearInterval(id);
    bob?.cancel();
    dog.current?.setPose("sit-idle");
  }

  /* ---------- Inputs ---------- */

  async function changePhone(event: ChangeEvent<HTMLInputElement>) {
    if (busy) return;
    const raw = event.currentTarget.value;
    const digits = raw.replace(/\D/g, "").slice(0, 10);
    if (digits === phone) {
      if (raw.replace(/\s/g, "") !== phone) refuse();
      return;
    }
    if (digits.length > 0 && !/^[6-9]/.test(digits)) {
      refuse();
      return;
    }
    if (digits.length < phone.length) heal();
    else note(0, digits.length - 1, panes[0].stages);
    setPhone(digits);
    if (digits.length === 10 && phonePattern.test(digits)) {
      const [{ code: sent }] = await Promise.all([requestCode(digits), resonate(0)]);
      setSentCode(sent);
      setAnnouncement(`First pane broken. Your code is ${sent.split("").join(" ")}.`);
      await advance(1);
      dog.current?.setPose("proud-sit");
      window.setTimeout(() => dog.current?.setPose("sit-idle"), 900);
      setBusy(false);
    }
  }

  async function changeCode(event: ChangeEvent<HTMLInputElement>) {
    if (busy) return;
    const raw = event.currentTarget.value;
    const digits = raw.replace(/\D/g, "").slice(0, codeLength);
    if (digits === code) {
      if (raw !== code) refuse();
      return;
    }
    if (digits.length < code.length) heal();
    else note(1, digits.length - 1, codeLength);
    setCode(digits);
    if (digits.length !== codeLength) return;
    setBusy(true);
    if (await verifyCode(phone, digits)) {
      await resonate(1);
      setAnnouncement("Second pane broken.");
      await advance(2);
      setBusy(false);
      return;
    }
    // Wrong code: the glass flexes but holds, and the cracks seal back up.
    await wait(320);
    sound.whine();
    strike("head-tilt", 1000);
    bump(1);
    setCode("");
    setAnnouncement("That code didn't match. Try again.");
    setBusy(false);
  }

  function changeName(event: ChangeEvent<HTMLInputElement>) {
    if (busy) return;
    const raw = event.currentTarget.value;
    const allowed = raw.replace(/[^\p{L}\p{M} .'-]/gu, "").replace(/^\s+/, "").slice(0, nameMax);
    if (allowed === name) {
      if (raw !== name) refuse();
      return;
    }
    if (allowed.length < name.length) heal();
    else note(2, Math.min(allowed.length, panes[2].stages) - 1, panes[2].stages);
    setName(allowed);
  }

  async function submitName() {
    if (busy) return;
    if (cleanName(name).length < 2) {
      refuse();
      return;
    }
    const [registered] = await Promise.all([registerFan({ phone, name }), resonate(2)]);
    setAnnouncement(`The last pane broke. Welcome, ${registered.name}.`);
    await reward(registered);
  }

  function nameKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      void submitName();
    }
  }

  /* ---------- Reward ---------- */

  async function reward(registered: Fan) {
    setPhase("reward");
    setStep(3);
    const layout = fit?.layout ?? landscape;
    const quick = reducedMotion();
    const size = layout.dog.size;
    // Run until the mouth is just short of the ticket.
    const mouthX = (mouthPoint["carry-sit"]?.[0] ?? 0.66) - groundPoint.x;
    const target = layout.ticket.x - 30 - layout.dog.x - size * mouthX;

    if (!quick && dogWrap.current) {
      let frame = 0;
      const id = window.setInterval(() => dog.current?.setPose(runCycle[frame++ % runCycle.length]), 85);
      await gsap.to(dogWrap.current, { x: target, duration: 1.1, ease: "power1.inOut" });
      window.clearInterval(id);
      dog.current?.setPose("leap");
      await gsap.to(dogWrap.current, { y: -size * 0.32, duration: 0.32, ease: "power2.out" });
    }
    // Got it: the ticket flies into the dog's mouth, where the carry pose holds it.
    sound.fanfare();
    if (ticketWrap.current) {
      const mouth = mouthPoint["carry-sit"] ?? [0.7, 0.42];
      const x = layout.dog.x - size * groundPoint.x + size * mouth[0] + (quick ? 0 : target);
      const y = layout.ground - size * groundPoint.y + size * mouth[1];
      await gsap.to(ticketWrap.current, {
        left: x - layout.ticket.width * 0.2,
        top: y - layout.ticket.width * 0.2,
        width: layout.ticket.width * 0.4,
        rotate: -14,
        duration: quick ? 0 : 0.2,
        ease: "power2.in",
      });
      ticketWrap.current.style.opacity = "0";
    }
    dog.current?.setPose("carry-sit");
    if (!quick && dogWrap.current) {
      await gsap.to(dogWrap.current, { y: 0, duration: 0.3, ease: "bounce.out" });
      burstGlints();
    }
    await wait(quick ? 300 : 1500);
    onRegistered(registered);
    setPhase("pass");
  }

  function burstGlints() {
    if (!stage.current || !fit) return;
    const { layout } = fit;
    for (let i = 0; i < 26; i++) {
      const glint = document.createElement("div");
      glint.className = styles.glint;
      const x = layout.ticket.x - 80 + Math.random() * 60;
      const y = layout.ground - 140;
      Object.assign(glint.style, { left: `${x}px`, top: `${y}px` });
      stage.current.appendChild(glint);
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
      const speed = 160 + Math.random() * 260;
      const animation = glint.animate(
        [
          { transform: "translate(0,0) rotate(0)", opacity: 1 },
          {
            transform: `translate(${Math.cos(angle) * speed}px, ${Math.sin(angle) * speed + 220}px) rotate(${Math.random() * 540}deg)`,
            opacity: 0,
          },
        ],
        { duration: 1100 + Math.random() * 700, easing: "cubic-bezier(0.2, 0.6, 0.4, 1)", fill: "forwards" },
      );
      animation.onfinish = () => glint.remove();
    }
  }

  /* ---------- Closing ---------- */

  useEffect(() => {
    if (!open) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function toggleSound() {
    sound.setMuted(!muted);
    setMutedState(!muted);
  }

  if (!fit) return null;
  const { layout, scale } = fit;
  const tension = (index: number, length: number) =>
    full[index] ? 1 : Math.min(1, length / panes[index].stages);
  const levels = [
    full[0] ? panes[0].stages : phone.length,
    full[1] ? panes[1].stages : code.length,
    full[2] ? panes[2].stages : Math.min(name.length, panes[2].stages),
  ];
  const lengths = [phone.length, code.length, name.length];

  const slotFor = (index: number) => {
    const offset = index - step;
    if (offset < 0) return { slot: "gone" as const, transform: "perspective(900px) rotateY(-6deg)", z: 4 };
    if (offset === 0) return { slot: "active" as const, transform: "perspective(900px) rotateY(-6deg)", z: 3 };
    return {
      slot: "queued" as const,
      transform: `translateX(${layout.queued[offset - 1]}px) perspective(900px) rotateY(-58deg) scale(${1 - 0.07 * offset})`,
      z: 3 - offset,
    };
  };

  const dogSize = layout.dog.size;
  const showTag = step === 1 && sentCode && phase === "panes";

  return (
    <div
      className={styles.vault}
      data-open={open}
      data-world-controls
      role="dialog"
      aria-modal="true"
      aria-label="Sign up: help the dog reach the ticket"
      hidden={!open}
      onWheel={(event) => {
        if (event.deltaY < -40) onClose();
      }}
    >
      <div className={styles.scrim} />
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      <div className={styles.chrome}>
        <button
          type="button"
          className={`${glassVeil} glass-focus ${styles.icon} cursor-pointer`}
          aria-pressed={!muted}
          aria-label={muted ? "Turn sound on" : "Turn sound off"}
          onClick={toggleSound}
        >
          <SoundGlyph muted={muted} />
        </button>
        <button
          type="button"
          className={`${glassVeil} glass-focus ${styles.icon} cursor-pointer`}
          aria-label="Back to the sky"
          onClick={onClose}
        >
          <CloseGlyph />
        </button>
      </div>

      {phase !== "pass" && (
        <div className={styles.progress} aria-hidden="true">
          {panes.map((_, index) => (
            <span key={index} data-done={broken[index]} />
          ))}
        </div>
      )}

      <div
        ref={stage}
        className={styles.stage}
        data-phase={phase}
        style={{
          width: layout.width,
          height: layout.height,
          transform: `translate(${fit.x}px, ${fit.y}px) scale(${scale})`,
        }}
      >
        {/* The ticket on its cloud. */}
        <div
          className={styles.pedestal}
          style={{
            left: layout.ticket.x - layout.ticket.width * 0.7,
            top: layout.ticket.y + layout.ticket.width * 0.45,
            width: layout.ticket.width * 1.4,
            height: layout.ticket.width * 0.5,
          }}
        />
        <div
          ref={ticketWrap}
          className={`absolute ${phase === "panes" ? styles.float : ""}`}
          style={{
            left: layout.ticket.x - layout.ticket.width / 2,
            top: layout.ticket.y,
            width: layout.ticket.width,
            zIndex: phase === "panes" ? 0 : 6,
          }}
        >
          <GoldenTicket name={step >= 2 ? cleanName(name) || name : ""} className={`w-full ${styles.ticketGlow}`} />
        </div>

        {panes.map((pane, index) => {
          const { slot, transform, z } = slotFor(index);
          if (slot === "gone" && !broken[index]) return null;
          return (
            <BreakablePane
              key={index}
              tier={pane.tier}
              stages={pane.stages}
              level={levels[index]}
              tension={tension(index, lengths[index])}
              pulse={pulse[index]}
              broken={broken[index]}
              seed={pane.seed}
              impact={pane.impact}
              slot={slot}
              style={{
                left: paneLeft(layout),
                top: paneTop(layout),
                transform,
                zIndex: z,
              }}
            >
              {index === 0 && (
                <>
                  <PhoneGlyph className={styles.glyph} />
                  <label className={`${glassField} ${styles.field}`}>
                    <span className="sr-only">Mobile number</span>
                    <span className={`${styles.prefix} font-mono`} aria-hidden="true">
                      +91
                    </span>
                    <input
                      ref={inputs[0]}
                      className={`${styles.input} font-mono`}
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      placeholder="··········"
                      value={phone}
                      onChange={changePhone}
                      disabled={busy || step !== 0}
                    />
                  </label>
                </>
              )}
              {index === 1 && (
                <>
                  <MessageGlyph className={styles.glyph} />
                  <label className={`${glassField} ${styles.field}`}>
                    <span className="sr-only">Verification code</span>
                    <input
                      ref={inputs[1]}
                      className={`${styles.input} text-center font-mono`}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder="······"
                      value={code}
                      onChange={changeCode}
                      disabled={busy || step !== 1}
                    />
                  </label>
                </>
              )}
              {index === 2 && (
                <>
                  <NameTagGlyph className={styles.glyph} />
                  <div className="flex w-full items-center gap-2">
                    <label className={`${glassField} ${styles.field}`}>
                      <span className="sr-only">Your name</span>
                      <input
                        ref={inputs[2]}
                        className={`${styles.input} ${displayClassName}`}
                        type="text"
                        autoComplete="name"
                        autoCapitalize="words"
                        enterKeyHint="done"
                        value={name}
                        onChange={changeName}
                        onKeyDown={nameKey}
                        disabled={busy || step !== 2}
                      />
                    </label>
                    <button
                      type="button"
                      className={`${glassInsetAction} ${styles.paw}`}
                      aria-label="Break the glass"
                      disabled={busy || step !== 2 || cleanName(name).length < 2}
                      onClick={() => void submitName()}
                    >
                      <PawGlyph />
                    </button>
                  </div>
                </>
              )}
            </BreakablePane>
          );
        })}

        <div
          ref={dogWrap}
          className="absolute"
          style={{
            left: layout.dog.x - dogSize * groundPoint.x,
            top: layout.ground - dogSize * groundPoint.y,
            width: dogSize,
            height: dogSize,
            zIndex: 5,
          }}
        >
          <Dog ref={dog} className={`${styles.dogSprite}`} />
        </div>

        {showTag && (
          <div
            className={styles.tag}
            style={{
              // Over the dog's head (about 0.18 of the frame ahead of its ground point).
              left: layout.dog.x + dogSize * 0.18 - 70,
              top: layout.ground - dogSize * 0.5 - 170,
              width: 140,
              zIndex: 6,
            }}
          >
            <TagReveal code={sentCode} />
          </div>
        )}
      </div>

      <div className={styles.pass} data-shown={phase === "pass" && Boolean(pass)}>
        {phase === "pass" && pass && (
          <Lanyard
            frontImage={pass.front}
            backImage={pass.back}
            imageFit="cover"
            cardColor="#0B0F17"
            orientation="portrait"
            finish="glossy"
            cornerRadius={0.42}
            size={0.62}
            anchor="center"
            strapLength={0.5}
            strapColor="#1A2233"
            strapWidth={0.6}
            metal="gold"
            damping={0.55}
            elasticity={0.5}
            breeze={0.3}
            interactive
            intro
            className={styles.lanyard}
          />
        )}
        {phase === "pass" && pass && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-1/2 size-[min(36vw,240px)] -translate-x-[150%] max-sm:-translate-x-[110%]"
          >
            <Dog className={styles.dogSprite} initialPose="proud-sit" />
          </div>
        )}
        {phase === "pass" && fan && (
          <p className="sr-only">
            Your OnceMore pass, number {fan.number}, for {fan.name}.
          </p>
        )}
      </div>
    </div>
  );
}

/** The collar tag swings up and flips to show the code. */
function TagReveal({ code }: { code: string }) {
  const element = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!element.current || reducedMotion()) return;
    element.current.animate(
      [
        { transform: "translateY(120px) scale(0.2) rotateY(180deg)", opacity: 0 },
        { transform: "translateY(-12px) scale(1.06) rotateY(20deg)", opacity: 1, offset: 0.6 },
        { transform: "translateY(0) scale(1) rotateY(0)", opacity: 1 },
      ],
      { duration: 900, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "both" },
    );
    element.current.animate(
      [{ rotate: "-5deg" }, { rotate: "5deg" }, { rotate: "-5deg" }],
      { duration: 2600, iterations: Infinity, easing: "ease-in-out", delay: 900 },
    );
  }, []);
  return (
    <div ref={element} style={{ transformOrigin: "50% 0" }}>
      <CollarTag code={code} className="w-full drop-shadow-[0_10px_20px_rgb(3_5_12/0.5)]" />
    </div>
  );
}
