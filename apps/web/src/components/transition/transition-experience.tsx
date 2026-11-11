"use client";

import LightTunnel from "@oncemore-landing-page/ui/components/LightTunnel";
import { useRef, useState } from "react";

import { gsap } from "@/lib/gsap";

import "./transition.css";

export function TransitionExperience() {
  const cardRef = useRef<HTMLButtonElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const tunnelRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<ReturnType<typeof gsap.timeline> | null>(null);
  const busyRef = useRef(false);
  const [arrived, setArrived] = useState(false);

  const start = () => {
    if (busyRef.current) return;

    const card = cardRef.current;
    const veil = veilRef.current;
    const tunnel = tunnelRef.current;
    const dest = destRef.current;
    if (!card || !veil || !tunnel || !dest) return;

    busyRef.current = true;
    setArrived(false);

    const rect = card.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const dx = viewportWidth / 2 - (rect.left + rect.width / 2);
    const dy = viewportHeight / 2 - (rect.top + rect.height / 2);
    const scaleX = viewportWidth / rect.width;
    const scaleY = viewportHeight / rect.height;

    timelineRef.current?.kill();
    gsap.killTweensOf([card, veil, tunnel, dest]);

    tunnel.style.display = "block";

    gsap.set(veil, {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      borderRadius: 22,
      transformOrigin: "50% 50%",
      autoAlpha: 1,
    });
    gsap.set(tunnel, { autoAlpha: 0, scale: 1 });
    gsap.set(dest, { autoAlpha: 0, scale: 0.09, y: 0 });

    const timeline = gsap.timeline({
      onComplete: () => {
        tunnel.style.display = "none";
        gsap.set(tunnel, { scale: 1 });
        busyRef.current = false;
        setArrived(true);
      },
    });
    timelineRef.current = timeline;

    timeline
      .to(card, { autoAlpha: 0, duration: 0.25, ease: "power2.out" }, 0.3)
      .to(
        veil,
        {
          x: dx,
          y: dy,
          scaleX,
          scaleY,
          borderRadius: 0,
          duration: 0.95,
          ease: "power3.inOut",
        },
        0,
      )
      .to(tunnel, { autoAlpha: 1, duration: 0.8, ease: "power2.out" }, 0.55)
      .to(veil, { autoAlpha: 0, duration: 0.8, ease: "power2.inOut" }, 0.9)
      .to(dest, { autoAlpha: 1, duration: 0.6, ease: "power1.out" }, 0.8)
      .to(dest, { scale: 1, duration: 3.4, ease: "power2.in" }, 1.2)
      .to(tunnel, { scale: 1.5, duration: 3.7, ease: "power1.in" }, 0.9)
      .to(tunnel, { autoAlpha: 0, duration: 0.45, ease: "power2.out" }, 4.6);
  };

  const replay = () => {
    timelineRef.current?.kill();
    timelineRef.current = null;
    busyRef.current = false;
    setArrived(false);

    gsap.killTweensOf([cardRef.current, veilRef.current, tunnelRef.current, destRef.current]);
    gsap.set([veilRef.current, tunnelRef.current], { autoAlpha: 0 });
    gsap.set(tunnelRef.current, { scale: 1 });
    if (tunnelRef.current) tunnelRef.current.style.display = "none";
    gsap.set(destRef.current, { autoAlpha: 0, scale: 0.09, y: 0 });
    gsap.set(cardRef.current, { autoAlpha: 1 });
  };

  return (
    <div className="t-root">
      <div className="t-stage">
        <button
          ref={cardRef}
          type="button"
          onClick={start}
          className="t-card"
          aria-label="Enter the light tunnel"
        >
          <span className="t-card__orb" aria-hidden />
          <span className="t-card__ring" aria-hidden />
          <span className="t-card__eyebrow">Transition study · 001</span>
          <span className="t-card__title">Enter the tunnel</span>
          <span className="t-card__hint">
            Click to travel
            <span aria-hidden>→</span>
          </span>
        </button>

        <div ref={destRef} className="t-dest" aria-hidden={!arrived}>
          <span className="t-dest__eyebrow">Arrived · Section 02</span>
          <h1 className="t-dest__title">Worlds</h1>
          <p className="t-dest__copy">
            Step inside interactive worlds built for the films, shows, and IP your fans already
            live in — launched the moment they press play.
          </p>
          <div className="t-dest__meta">
            <span>OnceMore</span>
            <span>Chapter 02 / MMXXV</span>
          </div>
          <button type="button" onClick={replay} className="t-dest__replay">
            Replay transition
          </button>
        </div>
      </div>

      <div ref={veilRef} className="t-veil" aria-hidden />
      <div ref={tunnelRef} className="t-tunnel" aria-hidden>
        <LightTunnel
          cableColor="#BFE4FF"
          pulseColor="#7CC8FF"
          tunnelColor="#0B1B36"
          tunnelOpacity={0.12}
          speed={0.16}
          flowDirection="inward"
          pulseSpeed={3.2}
          pulseLength={0.3}
          pulseBlend={0.65}
          pulseWidth={1}
          pulseDensity={0.55}
          cableCount={56}
          thickness={0.42}
          rimWidth={0.16}
          waviness={0.35}
          sway={0.6}
          bend={0.04}
          size={1.05}
          glow={0.85}
          fadeNear={0.45}
          fadeFar={2.3}
          brightness={0.9}
          colorVariance
          grain
          grainIntensity={0.03}
          opacity={1}
          mouseInteraction={false}
          mouseStrength={0.12}
          clickSurge
          intro
          variation={0.4}
          dpr={2}
          style={{}}
        />
      </div>
    </div>
  );
}
